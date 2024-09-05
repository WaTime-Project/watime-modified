function weatherApp() {
    return {
        city: '',
        temperature: '',
        cityName: '',
        description: '',
        weatherIconUrl: '',
        hourlyForecast: [],

        async getWeatherByCity() {
            if (!this.city) {
                alert('Please enter a city');
                return;
            }
            await this.fetchWeather(`http://localhost:3000/weather/${this.city}`);
        },

        async getWeatherByLocation() {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    async position => {
                        const lat = position.coords.latitude;
                        const lon = position.coords.longitude;
        
                        // Log the latitude and longitude to the console
                        console.log(`Location fetched: Latitude = ${lat}, Longitude = ${lon}`);
        
                        // Get the city name from the coordinates using OpenCage Geocoder API
                        const cityName = await this.getCityName(lat, lon);
                        console.log(`City Name: ${cityName}`);
                        
                        // Use the cityName for any further operations if needed
                        this.city = cityName;
        
                        // Fetch weather data based on the location
                        const url = `http://localhost:3000/weather/${cityName}`;
                        await this.fetchWeather(url);
                    },
                    error => {
                        console.error('Error getting location:', error);
                        alert('Unable to retrieve your location. Please enter a city manually.');
                    }
                );
            } else {
                alert('Geolocation is not supported by this browser.');
            }
        },
        async getCityName(lat, lon) {
            const apiKey = 'd8e347904ec4467d8eedcd7ec2b84544'; // Replace with your OpenCage API key
            const url = `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lon}&key=${apiKey}`;
        
            try {
                const response = await axios.get(url);
                const data = response.data;
                
                // Extract city name from the OpenCage response
                const city = data.results[0].components.city || data.results[0].components.town || data.results[0].components.village;
                return city || 'Unknown Location'; // Fallback to 'Unknown Location' if no city name is found
            } catch (error) {
                console.error('Error fetching city name:', error);
                return 'Unknown Location';
            }
        },

        async fetchWeather(url) {
            try {
                const response = await axios.get(url);
                const data = response.data;

                this.cityName = data.currentWeather.name;
                this.temperature = Math.round(data.currentWeather.main.temp - 273.15) + '°C';
                this.description = data.currentWeather.weather[0].description;
                this.weatherIconUrl = `https://openweathermap.org/img/wn/${data.currentWeather.weather[0].icon}@4x.png`;

                this.hourlyForecast = data.forecast.slice(0, 8).map(item => ({
                    time: new Date(item.dt * 1000).getHours() + ':00',
                    temp: Math.round(item.main.temp - 273.15) + '°C',
                    iconUrl: `https://openweathermap.org/img/wn/${item.weather[0].icon}.png`,
                }));
            } catch (error) {
                console.error('Error fetching weather data:', error);
                alert('Error fetching weather data. Please try again.');
            }
        }
    };
}


function displayWeather(data) {
    const temperatureInfo = document.querySelector('.temperatureContainer');
    const weatherInfo = document.querySelector('.weatherInfo');
    const weatherIcon = document.querySelector('.weatherIcon');
    const hourlyForecast = document.querySelector('.hourlyForecast');

    temperatureInfo.innerHTML = '';
    weatherInfo.innerHTML = '';
    hourlyForecast.innerHTML = '';

    if (data.cod === '404') {
        weatherInfo.innerHTML = `<p>${data.message}</p>`;
    } else {
        const cityName = data.name;
        const temperature = Math.round(data.main.temp - 273.15);
        const description = data.weather[0].description;
        const iconCode = data.weather[0].icon;
        const iconURL = `https://api.openweathermap.org/img/wn/${iconCode}@4.png`;

        const temperatureHTML = `<p>${temperature}°C</p>`;
        const weatherHTML = `<p>${cityName}</p><p>${description}</p>`;

        temperatureInfo.innerHTML = temperatureHTML;
        weatherInfo.innerHTML = weatherHTML;
        weatherIcon.src = iconURL;
        weatherIcon.alt = description;

        showImage();
    }
}

function displayHourlyForecast(hourlyData) {
    const hourlyForecastContainer = document.querySelector('.hourlyForecast');
    const next24Hours = hourlyData.slice(0, 8);

    next24Hours.forEach(item => {
        const dateTime = new Date(item.dt * 1000);
        const hour = dateTime.getHours();
        const temperature = Math.round(item.main.temp - 273.15);
        const iconCode = item.weather[0].icon;
        const iconURL = `https://openweathermap.org/img/wn/${iconCode}.png`;

        const hourlyItemHTML = `
        <div class="hourlyItem">
            <span>${hour}:00</span>
            <img src="${iconURL}" alt="Hourly Weather Icon">
            <span>${temperature}°C</span> 
        </div>
    `;
        hourlyForecastContainer.innerHTML += hourlyItemHTML;
    });
}

function showImage() {
    const weatherIcon = document.querySelector('.weatherIcon');
    weatherIcon.style.display = 'block';
}

