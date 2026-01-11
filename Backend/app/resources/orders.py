from flask_restx import Namespace, Resource, fields
from flask import request
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from app.extensions import db
from app.models.order import Order
from app.models.order_item import OrderItem
from app.models.product import Product
import uuid

api = Namespace("orders", description="Gestión de pedidos")

# =========================
# MODELS (Swagger)
# =========================

order_create_item_model = api.model("OrderCreateItem", {
    "product_id": fields.Integer(required=True),
    "quantity": fields.Integer(required=True)
})

order_create_model = api.model("OrderCreate", {
    "receiver_name": fields.String(required=True),
    "phone": fields.String(required=True),
    "street": fields.String(required=True),
    "city": fields.String(required=True),
    "state": fields.String(required=True),
    "postal_code": fields.String(required=True),
    "references": fields.String,
    "items": fields.List(fields.Nested(order_create_item_model), required=True)
})

# =========================
# HELPERS
# =========================

def generate_order_number():
    return f"ORD-{uuid.uuid4().hex[:10].upper()}"

# =========================
# CREATE ORDER
# =========================

@api.route("/")
class OrderList(Resource):

    @jwt_required()
    @api.expect(order_create_model, validate=True)
    def post(self):
        user_id = int(get_jwt_identity())
        data = request.json or {}

        # 🔍 DEBUG 1: payload recibido
        print("===================================")
        print("DATA RECIBIDA:", data)
        print("===================================")

        required_fields = [
            "receiver_name", "phone", "street",
            "city", "state", "postal_code"
        ]

        for field in required_fields:
            if not data.get(field):
                api.abort(400, f"El campo '{field}' es obligatorio")

        if not data.get("items"):
            api.abort(400, "El pedido debe contener productos")

        subtotal = 0
        order_items = []

        for item in data["items"]:
            product = Product.query.get(item["product_id"])

            if not product:
                api.abort(400, "Producto no existe")

            if product.stock < item["quantity"]:
                api.abort(400, "Stock insuficiente")

            subtotal += product.price * item["quantity"]

            order_items.append({
                "product": product,
                "quantity": item["quantity"]
            })

        order = Order(
            order_number=generate_order_number(),
            user_id=user_id,
            receiver_name=data["receiver_name"],
            phone=data["phone"],
            street=data["street"],
            city=data["city"],
            state=data["state"],
            postal_code=data["postal_code"],
            references=data.get("references"),
            subtotal=subtotal,
            total=subtotal
        )

        # 🔍 DEBUG 2: objeto Order antes de guardar
        print("ORDER A GUARDAR:", order.__dict__)
        print("===================================")

        db.session.add(order)
        db.session.flush()

        for item in order_items:
            order_item = OrderItem(
                order_id=order.id,
                product_id=item["product"].id,
                product_name=item["product"].name,
                product_price=item["product"].price,
                quantity=item["quantity"],
                subtotal=item["product"].price * item["quantity"]
            )

            item["product"].stock -= item["quantity"]
            db.session.add(order_item)

        db.session.commit()

        return {
            "id": order.id,
            "order_number": order.order_number
        }, 201
