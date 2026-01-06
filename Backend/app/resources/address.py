from flask_restx import Namespace, Resource, fields
from flask import request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.extensions import db
from app.models.address import Address

api = Namespace("addresses", description="Direcciones de envío")

# =========================
# MODELS (Swagger)
# =========================

address_model = api.model("Address", {
    "id": fields.Integer(readOnly=True),
    "receiver_name": fields.String(required=True),
    "phone": fields.String(required=True),
    "street": fields.String(required=True),
    "city": fields.String(required=True),
    "state": fields.String(required=True),
    "postal_code": fields.String(required=True),
    "references": fields.String,
    "is_default": fields.Boolean
})

# =========================
# LIST / CREATE
# =========================

@api.route("/")
class AddressList(Resource):

    #@jwt_required()
    @api.marshal_list_with(address_model)
    def get(self):
        """Listar direcciones del usuario"""
        user_id = int(get_jwt_identity())
        return Address.query.filter_by(user_id=user_id).all()

    #@jwt_required()
    @api.expect(address_model, validate=True)
    @api.marshal_with(address_model, code=201)
    def post(self):
        """Crear dirección"""
        user_id = int(get_jwt_identity())
        data = request.json

        # Si se marca como default, limpiar las demás
        if data.get("is_default"):
            Address.query.filter_by(
                user_id=user_id,
                is_default=True
            ).update({"is_default": False})

        address = Address(
            user_id=user_id,
            receiver_name=data["receiver_name"],
            phone=data["phone"],
            street=data["street"],
            city=data["city"],
            state=data["state"],
            postal_code=data["postal_code"],
            references=data.get("references"),
            is_default=data.get("is_default", False)
        )

        db.session.add(address)
        db.session.commit()

        return address, 201


# =========================
# DETAIL / UPDATE / DELETE
# =========================

@api.route("/<int:id>")
@api.param("id", "ID de la dirección")
class AddressDetail(Resource):

    #@jwt_required()
    @api.marshal_with(address_model)
    def get(self, id):
        """Obtener dirección"""
        user_id = int(get_jwt_identity())
        address = Address.query.filter_by(
            id=id,
            user_id=user_id
        ).first_or_404()
        return address

    #@jwt_required()
    @api.expect(address_model, validate=True)
    @api.marshal_with(address_model)
    def put(self, id):
        """Actualizar dirección"""
        user_id = int(get_jwt_identity())
        address = Address.query.filter_by(
            id=id,
            user_id=user_id
        ).first_or_404()

        data = request.json

        if data.get("is_default"):
            Address.query.filter_by(
                user_id=user_id,
                is_default=True
            ).update({"is_default": False})

        address.receiver_name = data["receiver_name"]
        address.phone = data["phone"]
        address.street = data["street"]
        address.city = data["city"]
        address.state = data["state"]
        address.postal_code = data["postal_code"]
        address.references = data.get("references")
        address.is_default = data.get("is_default", False)

        db.session.commit()
        return address

    #@jwt_required()
    def delete(self, id):
        """Eliminar dirección"""
        user_id = int(get_jwt_identity())
        address = Address.query.filter_by(
            id=id,
            user_id=user_id
        ).first_or_404()

        db.session.delete(address)
        db.session.commit()

        return {"message": "Dirección eliminada"}, 200