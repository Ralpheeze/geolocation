let result = document.querySelector("#results");
let landmarksTitle = document.getElementById("landmarks-title");
let landmarksContainer = document.getElementById("landmarks");

// Automatically request location on page load
window.addEventListener("load", () => {
    findMyCoordinates();
});

function findMyCoordinates() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;
                getLandmarks(latitude, longitude);
            },
            (err) => {
                alert("Location access denied. Default location will be shown.");
                // Display default landmarks if location access is denied
                updateLandmarksBasedOnLocation("Default");
            }
        );
    } else {
        alert("Geolocation is not supported by your browser");
        updateLandmarksBasedOnLocation("Default");
    }
}

// Fetch landmarks from Google Places API
function getLandmarks(latitude, longitude) {
    const googlePlacesAPI = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=5000&type=point_of_interest&key=AIzaSyB8B50qczcFw08MgEXhSQvuOqVrkYSRyxY`;

    fetch(googlePlacesAPI)
        .then(response => response.json())
        .then(data => {
            if (data.results && data.results.length > 0) {
                updateLandmarksFromAPI(data.results);
            } else {
                // If no landmarks are found, use default location
                updateLandmarksBasedOnLocation("Default");
            }
        })
        .catch(error => {
            console.error("Error fetching landmarks:", error);
            // Use default location if API call fails
            updateLandmarksBasedOnLocation("Default");
        });
}

// Update landmarks based on API data
function updateLandmarksFromAPI(landmarks) {
    // Update the title
    landmarksTitle.textContent = `Landmarks near you`;

    // Clear existing landmarks
    landmarksContainer.innerHTML = "";

    // Populate the landmarks container with data from the API
    landmarks.forEach(landmark => {
        const card = document.createElement("div");
        card.classList.add("landmark-card");

        // Use a placeholder image if the landmark doesn't have one
        const imageSrc = landmark.photos && landmark.photos[0]
            ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${landmark.photos[0].photo_reference}&key=AIzaSyB8B50qczcFw08MgEXhSQvuOqVrkYSRyxY`
            : "path-to-default-image.jpg";

        card.innerHTML = `
            <img src="${imageSrc}" alt="${landmark.name}">
            <p class="location-name">${landmark.name}</p>
            <p class="hotel-count">Popular landmark</p>
        `;
        landmarksContainer.appendChild(card);
    });
}

// Fallback function to show default landmarks if needed
function updateLandmarksBasedOnLocation(location) {
    const defaultLandmarks = [
        { name: "Lekki", imgSrc: "images/hive1.png" },
        { name: "Victoria Island", imgSrc: "images/hive2.png" },
        { name: "Bon Hotel", imgSrc: "images/hive5.png" },
    ];

    landmarksTitle.textContent = `Popular landmarks in ${location}`;

    // Clear existing landmarks
    landmarksContainer.innerHTML = "";

    // Populate the landmarks container with default landmarks
    defaultLandmarks.forEach(landmark => {
        const card = document.createElement("div");
        card.classList.add("landmark-card");

        card.innerHTML = `
            <img src="${landmark.imgSrc}" alt="${landmark.name}">
            <p class="location-name">${landmark.name}</p>
            <p class="hotel-count">Popular landmark</p>
        `;
        landmarksContainer.appendChild(card);
    });
}
