# app/resources/users.py
from flask_restx import Namespace, Resource
from flask_jwt_extended import jwt_required, get_jwt
from app.models.user import User

api = Namespace("users", description="Administración de usuarios")

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
