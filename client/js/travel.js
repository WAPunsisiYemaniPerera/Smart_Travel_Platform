const WEATHER_API_KEY = 'b76125182e0f92bb87dfab5c48e8f585';
const EXCHANGE_RATE_API_KEY = 'dca4dc5d69bba11c25957aa8';
const APP_API_KEY = 'HELLO_HELLO_WORLD_2025';


document.addEventListener('DOMContentLoaded', () => {
    // Checks if the URL contains a token.
    const params = new URLSearchParams(window.location.search);
    const tokenFromUrl = params.get('token');

    if (tokenFromUrl) {
        // If a token exists, it is saved in local storage.
        localStorage.setItem('token', tokenFromUrl);
        // Clean up the URL (so that the token is not visible)
        window.history.replaceState({}, document.title, window.location.pathname);
    }



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
            <div class="bg-white rounded-xl shadow-lg mt-6 animate-fade-in-up">
            <div class="p-6 md:p-8 border-b border-gray-200">
                <div class="flex items-center gap-4">
                    <img src="${data.countryDetails.flag}" alt="flag" class="w-16 h-auto rounded-md shadow-sm">
                    <div>
                        <h2 class="text-3xl md:text-4xl font-bold text-gray-800">${data.country}</h2>
                        <p class="text-md text-gray-500">${data.countryDetails.capital}</p>
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 md:p-8">
                
                <div class="bg-slate-50 border border-slate-200 rounded-lg p-6 transform hover:shadow-lg hover:scale-105 transition-all duration-300">
                    <div class="flex items-center gap-3 mb-4">
                        <div class="bg-sky-100 p-2 rounded-full">
                            <svg class="w-6 h-6 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6H8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9"></path></svg>
                        </div>
                        <h4 class="text-lg font-semibold text-gray-700">Country Details</h4>
                    </div>
                    <ul class="space-y-3 text-sm text-gray-600">
                        <li class="flex justify-between"><span>Population:</span> <span class="font-medium text-gray-900">${data.countryDetails.population.toLocaleString()}</span></li>
                        <li class="flex justify-between"><span>Currency:</span> <span class="font-medium text-gray-900">${data.countryDetails.currencyName} (${data.countryDetails.currencySymbol})</span></li>
                    </ul>
                </div>

                <div class="bg-slate-50 border border-slate-200 rounded-lg p-6 transform hover:shadow-lg hover:scale-105 transition-all duration-300">
                    <div class="flex items-center gap-3 mb-4">
                        <div class="bg-amber-100 p-2 rounded-full">
                           <svg class="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                        </div>
                        <h4 class="text-lg font-semibold text-gray-700">Live Weather</h4>
                    </div>
                     <ul class="space-y-3 text-sm text-gray-600">
                        <li class="flex justify-between"><span>Temperature:</span> <span class="font-medium text-gray-900">${data.weather.temperature}°C</span></li>
                        <li class="flex justify-between"><span>Condition:</span> <span class="font-medium text-gray-900 capitalize">${data.weather.condition}</span></li>
                    </ul>
                </div>

                <div class="bg-slate-50 border border-slate-200 rounded-lg p-6 transform hover:shadow-lg hover:scale-105 transition-all duration-300">
                    <div class="flex items-center gap-3 mb-4">
                         <div class="bg-green-100 p-2 rounded-full">
                           <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01M12 16v-1m0-1c-1.11 0-2.08-.402-2.599-1M12 16c-1.657 0-3-.895-3-2s1.343-2 3-2m0 8v1m0-1c1.11 0 2.08.402 2.599 1M12 4v1m0 16v-1m0-1c1.11 0 2.08-.402 2.599-1M12 4c-1.657 0-3 .895-3 2s1.343 2 3 2m0-8V3"></path></svg>
                        </div>
                        <h4 class="text-lg font-semibold text-gray-700">Exchange Rates</h4>
                    </div>
                    <ul class="space-y-3 text-sm text-gray-600">
                        <li class="flex justify-between"><span>1 ${data.exchangeRates.base} to USD:</span> <span class="font-medium text-gray-900">${data.exchangeRates.rates.USD}</span></li>
                        <li class="flex justify-between"><span>1 ${data.exchangeRates.base} to EUR:</span> <span class="font-medium text-gray-900">${data.exchangeRates.rates.EUR}</span></li>
                        <li class="flex justify-between"><span>1 ${data.exchangeRates.base} to LKR:</span> <span class="font-medium text-gray-900">${data.exchangeRates.rates.LKR}</span></li>
                    </ul>
                </div>

            </div>

            <div class="text-center p-6 md:p-8 border-t border-gray-200">
                <button id="save-btn" class="bg-green-500 text-white px-8 py-3 rounded-lg hover:bg-green-600 transform hover:scale-105 transition-all duration-300 font-semibold">
                    Save This Search
                </button>
            </div>
        </div>
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
