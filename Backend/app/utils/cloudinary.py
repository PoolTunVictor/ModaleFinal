import cloudinary
import cloudinary.uploader
from flask import current_app


def init_cloudinary(app):
    cloudinary.config(
        cloud_name=app.config.get("CLOUDINARY_CLOUD_NAME"),
        api_key=app.config.get("CLOUDINARY_API_KEY"),
        api_secret=app.config.get("CLOUDINARY_API_SECRET"),
        secure=True
    )


def upload_image(file, folder="products"):
    """
    Sube una imagen a Cloudinary
    Retorna: {url, public_id}
    """

    if not file:
        raise ValueError("No se envió ningún archivo")

    # ✅ Validación local de extensión
    filename = file.filename.lower()
    if not filename.endswith((".jpg", ".jpeg", ".png", ".webp")):
        raise ValueError("Formato de imagen no permitido")

    result = cloudinary.uploader.upload(
        file,
        folder=folder,
        resource_type="image"
    )

    return {
        "url": result["secure_url"],
        "public_id": result["public_id"]
    }


def delete_image(public_id):
    if not public_id:
        return

    cloudinary.uploader.destroy(
        public_id,
        resource_type="image"
    )
