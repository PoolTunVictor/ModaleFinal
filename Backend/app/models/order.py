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

    user_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id"),
        nullable=False
    )

    receiver_name = db.Column(
        db.String(120),
        nullable=False
    )

    phone = db.Column(
        db.String(20),
        nullable=False
    )

    street = db.Column(
        db.String(120),
        nullable=False
    )

    city = db.Column(
        db.String(80),
        nullable=False
    )

    state = db.Column(
        db.String(80),
        nullable=False
    )

    postal_code = db.Column(
        db.String(10),
        nullable=False
    )

    references = db.Column(
        db.String(255)
    )

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

    user = db.relationship(
        "User",
        backref="orders"
    )