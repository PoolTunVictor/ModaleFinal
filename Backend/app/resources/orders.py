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

order_item_model = api.model("OrderItem", {
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
    "items": fields.List(fields.Nested(order_item_model), required=True)
})

order_response_model = api.model("OrderResponse", {
    "id": fields.Integer,
    "order_number": fields.String,
    "status": fields.String,
    "subtotal": fields.Float,
    "total": fields.Float,
    "created_at": fields.DateTime
})


# =========================
# HELPERS
# =========================

def generate_order_number():
    return f"ORD-{uuid.uuid4().hex[:10].upper()}"


# =========================
# LIST / CREATE
# =========================

@api.route("/")
class OrderList(Resource):

    @jwt_required()
    @api.marshal_list_with(order_response_model)
    def get(self):
        """
        Listar pedidos
        - Admin: todos
        - Usuario: solo los suyos
        """
        claims = get_jwt()
        role = claims.get("role")
        user_id = int(get_jwt_identity())

        if role == "admin":
            return Order.query.order_by(Order.created_at.desc()).all()

        return Order.query.filter_by(user_id=user_id).order_by(
            Order.created_at.desc()
        ).all()

    @jwt_required()
    @api.expect(order_create_model, validate=True)
    @api.marshal_with(order_response_model, code=201)
    def post(self):
        """Crear pedido"""
        user_id = int(get_jwt_identity())
        data = request.json

        if not data["items"]:
            api.abort(400, "El pedido debe contener productos")

        subtotal = 0
        order_items = []

        # Validar productos y stock
        for item in data["items"]:
            product = Product.query.get(item["product_id"])

            if not product:
                api.abort(400, f"Producto {item['product_id']} no existe")

            if item["quantity"] <= 0:
                api.abort(400, "La cantidad debe ser mayor a 0")

            if product.stock < item["quantity"]:
                api.abort(
                    400,
                    f"Stock insuficiente para {product.name}"
                )

            line_total = product.price * item["quantity"]
            subtotal += line_total

            order_items.append({
                "product": product,
                "quantity": item["quantity"],
                "price": product.price
            })

        total = subtotal  # aquí luego puedes agregar envío, impuestos, etc.

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
            total=total
        )

        db.session.add(order)
        db.session.flush()  # para obtener order.id

        # Crear OrderItems y descontar stock
        for item in order_items:
            order_item = OrderItem(
                order_id=order.id,
                product_id=item["product"].id,
                quantity=item["quantity"],
                price=item["price"]
            )

            item["product"].stock -= item["quantity"]
            db.session.add(order_item)

        db.session.commit()
        return order, 201


# =========================
# DETAIL / STATUS
# =========================

@api.route("/<int:id>")
@api.param("id", "ID del pedido")
class OrderDetail(Resource):

    @jwt_required()
    @api.marshal_with(order_response_model)
    def get(self, id):
        """Obtener pedido por ID"""
        user_id = int(get_jwt_identity())
        claims = get_jwt()
        role = claims.get("role")

        order = Order.query.get_or_404(id)

        if role != "admin" and order.user_id != user_id:
            api.abort(403, "No autorizado")

        return order


@api.route("/<int:id>/status")
@api.param("id", "ID del pedido")
class OrderStatus(Resource):

    @jwt_required()
    def put(self, id):
        """Actualizar estado del pedido (ADMIN)"""

        claims = get_jwt()
        if claims.get("role") != "admin":
            api.abort(403, "Solo administradores")

        data = request.json or {}

        if "status" not in data:
            api.abort(400, "El estado es requerido")

        new_status = data["status"]

        VALID_STATUSES = ["pendiente", "confirmado", "entregado", "cancelado"]

        if new_status not in VALID_STATUSES:
            api.abort(
                400,
                f"Estado inválido. Estados permitidos: {', '.join(VALID_STATUSES)}"
            )

        order = Order.query.get_or_404(id)

        # Evitar cambios innecesarios
        if order.status == new_status:
            return {
                "message": f"El pedido ya está en estado '{new_status}'"
            }, 200

        # Restaurar stock si se cancela el pedido
        if new_status == "cancelado" and order.status != "cancelado":
            for item in order.items:
                item.product.stock += item.quantity

        order.status = new_status
        db.session.commit()

        return {
            "message": "Estado del pedido actualizado",
            "order_id": order.id,
            "new_status": order.status
        }, 200
    