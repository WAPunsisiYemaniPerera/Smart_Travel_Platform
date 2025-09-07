const WEATHER_API_KEY = 'b76125182e0f92bb87dfab5c48e8f585';
const EXCHANGE_RATE_API_KEY = 'dca4dc5d69bba11c25957aa8';

document.addEventListener('DOMContentLoaded', () => {
    // The token is needed to check if you are logged in, since this page doesn't require you to log in,
    // Let's make this public, without logging out if we don't have the token.
    // You can also put the login check here if you want.
    const compareForm = document.getElementById('compare-form');
    const country1Input = document.getElementById('country1-input');
    const country2Input = document.getElementById('country2-input');
    const comparisonContainer = document.getElementById('comparison-container');

    compareForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const countryName1 = country1Input.value.trim();
        const countryName2 = country2Input.value.trim();

        if (!countryName1 || !countryName2) return;

        comparisonContainer.innerHTML = '<h3>Loading comparison...</h3>';

        try {
            // Using Promise.all get the details of the both countries at the same time
            const [data1, data2] = await Promise.all([
                fetchCountryData(countryName1),
                fetchCountryData(countryName2)
            ]);

            displayComparison(data1, data2);

        } catch (error) {
            comparisonContainer.innerHTML = `<h3>Error: ${error.message}</h3>`;
        }
    });

    // Given a country name, this function will make all the API calls related to it and return the 
    // aggregated data.
    async function fetchCountryData(countryName) {
        // This is the same logic as in travel.js
        const countryRes = await fetch(`https://restcountries.com/v3.1/name/${countryName}?fullText=true`);
        if (!countryRes.ok) throw new Error(`Could not find data for ${countryName}`);
        const countryData = await countryRes.json();
        const countryInfo = countryData[0];

        const capital = countryInfo.capital[0];
        const currencyCode = Object.keys(countryInfo.currencies)[0];

        const [weatherRes, exchangeRes] = await Promise.all([
            fetch(`https://api.openweathermap.org/data/2.5/weather?q=${capital}&appid=${WEATHER_API_KEY}&units=metric`),
            fetch(`https://v6.exchangerate-api.com/v6/${EXCHANGE_RATE_API_KEY}/latest/USD`) // Base එක USD ලෙස ගමු
        ]);
        
        const weatherData = await weatherRes.json();
        const exchangeData = await exchangeRes.json();
        
        // Return the collected data
        return {
            country: countryInfo.name.common,
            details: {
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
            exchangeRate: exchangeData.conversion_rates[currencyCode] // the value for 1 USD
        };
    }

    // Function that displays two columns of data
    function displayComparison(data1, data2) {
        comparisonContainer.innerHTML = `
            <div class="bg-white rounded-xl shadow-lg p-6 md:p-8 animate-fade-in-up">
                <div class="flex items-center gap-4 mb-6 pb-4 border-b border-gray-200">
                    <img src="${data1.details.flag}" alt="flag" class="w-12 h-auto rounded-md shadow-sm">
                    <h2 class="text-2xl font-bold text-gray-800">${data1.country}</h2>
                </div>
                <div class="space-y-4">
                    <div>
                        <h3 class="text-lg font-semibold text-gray-700 mb-2 flex items-center gap-2">
                            <svg class="w-5 h-5 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6H8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9"></path></svg>
                            Country Details
                        </h3>
                        <ul class="text-sm text-gray-600 space-y-1">
                            <li class="flex justify-between"><span>Capital:</span> <span class="font-medium text-gray-800">${data1.details.capital}</span></li>
                            <li class="flex justify-between"><span>Population:</span> <span class="font-medium text-gray-800">${data1.details.population.toLocaleString()}</span></li>
                            <li class="flex justify-between"><span>Currency:</span> <span class="font-medium text-gray-800">${data1.details.currencyName} (${data1.details.currencySymbol})</span></li>
                        </ul>
                    </div>
                    <div>
                        <h3 class="text-lg font-semibold text-gray-700 mb-2 flex items-center gap-2">
                            <svg class="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                            Current Weather
                        </h3>
                        <ul class="text-sm text-gray-600 space-y-1">
                            <li class="flex justify-between"><span>Temperature:</span> <span class="font-medium text-gray-800">${data1.weather.temperature}°C</span></li>
                            <li class="flex justify-between"><span>Condition:</span> <span class="font-medium text-gray-800 capitalize">${data1.weather.condition}</span></li>
                        </ul>
                    </div>
                    <div>
                        <h3 class="text-lg font-semibold text-gray-700 mb-2 flex items-center gap-2">
                            <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01M12 16v-1m0-1c-1.11 0-2.08-.402-2.599-1M12 16c-1.657 0-3-.895-3-2s1.343-2 3-2m0 8v1m0-1c1.11 0 2.08.402 2.599 1M12 4v1m0 16v-1m0-1c1.11 0 2.08.402 2.599 1M12 4c-1.657 0-3 .895-3 2s1.343 2 3 2m0-8V3"></path></svg>
                            Exchange Rate
                        </h3>
                        <ul class="text-sm text-gray-600 space-y-1">
                            <li class="flex justify-between"><span>1 USD to ${data1.details.currencySymbol}:</span> <span class="font-medium text-gray-800">${data1.exchangeRate.toFixed(2)}</span></li>
                            </ul>
                    </div>
                </div>
            </div>

            <div class="bg-white rounded-xl shadow-lg p-6 md:p-8 animate-fade-in-up">
                <div class="flex items-center gap-4 mb-6 pb-4 border-b border-gray-200">
                    <img src="${data2.details.flag}" alt="flag" class="w-12 h-auto rounded-md shadow-sm">
                    <h2 class="text-2xl font-bold text-gray-800">${data2.country}</h2>
                </div>
                <div class="space-y-4">
                     <div>
                        <h3 class="text-lg font-semibold text-gray-700 mb-2 flex items-center gap-2">
                             <svg class="w-5 h-5 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6H8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9"></path></svg>
                            Country Details
                        </h3>
                        <ul class="text-sm text-gray-600 space-y-1">
                            <li class="flex justify-between"><span>Capital:</span> <span class="font-medium text-gray-800">${data2.details.capital}</span></li>
                            <li class="flex justify-between"><span>Population:</span> <span class="font-medium text-gray-800">${data2.details.population.toLocaleString()}</span></li>
                            <li class="flex justify-between"><span>Currency:</span> <span class="font-medium text-gray-800">${data2.details.currencyName} (${data2.details.currencySymbol})</span></li>
                        </ul>
                    </div>
                    <div>
                        <h3 class="text-lg font-semibold text-gray-700 mb-2 flex items-center gap-2">
                             <svg class="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                            Current Weather
                        </h3>
                        <ul class="text-sm text-gray-600 space-y-1">
                            <li class="flex justify-between"><span>Temperature:</span> <span class="font-medium text-gray-800">${data2.weather.temperature}°C</span></li>
                            <li class="flex justify-between"><span>Condition:</span> <span class="font-medium text-gray-800 capitalize">${data2.weather.condition}</span></li>
                        </ul>
                    </div>
                    <div>
                        <h3 class="text-lg font-semibold text-gray-700 mb-2 flex items-center gap-2">
                             <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01M12 16v-1m0-1c-1.11 0-2.08-.402-2.599-1M12 16c-1.657 0-3-.895-3-2s1.343-2 3-2m0 8v1m0-1c1.11 0 2.08.402 2.599 1M12 4v1m0 16v-1m0-1c1.11 0 2.08.402 2.599 1M12 4c-1.657 0-3 .895-3 2s1.343 2 3 2m0-8V3"></path></svg>
                            Exchange Rate
                        </h3>
                        <ul class="text-sm text-gray-600 space-y-1">
                            <li class="flex justify-between"><span>1 USD to ${data2.details.currencySymbol}:</span> <span class="font-medium text-gray-800">${data2.exchangeRate.toFixed(2)}</span></li>
                            </ul>
                    </div>
                </div>
            </div>
        `;
    }
});