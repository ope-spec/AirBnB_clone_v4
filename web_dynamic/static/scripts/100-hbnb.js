$(document).ready(function () {
    const api = 'http://' + window.location.hostname;

    // Check the API status
    $.get(api + ':5001/api/v1/status/', function (response) {
        if (response.status === 'OK') {
            $('div#api_status').addClass('available');
        } else {
            $('div#api_status').removeClass('available');
        }
    });

    // Initialize states, cities, and amenities objects
    let states = {};
    let cities = {};
    let amenities = {};

    // Handle checkbox changes for states
    $('.locations > UL > h2 > INPUT[type="checkbox"]').change(function () {
        updateLocations();
    });

    // Handle checkbox changes for cities
    $('.locations > UL > UL > LI INPUT[type="checkbox"]').change(function () {
        updateLocations();
    });

    // Handle checkbox changes for amenities
    $('.amenities INPUT[type="checkbox"]').change(function () {
        updateAmenities();
    });

    // Handle button click to search for places
    $('button').click(function () {
        $.ajax({
            url: api + ':5001/api/v1/places_search/',
            type: 'POST',
            data: JSON.stringify({
                'states': Object.keys(states),
                'cities': Object.keys(cities),
                'amenities': Object.keys(amenities)
            }),
            contentType: 'application/json',
            dataType: 'json',
            success: appendPlaces
        });
    });

    function updateLocations() {
        $('.locations h4').text(Object.values(Object.assign({}, states, cities)).join(', '));
    }

    function updateAmenities() {
        $('.amenities h4').text(Object.values(amenities).join(', '));
    }

    function appendPlaces(data) {
        const placesSection = $('section.places');
        placesSection.empty();
        placesSection.append(data.map(place => {
            return `<article>
                <div class="title">
                    <h2>${place.name}</h2>
                    <div class="price_by_night">
                        ${place.price_by_night}
                    </div>
                </div>
                <div class="information">
                    <div class="max_guest">
                        <i class="fa fa-users fa-3x" aria-hidden="true"></i><br>
                        ${place.max_guest} Guests
                    </div>
                    <div class="number_rooms">
                        <i class="fa fa-bed fa-3x" aria-hidden="true"></i><br>
                        ${place.number_rooms} Bedrooms
                    </div>
                    <div class="number_bathrooms">
                        <i class="fa fa-bath fa-3x" aria-hidden="true"></i><br>
                        ${place.number_bathrooms} Bathrooms
                    </div>
                </div>
                <div class="description">
                    ${place.description}
                </div>
            </article>`;
        }));
    }
});
