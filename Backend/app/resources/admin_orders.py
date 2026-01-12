from flask_restx import Namespace, Resource, fields
from flask_jwt_extended import jwt_required, get_jwt
from app.extensions import db
from app.models.order import Order
from app.models.order_item import OrderItem
from app.utils.decorators import admin_required

api = Namespace("admin-orders", description="Gestión de pedidos (ADMIN)")

# =========================
# SWAGGER MODELS
# =========================

order_item_model = api.model("AdminOrderItem", {
    "id": fields.Integer,
    "product_name": fields.String,
    "product_price": fields.Float,
    "quantity": fields.Integer,
    "subtotal": fields.Float
})

order_model = api.model("AdminOrder", {
    "id": fields.Integer,
    "user_id": fields.Integer,
    "status": fields.String,
    "subtotal": fields.Float,
    "total": fields.Float,
    "created_at": fields.DateTime,
    "items": fields.List(fields.Nested(order_item_model))
})

order_status_model = api.model("OrderStatusUpdate", {
    "status": fields.String(
        required=True,
        description="Estado del pedido",
        enum=["pendiente", "en camino", "entregado"]
    )
})

# =========================
# LISTAR TODOS LOS PEDIDOS
# =========================

@api.route("/")
class AdminOrderList(Resource):

    @admin_required
    @api.marshal_list_with(order_model)
    def get(self):
        """Listar todos los pedidos (admin)"""
        orders = Order.query.order_by(Order.created_at.desc()).all()
        return orders


# =========================
# CAMBIAR ESTADO DEL PEDIDO
# =========================

@api.route("/<int:order_id>/status")
@api.param("order_id", "ID del pedido")
class AdminOrderStatus(Resource):

    @admin_required
    @api.expect(order_status_model, validate=True)
    def put(self, order_id):
        """Actualizar estado del pedido"""
        data = api.payload

        order = Order.query.get_or_404(order_id)

        order.status = data["status"]
        db.session.commit()

        return {
            "message": "Estado actualizado",
            "order_id": order.id,
            "new_status": order.status
        }, 200


# =========================
# ELIMINAR PEDIDO
# =========================

@api.route("/<int:order_id>")
@api.param("order_id", "ID del pedido")
class AdminOrderDelete(Resource):

    @admin_required
    def delete(self, order_id):
        """Eliminar pedido completo (admin)"""
        order = Order.query.get_or_404(order_id)

        # Eliminar items primero (seguridad extra)
        OrderItem.query.filter_by(order_id=order.id).delete()

        db.session.delete(order)
        db.session.commit()

        return {"message": "Pedido eliminado"}, 200
