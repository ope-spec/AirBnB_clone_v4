#!/usr/bin/python3
"""
This module defines the routes for the API.
"""

import os
from flask import jsonify
from api.v1.views import app_views
from models import storage
from models.amenity import Amenity
from models.city import City
from models.place import Place
from models.review import Review
from models.state import State
from models.user import User


@app_views.route('/status')
def get_status():
    """
    Returns the status of the API.
    """
    return jsonify({"status": "OK"}), 200


@app_views.route('/stats')
def get_stats():
    """
    Returns the number of each object by type.
    """
    obj_count = {
        "amenities": storage.count("Amenity"),
        "cities": storage.count("City"),
        "places": storage.count("Place"),
        "reviews": storage.count("Review"),
        "states": storage.count("State"),
        "users": storage.count("User")
    }
    return jsonify(obj_count)


if __name__ == "__main__":
    host = os.getenv('HBNB_API_HOST', '0.0.0.0')
    port = int(os.getenv('HBNB_API_PORT', 5000))
    threaded = True
    app.run(host=host, port=port, threaded=threaded)
