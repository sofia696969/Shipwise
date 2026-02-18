from flask import Blueprint, request, jsonify
from controllers.shipment_controller import get_all_shipments, create_shipment

shipment_bp = Blueprint('shipment_bp', __name__)

@shipment_bp.route("/", methods=["GET"])
def shipments():
    shipments = get_all_shipments()
    return jsonify(shipments)

@shipment_bp.route("/", methods=["POST"])
def add_shipment():
    data = request.json
    shipment = create_shipment(data)
    return jsonify(shipment)
