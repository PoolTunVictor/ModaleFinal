from flask_restx import Namespace, Resource
from flask_jwt_extended import jwt_required, get_jwt
from flask import request
from app.models.user import User
from app.extensions import db

api = Namespace("users", description="Administración de usuarios")

# =========================
# LISTAR USUARIOS
# =========================
@api.route("/")
class UserList(Resource):

    @jwt_required()
    def get(self):
        claims = get_jwt()

        # 🔐 solo admin
        if claims.get("role") != "admin":
            return {"message": "Acceso no autorizado"}, 403

        users = User.query.order_by(User.id.desc()).all()

        return [
            {
                "id": user.id,
                "email": user.email,
                "phone": user.phone,
                "role": user.role,
                "addresses_count": len(user.addresses)
            }
            for user in users
        ], 200


# =========================
# CAMBIAR ROL
# =========================
@api.route("/<int:user_id>/role")
class UserRole(Resource):

    @jwt_required()
    def put(self, user_id):
        claims = get_jwt()

        # 🔐 solo admin
        if claims.get("role") != "admin":
            return {"message": "Acceso no autorizado"}, 403

        data = request.get_json()
        new_role = data.get("role")

        if new_role not in ["admin", "cliente"]:
            return {"message": "Rol inválido"}, 400

        user = User.query.get_or_404(user_id)

        user.role = new_role
        db.session.commit()

        return {
            "id": user.id,
            "email": user.email,
            "role": user.role
        }, 200
