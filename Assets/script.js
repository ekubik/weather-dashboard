var apiKey = "d958229d63493292b265d62c35a602e7";
var apiUrl =
  "http://api.openweathermap.org/data/2.5/weather?q=" +
  city +
  "&appid=" +
  apiKey;

var cityInput = $("input[name='city-search']");

var city = cityInput.val();

var searchBtn = document.getElementById("searchBtn");

function currentWeather() {
  console.log(city);
  fetch(apiUrl).then(function (response) {
    console.log(response);
    return response.json();
  });
}

searchBtn.addEventListener("click", currentWeather());
