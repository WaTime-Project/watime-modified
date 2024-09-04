function weatherApp() {
    return {
        city: '',
        temperature: '',
        cityName: '',
        description: '',
        weatherIconUrl: '',
        hourlyForecast: [],

        async getWeather() {
            if (!this.city) {
                alert('Please enter a city');
                return;
            }

            try {
                const response = await axios.get(`http://localhost:3000/weather/${this.city}`);
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

