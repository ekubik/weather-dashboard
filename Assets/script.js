var apiKey = "d958229d63493292b265d62c35a602e7";
var dateToday = moment().format("DD/MM/YYYY");
var currentWeatherEl = document.getElementById("current-weather-container");

var searchBtn = document.getElementById("searchBtn");


function currentWeather() {
  event.preventDefault();
  var cityInput = $("input[name='city-search']");
  var city = cityInput.val();
  console.log(city);
  var apiUrl =
    "http://api.openweathermap.org/data/2.5/weather?q=" +
    city +
    "&units=metric&appid=" +
    apiKey;
  fetch(apiUrl)
    .then(function (response) {
      console.log(response);
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      console.log(data.main.temp);
      console.log(data.wind.speed);
      console.log(data.main.humidity);

      var cityName = document.createElement("h2");
      var currentTemperature = document.createElement("p");
      var currentWind = document.createElement("p");
      var currentHumidity = document.createElement("p");

      cityName.textContent = city + ",    " + dateToday;
      currentTemperature.textContent = "Temperature: " + data.main.temp + "°C";
      currentWind.textContent = "Wind: " + data.wind.speed + " m/s";
      currentHumidity.textContent = "Humidity: " + data.main.humidity + "%";

      currentWeatherEl.append(cityName);
      currentWeatherEl.append(currentTemperature);
      currentWeatherEl.append(currentWind);
      currentWeatherEl.append(currentHumidity);
    });
}

searchBtn.addEventListener("click", currentWeather);
