from flask_restx import Namespace, Resource, fields
from flask import request
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token

from app.extensions import db
from app.models.user import User

api = Namespace("auth", description="Autenticación")

register_model = api.model("Register", {
    "email": fields.String(required=True, example="user@mail.com"),
    "password": fields.String(required=True, example="123456"),
    "phone": fields.String(example="9999999999")
})

@api.route("/register")
class Register(Resource):
    @api.expect(register_model, validate=True)
    def post(self):
        data = request.get_json() or {}

        email = data.get("email")
        password = data.get("password")
        phone = data.get("phone")

        if not email or not password:
            return {"message": "Email y password son obligatorios"}, 400

        if User.query.filter_by(email=email).first():
            return {"message": "Usuario ya existe"}, 400

        user = User(
            email=email,
            phone=phone,
            password=generate_password_hash(password)
        )

        db.session.add(user)
        db.session.commit()

        return {"message": "Usuario creado"}, 201

login_model = api.model("Login", {
    "email": fields.String(required=True, example="user@mail.com"),
    "password": fields.String(required=True, example="123456")
})

@api.route("/login")
class Login(Resource):
    @api.expect(login_model, validate=True)
    def post(self):
        data = request.get_json() or {}

        email = data.get("email")
        password = data.get("password")

        if not email or not password:
            return {"message": "Credenciales incompletas"}, 400

        user = User.query.filter_by(email=email).first()

        if not user or not check_password_hash(user.password, password):
            return {"message": "Credenciales incorrectas"}, 401

        token = create_access_token(
            identity=str(user.id),
            additional_claims={"role": user.role}
        )

        return {
            "access_token": token,
            "user": {
                "id": user.id,
                "email": user.email,
                "role": user.role
            }
        }