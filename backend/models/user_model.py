from config import supabase

def fetch_users():
    response = supabase.table("users").select("*").execute()
    return response.data

def insert_user(data):
    response = supabase.table("users").insert(data).execute()
    return response.data
