from flask_restx import Namespace, Resource, fields
from flask import request
from app.extensions import db
from app.models.product import Product
from app.models.product_image import ProductImage
from app.utils.decorators import admin_required
from app.utils.cloudinary import upload_image, delete_image

api = Namespace("product-images", description="Gestión de imágenes de productos")

# ======================
# MODELO SWAGGER
# ======================
product_image_model = api.model("ProductImage", {
    "id": fields.Integer(readOnly=True),
    "product_id": fields.Integer(required=True),
    "url": fields.String(readOnly=True),
    "is_main": fields.Boolean
})


# ======================
# LISTAR / CREAR
# ======================
@api.route("/", strict_slashes=False)
class ProductImageList(Resource):

    @api.marshal_list_with(product_image_model)
    def get(self):
        try:
            product_id = int(request.args.get("product_id", 0))
        except ValueError:
            product_id = 0

        if not product_id:
            api.abort(400, "product_id es requerido")

        return ProductImage.query.filter_by(product_id=product_id).all()

    #@admin_required
    @api.marshal_with(product_image_model, code=201)
    def post(self):
        """
        Subir imagen a Cloudinary y asociarla a un producto
        (multipart/form-data)
        """

        # 🔍 DEBUG TEMPORAL (puedes quitar luego)
        print("FORM:", request.form)
        print("FILES:", request.files)

        product_id_raw = request.form.get("product_id")
        is_main = request.form.get("is_main", "false").lower() == "true"
        file = request.files.get("file")

        try:
            product_id = int(product_id_raw)
        except (TypeError, ValueError):
            product_id = 0

        if not product_id:
            api.abort(400, "product_id es obligatorio")

        product = Product.query.get(product_id)
        if not product:
            api.abort(404, "Producto no encontrado")

        if not file:
            api.abort(400, "Archivo de imagen requerido")

        if is_main:
            ProductImage.query.filter_by(
                product_id=product_id,
                is_main=True
            ).update({"is_main": False})

        try:
            result = upload_image(file)
        except Exception as e:
            api.abort(400, str(e))

        image = ProductImage(
            product_id=product_id,
            url=result["url"],
            public_id=result["public_id"],
            is_main=is_main
        )

        db.session.add(image)
        db.session.commit()

        return image, 201



# ======================
# OBTENER / ACTUALIZAR / ELIMINAR
# ======================
@api.route("/<int:id>")
@api.param("id", "ID de la imagen")
class ProductImageDetail(Resource):

    @api.marshal_with(product_image_model)
    def get(self, id):
        """
        Obtener imagen por ID
        """
        return ProductImage.query.get_or_404(id)

    #@admin_required
    @api.expect(api.model("UpdateProductImage", {
        "is_main": fields.Boolean(required=True)
    }))
    @api.marshal_with(product_image_model)
    def put(self, id):
        """
        Marcar / desmarcar imagen como principal
        """
        image = ProductImage.query.get_or_404(id)
        data = request.json or {}

        if "is_main" not in data:
            api.abort(400, "is_main es requerido")

        if data["is_main"]:
            ProductImage.query.filter_by(
                product_id=image.product_id,
                is_main=True
            ).update({"is_main": False})

        image.is_main = data["is_main"]
        db.session.commit()

        return image

    #@admin_required
    def delete(self, id):
        """
        Eliminar imagen (Cloudinary + DB)
        """
        image = ProductImage.query.get_or_404(id)

        delete_image(image.public_id)

        db.session.delete(image)
        db.session.commit()

        return {"message": "Imagen eliminada"}, 200