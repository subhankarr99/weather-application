const API_KEY = '9e07df744787bcd31a1822aecee7bfa6';
const currentWeatherDiv = document.getElementById('currentWeather');
const forecastDiv = document.getElementById('forecast');
const errorMessageDiv = document.getElementById('errorMessage');

// Fetch current weather
async function fetchCurrentWeather(city) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('City not found');
    const data = await response.json();
    displayCurrentWeather(data);
    fetchForecast(data.coord.lat, data.coord.lon);
  } catch (error) {
    showError();
  }
}

// Fetch weather by coordinates (for current location)
async function fetchWeatherByCoords(lat, lon) {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    displayCurrentWeather(data);
    fetchForecast(lat, lon);
  } catch (error) {
    showError();
  }
}

// Display current weather
function displayCurrentWeather(data) {
  const cityName = document.getElementById('cityName');
  const currentTemp = document.getElementById('currentTemp');
  const currentHumidity = document.getElementById('currentHumidity');
  const currentWind = document.getElementById('currentWind');
  const weatherIcon = document.getElementById('weatherIcon');

  cityName.textContent = data.name;
  currentTemp.textContent = `Temperature: ${data.main.temp}°C`;
  currentHumidity.textContent = `Humidity: ${data.main.humidity}%`;
  currentWind.textContent = `Wind Speed: ${data.wind.speed} m/s`;
  weatherIcon.src = `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`;

  currentWeatherDiv.classList.remove('hidden');
  errorMessageDiv.classList.add('hidden');
}

// Fetch 5-day forecast
async function fetchForecast(lat, lon) {
  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    displayForecast(data);
  } catch (error) {
    console.error('Error fetching forecast:', error);
  }
}

// Display 5-day forecast
function displayForecast(data) {
  forecastDiv.innerHTML = ''; // Clear previous forecast

  // Filter data to get one entry per day
  const dailyForecast = data.list.filter((item, index) => index % 8 === 0);

  dailyForecast.forEach(day => {
    const date = new Date(day.dt * 1000).toLocaleDateString();
    const icon = day.weather[0].icon;
    const temp = day.main.temp;
    const wind = day.wind.speed;
    const humidity = day.main.humidity;

    const forecastCard = `
      <div class="forecast-card">
        <p class="font-bold">${date}</p>
        <img src="http://openweathermap.org/img/wn/${icon}.png" alt="Weather Icon">
        <p>Temp: ${temp}°C</p>
        <p>Wind: ${wind} m/s</p>
        <p>Humidity: ${humidity}%</p>
      </div>
    `;
    forecastDiv.insertAdjacentHTML('beforeend', forecastCard);
  });

  forecastDiv.classList.remove('hidden');
}

// Show error message
function showError() {
  errorMessageDiv.classList.remove('hidden');
  currentWeatherDiv.classList.add('hidden');
  forecastDiv.classList.add('hidden');
}

// Event listener for search button
document.getElementById('searchButton').addEventListener('click', () => {
  const city = document.getElementById('cityInput').value.trim();
  if (city) {
    fetchCurrentWeather(city);
  }
});

// Event listener for current location button
document.getElementById('currentLocationButton').addEventListener('click', () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        fetchWeatherByCoords(latitude, longitude);
      },
      (error) => {
        console.error('Error getting location:', error);
        showError();
      }
    );
  } else {
    alert('Geolocation is not supported by your browser.');
  }
});

// Event listener for Enter key
document.getElementById('cityInput').addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    const city = document.getElementById('cityInput').value.trim();
    if (city) {
      fetchCurrentWeather(city);
    }
  }
});