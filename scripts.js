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
  var placeTypes;
  switch (type) {
    case 'cleaning':
      placeTypes = ['laundry', 'cleaning_services'];
      break;
    case 'moving':
      placeTypes = ['moving_company', 'storage'];
      break;
    case 'photography':
      placeTypes = ['photographer'];
      break;
    case 'staging':
      placeTypes = ['furniture_store', 'home_goods_store', 'interior_designer'];
      break;
    case 'landscaping':
      placeTypes = ['landscaper', 'gardener'];
      break;
    case 'storage':
      placeTypes = ['storage'];
      break;
    default:
      placeTypes = [];
  }

  var request = {
    location: userLocation,
    radius: document.getElementById('radius').value,
    type: placeTypes
  };

  service = new google.maps.places.PlacesService(map);
  service.nearbySearch(request, function (results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      var filteredResults = results.filter(place => {
        // Additional filtering logic based on name or vicinity
        var name = place.name.toLowerCase();
        var vicinity = place.vicinity.toLowerCase();

        if (type === 'cleaning' && !name.includes('cleaning') && !vicinity.includes('cleaning')) {
          return false;
        }
        if (type === 'moving' && !name.includes('moving') && !vicinity.includes('moving')) {
          return false;
        }
        if (type === 'photography' && !name.includes('photo') && !vicinity.includes('photo')) {
          return false;
        }
        if (type === 'staging' && !name.includes('staging') && !vicinity.includes('staging')) {
          return false;
        }
        if (type === 'landscaping' && !name.includes('landscaping') && !vicinity.includes('landscaping')) {
          return false;
        }
        if (type === 'storage' && !name.includes('storage') && !vicinity.includes('storage')) {
          return false;
        }
        return true;
      });
      callback(filteredResults, type);
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
      serviceContainer.classList.add('service-container');
      serviceContainer.innerHTML = `<h4>${type.charAt(0).toUpperCase() + type.slice(1)} Companies</h4>`;
      results.forEach(function (place) {
        var div = document.createElement('div');
        div.classList.add('service-tile');
        div.innerHTML = `<label><input type="checkbox" value="${place.name}" onchange="toggleSelectCompaniesButton()"><strong>${place.name}</strong></label><br>${place.vicinity}<br>Distance: ${calculateDistance(place.geometry.location)} miles<br><a href="${place.url}" target="_blank">View on Google Maps</a>`;
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

function toggleSelectServicesButton() {
  var selectedServices = document.querySelectorAll('.sidebar input[type="checkbox"]:checked');
  var selectServicesButton = document.getElementById('select-services-button');
  if (selectedServices.length > 0) {
    selectServicesButton.style.display = 'block';
  } else {
    selectServicesButton.style.display = 'none';
  }
}

function toggleSelectCompaniesButton() {
  var selectedCompanies = document.querySelectorAll('.results-container input[type="checkbox"]:checked');
  var selectCompaniesButton = document.getElementById('select-companies-button');
  if (selectedCompanies.length > 0) {
    selectCompaniesButton.style.display = 'block';
  } else {
    selectCompaniesButton.style.display = 'none';
  }
}

function selectCompanies() {
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
  var lastName = document.getElement.getElementById('lastName').value;
  var email = document.getElement.getElementById('email').value;

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
  document.getElementById('select-services-button').style.display = 'none';
  document.getElementById('select-companies-button').style.display = 'none';
};
