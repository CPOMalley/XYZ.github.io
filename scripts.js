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
      document.getElementById('new-search').classList.add('visible'); // Show "Start a New Search" after successful search
      // Store the radius for later use
      userLocation.radius = document.getElementById('radius').value;
    } else {
      alert('Geocode was not successful for the following reason: ' + status);
    }
  });
}

function filterPlaces(type, callback) {
  var request = {
    location: userLocation,
    radius: userLocation.radius || '5000', // Use the stored radius or default to 5km
    keyword: type
  };

  service = new google.maps.places.PlacesService(map);
  service.nearbySearch(request, function (results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      callback(results, type);
    } else {
      alert('Search was not successful for the following reason: ' + status);
    }
  });
}

function getPlaceDetails(place, callback) {
  service.getDetails({ placeId: place.place_id }, function (details, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      callback(details);
    } else {
      console.error('Place details request failed due to ' + status);
    }
  });
}

function calculateDistance(origin, destination) {
  var distanceService = new google.maps.DistanceMatrixService();
  return new Promise(function (resolve, reject) {
    distanceService.getDistanceMatrix({
      origins: [origin],
      destinations: [destination],
      travelMode: 'DRIVING',
    }, function (response, status) {
      if (status === 'OK') {
        var distanceText = response.rows[0].elements[0].distance.text;
        // Convert distance to miles if it is in km
        if (distanceText.includes('km')) {
          var distanceKm = parseFloat(distanceText.replace(' km', ''));
          var distanceMiles = (distanceKm * 0.621371).toFixed(2);
          resolve(distanceMiles + ' miles');
        } else {
          resolve(distanceText);
        }
      } else {
        reject('Distance calculation failed due to ' + status);
      }
    });
  });
}

function selectServices() {
  if (!userLocation) {
    alert('Please search for an address first.');
    return;
  }

  var selectedServices = [];
  var checkboxes = document.querySelectorAll('.sidebar input[type="checkbox"]:checked');
  checkboxes.forEach(function (checkbox) {
    selectedServices.push(checkbox.value);
  });

  if (selectedServices.length === 0) {
    alert('Please select at least one service.');
    return;
  }

function selectServices() {
  if (!userLocation) {
    alert('Please search for an address first.');
    return;
  }

  var selectedServices = [];
  var checkboxes = document.querySelectorAll('.sidebar input[type="checkbox"]:checked');
  checkboxes.forEach(function (checkbox) {
    selectedServices.push(checkbox.value);
  });

  if (selectedServices.length === 0) {
    alert('Please select at least one service.');
    return;
  }

  var resultsContainer = document.getElementById('results');
  resultsContainer.innerHTML = ''; // Clear the container
  resultsContainer.classList.add('visible');

  selectedServices.forEach(function (service) {
    var serviceContainer = document.createElement('div');
    serviceContainer.classList.add('service-container');
    // Comment out the following line to remove the selected services text
    // serviceContainer.innerHTML = `<h4>${service.charAt(0).toUpperCase() + service.slice(1)} Companies</h4>`;
    resultsContainer.appendChild(serviceContainer);

    filterPlaces(service, function (results, type) {
      results.forEach(function (place) {
        getPlaceDetails(place, function (details) {
          calculateDistance(userLocation, details.geometry.location).then(function (distance) {
            var placeDetails = `
              <div class="result-banner">
                <input type="checkbox" class="company-checkbox" data-name="${details.name}" data-address="${details.vicinity}" data-phone="${details.formatted_phone_number || 'N/A'}" data-distance="${distance}">
                <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(details.name)}&query_place_id=${details.place_id}" target="_blank">${details.name}</a><br>
                ${details.vicinity}<br>
                Distance: ${distance}<br>
                Phone: ${details.formatted_phone_number || 'N/A'}
              </div>`;
            serviceContainer.innerHTML += placeDetails;
          }).catch(function (error) {
            console.error(error);
          });
        });
      });
    });
  });

  var selectCompaniesButton = document.getElementById('select-companies-button');
  selectCompaniesButton.style.display = 'block';
}


  var selectCompaniesButton = document.getElementById('select-companies-button');
  selectCompaniesButton.style.display = 'block';
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

function generateSelectedCompanies() {
  var selectedCompanies = document.querySelectorAll('.company-checkbox:checked');
  if (selectedCompanies.length === 0) {
    alert('Please select at least one company.');
    return;
  }

  // Show user info modal before displaying results
  var userInfoModal = document.getElementById('userInfoModal');
  userInfoModal.style.display = 'block';
}

function submitUserInfo() {
  var firstName = document.getElementById('firstName').value;
  var lastName = document.getElementById('lastName').value;
  var email = document.getElementById('email').value;

  if (firstName && lastName && email) {
    var selectedCompaniesContainer = document.getElementById('selected-companies');
    var selectedCompaniesList = document.getElementById('selected-companies-list');
    selectedCompaniesList.innerHTML = '';

    var selectedCompanies = document.querySelectorAll('.company-checkbox:checked');
    selectedCompanies.forEach(function (checkbox) {
      var companyDetails = `
        <p>
          ${checkbox.dataset.name}<br>
          Address: ${checkbox.dataset.address}<br>
          Distance: ${checkbox.dataset.distance}<br>
          Phone: ${checkbox.dataset.phone}
        </p>`;
      selectedCompaniesList.innerHTML += companyDetails;
    });

    selectedCompaniesContainer.classList.add('visible');
    document.getElementById('userInfoModal').style.display = 'none'; // Hide the modal
  } else {
    alert('Please fill out all fields.');
  }
}

function saveAsPDF() {
  var { jsPDF } = window.jspdf;
  var doc = new jsPDF();
  var selectedCompaniesList = document.getElementById('selected-companies-list');
  var content = selectedCompaniesList.innerHTML.replace(/<br>/g, '\n').replace(/<\/?[^>]+(>|$)/g, "");
  var lines = doc.splitTextToSize(content, 180);
  doc.text(lines, 10, 10);
  doc.save('selected-companies.pdf');
}

function startNewSearch() {
  location.reload(); // Refresh the page
}

window.onload = function () {
  initMap();
  // Hide the "Select Services" button initially
  var selectServicesButton = document.getElementById('select-services-button');
  selectServicesButton.style.display = 'none';
  // Hide the "Select Companies" button and "Start a New Search" text initially
  var selectCompaniesButton = document.getElementById('select-companies-button');
  selectCompaniesButton.style.display = 'none';
  var newSearchText = document.getElementById('new-search');
  newSearchText.style.display = 'none';

  // Attach the change event to checkboxes to toggle the "Select Services" button
  var serviceCheckboxes = document.querySelectorAll('.sidebar input[type="checkbox"]');
  serviceCheckboxes.forEach(function (checkbox) {
    checkbox.addEventListener('change', toggleSelectServicesButton);
  });
};
