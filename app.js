// Paste your active key here
const apiKey = '274cbf0c78cf54bfd65004392141a117'; 

// 1. Arrow Function for the button click
document.getElementById('getWeatherBtn').addEventListener('click', () => {
    const city = document.getElementById('cityInput').value;
    if (city) {
        fetchWeather(city);
    } else {
        alert("Please enter a city name");
    }
});

// 2. Async/Await function to fetch data
async function fetchWeather(city) {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;
    
    try {
        const response = await fetch(url);
        
        // This part helps catch specifically the 401 (Invalid Key) error
        if (response.status === 401) {
            throw new Error("Your API key is not active yet. Please wait 30-60 minutes.");
        }

        if (!response.ok) {
            const errorInfo = await response.json();
            throw new Error(errorInfo.message);
        }
        
        const data = await response.json();
        processWeatherData(data);
    } catch (error) {
        console.error("Error fetching weather:", error);
        alert(`Error: ${error.message}`);
    }
}

// 3. Arrow Function to process and filter data
const processWeatherData = (data) => {
    // The API returns 40 data points (every 3 hours). 
    // We'll take the first 8 points to show the next 24 hours.
    const forecastList = data.list.slice(0, 8);

    // Using ES6 .map() to create arrays for the chart
    const labels = forecastList.map(item => {
        // Extracting just the time (HH:mm) from the date string
        return item.dt_txt.split(' ')[1].substring(0, 5); 
    });

    const temps = forecastList.map(item => item.main.temp);
    
    renderChart(labels, temps, data.city.name);
};

// 4. Function to render the Chart.js graph
let myChart;
function renderChart(labels, temps, cityName) {
    const ctx = document.getElementById('weatherChart').getContext('2d');
    
    // If a chart already exists, destroy it before creating a new one
    if (myChart) {
        myChart.destroy();
    }

    myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: `Temperature in ${cityName} (°C)`,
                data: temps,
                borderColor: '#4bc0c0',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                fill: true,
                tension: 0.4 // Makes the line smooth/curvy
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    title: { display: true, text: 'Temperature (°C)' }
                },
                x: {
                    title: { display: true, text: 'Time (Next 24h)' }
                }
            }
        }
    });
}