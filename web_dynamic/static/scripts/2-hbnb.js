$(document).ready(function () {
	const url = 'http://' + window.location.hostname + ':5001/api/v1/status/';
	$.get(url, function (response) {
		if (response.status === 'OK') {
			$('div#api_status').addClass('available');
		} else {
			$('div#api_status').removeClass('available');
		}
	});

	let amenities = {};
	$('input[type="checkbox"]').change(function () {
		if ($(this).is(':checked')) {
			amenities[$(this).attr('data-id')] = $(this).attr('data-name');
		} else {
			delete amenities[$(this).attr('data-id')];
		}
		if (Object.values(amenities).length === 0) {
			$('.amenities h4').html('&nbsp;');
		} else {
			$('.amenities h4').text(Object.values(amenities).join(', '));
		}
	});
});
