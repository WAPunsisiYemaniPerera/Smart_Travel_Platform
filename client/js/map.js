document.addEventListener('DOMContentLoaded', () => {
    // Create the map and set up the basic view
    const map = L.map('map').setView([20, 0], 2); // [lat, lon], zoom level

    // Adding tiles to the map
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    const searchForm = document.getElementById('map-search-form');
    const countryInput = document.getElementById('map-country-input');
    let currentMarker = null; // To keep the current marker

    // When the Search Form is submitted
    searchForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const countryName = countryInput.value.trim();
        if (!countryName) return;

        await searchAndFlyToCountry(countryName);
    });

    // The main function is to find the country, zoom the map, and place a marker.
    async function searchAndFlyToCountry(countryName) {
        try {
            // Retrieving country data from the RestCountries API
            const res = await fetch(`https://restcountries.com/v3.1/name/${countryName}?fullText=true`);
            if (!res.ok) {
                alert('Country not found. Please try again with a more specific name.');
                return;
            }
            const data = await res.json();
            const countryInfo = data[0];

            const lat = countryInfo.latlng[0];
            const lon = countryInfo.latlng[1];
            
            // MZooming the app live to the relevant country (flyTo)
            map.flyTo([lat, lon], 5); // Up to 5 zoom levels

            // Removing an old marker
            if (currentMarker) {
                map.removeLayer(currentMarker);
            }

            // Creating a new marker and adding it to the map
            currentMarker = L.marker([lat, lon]).addTo(map);

            // Setting the Popup that appears when the marker is clicked
            const popupContent = `
                <div class="font-sans">
                    <h3 class="font-bold text-lg mb-1 flex items-center gap-2">
                        <img src="${countryInfo.flags.svg}" alt="flag" class="w-6 h-auto rounded-sm">
                        ${countryInfo.name.common}
                    </h3>
                    <p><strong>Capital:</strong> ${countryInfo.capital[0]}</p>
                    <p><strong>Population:</strong> ${countryInfo.population.toLocaleString()}</p>
                </div>
            `;
            currentMarker.bindPopup(popupContent).openPopup();

        } catch (error) {
            console.error(error);
            alert('An error occurred while fetching country data.');
        }
    }
});