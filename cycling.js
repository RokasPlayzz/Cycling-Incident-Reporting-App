//Creating a Leaflet map that gives a base centre of London
let map = L.map('map').setView([51.505, -0.09], 13);
//openstreetmap creates the tiles in the map's background
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

//creating a function to locate the user, using browsers geolocation
function locateUser() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords;
            //has a set value of zoom 15 for all devices and browsers
            map.setView([latitude, longitude], 15);
            L.marker([latitude, longitude]).addTo(map)
            //clearly states to the user where they are on the map
                .bindPopup("You are here").openPopup();
        }, () => {
            alert("Could not get your location");
        });
    } else {
        //if user doesn't allow location it fails to connect to where the user is and gives a popup of the error
        alert("Geolocation is not supported by your browser");
    }
}

function recordIncident() {
    //Checking if the browser the user is using supports the geolocation
    if (navigator.geolocation) {
        //getting the users current location
        navigator.geolocation.getCurrentPosition(async (position) => {
            //gathers the latitude and longitude from position data
            const { latitude, longitude } = position.coords;
            //Adds a marker for visability for the user on their location
            L.marker([latitude, longitude]).addTo(map)
            //popup indicating the user pressing the button 
                .bindPopup("Incident recorded here").openPopup();

            console.log(`Incident recorded at: ${latitude}, ${longitude}`);

            try {
                //send a POST request to the server endpoint to record incident
                const response = await fetch("https://localhost:500/record-incident", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ latitude, longitude })
                });

                const data = await response.json();
                console.log(data.message);
                //Handling errors from fetch request
            } catch (error) {
                console.error("Error recording incident:", error);
            }
        });
    } else {
        //Alerts user if geolocation is not supported
        alert("Geolocation is not supported by your browser");
    }
}

locateUser();

//asynchronous function to load past incidents
async function loadIncidents() {
    try {
        //sending a GET request to the server to fetch incident data
        const reponse = await fetch("https://localhost:5000/incidents");
        const incidents = await response.json();

        incidents.forEach(({ latitude, longitude }) => {
            //places a marker for each incident recorded
            L.marker([latitude, longitude]).addTo(map)
                .bindPopup("Previously recorded incident");
        });
    } catch (error) {
        console.error("Error fetching incidents:", error);
    }
}

loadIncidents();