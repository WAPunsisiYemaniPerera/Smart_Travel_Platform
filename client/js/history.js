document.addEventListener('DOMContentLoaded', ()=>{
    const token = localStorage.getItem('token');

    const APP_API_KEY = 'HELLO_HELLO_WORLD_2025';

    if (!token) {
        // if user have no token then direct to login
        window.location.href = 'login.html';
        return;
    }

    const historyContainer = document.getElementById('history-container');

    //function that fetch the saved records from the backend
    async function fetchHistory (){
        try{
            const res = await fetch('http://localhost:5000/api/records',{
                method: 'GET',
                headers: {
                    'x-auth-token': token,
                    'x-api-key': APP_API_KEY
                }
            });

            if (!res.ok){
                throw new Error('Could not fetch history.');
            }

            const records = await res.json();
            displayHistory(records);
        } catch (error){
            historyContainer.innerHTML = `<p>Error: ${error.message}</p>`;
        }
    }

    //display the fetched details
    function displayHistory(records){
       if (records.length === 0) {
        historyContainer.innerHTML = '<p>No saved search records found.</p>';
        return;
    }

    let html = '';
    records.forEach(record => {
        // give default value if there are no data from exchange rates
        const exchangeRateText = record.exchangeRates 
            ? `1 ${record.exchangeRates.base} = ${record.exchangeRates.rates.USD} USD`
            : 'N/A';

        html += `
            <div class="history-card">
                <h3>${record.country} <img src="${record.countryDetails.flag}" alt="flag" width="30"></h3>
                <p><small>Saved on: ${new Date(record.date).toLocaleString()}</small></p>
                <ul>
                    <li><strong>Capital:</strong> ${record.countryDetails.capital}</li>
                    <li><strong>Weather:</strong> ${record.weather.temperature}°C, ${record.weather.condition}</li>
                    <li><strong>USD Exchange Rate:</strong> ${exchangeRateText}</li>
                </ul>
            </div>
        `;
    });

    historyContainer.innerHTML = html;
    }

    //fetch the history when the page is loades
    fetchHistory();
})