var apiKey = "d958229d63493292b265d62c35a602e7"
var currentDate = moment().format();

var searchBtn = document.getElementById("searchBtn");

function currentWeather() {
event.preventDefault();

var apiUrl =
  "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=metric&appid=" +
  apiKey;

var cityInput = $("input[name='city-search']");
var city = cityInput.value;
console.log(city);
fetch(apiUrl)
  .then(function (response) {
    console.log(response);
    return response.json();
  })
  .then(function (data) {
    console.log(data);
    console.log(data.main.temp);

    var cityName = document.createElement("h2");
    var currentTemperature = document.createElement("p");
    var currentWind = document.createElement("p");
    var currentHumidity = document.createElement("p");
  })};


searchBtn.addEventListener("click", currentWeather)
