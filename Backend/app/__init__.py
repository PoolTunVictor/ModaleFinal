from flask import Flask
from flask_cors import CORS
from flask_restx import Api
from sqlalchemy import text
from werkzeug.security import generate_password_hash
from app.models.user import User

from app.utils.cloudinary import init_cloudinary
from .config import Config
from .extensions import db, migrate, jwt
from .resources import register_namespaces
#p
def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # =========================
    # EXTENSIONS
    # =========================
    CORS(
    app,
    resources={r"/*": {"origins": "*"}},
    supports_credentials=True,
    allow_headers=["Content-Type", "Authorization"],
    methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"]
)
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)

    # =========================
    # CLOUDINARY (FIX)
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
                "description": 'Agrega tu token JWT con "Bearer <token>"'
            }
        },
        security="Bearer Auth"
    )

    register_namespaces(api)
    
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