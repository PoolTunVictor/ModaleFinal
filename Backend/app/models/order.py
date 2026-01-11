from app.extensions import db

class Order(db.Model):
    __tablename__ = "orders"

    id = db.Column(db.Integer, primary_key=True)

    order_number = db.Column(
        db.String(30),
        unique=True,
        nullable=False,
        index=True
    )

    # =========================
    # RELACIONES CLAVE
    # =========================

    user_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id"),
        nullable=False
    )

    address_id = db.Column(
        db.Integer,
        db.ForeignKey("addresses.id"),
        nullable=False
    )

    # =========================
    # ESTADO Y TOTALES
    # =========================

    status = db.Column(
        db.String(30),
        nullable=False,
        default="pendiente"
    )

    subtotal = db.Column(
        db.Float,
        nullable=False
    )

    total = db.Column(
        db.Float,
        nullable=False
    )

    created_at = db.Column(
        db.DateTime,
        server_default=db.func.now()
    )

    # =========================
    # RELATIONSHIPS
    # =========================

    user = db.relationship(
        "User",
        backref="orders"
    )

    address = db.relationship(
        "Address"
    )