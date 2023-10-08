#!/usr/bin/python3
"""
Flask App for Airbnb Clone with Custom HTML Template
"""
import uuid
from flask import Flask, render_template, url_for
from models import storage


app = Flask(__name__)
app.url_map.strict_slashes = False
port = 5000
host = '0.0.0.0'


@app.teardown_appcontext
def teardown_db(exception):
    """Closes the storage on teardown."""
    storage.close()


@app.route('/100-hbnb/')
def hbnb_filters(the_id=None):
    """Handles requests to display a custom template"""
    states = storage.all('State').values()
    amenities = storage.all('Amenity').values()
    places = storage.all('Place').values()
    users = dict([user.id, "{} {}".format(user.first_name, user.last_name)]
                 for user in storage.all('User').values())
    cache_id = (str(uuid.uuid4()))
    return render_template('100-hbnb.html',
                           states=states, amenities=amenities,
                           places=places, users=users,
                           cache_id=cache_id)


if __name__ == "__main__":
    app.run(host=host, port=port)
