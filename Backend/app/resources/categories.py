from flask_restx import Namespace, Resource, fields
from flask import request
from app.extensions import db
from app.models.category import Category
from app.utils.decorators import admin_required

api = Namespace("categories", description="Gestión de categorías")

#SCHEMA
category_model = api.model("Category", {
    "id": fields.Integer(readOnly=True),
    "name": fields.String(required=True),
    "description": fields.String,
    "is_active": fields.Boolean
})

#GET /categories y POST /categories
@api.route("/")
class CategoryList(Resource):

    @api.marshal_list_with(category_model)
    def get(self):
        """Listar todas las categorías"""
        return Category.query.all()

    @api.expect(category_model, validate=True)
    @api.marshal_with(category_model, code=201)
    
    def post(self):
        """Crear una nueva categoría"""
        data = request.json

        if Category.query.filter_by(name=data["name"]).first():
            api.abort(400, "La categoría ya existe")

        category = Category(
            name=data["name"],
            description=data.get("description"),
            is_active=data.get("is_active", True)
        )

        db.session.add(category)
        db.session.commit()

        return category, 201

#GET /categories/<id> PUT /categories/<id> DELETE /categories/<id>
@api.route("/<int:id>")
@api.param("id", "ID de la categoría")
class CategoryDetail(Resource):

    @api.marshal_with(category_model)
    def get(self, id):
        """Obtener una categoría por ID"""
        category = Category.query.get_or_404(id)
        return category

    @api.expect(category_model, validate=True)
    @api.marshal_with(category_model)
    
    def put(self, id):
        """Actualizar una categoría"""
        category = Category.query.get_or_404(id)
        data = request.json

        category.name = data["name"]
        category.description = data.get("description")
        category.is_active = data.get("is_active", category.is_active)

        db.session.commit()
        return category
    
    
    def delete(self, id):
        """Eliminar una categoría"""
        category = Category.query.get_or_404(id)
        db.session.delete(category)
        db.session.commit()

        return {"message": "Categoría eliminada"}, 200
