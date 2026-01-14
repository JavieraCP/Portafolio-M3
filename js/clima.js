const API_KEY = "dd65df5df187e145939ec684f4c902d2"; 

const cityInput = document.getElementById("cityInput");
const getWeatherBtn = document.getElementById("getWeatherBtn");
const weatherInfoDiv = document.getElementById("weather-info"); 

getWeatherBtn.addEventListener("click", () => {
    const city = cityInput.value.trim();
    if (city === "") {
        weatherInfoDiv.innerHTML = '<p class="error">Por favor, ingresa el nombre de la ciudad.</p>';
        return;
    }
    const API_URL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=es`;

    weatherInfoDiv.innerHTML = '<p>Cargando datos...</p>';

    fetch(API_URL)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Error ${response.status}: Ciudad no encontrada o clave API inválida.`);
            }
            return response.json();
        })
        .then((data) => {
            displayWeather(data);
        })
        .catch((error) => {
            weatherInfoDiv.innerHTML = `<p class="error">⚠️ ${error.message}</p>`;
        });
});

function displayWeather(data) {
    const cityName = data.name;
    const temp = Math.round(data.main.temp);
    const description = data.weather[0].description;
    const humidity = data.main.humidity;
    const windSpeedKmh = (data.wind.speed * 3.6).toFixed(1); 
    const iconCode = data.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    
    weatherInfoDiv.innerHTML = 
    `<h2>Clima en ${cityName}</h2>
    <img src="${iconUrl}" alt="${description}" style="width: 50px; height: 50px;">
    <p><strong>Temperatura:</strong> ${temp}ºC</p>
    <p><strong>Descripción:</strong> ${description.charAt(0).toUpperCase() + description.slice(1)}</p>
    <p><strong>Humedad:</strong> ${humidity}%</p>
    <p><strong>Velocidad del Viento:</strong> ${windSpeedKmh} km/h</p>`;
}

async function getPastWeather(lat, lon) {
    const API_KEY = "dd65df5df187e145939ec684f4c902d2";
    const weatherDaysDiv = document.getElementById("weather-days");
    weatherDaysDiv.innerHTML = ""; // Limpiar contenedor

    // Obtenemos el tiempo actual en segundos (Unix timestamp)
    let currentTimestamp = Math.floor(Date.now() / 1000);
    const SECONDS_IN_A_DAY = 86400;

    try {
        // Hacemos 7 peticiones (una por cada día pasado)
        for (let i = 1; i <= 7; i++) {
            const pastTimestamp = currentTimestamp - (i * SECONDS_IN_A_DAY);
            
            const response = await fetch(
                `https://api.openweathermap.org/data/3.0/onecall/timemachine?lat=${lat}&lon=${lon}&dt=${pastTimestamp}&units=metric&lang=es&appid=${API_KEY}`
            );
            
            const data = await response.json();
            renderPastCard(data.data[0]); // La respuesta viene dentro de un array 'data'
        }
    } catch (error) {
        console.error("Error obteniendo datos históricos:", error);
    }
}

function renderPastCard(dayData) {
    const dateObj = new Date(dayData.dt * 1000);
    const dayName = dateObj.toLocaleDateString('es-ES', { weekday: 'long' });
    const dayDate = dateObj.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });

    const cardHTML = `
        <div class="card-weather">
            <span class="day-name">${dayName.charAt(0).toUpperCase() + dayName.slice(1)}</span>
            <span class="day-date">${dayDate}</span>
            <img src="https://openweathermap.org/img/wn/${dayData.weather[0].icon}@2x.png" class="weather-icon">
            <div class="temp-range">
                <span class="max">${Math.round(dayData.temp)}°</span>
            </div>
            <div class="wind-info">
                <small>Histórico</small>
            </div>
        </div>
    `;
    document.getElementById("weather-days").innerHTML += cardHTML;
}