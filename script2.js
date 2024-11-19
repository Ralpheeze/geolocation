const apiKey = 'AIzaSyB8B50qczcFw08MgEXhSQvuOqVrkYSRyxY';
const landmarks = [
    { name: "University of Nigeria, Nsukka", lat: 6.86670, lng: 7.41152 },
    { name: "St Theresa's Cathedral, Nsukka", lat: 6.85148, lng: 7.39268 },
    { name: "St Charles Parish Ofulonu", lat: 6.85460, lng: 7.37464 }
];

document.getElementById("#share").addEventListener("click", () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showNearbyLandmarks, handleLocationError);
    } else {
        alert("Geolocation is not supported by this browser.");
    }
});

function showNearbyLandmarks(position) {
    const userLat = position.coords.latitude;
    const userLng = position.coords.longitude;

    const resultDiv = document.getElementById("result");
    resultDiv.textContent = `Your location: ${userLat}, ${userLng}`;

    // Show landmarks around user
    document.getElementById("landmarks").innerHTML = "";
    landmarks.forEach(landmark => {
        // Find hotels near each landmark
        findHotelsNearLandmark(landmark);
    });
}

function handleLocationError(error) {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            alert("User denied the request for Geolocation.");
            break;
        case error.POSITION_UNAVAILABLE:
            alert("Location information is unavailable.");
            break;
        case error.TIMEOUT:
            alert("The request to get user location timed out.");
            break;
        case error.UNKNOWN_ERROR:
            alert("An unknown error occurred.");
            break;
    }
}

function findHotelsNearLandmark(landmark) {
    const nearbySearchUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${landmark.lat},${landmark.lng}&radius=5000&type=lodging&key=${AIzaSyB8B50qczcFw08MgEXhSQvuOqVrkYSRyxY}`;

    fetch(nearbySearchUrl)
        .then(response => response.json())
        .then(data => {
            if (data.results) {
                displayLandmarkHotels(data.results, landmark);
            } else {
                console.log(`No hotels found near ${landmark.name}.`);
            }
        })
        .catch(error => console.error("Error fetching hotels:", error));
}

function displayLandmarkHotels(hotels, landmark) {
    const landmarksContainer = document.getElementById("landmarks");
    
    // Create a landmark card with hotels information
    const landmarkCard = document.createElement("div");
    landmarkCard.classList.add("landmark-card");

    const image = document.createElement("img");
    image.src = "images/hive1.png"; // Replace with actual landmark image if available
    image.alt = landmark.name;

    const locationName = document.createElement("p");
    locationName.classList.add("location-name");
    locationName.textContent = landmark.name;

    const hotelCount = document.createElement("p");
    hotelCount.classList.add("hotel-count");
    hotelCount.textContent = `${hotels.length} hotels recommended`;

    landmarkCard.appendChild(image);
    landmarkCard.appendChild(locationName);
    landmarkCard.appendChild(hotelCount);

    // List the hotel names (optional)
    const hotelList = document.createElement("ul");
    hotels.forEach(hotel => {
        const hotelItem = document.createElement("li");
        hotelItem.textContent = hotel.name;
        hotelList.appendChild(hotelItem);
    });
    landmarkCard.appendChild(hotelList);

    landmarksContainer.appendChild(landmarkCard);
}
