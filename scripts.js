body {
  font-family: Arial, sans-serif;
  background-color: #f8f9fa;
  margin: 0;
  padding: 0;
}

.hero {
  position: relative;
  height: 100vh;
  overflow: hidden;
}

#hero-video {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: -1;
}
.hero-content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: #fff;
  padding: 20px;
}

.hero-content h1 {
  font-size: 3em;
  margin: 0;
}

.hero-content p {
  font-size: 1.5em;
  margin: 10px 0;
}

.hero-content button {
  padding: 10px 20px;
  font-size: 1em;
  border: none;
  border-radius: 5px;
  background-color: #007bff;
  color: #fff;
  cursor: pointer;
}

.hero-content button:hover {
  background-color: #0056b3;
}

.header {
  text-align: center;
  padding: 20px;
  background-color: #fff;
  border-bottom: 1px solid #ccc;
}

.header-content {
  display: flex;
  justify-content: center;
  align-items: center;
}

.header-text {
  margin-left: 20px;
}

.header h1 {
  margin: 0;
  color: black;
}

.header p {
  margin: 5px 0 0;
  color: black;
}

.logo {
  max-width: 200px; /* Increased size for better visibility */
  margin-bottom: 10px;
}

.container {
  max-width: 1000px; /* Reduced width for the container */
  margin: 20px auto;
  padding: 20px;
  background-color: #fff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.search-container {
  margin-top: 20px;
  text-align: center;
}

.search-container input[type="text"] {
  padding: 10px;
  width: 80%;
  max-width: 400px;
  margin-right: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.search-container select {
  padding: 10px;
  margin-right: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.search-container button {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  background-color: #007bff;
  color: #fff;
  cursor: pointer;
}

.search-container button:hover {
  background-color: #0056b3;
}

.map-container {
  margin-top: 20px;
}

#map {
  width: 100%;
  height: 400px;
  border: 1px solid #ccc;
  border-radius: 8px;
}

.sidebar {
  margin-top: 20px;
  display: none;
}

.sidebar.visible {
  display: block;
}

.sidebar h3 {
  margin-top: 0;
  text-align: center;
}

.service-banners {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin-top: 20px;
}

.service-banner {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #f0f0f0;
  padding: 20px;
  border-radius: 4px;
  text-align: center;
}

.service-logo {
  max-width: 150px; /* Increased size for service logos */
  margin-bottom: 10px;
}

.center {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

#select-services-button,
#select-companies-button,
#save-as-pdf-button {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  background-color: #007bff;
  color: #fff;
  cursor: pointer;
  font-size: 16px;
  display: block;
  margin: 10px auto;
}

#select-services-button:hover,
#select-companies-button:hover,
#save-as-pdf-button:hover {
  background-color: #0056b3;
}

.results-container {
  margin-top: 20px;
  display: grid;
  grid-template-columns: 1fr; /* Single column layout */
  gap: 10px;
  max-height: 800px;
  overflow-y: auto;
}

.service-container {
  background-color: #f9f9f9;
  padding: 10px;
  border-radius: 4px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
}

.result-banner {
  display: flex;
  gap: 10px;
  padding: 10px;
  border: 1px solid #ddd;
  background-color: #fff;
  border-radius: 5px;
  align-items: center; /* Ensure items are vertically centered */
}

.business-photo {
  max-width: 100px; /* Adjusted width for a more compact layout */
  border-radius: 5px;
}

.result-details {
  flex-grow: 1;
  display: flex;
  flex-direction: column; /* Stack the items vertically */
  justify-content: center; /* Center the text vertically */
  padding-left: 10px; /* Add padding to the left */
}

.result-details a {
  color: #007bff;
  text-decoration: none;
  font-weight: bold; /* Make the link bold */
}

.result-details a:hover {
  text-decoration: underline;
}

.result-banner input[type="checkbox"] {
  align-self: center; /* Align the checkbox vertically in the center */
  margin-right: 10px;
}

.selected-companies {
  display: none;
  margin-top: 20px;
}

.selected-companies.visible {
  display: block;
  margin: 20px auto;
  padding: 20px;
  max-width: 800px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #fff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.selected-companies h3 {
  text-align: center;
}

.selected-companies p {
  margin: 10px 0;
}

.modal {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  width: 400px;
  text-align: center;
}

.modal-content input[type="text"],
.modal-content input[type="email"] {
  padding: 10px;
  width: 95%;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.modal-content button {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  background-color: #007bff;
  color: #fff;
  cursor: pointer;
}

.hidden {
  display: none;
}

.visible {
  display: block;
}

@media (max-width: 600px) {
  .header-content {
    flex-direction: column;
  }

  .header-text {
    margin-left: 0;
    text-align: center;
  }

  .search-container input[type="text"],
  .search-container select {
    width: 100%;
    margin-bottom: 10px;
  }

  .search-container button {
    width: 100%;
  }

  .service-banners {
    grid-template-columns: repeat(1, 1fr);
  }

  .service-banner {
    width: 100%;
  }
}
