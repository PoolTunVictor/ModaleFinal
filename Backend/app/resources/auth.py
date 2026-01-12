from flask_restx import Namespace, Resource
from flask import request
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token
from werkzeug.utils import secure_filename
import os

from app.extensions import db
from app.models.user import User

api = Namespace("auth", description="Autenticación")

UPLOAD_FOLDER = "uploads/avatars"


# =========================
# REGISTER
# =========================
@api.route("/register")
class Register(Resource):

    def post(self):
        # 👇 multipart/form-data
        data = request.form
        file = request.files.get("avatar")  # 👈 OPCIONAL

        email = data.get("email")
        password = data.get("password")
        phone = data.get("phone")

        if not email or not password:
            return {"message": "Email y password son obligatorios"}, 400

        if User.query.filter_by(email=email).first():
            return {"message": "Usuario ya existe"}, 400

        avatar_url = None

        # 🖼️ Guardar avatar SOLO si viene
        if file:
            os.makedirs(UPLOAD_FOLDER, exist_ok=True)
            filename = secure_filename(file.filename)
            file_path = os.path.join(UPLOAD_FOLDER, filename)
            file.save(file_path)

            avatar_url = f"/{UPLOAD_FOLDER}/{filename}"

        user = User(
            email=email,
            phone=phone,
            password=generate_password_hash(password),
            avatar=avatar_url
        )

        db.session.add(user)
        db.session.commit()

        return {"message": "Usuario creado"}, 201


# =========================
# LOGIN
# =========================
@api.route("/login")
class Login(Resource):

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
                "role": user.role,
                "avatar": user.avatar  # 👈 NUEVO
            }
        }
