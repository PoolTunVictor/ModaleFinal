from flask_restx import Namespace, Resource, fields
from flask import request
from app.extensions import db
from app.models.product import Product
from app.models.category import Category
from app.models.product_image import ProductImage
from slugify import slugify

api = Namespace("products", description="Gestión de productos")

# ======================
# MODELO (solo para POST / PUT)
# ======================
product_model = api.model("Product", {
    "id": fields.Integer(readOnly=True),
    "name": fields.String(required=True),
    "slug": fields.String(readOnly=True),
    "description": fields.String,
    "price": fields.Float(required=True),
    "stock": fields.Integer,
    "category_id": fields.Integer(required=True)
})

# ======================
# LISTAR / CREAR
# ======================
@api.route("/", strict_slashes=False)
class ProductList(Resource):

    def get(self):
        """
        Listar productos (incluye imagen principal si existe)
        """
        category_id = request.args.get("category_id", type=int)

        query = Product.query
        if category_id:
            query = query.filter_by(category_id=category_id)

        products = query.all()
        result = []

        for product in products:
            # 🔍 Buscar imagen principal
            main_image = ProductImage.query.filter_by(
                product_id=product.id,
                is_main=True
            ).first()

            result.append({
                "id": product.id,
                "name": product.name,
                "slug": product.slug,
                "description": product.description,
                "price": product.price,
                "stock": product.stock,
                "category_id": product.category_id,
                "main_image": main_image.url if main_image else None
            })

        return result, 200


    @api.expect(product_model, validate=True)
    @api.marshal_with(product_model, code=201)
    def post(self):
        """
        Crear producto
        """
        data = request.json

        # Validaciones
        if not Category.query.get(data["category_id"]):
            api.abort(400, "La categoría no existe")

        if data["price"] < 0:
            api.abort(400, "El precio no puede ser negativo")

        if data.get("stock", 0) < 0:
            api.abort(400, "El stock no puede ser negativo")

        slug = slugify(data["name"])
        if Product.query.filter_by(slug=slug).first():
            api.abort(400, "Producto ya existe")

        product = Product(
            name=data["name"],
            slug=slug,
            description=data.get("description"),
            price=data["price"],
            stock=data.get("stock", 0),
            category_id=data["category_id"]
        )

        db.session.add(product)
        db.session.commit()

        return product, 201


# ======================
# GET / PUT / DELETE POR ID
# ======================
@api.route("/<int:id>")
@api.param("id", "ID del producto")
class ProductDetail(Resource):

    def get(self, id):
        """
        Obtener producto por ID (incluye imagen principal)
        """
        product = Product.query.get_or_404(id)

        main_image = ProductImage.query.filter_by(
            product_id=product.id,
            is_main=True
        ).first()

        return {
            "id": product.id,
            "name": product.name,
            "slug": product.slug,
            "description": product.description,
            "price": product.price,
            "stock": product.stock,
            "category_id": product.category_id,
            "main_image": main_image.url if main_image else None
        }, 200


    @api.expect(product_model, validate=True)
    @api.marshal_with(product_model)
    def put(self, id):
        """
        Actualizar producto
        """
        product = Product.query.get_or_404(id)
        data = request.json

        # Validar nombre duplicado
        if "name" in data and data["name"] != product.name:
            new_slug = slugify(data["name"])
            existing = Product.query.filter_by(slug=new_slug).first()
            if existing and existing.id != product.id:
                api.abort(400, "Otro producto ya tiene este nombre")

            product.name = data["name"]
            product.slug = new_slug

        product.description = data.get("description", product.description)
        product.price = data.get("price", product.price)
        product.stock = data.get("stock", product.stock)
        product.category_id = data.get("category_id", product.category_id)

        db.session.commit()
        return product


    def delete(self, id):
        """
        Eliminar producto
        """
        product = Product.query.get_or_404(id)
        db.session.delete(product)
        db.session.commit()
        return {"message": "Producto eliminado"}, 200
