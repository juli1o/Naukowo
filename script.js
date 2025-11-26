const Weather = class {
    constructor(apiKey, blockSelector) {
        this.apiKey = apiKey;
        this.blockSelector = document.querySelector(blockSelector);

        this.currentWeather = undefined;
        this.forecast = undefined;
    }

    getCurrentWeather(query) {
    const url =`https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=${this.apiKey}&units=metric&lang=pl`;

        const req = new XMLHttpRequest();
        req.open("GET", url);
        req.onload = () => {
            this.currentWeather = JSON.parse(req.responseText);
            this.drawWeather();
            console.log("WEATHER",this.currentWeather)
        };
        req.send();
    }

    getForecast(query) {
    const url =`https://api.openweathermap.org/data/2.5/forecast?q=${query}&appid=${this.apiKey}&units=metric&lang=pl`;

    fetch(url)
        .then(resp => resp.json())
        .then(data => {
            this.forecast = data.list;
            this.drawWeather();
             console.log("FORECAST",this.forecast)
        });
    }

    getWeather(query) {
        this.getCurrentWeather(query);
        this.getForecast(query);
    }

    drawWeather() {
        this.blockSelector.innerHTML = "";

        if (this.currentWeather) {
            const d = new Date(this.currentWeather.dt * 1000);
            const block = this.createWeatherBlock(
                `${d.toLocaleDateString("pl-PL")} ${d.toLocaleTimeString("pl-PL")}`,
                this.currentWeather.main.temp,
                this.currentWeather.main.feels_like,
                this.currentWeather.weather[0].icon,
                this.currentWeather.weather[0].description
            );
            this.blockSelector.appendChild(block);
        }

        if (this.forecast) {
            this.forecast.forEach(w => {
                const d = new Date(w.dt * 1000);
                const block = this.createWeatherBlock(
                    `${d.toLocaleDateString("pl-PL")} ${d.toLocaleTimeString("pl-PL")}`,
                    w.main.temp,
                    w.main.feels_like,
                    w.weather[0].icon,
                    w.weather[0].description
                );
                this.blockSelector.appendChild(block);
            });
        }
    }

    createWeatherBlock(date, temp, feel, icon, desc) {
        const box = document.createElement("div");
        box.className = "content";

        box.innerHTML = `
            <div class="date">${date}</div>
            <div class="temperature">${temp} &deg;C</div>
            <div class="temp-feel">Odczuwalna: ${feel} &deg;C</div>
            <img class="icon" src="https://openweathermap.org/img/wn/${icon}@2x.png">
            <div class="description">${desc}</div>
        `;

        return box;
    }
};

document.Weather = new Weather("cface8a27eff9dcbc95b63bb6fea4ea4", "#weather-container"
);

document.querySelector(".weather-button").addEventListener("click", () => {
    const query = document.querySelector(".weather-input").value;
    document.Weather.getWeather(query);
});
