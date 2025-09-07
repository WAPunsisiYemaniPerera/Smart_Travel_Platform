// client/js/history.js (සම්පූර්ණ අලුත් ගොනුව)

document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    const APP_API_KEY = 'HELLO_HELLO_WORLD_2025'; 

    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    const historyContainer = document.getElementById('history-container');

    async function fetchHistory() {
        try {
            const res = await fetch('http://localhost:5000/api/records', {
                method: 'GET',
                headers: { 'x-auth-token': token, 'x-api-key': APP_API_KEY }
            });
            if (!res.ok) throw new Error('Could not fetch history.');
            
            const records = await res.json();
            displayHistory(records);
        } catch (error) {
            historyContainer.innerHTML = `<p class="text-red-500 text-center">${error.message}</p>`;
        }
    }

    function displayHistory(records) {
        if (records.length === 0) {
            historyContainer.innerHTML = '<p class="text-center text-gray-500">No saved search records found.</p>';
            return;
        }

        historyContainer.innerHTML = ''; // Clear "Loading..." message
        records.forEach(record => {
            const card = document.createElement('div');
            card.className = 'bg-white rounded-xl shadow-lg transition-all duration-300 animate-fade-in-up';
            
            // record එකේ exchangeRates තිබේදැයි පරීක්ෂා කිරීම
            const hasExchangeRates = record.exchangeRates && record.exchangeRates.rates;

            card.innerHTML = `
                <div class="p-6 border-b border-gray-200">
                    <div class="flex justify-between items-center">
                        <div>
                            <h3 class="text-2xl font-bold text-gray-800">${record.country}</h3>
                            <p class="text-sm text-gray-500">Saved on: ${new Date(record.date).toLocaleString()}</p>
                        </div>
                        <img src="${record.countryDetails.flag}" alt="flag" width="50" class="rounded-md shadow-sm">
                    </div>
                </div>

                <div class="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div class="space-y-2">
                        <h4 class="font-semibold text-gray-600 border-b pb-1 mb-2">Country Details</h4>
                        <p class="text-sm flex justify-between"><span>Capital:</span> <strong>${record.countryDetails.capital}</strong></p>
                        <p class="text-sm flex justify-between"><span>Population:</span> <strong>${record.countryDetails.population.toLocaleString()}</strong></p>
                        <p class="text-sm flex justify-between"><span>Currency:</span> <strong>${record.countryDetails.currencyName} (${record.countryDetails.currencySymbol})</strong></p>
                    </div>

                    <div class="space-y-2">
                        <h4 class="font-semibold text-gray-600 border-b pb-1 mb-2">Current Weather</h4>
                        <p class="text-sm flex justify-between"><span>Temperature:</span> <strong>${record.weather.temperature}°C</strong></p>
                        <p class="text-sm flex justify-between"><span>Condition:</span> <strong class="capitalize">${record.weather.condition}</strong></p>
                    </div>

                    <div class="space-y-2">
                        <h4 class="font-semibold text-gray-600 border-b pb-1 mb-2">Exchange Rates (Base: ${hasExchangeRates ? record.exchangeRates.base : 'N/A'})</h4>
                        ${hasExchangeRates ? `
                            <p class="text-sm flex justify-between"><span>USD:</span> <strong>${record.exchangeRates.rates.USD}</strong></p>
                            <p class="text-sm flex justify-between"><span>EUR:</span> <strong>${record.exchangeRates.rates.EUR}</strong></p>
                            <p class="text-sm flex justify-between"><span>LKR:</span> <strong>${record.exchangeRates.rates.LKR}</strong></p>
                            <p class="text-sm flex justify-between"><span>INR:</span> <strong>${record.exchangeRates.rates.INR}</strong></p>
                        ` : '<p class="text-sm text-gray-500">Not Available</p>'}
                    </div>
                </div>

                <div class="bg-gray-50 p-4 text-right rounded-b-xl">
                    <button data-id="${record._id}" class="delete-btn bg-red-100 text-red-700 px-3 py-1 text-xs font-semibold rounded-full hover:bg-red-200 transition-colors">
                        Delete
                    </button>
                </div>
            `;
            historyContainer.appendChild(card);
        });

        // Add event listeners to all new delete buttons
        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', handleDelete);
        });
    }

        // Add event listeners to all new delete buttons
        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', handleDelete);
        });
    

    async function handleDelete(event) {
        const recordId = event.target.dataset.id;
        if (!confirm('Are you sure you want to delete this record?')) return;

        try {
            const res = await fetch(`http://localhost:5000/api/records/${recordId}`, {
                method: 'DELETE',
                headers: { 'x-auth-token': token, 'x-api-key': APP_API_KEY }
            });
            if (!res.ok) throw new Error('Failed to delete record.');
            
            // Delete the card from the page without reloading
            event.target.closest('.bg-white').remove();
            
        } catch (error) {
            alert(error.message);
        }
    }

    fetchHistory();
});