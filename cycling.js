let map = L.map('map').setView([51.505, -0.09], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

function locateUser() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords;
            map.setView([latitude, longitude], 15);
            L.marker([latitude, longitude]).addTo(map)
                .bindPopup("You are here").openPopup();
        }, () => {
            alert("Could not get your location");
        });
    } else {
        alert("Geolocation is not supported by your browser");
    }
}

function recordIncident() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;

            L.marker([latitude, longitude]).addTo(map)
                .bindPopup("Incident recorded here").openPopup();

            console.log(`Incident recorded at: ${latitude}, ${longitude}`);

            try {
                const response = await fetch("https://localhost:500/record-incident", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ laatitude, longitude })
                });

                const data = await response.json();
                console.log(data.message);
            } catch (error) {
                console.error("Error recording incident:", error);
            }
        });
    } else {
        alert("Geolocation is not supported by your browser");
    }
}

locateUser();


async function loadIncidents() {
    try {
        const reponse = await fetch("https://localhost:5000/incidents");
        const incidents = await response.json();

        incidents.forEach(({ latitude, longitude }) => {
            L.marker([latitude, longitude]).addTo(map)
                .bindPopup("Previously recorded incident");
        });
    } catch (error) {
        console.error("Error fetching incidents:", error);
    }
}

loadIncidents();