var apiKey = "d958229d63493292b265d62c35a602e7";
var dateToday = moment().format("DD/MM/YYYY");
var currentWeatherEl = document.getElementById("current-weather-container");
var forecastContainer = document.getElementById("five-day-forecast");
var searchBtn = document.getElementById("searchBtn");
var searchHistory = [];

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
      currentTemperature.textContent = "Temperature: " + data.main.temp + " °C";
      currentWind.textContent = "Wind: " + data.wind.speed + " m/s";
      currentHumidity.textContent = "Humidity: " + data.main.humidity + "%";

      currentWeatherEl.append(cityName);
      currentWeatherEl.append(currentTemperature);
      currentWeatherEl.append(currentWind);
      currentWeatherEl.append(currentHumidity);
    });
  uvIndex();
}

function uvIndex() {
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
      var lat = data.coord.lat;
      var lon = data.coord.lon;

      var getUV =
        "https://api.openweathermap.org/data/2.5/onecall?lat=" +
        lat +
        "&lon=" +
        lon +
        "&exclude=minutely,hourly,alerts&units=metric&appid=" +
        apiKey;

      fetch(getUV)
        .then(function (response) {
          console.log(response);
          return response.json();
        })
        .then(function (data) {
          console.log(data.current.uvi);
          var currentUvIndex = document.createElement("p");
          currentUvIndex.textContent = "UV Index: " + data.current.uvi;
          currentWeatherEl.append(currentUvIndex);

          var currentUvIndexValue = data.current.uvi;

          if (currentUvIndexValue <= 2) {
            currentUvIndex.setAttribute("class", "lowUV");
          }
          if (currentUvIndexValue > 2 && currentUvIndexValue <= 5) {
            currentUvIndex.setAttribute("class", "moderateUV");
          }
          if (currentUvIndexValue > 5 && currentUvIndexValue <= 7) {
            currentUvIndex.setAttribute("class", "highUV");
          }
          if (currentUvIndexValue > 7) {
            currentUvIndexValue.setAttribute("class", "extreme");
          }
        });
    });
}

function fiveDayForecast() {
  event.preventDefault();
  var cityInput = $("input[name='city-search']");
  var city = cityInput.val();
  console.log(city);
  var forecastApiUrl =
    "https://api.openweathermap.org/data/2.5/forecast?q=" +
    city +
    "&units=metric&appid=" +
    apiKey;

  fetch(forecastApiUrl)
    .then(function (response) {
      console.log(response);
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      for (var i = 0; i < 40; i += 8) {
        var forecastCard = document.createElement("div");
        var forecastDate = document.createElement("h3");
        var forecastIcon = document.createElement("img");
        var forecastTemp = document.createElement("p");
        var forecastWind = document.createElement("p");
        var forecastHumidity = document.createElement("p");

        forecastIconProperty = data.list[i].weather[0].icon;
        forecastIconLink =
          "https://openweathermap.org/img/w/" + forecastIconProperty + ".png";
        forecastIcon.setAttribute("src", forecastIconLink);

        var headerDate = data.list[i].dt_txt.split(" ")[0];
        var year = headerDate.split("-")[0];
        var month = headerDate.split("-")[1];
        var day = headerDate.split("-")[2];

        console.log(year);
        console.log(month);
        console.log(day);
        forecastDate.textContent = day + "/" + month + "/" + year;
        forecastTemp.textContent = "Temp: " + data.list[i].main.temp + " °C";
        forecastWind.textContent = "Wind: " + data.list[i].wind.speed + " m/s";
        forecastHumidity.textContent =
          "Humidity: " + data.list[i].main.humidity + "%";
        forecastCard.append(forecastDate);
        forecastCard.append(forecastIcon);
        forecastCard.append(forecastTemp);
        forecastCard.append(forecastWind);
        forecastCard.append(forecastHumidity);
        forecastContainer.append(forecastCard);
        forecastCard.setAttribute("class", "forecast-cards");
      }
    });
}

function storeSearchHistory() {
  var cityInput = $("input[name='city-search']");
  var city = cityInput.val();
  searchHistory.push(city);
  localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
}

//function displaySearchHistory() {
  //var savedSearchHistory = JSON.parse(localStorage.getItem("searchHistory"));
  //console.log(savedSearchHistory);
//}


searchBtn.addEventListener("click", currentWeather);

searchBtn.addEventListener("click", fiveDayForecast);

searchBtn.addEventListener("click", storeSearchHistory);
