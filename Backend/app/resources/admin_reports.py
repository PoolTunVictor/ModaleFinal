from flask_restx import Namespace, Resource
from sqlalchemy import func
from app.extensions import db
from app.models.order import Order
from app.models.order_item import OrderItem
from app.models.product import Product
from app.utils.decorators import admin_required

api = Namespace(
    "admin-reports",
    description="Reportes administrativos basados en pedidos"
)

@api.route("/summary")
class AdminReportSummary(Resource):

    @admin_required
    def get(self):

        # =========================
        # TOTALES GENERALES
        # =========================
        total_sales = db.session.query(
            func.coalesce(func.sum(Order.total), 0)
        ).scalar()

        total_orders = db.session.query(
            func.count(Order.id)
        ).scalar()

        # =========================
        # PRODUCTOS VENDIDOS (UNIDADES)
        # =========================
        products_query = (
            db.session.query(
                Product.id,
                Product.name,
                func.sum(OrderItem.quantity).label("units")
            )
            .join(OrderItem, OrderItem.product_id == Product.id)
            .group_by(Product.id)
            .order_by(func.sum(OrderItem.quantity).desc())
            .all()
        )

        products = [
            {
                "id": p.id,
                "name": p.name,
                "units": int(p.units),
                "revenue": None  # no existe price en OrderItem
            }
            for p in products_query
        ]

        return {
            "total_sales": float(total_sales),
            "total_orders": total_orders,
            "top_product": products[0] if products else None,
            "least_product": products[-1] if products else None,
            "products": products
        }, 200
