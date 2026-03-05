from flask import Flask, request
from flask_cors import CORS
from flask_restx import Api
from werkzeug.security import generate_password_hash
from sqlalchemy import inspect
import os

from app.models.user import User
from app.utils.cloudinary import init_cloudinary
from .config import Config
from .extensions import db, migrate, jwt
from .resources import register_namespaces


ALLOWED_ORIGINS = [
    "http://localhost:4200",
    "https://modale.click",
    "https://www.modale.click",
]

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # =========================
    # EXTENSIONS
    # =========================
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)

    # =========================
    # CLOUDINARY
    # =========================
    init_cloudinary(app)

    # =========================
    # SWAGGER / RESTX
    # =========================
    api = Api(
        app,
        title="API Ventas",
        version="1.0",
        description="Backend para sistema de ventas",
        authorizations={
            "Bearer Auth": {
                "type": "apiKey",
                "in": "header",
                "name": "Authorization",
                "description": "Bearer <token>",
            }
        },
        security="Bearer Auth",
    )
    register_namespaces(api)

    # =========================
    # CORS
    # =========================
    CORS(
        app,
        resources={r"/*": {"origins": ALLOWED_ORIGINS}},
        supports_credentials=True,
        allow_headers=["Content-Type", "Authorization"],
        methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    )

    # =========================
    # PRE-FLIGHT OPTIONS
    # =========================
    @app.before_request
    def handle_preflight():
        if request.method == "OPTIONS":
            response = app.make_response("")
            origin = request.headers.get("Origin")
            if origin in ALLOWED_ORIGINS:
                response.headers["Access-Control-Allow-Origin"] = origin
            response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
            response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
            response.headers["Access-Control-Allow-Credentials"] = "true"
            return response

    # =========================
    # INIT ADMIN (SOLO SI YA HAY TABLAS)
    # =========================
    with app.app_context():
        try:
            inspector = inspect(db.engine)
            tables = set(inspector.get_table_names())

            if "users" not in tables:
                print("ℹ️ Aún no hay tablas (falta migración). Saltando creación de admin.")
            else:
                # Valores por defecto del administrador
                admin_email = os.getenv("ADMIN_EMAIL", "admin@admin.com")
                admin_password = os.getenv("ADMIN_PASSWORD", "admin123")

                if not User.query.filter_by(email=admin_email).first():
                    admin = User(
                        email=admin_email,
                        phone="0000000000",
                        password=generate_password_hash(admin_password),
                        role="admin",
                    )
                    db.session.add(admin)
                    db.session.commit()
                    print("✅ Usuario admin creado")
                else:
                    print("ℹ️ El usuario admin ya existe")

        except Exception as e:
            db.session.rollback()
            print("❌ Error en init admin:", e)

    return app