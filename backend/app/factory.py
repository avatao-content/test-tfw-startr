from flask import Flask
from flask_cors import CORS

from app.config import AppConfig


def create_app(config_class=AppConfig):
    app = Flask(__name__)
    CORS(app)

    app.config.from_object(config_class)

    from app.api_v1 import bp as api_v1_bp

    app.register_blueprint(api_v1_bp, url_prefix="/api/v1")

    return app
