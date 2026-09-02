import os
from channels.routing import ProtocolTypeRouter, URLRouter
from django.core.asgi import get_asgi_application
from django.urls import re_path
from analytics.consumers import MetricsConsumer

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": URLRouter([re_path(r"ws/metrics/$", MetricsConsumer.as_asgi())]),
})
