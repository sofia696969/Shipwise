from config import supabase

def fetch_shipments():
    response = supabase.table("shipments").select("*").execute()
    return response.data

def insert_shipment(data):
    response = supabase.table("shipments").insert(data).execute()
    return response.data
