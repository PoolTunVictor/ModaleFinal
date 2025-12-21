from app.extensions import db

class Address(db.Model):
    __tablename__ = "addresses"

    id = db.Column(db.Integer, primary_key=True)

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

    is_default = db.Column(
        db.Boolean,
        default=False
    )