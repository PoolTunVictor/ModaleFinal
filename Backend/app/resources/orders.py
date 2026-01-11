from flask_restx import Namespace, Resource, fields
from flask import request
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from app.extensions import db
from app.models.order import Order
from app.models.order_item import OrderItem
from app.models.product import Product
from app.models.product_image import ProductImage
from app.models.address import Address
import uuid
import traceback

api = Namespace("orders", description="Gestión de pedidos")

# =========================
# MODELS (Swagger)
# =========================

order_item_response_model = api.model("OrderItemResponse", {
    "product_id": fields.Integer,
    "product_name": fields.String,
    "product_image": fields.String,
    "quantity": fields.Integer,
    "subtotal": fields.Float
})

order_response_model = api.model("OrderResponse", {
    "id": fields.Integer,
    "order_number": fields.String,
    "status": fields.String,
    "subtotal": fields.Float,
    "total": fields.Float,
    "created_at": fields.String,
    "items": fields.List(fields.Nested(order_item_response_model))
})

order_create_item_model = api.model("OrderCreateItem", {
    "product_id": fields.Integer(required=True),
    "quantity": fields.Integer(required=True)
})

order_create_model = api.model("OrderCreate", {
    "address_id": fields.Integer(required=True),
    "items": fields.List(fields.Nested(order_create_item_model), required=True)
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

    # =========================
    # GET MIS PEDIDOS
    # =========================
    @jwt_required()
    def get(self):
        claims = get_jwt()
        role = claims.get("role")
        user_id = int(get_jwt_identity())

        print("\n==============================")
        print("📦 GET /orders")
        print("👤 USER ID:", user_id)
        print("🔐 ROLE:", role)
        print("==============================")

        if role == "admin":
            orders = Order.query.order_by(Order.created_at.desc()).all()
        else:
            orders = Order.query.filter_by(user_id=user_id)\
                .order_by(Order.created_at.desc()).all()

        response = []

        for order in orders:
            print("\n🧾 ORDER:", order.id, order.order_number)
            items = []

            order_items = OrderItem.query.filter_by(order_id=order.id).all()
            print("📦 ITEMS DEL PEDIDO:", len(order_items))

            for item in order_items:
                print("\n🔎 ORDER_ITEM")
                print("➡ product_id:", item.product_id)
                print("➡ product_name:", item.product_name)

                # 🔍 BUSCAR IMAGEN PRINCIPAL
                main_image = (
                    ProductImage.query
                    .filter_by(product_id=item.product_id, is_main=True)
                    .first()
                )

                if main_image:
                    print("🖼️ IMAGEN ENCONTRADA:", main_image.url)
                else:
                    print("❌ NO HAY IMAGEN PRINCIPAL PARA ESTE PRODUCTO")

                    # DEBUG EXTRA: cuántas imágenes existen
                    total_imgs = ProductImage.query.filter_by(
                        product_id=item.product_id
                    ).count()
                    print("📊 TOTAL IMÁGENES DEL PRODUCTO:", total_imgs)

                items.append({
                    "product_id": item.product_id,
                    "product_name": item.product_name,
                    "product_image": main_image.url if main_image else None,
                    "quantity": item.quantity,
                    "subtotal": item.subtotal
                })

            response.append({
                "id": order.id,
                "order_number": order.order_number,
                "status": order.status,
                "subtotal": order.subtotal,
                "total": order.total,
                "created_at": order.created_at.isoformat(),
                "items": items
            })

        print("\n✅ RESPUESTA FINAL ENVIADA")
        return response, 200

    # =========================
    # CREATE ORDER
    # =========================
    @jwt_required()
    @api.expect(order_create_model, validate=True)
    def post(self):
        try:
            user_id = int(get_jwt_identity())
            data = request.json or {}

            address = Address.query.filter_by(
                id=data.get("address_id"),
                user_id=user_id
            ).first()

            if not address:
                api.abort(400, "Dirección inválida o no pertenece al usuario")

            if not data.get("items"):
                api.abort(400, "El pedido debe contener productos")

            subtotal = 0
            order_items = []

            for item in data["items"]:
                product = Product.query.get(item["product_id"])

                if not product:
                    api.abort(400, "Producto no existe")

                if product.stock < item["quantity"]:
                    api.abort(400, f"Stock insuficiente para {product.name}")

                line_total = product.price * item["quantity"]
                subtotal += line_total

                order_items.append({
                    "product": product,
                    "quantity": item["quantity"]
                })

            order = Order(
                order_number=generate_order_number(),
                user_id=user_id,
                address_id=address.id,
                subtotal=subtotal,
                total=subtotal
            )

            db.session.add(order)
            db.session.flush()

            for item in order_items:
                db.session.add(OrderItem(
                    order_id=order.id,
                    product_id=item["product"].id,
                    product_name=item["product"].name,
                    product_price=item["product"].price,
                    quantity=item["quantity"],
                    subtotal=item["product"].price * item["quantity"]
                ))

                item["product"].stock -= item["quantity"]

            db.session.commit()

            return {
                "id": order.id,
                "order_number": order.order_number
            }, 201

        except Exception as e:
            db.session.rollback()
            traceback.print_exc()
            return {
                "message": "Error interno al generar el pedido",
                "error": str(e)
            }, 500
