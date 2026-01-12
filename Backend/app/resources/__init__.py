from .auth import api as auth_ns
from .categories import api as categories_ns
from .products import api as products_ns
from .product_images import api as product_images_ns
from .address import api as addresses_ns
from .orders import api as orders_ns
from .order_items import api as order_items_ns
from .checkout import api as checkout_ns
from app.resources.users import api as users_ns
from app.resources.admin_orders import api as admin_orders_ns
from app.resources.admin_reports import api as admin_reports_api



def register_namespaces(api):
    api.add_namespace(auth_ns, path="/auth")
    api.add_namespace(categories_ns, path="/categories")
    api.add_namespace(products_ns, path="/products")
    api.add_namespace(product_images_ns, path="/product-images")
    api.add_namespace(addresses_ns, path="/addresses")
    api.add_namespace(orders_ns, path="/orders")
    api.add_namespace(order_items_ns, path="/order-items")
    api.add_namespace(checkout_ns, path="/checkout")
    api.add_namespace(users_ns, path="/users")
    api.add_namespace(admin_orders_ns)
    api.add_namespace(admin_reports_api)

    