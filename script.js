const apiKey = '4c4abe58b8163fe3e13ffee1e28182da';
let isCelsius = true;
let map;
let marker;

const weatherBackgrounds = {
    Clear: 'https://images.pexels.com/photos/691901/pexels-photo-691901.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    Clouds: 'https://images.pexels.com/photos/209831/pexels-photo-209831.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    Rain: 'https://images.pexels.com/photos/1110497/pexels-photo-1110497.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    Drizzle: 'https://images.pexels.com/photos/3796234/pexels-photo-3796234.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    Snow: 'https://images.pexels.com/photos/908644/pexels-photo-908644.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    Thunderstorm: 'https://images.pexels.com/photos/14558098/pexels-photo-14558098.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    Mist: 'https://images.pexels.com/photos/813269/pexels-photo-813269.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    Smoke: 'https://images.pexels.com/photos/813269/pexels-photo-813269.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    Haze: 'https://images.pexels.com/photos/813269/pexels-photo-813269.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    Dust: 'https://images.pexels.com/photos/813269/pexels-photo-813269.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    Fog: 'https://images.pexels.com/photos/626163/pexels-photo-626163.jpeg?auto=compress&cs=tinysrgb&w=600',
    Sand: 'https://images.pexels.com/photos/813269/pexels-photo-813269.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    Ash: 'https://images.pexels.com/photos/813269/pexels-photo-813269.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    Squall: 'https://images.pexels.com/photos/813269/pexels-photo-813269.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    Tornado: 'https://images.pexels.com/photos/813269/pexels-photo-813269.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
};

document.getElementById('getWeather').addEventListener('click', function() {
    const city = document.getElementById('city').value;
    fetchWeather(city);
    document.getElementById('city').value = '';
});

function fetchWeather(city) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            fetchSunriseSunset(data.coord.lat, data.coord.lon);
            displayWeather(data);
            displayMap(data.coord.lat, data.coord.lon);
            setWeatherBackground(data.weather[0].main, data.dt);
        })
        .catch(error => console.error('Error fetching weather data:', error));
}

function displayWeather(data) {
    const cityName = document.getElementById('cityName');
    const weatherIcon = document.getElementById('weatherIcon');
    const temperature = document.getElementById('temperature');
    const weatherDescription = document.getElementById('weatherDescription');
    const feelsLike = document.getElementById('feelsLike').querySelector('span');
    const wind = document.getElementById('wind').querySelector('span');
    const visibility = document.getElementById('visibility').querySelector('span');
    const humidity = document.getElementById('humidity').querySelector('span');
    const uvIndex = document.getElementById('uvIndex').querySelector('span');
    const dewPoint = document.getElementById('dewPoint').querySelector('span');
    const lastUpdated = document.getElementById('lastUpdated');
    const toggleUnitC = document.getElementById('toggleUnitC');
    const toggleUnitF = document.getElementById('toggleUnitF');

    cityName.textContent = `${data.name}, ${data.sys.country}`;
    weatherIcon.src = getWeatherIcon(data.weather[0].main, data.weather[0].icon);
    temperature.textContent = `${Math.round(data.main.temp)}°C`;
    weatherDescription.textContent = data.weather[0].description;
    lastUpdated.textContent = `Updated as of ${new Date().toLocaleString()}`;
    feelsLike.textContent = `${Math.round(data.main.feels_like)}°C`;
    wind.textContent = `${data.wind.speed} m/s`;
    visibility.textContent = `${data.visibility / 1000} km`;
    humidity.textContent = `${data.main.humidity}%`;
    uvIndex.textContent = 'N/A';
    dewPoint.textContent = `${calculateDewPoint(data.main.temp, data.main.humidity)}°C`;

    toggleUnitC.classList.add('active');
    toggleUnitF.classList.remove('active');
    isCelsius = true;

    toggleUnitC.onclick = function() {
        if (!isCelsius) {
            temperature.textContent = `${Math.round(data.main.temp)}°C`;
            feelsLike.textContent = `${Math.round(data.main.feels_like)}°C`;
            dewPoint.textContent = `${calculateDewPoint(data.main.temp, data.main.humidity)}°C`;
            toggleUnitC.classList.add('active');
            toggleUnitF.classList.remove('active');
            isCelsius = true;
        }
    };

    toggleUnitF.onclick = function() {
        if (isCelsius) {
            const tempInFahrenheit = Math.round((data.main.temp * 9/5) + 32);
            temperature.textContent = `${tempInFahrenheit}°F`;
            feelsLike.textContent = `${Math.round((data.main.feels_like * 9/5) + 32)}°F`;
            dewPoint.textContent = `${calculateDewPoint(tempInFahrenheit, data.main.humidity)}°F`;
            toggleUnitC.classList.remove('active');
            toggleUnitF.classList.add('active');
            isCelsius = false;
        }
    };

    weatherInfo.style.display = 'block';
}

function getWeatherIcon(weather, iconCode) {
    switch (weather.toLowerCase()) {
        case 'clear':
            return 'https://img.icons8.com/ios-filled/50/ffffff/sun--v1.png';
        case 'clouds':
            return 'https://img.icons8.com/ios-filled/50/ffffff/cloud.png';
        case 'rain':
            return 'https://img.icons8.com/ios-filled/50/ffffff/rain.png';
        case 'drizzle':
            return 'https://img.icons8.com/ios-filled/50/ffffff/light-rain.png';
        case 'snow':
            return 'https://img.icons8.com/ios-filled/50/ffffff/snow.png';
        case 'thunderstorm':
            return 'https://img.icons8.com/ios-filled/50/ffffff/storm.png';
        case 'mist':
        case 'smoke':
        case 'haze':
        case 'dust':
        case 'fog':
        case 'sand':
        case 'ash':
        case 'squall':
        case 'tornado':
            return 'https://img.icons8.com/ios-filled/50/ffffff/fog.png';
        default:
            return `http://openweathermap.org/img/wn/${iconCode}.png`;
    }
}

function calculateDewPoint(temp, humidity) {
    const dewPointC = temp - (100 - humidity) / 5;
    return Math.round(dewPointC * 10) / 10;
}

function fetchSunriseSunset(latitude, longitude) {
    fetch(`https://api.sunrise-sunset.org/json?lat=${latitude}&lng=${longitude}&formatted=0`)
        .then(response => response.json())
        .then(data => {
            const sunriseTime = new Date(data.results.sunrise);
            const sunsetTime = new Date(data.results.sunset);
            document.getElementById('sunrise').textContent = sunriseTime.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
            document.getElementById('sunset').textContent = sunsetTime.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
        })
        .catch(error => console.error('Error fetching sunrise/sunset data:', error));
}

function setWeatherBackground(weatherCondition, timestamp) {
    const currentHour = new Date(timestamp * 1000).getHours();
    const isDayTime = currentHour >= 6 && currentHour < 18;

    let backgroundImageUrl;

    switch (weatherCondition.toLowerCase()) {
        case 'clear':
            backgroundImageUrl = isDayTime ? weatherBackgrounds.Clear : 'https://images.pexels.com/photos/813269/pexels-photo-813269.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2';
            break;
        case 'clouds':
            backgroundImageUrl = weatherBackgrounds.Clouds;
            break;
        case 'rain':
        case 'drizzle':
        case 'snow':
            backgroundImageUrl = weatherBackgrounds.Rain;
            break;
        case 'thunderstorm':
            backgroundImageUrl = weatherBackgrounds.Thunderstorm;
            break;
        default:
            backgroundImageUrl = 'https://images.pexels.com/photos/813269/pexels-photo-813269.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2';
            break;
    }

    document.body.style.backgroundImage = `url('${backgroundImageUrl}')`;
}

window.onload = function() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords;
            fetchWeatherByCoords(latitude, longitude);
        }, error => {
            console.error('Error getting location:', error);
            fetchWeather('Delhi');
        });
    } else {
        console.error('Geolocation is not supported by this browser.');
        fetchWeather('Delhi');
    }
};

function fetchWeatherByCoords(lat, lon) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            fetchSunriseSunset(data.coord.lat, data.coord.lon);
            displayWeather(data);
            displayMap(data.coord.lat, data.coord.lon);
            setWeatherBackground(data.weather[0].main, data.dt);
        })
        .catch(error => console.error('Error fetching weather data:', error));
}

function displayMap(lat, lon) {
    if (!map) {
        map = L.map('map').setView([lat, lon], 10);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
        }).addTo(map);

        map.on('click', function(e) {
            const { lat, lng } = e.latlng;
            updateMarkerPosition(lat, lng);
            fetchWeatherByCoords(lat, lng);
        });
    }

    updateMarkerPosition(lat, lon);
}

function updateMarkerPosition(lat, lon) {
    if (!marker) {
        marker = L.marker([lat, lon]).addTo(map)
            .bindPopup('Your location')
            .openPopup();
    } else {
        marker.setLatLng([lat, lon]);
    }

    map.setView([lat, lon], 10);
}
