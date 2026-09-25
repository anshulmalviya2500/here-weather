const API_KEY = "f2ebc4d091bec98b07ac7922acdc54de"; 
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";
const cityInput = document.getElementById('city-input');
const searchBtn = document.getElementById('search-btn');
const weatherDisplay = document.getElementById('weather-display');
const messageDisplay = document.getElementById('message');
const backgroundGradient = document.querySelector('.background-gradient');

const temperatureEl = document.getElementById('temperature');
const cityNameEl = document.getElementById('city-name');
const descriptionEl = document.getElementById('description');
const humidityEl = document.getElementById('humidity');
const windSpeedEl = document.getElementById('wind-speed');
const pressureEl = document.getElementById('pressure');
const visibilityEl = document.getElementById('visibility');
const weatherIconEl = document.getElementById('weather-icon');
searchBtn.addEventListener('click', () => {
    fetchWeather(cityInput.value);
});

cityInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        fetchWeather(cityInput.value);
    }
});

async function fetchWeather(city) {
    if (!city) {
        showMessage("Please enter a city name.");
        return;
    }

    showMessage("Loading weather data...");
    weatherDisplay.classList.add('hide'); 

    const url = BASE_URL + city + `&appid=${API_KEY}`;
    
    try {
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`Error: ${response.status} - City not found or API issue.`);
        }
        
        const data = await response.json();
        updateWeatherUI(data);

    } catch (error) {
        console.error("Fetch error:", error);
        showMessage("Could not fetch weather data. Please check the city name and try again.");
    } finally {
        cityInput.value = '';
    }
}

function showMessage(msg) {
    messageDisplay.textContent = msg;
    messageDisplay.style.display = 'block';
    weatherDisplay.classList.remove('hide'); 
    weatherDisplay.style.display = 'none';
}

function showWeatherPanel() {
    messageDisplay.style.display = 'none';
    weatherDisplay.style.display = 'block';
    setTimeout(() => {
        weatherDisplay.classList.remove('hide');
    }, 10);
}

function updateWeatherUI(data) {
    const temperature = data.main.temp.toFixed(0); 
    const humidity = data.main.humidity;
    const windSpeed = (data.wind.speed * 3.6).toFixed(1); 
    const pressure = data.main.pressure;
    const visibility = (data.visibility / 1000).toFixed(0); 
    const descriptionText = data.weather[0].description;
    const iconCode = data.weather[0].icon;
    const mainWeather = data.weather[0].main; 

    temperatureEl.textContent = `${temperature}°C`;
    cityNameEl.textContent = `${data.name}, ${data.sys.country}`;
    descriptionEl.textContent = descriptionText.charAt(0).toUpperCase() + descriptionText.slice(1);
    humidityEl.textContent = `${humidity}%`;
    windSpeedEl.textContent = `${windSpeed} km/h`;
    pressureEl.textContent = `${pressure} mb`;
    visibilityEl.textContent = `${visibility} km`;

    setWeatherIcon(iconCode);
    setDynamicBackground(mainWeather);
    
    showWeatherPanel();
}

function setWeatherIcon(iconCode) {
    weatherIconEl.className = 'weather-icon'; 
    const isDay = iconCode.slice(-1) === 'd'; 

    if (iconCode.includes('01')) {
        weatherIconEl.classList.add('fas', isDay ? 'fa-sun' : 'fa-moon');
        weatherIconEl.style.color = isDay ? '#f1c40f' : '#bdc3c7';
    } 
    else if (iconCode.includes('02')) {
        weatherIconEl.classList.add('fas', isDay ? 'fa-cloud-sun' : 'fa-cloud-moon');
        weatherIconEl.style.color = '#a0c4ff';
    }
    else if (iconCode.includes('03') || iconCode.includes('04')) {
        weatherIconEl.classList.add('fas', 'fa-cloud');
        weatherIconEl.style.color = '#c0c0c0';
    }
    else if (iconCode.includes('09') || iconCode.includes('10')) {
        weatherIconEl.classList.add('fas', 'fa-cloud-showers-heavy');
        weatherIconEl.style.color = '#6cb9e9';
    } 
    else if (iconCode.includes('11')) {
        weatherIconEl.classList.add('fas', 'fa-bolt');
        weatherIconEl.style.color = '#ffd700';
    } 
    else if (iconCode.includes('13')) {
        weatherIconEl.classList.add('fas', 'fa-snowflake');
        weatherIconEl.style.color = '#e0f2f7';
    } 
    else if (iconCode.includes('50')) {
        weatherIconEl.classList.add('fas', 'fa-smog');
        weatherIconEl.style.color = '#bdbdbd';
    }
    else {
        weatherIconEl.classList.add('fas', 'fa-cloud');
        weatherIconEl.style.color = '#c0c0c0';
    }
}

function setDynamicBackground(weatherType) {
    let gradient = '';
    let animationDuration = '15s'; 

    switch (weatherType.toLowerCase()) {
        case 'clear':
            gradient = 'linear-gradient(135deg, #FFD194, #D16BA5, #86A8E7)'; 
            animationDuration = '20s';
            break;
        case 'clouds':
            gradient = 'linear-gradient(135deg, #bdc3c7, #2c3e50)'; 
            animationDuration = '25s';
            break;
        case 'rain':
        case 'drizzle':
            gradient = 'linear-gradient(135deg, #a7bfe8, #6190e8)'; 
            animationDuration = '18s';
            break;
        case 'thunderstorm':
            gradient = 'linear-gradient(135deg, #0f2027, #203a43, #2c5364)'; 
            animationDuration = '12s';
            break;
        case 'snow':
            gradient = 'linear-gradient(135deg, #e0f2f7, #a7d9f0)'; 
            animationDuration = '22s';
            break;
        case 'mist':
        case 'fog':
        case 'haze':
            gradient = 'linear-gradient(135deg, #b0c4de, #7f8c8d)'; 
            animationDuration = '20s';
            break;
        default:
            gradient = 'linear-gradient(135deg, #1a2a6c, #b21f1f, #fdbb2d)'; 
            animationDuration = '15s';
            break;
    }
    backgroundGradient.style.backgroundImage = gradient;
    backgroundGradient.style.animationDuration = animationDuration;
}

showMessage("Enter a city to get started!");