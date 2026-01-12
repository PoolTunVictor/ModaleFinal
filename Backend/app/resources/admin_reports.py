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

# =========================
# RESUMEN GENERAL
# =========================
@api.route("/summary")
class AdminReportSummary(Resource):

    @admin_required
    def get(self):

        # -------------------------
        # KPIs GENERALES
        # -------------------------
        total_sales = db.session.query(
            func.coalesce(func.sum(Order.total), 0)
        ).scalar()

        total_orders = db.session.query(
            func.count(Order.id)
        ).scalar()

        # -------------------------
        # PRODUCTOS VENDIDOS
        # -------------------------
        products_query = (
            db.session.query(
                Product.id,
                Product.name,
                func.sum(OrderItem.quantity).label("units"),
                func.coalesce(
                    func.sum(OrderItem.quantity * Product.price),
                    0
                ).label("revenue")
            )
            .join(OrderItem, OrderItem.product_id == Product.id)
            .join(Product, Product.id == OrderItem.product_id)
            .group_by(Product.id)
            .order_by(func.sum(OrderItem.quantity).desc())
            .all()
        )

        products = [
            {
                "id": p.id,
                "name": p.name,
                "units": int(p.units),
                "revenue": float(p.revenue)
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


# =========================
# VENTAS POR DÍA (GRÁFICA)
# =========================
@api.route("/sales-by-day")
class AdminReportSalesByDay(Resource):

    @admin_required
    def get(self):
        """
        Ventas agrupadas por día.
        SIN filtro de fechas para evitar gráficas vacías.
        """

        results = (
            db.session.query(
                func.date(Order.created_at).label("date"),
                func.sum(Order.total).label("total")
            )
            .group_by(func.date(Order.created_at))
            .order_by(func.date(Order.created_at))
            .all()
        )

        return [
            {
                "date": r.date.strftime("%Y-%m-%d"),
                "total": float(r.total)
            }
            for r in results
        ], 200
