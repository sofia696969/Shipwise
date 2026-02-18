from flask import Flask
from routes.users import user_bp
from routes.shipments import shipment_bp

app = Flask(__name__)

app.register_blueprint(user_bp, url_prefix="/users")
app.register_blueprint(shipment_bp, url_prefix="/shipments")

if __name__ == "__main__":
    app.run(debug=True)
