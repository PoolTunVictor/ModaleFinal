from flask_restx import Namespace, Resource, fields
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask import request
from sqlalchemy.exc import SQLAlchemyError
from uuid import uuid4

from app.extensions import db
from app.models.order import Order
from app.models.order_item import OrderItem
from app.models.product import Product
from app.models.address import Address

api = Namespace("checkout", description="Proceso de checkout")

# =========================
# SWAGGER MODELS
# =========================

checkout_item_model = api.model("CheckoutItem", {
    "product_id": fields.Integer(required=True),
    "quantity": fields.Integer(required=True)
})

checkout_model = api.model("Checkout", {
    "address_id": fields.Integer(required=True),
    "items": fields.List(fields.Nested(checkout_item_model), required=True)
})

# =========================
# CHECKOUT
# =========================

@api.route("/")
class Checkout(Resource):

    #@jwt_required()
    @api.expect(checkout_model, validate=True)
    def post(self):
        """Crear pedido y descontar stock"""
        user_id = int(get_jwt_identity())
        data = request.json

        address = Address.query.filter_by(
            id=data["address_id"],
            user_id=user_id
        ).first()

        if not address:
            api.abort(400, "Dirección inválida")

        if not data["items"]:
            api.abort(400, "El carrito está vacío")

        try:
            subtotal = 0
            order_items = []

            # =========================
            # VALIDAR STOCK
            # =========================
            for item in data["items"]:
                product = Product.query.get(item["product_id"])

                if not product:
                    api.abort(400, "Producto no encontrado")

                if item["quantity"] <= 0:
                    api.abort(400, "Cantidad inválida")

                if product.stock < item["quantity"]:
                    api.abort(
                        400,
                        f"Stock insuficiente para {product.name}"
                    )

                line_subtotal = product.price * item["quantity"]
                subtotal += line_subtotal

                order_items.append({
                    "product": product,
                    "quantity": item["quantity"],
                    "subtotal": line_subtotal
                })

            # =========================
            # CREAR ORDER
            # =========================
            order = Order(
                order_number=str(uuid4()).replace("-", "")[:12],
                user_id=user_id,
                receiver_name=address.receiver_name,
                phone=address.phone,
                street=address.street,
                city=address.city,
                state=address.state,
                postal_code=address.postal_code,
                references=address.references,
                subtotal=subtotal,
                total=subtotal,
                status="pendiente"
            )

            db.session.add(order)
            db.session.flush()  # obtiene order.id sin commit

            # =========================
            # CREAR ITEMS + DESCONTAR STOCK
            # =========================
            for item in order_items:
                product = item["product"]

                order_item = OrderItem(
                    order_id=order.id,
                    product_id=product.id,
                    product_name=product.name,
                    product_price=product.price,
                    quantity=item["quantity"],
                    subtotal=item["subtotal"]
                )

                product.stock -= item["quantity"]

                db.session.add(order_item)

            db.session.commit()

            return {
                "message": "Pedido creado exitosamente",
                "order_id": order.id,
                "order_number": order.order_number,
                "total": order.total
            }, 201

        except SQLAlchemyError:
            db.session.rollback()
            api.abort(500, "Error al procesar el checkout")