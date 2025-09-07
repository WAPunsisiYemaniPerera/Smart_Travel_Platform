const WEATHER_API_KEY = 'b76125182e0f92bb87dfab5c48e8f585';
const EXCHANGE_RATE_API_KEY = 'dca4dc5d69bba11c25957aa8';
const APP_API_KEY = 'HELLO_HELLO_WORLD_2025';


document.addEventListener('DOMContentLoaded', () => {
    // 2. Check if user is logged in (token exists)
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
        return; // stop running further code
    }

    // 3. Logout button functionality
    const logoutBtn = document.getElementById('logout-btn');
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('token');
        alert('You have been logged out.');
        window.location.href = 'login.html';
    });

    const searchForm = document.getElementById('search-form');
    const countryInput = document.getElementById('country-input');
    const resultsDisplay = document.getElementById('results-display');
    let aggregatedData = {}; // collected data will be stored here

    // 4. Main logic when Search Form is submitted
    searchForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const countryName = countryInput.value.trim();
        if (!countryName) return;

        resultsDisplay.innerHTML = '<h3>Loading data from public APIs...</h3>';

        try {
            // 4a. Get country details from RestCountries
            const countryRes = await fetch(`https://restcountries.com/v3.1/name/${countryName}?fullText=true`);
            if (!countryRes.ok) throw new Error('Country not found!');
            const countryData = await countryRes.json();
            const countryInfo = countryData[0];

            const capital = countryInfo.capital[0];
            const currencyCode = Object.keys(countryInfo.currencies)[0];

            // 4b. Fetch Weather and Exchange Rate data in parallel
            const [weatherRes, exchangeRes] = await Promise.all([
                fetch(`https://api.openweathermap.org/data/2.5/weather?q=${capital}&appid=${WEATHER_API_KEY}&units=metric`),
                fetch(`https://v6.exchangerate-api.com/v6/${EXCHANGE_RATE_API_KEY}/latest/${currencyCode}`)
            ]);

            const weatherData = await weatherRes.json();
            const exchangeData = await exchangeRes.json();

            // 4c. Aggregate all details into one JSON object
            aggregatedData = {
                country: countryInfo.name.common,
                countryDetails: {
                    capital: capital,
                    population: countryInfo.population,
                    currencyName: countryInfo.currencies[currencyCode].name,
                    currencySymbol: countryInfo.currencies[currencyCode].symbol,
                    flag: countryInfo.flags.svg
                },
                weather: {
                    temperature: weatherData.main.temp,
                    condition: weatherData.weather[0].description
                },
                exchangeRates: {
                    base: exchangeData.base_code,
                    rates: {
                        USD: exchangeData.conversion_rates.USD,
                        EUR: exchangeData.conversion_rates.EUR,
                        LKR: exchangeData.conversion_rates.LKR,
                        INR: exchangeData.conversion_rates.INR
                    }
                }
            };

            // 4d. Display the results
            displayResults(aggregatedData);

        } catch (error) {
            resultsDisplay.innerHTML = `<h3>Error: ${error.message}</h3>`;
        }
    });

    // 5. Function to display results on the frontend
    function displayResults(data) {
        resultsDisplay.innerHTML = `
            <h2>${data.country} <img src="${data.countryDetails.flag}" alt="flag" width="50"></h2>
            <h4>Country Details:</h4>
            <ul>
                <li><strong>Capital:</strong> ${data.countryDetails.capital}</li>
                <li><strong>Population:</strong> ${data.countryDetails.population.toLocaleString()}</li>
                <li><strong>Currency:</strong> ${data.countryDetails.currencyName} (${data.countryDetails.currencySymbol})</li>
            </ul>
            <h4>Current Weather in ${data.countryDetails.capital}:</h4>
            <ul>
                <li><strong>Temperature:</strong> ${data.weather.temperature} °C</li>
                <li><strong>Condition:</strong> ${data.weather.condition}</li>
            </ul>
            <h4>Exchange Rates (Base: 1 ${data.exchangeRates.base}):</h4>
            <ul>
                <li><strong>USD:</strong> ${data.exchangeRates.rates.USD}</li>
                <li><strong>EUR:</strong> ${data.exchangeRates.rates.EUR}</li>
                <li><strong>LKR:</strong> ${data.exchangeRates.rates.LKR}</li>
                <li><strong>INR:</strong> ${data.exchangeRates.rates.INR}</li>
            </ul>
            <button id="save-btn">Save This Search</button>
        `;
        document.getElementById('save-btn').addEventListener('click', saveRecord);
    }

    // 6. Save the details to backend
    async function saveRecord() {
        const saveButton = document.getElementById('save-btn');
        saveButton.disabled = true;
        saveButton.textContent = 'Saving...';

        try {
            const res = await fetch('http://localhost:5000/api/records', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token, // user login token
                    'x-api-key': APP_API_KEY // API key of the application
                },
                body: JSON.stringify(aggregatedData)
            });

            if (res.ok) {
                alert('Search saved successfully!');
                saveButton.textContent = 'Saved!';
            } else {
                throw new Error('Failed to save data. Check server logs.');
            }
        } catch (error) {
            alert(error.message);
            saveButton.disabled = false;
            saveButton.textContent = 'Save This Search';
        }
    }

    // 7. Detect country from IP Geolocation on page load
    async function fetchUserLocationAndData() {
        try {
            const res = await fetch('http://ip-api.com/json/');
            const locationData = await res.json();

            if (locationData.status === 'success') {
                countryInput.value = locationData.country;
                searchForm.dispatchEvent(new Event('submit'));
            }
        } catch (error) {
            console.error('Location detection failed:', error);
        }
    }

    fetchUserLocationAndData();
});
