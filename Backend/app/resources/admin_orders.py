from flask_restx import Namespace, Resource
from app.extensions import db
from app.models.order import Order
from app.models.order_item import OrderItem
from app.utils.decorators import admin_required

api = Namespace("admin-orders", description="Gestión de pedidos (ADMIN)")

# =========================
# LISTAR TODOS LOS PEDIDOS
# =========================

@api.route("/")
class AdminOrderList(Resource):

    @admin_required
    def get(self):
        """Listar todos los pedidos (admin)"""
        orders = Order.query.order_by(Order.created_at.desc()).all()

        response = []

        for order in orders:
            response.append({
                "id": order.id,
                "status": order.status,
                "subtotal": order.subtotal,
                "total": order.total,
                "created_at": order.created_at.isoformat(),
                "user": {
                    "id": order.user.id,
                    "email": order.user.email
                }
            })

        return response, 200


# =========================
# DETALLE DE PEDIDO (PARA FICHA)
# =========================

@api.route("/<int:order_id>")
class AdminOrderDetail(Resource):

    @admin_required
    def get(self, order_id):
        """Detalle completo de un pedido (admin)"""
        order = Order.query.get_or_404(order_id)

        return {
            "id": order.id,
            "status": order.status,
            "subtotal": order.subtotal,
            "total": order.total,
            "created_at": order.created_at.isoformat(),

            # 👤 USUARIO
            "user": {
                "id": order.user.id,
                "email": order.user.email
            },

            # 📍 DIRECCIÓN
            "address": {
                "street": order.address.street,
                "city": order.address.city,
                "state": order.address.state,
                "postal_code": order.address.postal_code,
                "phone": order.address.phone,
                "references": order.address.references
            },

            # 🧾 ITEMS
            "items": [
                {
                    "product_name": item.product_name,
                    "quantity": item.quantity,
                    "subtotal": item.subtotal
                }
                for item in order.items
            ]
        }, 200


# =========================
# CAMBIAR ESTADO DEL PEDIDO
# =========================

@api.route("/<int:order_id>/status")
class AdminOrderStatus(Resource):

    @admin_required
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
class AdminOrderDelete(Resource):

    @admin_required
    def delete(self, order_id):
        """Eliminar pedido completo (admin)"""
        order = Order.query.get_or_404(order_id)

        OrderItem.query.filter_by(order_id=order.id).delete()
        db.session.delete(order)
        db.session.commit()

        return {"message": "Pedido eliminado"}, 200
