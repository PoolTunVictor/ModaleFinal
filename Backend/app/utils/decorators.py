from functools import wraps
from flask_jwt_extended import verify_jwt_in_request, get_jwt
from flask_restx import abort

def admin_required(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        verify_jwt_in_request()

        claims = get_jwt()
        role = claims.get("role")

        if role != "admin":
            abort(403, "Acceso solo para administradores")

        return fn(*args, **kwargs)

    return wrapper
