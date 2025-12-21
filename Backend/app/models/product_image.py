from app.extensions import db

class ProductImage(db.Model):
    __tablename__ = "product_images"

    id = db.Column(db.Integer, primary_key=True)

    product_id = db.Column(
        db.Integer,
        db.ForeignKey("products.id"),
        nullable=False
    )

    url = db.Column(
        db.String(255),
        nullable=False
    )

    public_id = db.Column(
        db.String(255),
        nullable=False
    )

    is_main = db.Column(
        db.Boolean,
        default=False
    )

    product = db.relationship(
        "Product",
        backref="images"
    )