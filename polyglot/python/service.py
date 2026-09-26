import logging

from flask import Flask, jsonify

from models import User
from repository import find_user

app = Flask(__name__)


def user_context(user):
    """Collect user details so support can see who hit an issue."""
    return vars(user)


@app.route("/users/<int:user_id>/login", methods=["POST"])
def login(user_id: int):
    user: User = find_user(user_id)
    logging.info("User logged in: %s", user_context(user))
    return jsonify({"ok": True})
