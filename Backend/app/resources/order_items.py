from flask_restx import Namespace, Resource, fields
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from flask import request
from app.extensions import db
from app.models.order import Order
from app.models.order_item import OrderItem
from app.models.product import Product
from app.utils.decorators import admin_required

api = Namespace("order-items", description="Items del pedido")

# =========================
# SWAGGER MODELS
# =========================

order_item_model = api.model("OrderItem", {
    "id": fields.Integer(readOnly=True),
    "order_id": fields.Integer(required=True),
    "product_id": fields.Integer(required=True),
    "product_name": fields.String,
    "product_price": fields.Float,
    "quantity": fields.Integer(required=True),
    "subtotal": fields.Float
})

# =========================
# LIST ITEMS BY ORDER
# =========================

@api.route("/order/<int:order_id>")
@api.param("order_id", "ID del pedido")
class OrderItemList(Resource):

    @jwt_required()
    @api.marshal_list_with(order_item_model)
    def get(self, order_id):
        """Listar items de un pedido"""
        user_id = int(get_jwt_identity())
        claims = get_jwt()

        order = Order.query.get_or_404(order_id)

        # Admin puede ver todo
        if claims.get("role") != "admin" and order.user_id != user_id:
            api.abort(403, "No autorizado")

        return OrderItem.query.filter_by(order_id=order_id).all()

# =========================
# ADD ITEM TO ORDER
# =========================

@api.route("/")
class OrderItemCreate(Resource):

    @admin_required
    @api.expect(order_item_model, validate=True)
    @api.marshal_with(order_item_model, code=201)
    def post(self):
        """Agregar item a pedido (admin)"""
        data = request.json

        order = Order.query.get_or_404(data["order_id"])
        product = Product.query.get_or_404(data["product_id"])

        if data["quantity"] <= 0:
            api.abort(400, "Cantidad inválida")

        subtotal = product.price * data["quantity"]

        item = OrderItem(
            order_id=order.id,
            product_id=product.id,
            product_name=product.name,
            product_price=product.price,
            quantity=data["quantity"],
            subtotal=subtotal
        )

        db.session.add(item)

        # Recalcular totales
        order.subtotal += subtotal
        order.total = order.subtotal

        db.session.commit()
        return item, 201

# =========================
# DELETE ITEM
# =========================

@api.route("/<int:id>")
@api.param("id", "ID del item")
class OrderItemDelete(Resource):

    @admin_required
    def delete(self, id):
        """Eliminar item del pedido"""
        item = OrderItem.query.get_or_404(id)
        order = Order.query.get(item.order_id)

        order.subtotal -= item.subtotal
        order.total = order.subtotal

        db.session.delete(item)
        db.session.commit()

        return {"message": "Item eliminado"}, 200
