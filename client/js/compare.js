// js/compare.js

// travel.js එකේ තිබූ API Keys ටිකම මෙතනටත් දාන්න
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
            exchangeRate: exchangeData.conversion_rates[currencyCode] // USD එකකට අදාළ අගය
        };
    }

    // Function that displays two columns of data
    function displayComparison(data1, data2) {
        comparisonContainer.innerHTML = `
            <div class="comparison-grid">
                <div class="country-column">
                    <h2>${data1.country} <img src="${data1.details.flag}" width="50"></h2>
                    <ul>
                        <li><strong>Population:</strong> ${data1.details.population.toLocaleString()}</li>
                        <li><strong>Capital:</strong> ${data1.details.capital}</li>
                        <li><strong>Weather:</strong> ${data1.weather.temperature}°C, ${data1.weather.condition}</li>
                        <li><strong>Currency:</strong> ${data1.details.currencyName} (${data1.details.currencySymbol})</li>
                        <li><strong>Exchange Rate:</strong> 1 USD = ${data1.exchangeRate.toFixed(2)} ${data1.details.currencySymbol}</li>
                    </ul>
                </div>
                <div class="country-column">
                    <h2>${data2.country} <img src="${data2.details.flag}" width="50"></h2>
                    <ul>
                        <li><strong>Population:</strong> ${data2.details.population.toLocaleString()}</li>
                        <li><strong>Capital:</strong> ${data2.details.capital}</li>
                        <li><strong>Weather:</strong> ${data2.weather.condition}, ${data2.weather.temperature}°C</li>
                        <li><strong>Currency:</strong> ${data2.details.currencyName} (${data2.details.currencySymbol})</li>
                        <li><strong>Exchange Rate:</strong> 1 USD = ${data2.exchangeRate.toFixed(2)} ${data2.details.currencySymbol}</li>
                    </ul>
                </div>
            </div>
        `;
    }
});