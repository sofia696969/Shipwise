from flask import Blueprint, request, jsonify
from controllers.user_controller import get_all_users, create_user

user_bp = Blueprint('user_bp', __name__)

@user_bp.route("/", methods=["GET"])
def users():
    users = get_all_users()
    return jsonify(users)

@user_bp.route("/", methods=["POST"])
def add_user():
    data = request.json
    user = create_user(data)
    return jsonify(user)
