import logging

from flask import Flask, jsonify

from repository import find_user

app = Flask(__name__)


@app.route("/users/<int:user_id>/login", methods=["POST"])
def login(user_id: int):
    user = find_user(user_id)
    logging.info("User logged in: %s", user.id)
    return jsonify({"ok": True})
