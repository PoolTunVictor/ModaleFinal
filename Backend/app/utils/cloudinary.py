import cloudinary
import cloudinary.uploader
import cloudinary.api
from flask import current_app


def init_cloudinary(app):
    cloudinary.config(
        cloud_name=app.config.get("CLOUDINARY_CLOUD_NAME"),
        api_key=app.config.get("CLOUDINARY_API_KEY"),
        api_secret=app.config.get("CLOUDINARY_API_SECRET"),
        secure=True
    )


def upload_image(
    file,
    folder="products",
    allowed_formats=("jpg", "jpeg", "png", "webp")
):
    """
    Sube una imagen a Cloudinary
    Retorna: {url, public_id}
    """
    if not file:
        raise ValueError("No se envió ningún archivo")

    result = cloudinary.uploader.upload(
        file,
        folder=folder,
        resource_type="image",
        allowed_formats=list(allowed_formats)
    )

    return {
        "url": result.get("secure_url"),
        "public_id": result.get("public_id")
    }


def delete_image(public_id):
    """
    Elimina una imagen de Cloudinary usando public_id
    """
    if not public_id:
        return

    cloudinary.uploader.destroy(
        public_id,
        resource_type="image"
    )