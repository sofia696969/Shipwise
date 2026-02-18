from models.user_model import fetch_users, insert_user

def get_all_users():
    return fetch_users()

def create_user(data):
    return insert_user(data)
