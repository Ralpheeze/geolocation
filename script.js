// const http = new XMLHttpRequest()
// let result = document.querySelector("#result")

// document.querySelector("#share").addEventListener("click", () => {
//     findMyCoordinates()
// })

// function findMyCoordinates() {
//     if(navigator.geolocation) {
//         navigator.geolocation.getCurrentPosition ((position) => {
//             console.log(position.coords.latitude, position.coords.longitude)
//         },
//         (err) => {
//             alert(err.message)
//         })

//     } else {
//         alert("Geolocation is not supported by your browser")
//     }
// }


// const http = new XMLHttpRequest()
// let result_one = document.querySelector("#result")

// document.querySelector("#share").addEventListener("click", () => {
//     findMyCoordinates()
// })

// function findMyCoordinates() {
//     if(navigator.geolocation) {
//         navigator.geolocation.getCurrentPosition ((position) => {
//             const bdcAPI = `https://api-bdc.net/data/reverse-geocode?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&key=bdc_cc2aefdd20f244d9b8530aba68cd47e2`
//             console.log("API URL:", bdcAPI ); // Debug: Check API URL
//             getAPI(bdcAPI);
//         },
//         (err) => {
//             alert(err.message)
//         })

//     } else {
//         alert("Geolocation is not supported by your browser")
//     }
// }

// function getAPI(bdcAPI) {
//     const http = new XMLHttpRequest();  // Create a new XMLHttpRequest instance here
//     http.open("GET", bdcAPI);
//     http.send();

    // http.onreadystatechange = function() {
    //     if(this.readyState == 4 && this.status == 200) {
    //         result.innerHTML = this.responseText
    //         //To access the JSON location details
    //         const results = JSON.parse(this.responseText)
    //         console.log(results.locality)
    //     }
    // } 

//     // OR


//     http.onreadystatechange = function() {
//         if (http.readyState === 4) {
//             if (http.status === 200) {
//                 console.log("API Response:", http.responseText);  // Debug: Check API response
//                 result_one.innerHTML = http.responseText;
//             } else {
//                 console.error("Error:", http.statusText);  // Debug: Check for errors
//                 result_one.innerHTML = `Error: ${http.statusText}`;
//             }
//         }
//     }  
// } 

let result = document.querySelector("#results");
let landmarksTitle = document.getElementById("landmarks-title");
let landmarksContainer = document.getElementById("landmarks");

// Mock landmark data for different cities (replace this with API calls or a real database if available)
const landmarksData = {
    "Enugu": [
        { name: "Nike Lake Resort", hotels: 8, imgSrc: "images/Landmarks/Enu/nike_lake_resort.jpeg" },
        { name: "Polo Park Mall", hotels: 5, imgSrc: "images/Landmarks/Enu/polo_park_mall.jpeg" },
        { name: "Ngwo Pine Forest", hotels: 10, imgSrc: "images/Landmarks/Enu/ngwo_pine_forest.jpeg" },
    ],
    "Abuja": [
        { name: "National Mosque", hotels: 12, imgSrc: "images/Landmarks/Abj/mosque.jpeg" },
        { name: "Aso Rock", hotels: 15, imgSrc: "images/Landmarks/Abj/aso_rock.jpeg" },
        { name: "Jabi Lake", hotels: 9, imgSrc: "images/Landmarks/Abj/jabi_lake.jpeg" },
    ],
    "Kaduna": [
        { name: "Barnawa Market Square", hotels: 7, imgSrc: "images/Landmarks/Kaduna/barnawa_market_square.jpeg" },
        { name: "Command Junction", hotels: 11, imgSrc: "images/Landmarks/Kaduna/command_junction.jpeg" },
        { name: "Kaduna Refinery", hotels: 8, imgSrc: "images/Landmarks/Kaduna/kaduna_refinery.jpeg" },
    ],
    "Ekiti": [
        { name: "Fayose_market", hotels: 7, imgSrc: "images/Landmark/Ekiti/fayose_market.jpeg" },
        { name: "Green and Grills", hotels: 11, imgSrc: "images/Landmarks/Ekiti/green_and_grills.jpeg" },
        { name: "Prince Supermarket", hotels: 8, imgSrc: "images/Landmarks/Ekiti/prince_supermarket.jpeg" },
    ],
    // Default landmarks if location is unknown
    "Default": [
        { name: "Lekki", hotels: 19, imgSrc: "images/hive1.png" },
        { name: "Victoria Island", hotels: 28, imgSrc: "images/hive2.png" },
        { name: "Bon Hotel", hotels: 42, imgSrc: "images/hive5.png" },
    ]
};


// Automatically request location on page load
window.addEventListener("load", () => {
    findMyCoordinates();
});

function findMyCoordinates() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const bdcAPI = `https://api-bdc.net/data/reverse-geocode?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&localityLanguage=en&key=bdc_cc2aefdd20f244d9b8530aba68cd47e2`;
                getAPI(bdcAPI);
            },
            (err) => {
                alert("Location access denied. Default location will be shown.");
                // Handle denied permission here by displaying a default location
                updateLandmarksBasedOnLocation("Default");
            }
        );
    } else {
        alert("Geolocation is not supported by your browser");
        updateLandmarksBasedOnLocation("Default");
    }
}

function getAPI(bdcAPI) {
    const http = new XMLHttpRequest();
    http.open("GET", bdcAPI);
    http.send();
    http.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            const response = JSON.parse(this.responseText);
            const userLocation = response.principalSubdivision || "Lagos"; // Default to "Lagos" if location info isn't available
            
            updateLandmarksBasedOnLocation(userLocation);
        }
    };
}

function updateLandmarksBasedOnLocation(location) {
    // Update title
    landmarksTitle.textContent = `Landmarks in ${location} near you`;
    
    // Clear existing landmarks
    landmarksContainer.innerHTML = "";

    // Get landmarks for the location (use "Default" if location is not recognized)
    const landmarks = landmarksData[location] || landmarksData["Default"];

        // Populate the landmarks container with cards for each landmark
    landmarks.forEach(landmark => {
        const card = document.createElement("div");
        card.classList.add("landmark-card");

        card.innerHTML = `
            <img src="${landmark.imgSrc}" alt="${landmark.name}">
            <p class="location-name">${landmark.name}</p>
            <p class="hotel-count">${landmark.hotels} hotels recommended</p>
        `;
        landmarksContainer.appendChild(card);
    });

    // Update each landmark's location name based on the user's city
    // const locationNames = document.querySelectorAll(".location-name");
    // locationNames.forEach(name => {
    //     name.textContent = location;
    // });
    
    // Update other location-specific elements if needed
}


