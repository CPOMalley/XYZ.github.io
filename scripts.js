var map;
var service;
var infowindow;
var userLocation = null;

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: { lat: -33.867, lng: 151.195 },
    zoom: 15
  });

  var input = document.getElementById('address');
  var autocomplete = new google.maps.places.Autocomplete(input);
  autocomplete.bindTo('bounds', map);

  var marker = new google.maps.Marker({
    map: map,
    anchorPoint: new google.maps.Point(0, -29)
  });

  autocomplete.addListener('place_changed', function () {
    infowindow.close();
    marker.setVisible(false);
    var place = autocomplete.getPlace();
    if (!place.geometry) {
      window.alert("Autocomplete's returned place contains no geometry");
      return;
    }

    if (place.geometry.viewport) {
      map.fitBounds(place.geometry.viewport);
    } else {
      map.setCenter(place.geometry.location);
      map.setZoom(17);
    }
    marker.setPosition(place.geometry.location);
    marker.setVisible(true);

    userLocation = place.geometry.location;
  });
}

function searchAddress() {
  var address = document.getElementById('address').value;
  if (!address) {
    alert('Please enter an address.');
    return;
  }

  var geocoder = new google.maps.Geocoder();
  geocoder.geocode({ 'address': address }, function (results, status) {
    if (status === 'OK') {
      map.setCenter(results[0].geometry.location);
      userLocation = results[0].geometry.location;
      document.getElementById('service-sidebar').classList.add('visible'); // Show sidebar on successful search
      document.getElementById('new-search').style.display = 'block';
    } else {
      alert('Geocode was not successful for the following reason: ' + status);
    }
  });
}

function filterPlaces(type, callback) {
  var placeType;
  switch (type) {
    case 'cleaning':
      placeType = 'laundry';
      break;
    case 'moving':
      placeType = 'moving_company';
      break;
    case 'photography':
      placeType = 'photographer';
      break;
    case 'staging':
      placeType = 'furniture_store';
      break;
    case 'landscaping':
      placeType = 'general_contractor';
      break;
    case 'storage':
      placeType = 'storage';
      break;
    default:
      placeType = '';
  }

  var request = {
    location: userLocation,
    radius: document.getElementById('radius').value,
    type: [placeType]
  };

  service = new google.maps.places.PlacesService(map);
  service.nearbySearch(request, function (results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      callback(results, type);
    } else {
      alert('Places search was not successful for the following reason: ' + status);
    }
  });
}

function selectServices() {
  var selectedServices = [];
  document.querySelectorAll('.sidebar input[type="checkbox"]:checked').forEach(function (checkbox) {
    selectedServices.push(checkbox.value);
  });

  if (selectedServices.length === 0) {
    alert('Please select at least one service.');
    return;
  }

  var resultsContainer = document.getElementById('results');
  resultsContainer.innerHTML = '<h3>Selected Services</h3>';

  selectedServices.forEach(function (service) {
    filterPlaces(service, function (results, type) {
      var serviceContainer = document.createElement('div');
      serviceContainer.innerHTML = `<h4>${type.charAt(0).toUpperCase() + type.slice(1)} Companies</h4>`;
      results.forEach(function (place) {
        var div = document.createElement('div');
        div.innerHTML = `<label><input type="checkbox" value="${place.name}"><strong>${place.name}</strong></label><br>${place.vicinity}<br>Distance: ${calculateDistance(place.geometry.location)} miles<br><a href="${place.url}" target="_blank">View on Google Maps</a>`;
        serviceContainer.appendChild(div);
      });
      resultsContainer.appendChild(serviceContainer);
    });
  });

  document.getElementById('selected-companies').classList.add('visible');
}

function calculateDistance(location) {
  if (!userLocation) return 'N/A';
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(location.lat() - userLocation.lat());
  var dLng = deg2rad(location.lng() - userLocation.lng());
  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(userLocation.lat())) * Math.cos(deg2rad(location.lat())) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c; // Distance in km
  var miles = d * 0.621371; // Convert km to miles
  return miles.toFixed(2);
}

function deg2rad(deg) {
  return deg * (Math.PI / 180)
}

function saveAsPDF() {
  var pdfContent = document.getElementById('selected-companies-list').innerHTML;
  var opt = {
    margin: 1,
    filename: 'selected-companies.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
  };
  html2pdf().from(pdfContent).set(opt).save();
}

function startNewSearch() {
  location.reload();
}

function submitUserInfo() {
  var firstName = document.getElementById('firstName').value;
  var lastName = document.getElementById('lastName').value;
  var email = document.getElementById('email').value;

  if (!firstName || !lastName || !email) {
    alert('Please fill out all fields.');
    return;
  }

  var selectedCompanies = document.querySelectorAll('.results-container input[type="checkbox"]:checked');
  var selectedCompaniesList = document.getElementById('selected-companies-list');
  selectedCompaniesList.innerHTML = '';

  selectedCompanies.forEach(function (company) {
    var div = document.createElement('div');
    div.innerHTML = `<strong>${company.value}</strong><br>`;
    selectedCompaniesList.appendChild(div);
  });

  document.getElementById('userInfoModal').style.display = 'none';
  document.getElementById('selected-companies').classList.add('visible');
}

window.onload = function () {
  initMap();
  document.getElementById('new-search').style.display = 'none';
};
