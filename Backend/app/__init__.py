from flask import Flask, request
from flask_cors import CORS
from flask_restx import Api
from sqlalchemy import text
from werkzeug.security import generate_password_hash

from app.models.user import User
from app.utils.cloudinary import init_cloudinary
from .config import Config
from .extensions import db, migrate, jwt
from .resources import register_namespaces


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # =========================
    # EXTENSIONS
    # =========================
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)

    # =======================
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
                "description": 'Bearer <token>'
            }
        },
        security="Bearer Auth"
    )

    register_namespaces(api)

    # =========================
    # CORS (DESPUÉS DE RESTX)
    # =========================
    CORS(
        app,
        resources={r"/*": {
            "origins": [
                "http://localhost:4200",
                "https://modale.shop",
                "https://www.modale.shop"
            ]
        }},
        supports_credentials=True,
        allow_headers=["Content-Type", "Authorization"],
        methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"]
    )


    # =========================
    # 🔴 FIX DEFINITIVO PARA JWT + OPTIONS
    # =========================
    @app.before_request
    def handle_preflight():
        if request.method == "OPTIONS":
            response = app.make_response("")
            origin = request.headers.get("Origin")

            if origin in [
                "http://localhost:4200",
                "https://modale.shop",
                "https://www.modale.shop"
            ]:
                response.headers["Access-Control-Allow-Origin"] = origin

            response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
            response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
            response.headers["Access-Control-Allow-Credentials"] = "true"
            return response


    # =========================
    # INIT DB + ADMIN
    # =========================
    with app.app_context():
        try:
            db.session.execute(text("SELECT 1 FROM users LIMIT 1"))
        except Exception:
            print("⚠️ Tablas no existen, creando automáticamente...")
            db.create_all()

        if not User.query.filter_by(email="admin@admin.com").first():
            admin = User(
                email="admin@admin.com",
                phone="0000000000",
                password=generate_password_hash("admin123"),
                role="admin"
            )
            db.session.add(admin)
            db.session.commit()
            print("✅ Usuario admin creado")

    return app
