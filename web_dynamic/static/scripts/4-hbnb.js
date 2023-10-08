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

    // Initialize amenities object
    let amenities = {};

    // Handle checkbox changes
    $('input[type="checkbox"]').change(function () {
        if ($(this).is(':checked')) {
            amenities[$(this).attr('data-id')] = $(this).attr('data-name');
        } else {
            delete amenities[$(this).attr('data-id')];
        }
        updateAmenitiesDisplay();
    });

    // Handle button click to search for places
    $('button').click(function () {
        $.ajax({
            url: api + ':5001/api/v1/places_search/',
            type: 'POST',
            data: JSON.stringify({ 'amenities': Object.keys(amenities) }),
            contentType: 'application/json',
            dataType: 'json',
            success: appendPlaces
        });
    });

    // Initial load of places
    loadPlaces();

    function updateAmenitiesDisplay() {
        if (Object.values(amenities).length === 0) {
            $('.amenities h4').html('&nbsp;');
        } else {
            $('.amenities h4').text(Object.values(amenities).join(', '));
        }
    }

    function loadPlaces() {
        $.ajax({
            url: api + ':5001/api/v1/places_search/',
            type: 'POST',
            data: '{}',
            contentType: 'application/json',
            dataType: 'json',
            success: appendPlaces
        });
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
