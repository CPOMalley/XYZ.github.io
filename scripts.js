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
  resultsContainer.innerHTML = '<h3>Selected Services</h3>';
  resultsContainer.classList.add('visible');

  selectedServices.forEach(function (service) {
    var serviceContainer = document.createElement('div');
    serviceContainer.classList.add('service-container');
    serviceContainer.innerHTML = `<h4>${service.charAt(0).toUpperCase() + service.slice(1)} Companies</h4>`;
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

  // Show the "Select Companies" button after services are selected
  var selectCompaniesButton = document.getElementById('select-companies-button');
  selectCompaniesButton.style.display = 'block';
}
