from models.shipment_model import fetch_shipments, insert_shipment

def get_all_shipments():
    return fetch_shipments()

def create_shipment(data):
    return insert_shipment(data)
