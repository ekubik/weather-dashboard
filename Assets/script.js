//define variables
var apiKey = "d958229d63493292b265d62c35a602e7";
var dateToday = moment().format("DD/MM/YYYY");
var currentWeatherEl = document.getElementById("current-weather-container");
var forecastContainer = document.getElementById("five-day-forecast");
var pastSearchesContainer = document.getElementById("past-searches");
var searchBtn = document.getElementById("searchBtn");
var searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];
var city;
var previousSearchTerm;
var searchCity;

//function pulls current weather data from api and displays on page
function currentWeather() {
  event.preventDefault();
  //pulls value from input and sets against variable
  var cityInput = $("input[name='city-search']");
  city = cityInput.val();
  console.log(city);
  //url to access open weather api - uses apiKey variable
  var apiUrl =
    "http://api.openweathermap.org/data/2.5/weather?q=" +
    city +
    "&units=metric&appid=" +
    apiKey;
  //retrieve data
  fetch(apiUrl)
    .then(function (response) {
      console.log(response);
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      //create elements to hold data
      var cityName = document.createElement("h2");
      var currentTemperature = document.createElement("p");
      var currentWind = document.createElement("p");
      var currentHumidity = document.createElement("p");
      // capitalise text content no matter what user types in
      $(cityName).css("textTransform", "capitalize");
      //set text content of variables
      cityName.textContent = city + ",    " + dateToday;
      currentTemperature.textContent = "Temperature: " + data.main.temp + " °C";
      currentWind.textContent = "Wind: " + data.wind.speed + " m/s";
      currentHumidity.textContent = "Humidity: " + data.main.humidity + "%";

      //clear currentWeatherEl of any old/existing content
      currentWeatherEl.innerHTML = "";
      //append elements to container
      currentWeatherEl.append(cityName);
      currentWeatherEl.append(currentTemperature);
      currentWeatherEl.append(currentWind);
      currentWeatherEl.append(currentHumidity);
    });
  //call uvIndex function
  uvIndex();
}

//function pulls uv index and displays on page
function uvIndex() {
  event.preventDefault();
  //retrieve lat and lon data from api
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

      // use lat and lon data and put through as parameters to get UV index data
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
          //create element, set text content, and append to currentWeatherEl
          var currentUvIndex = document.createElement("p");
          currentUvIndex.textContent = "UV Index: " + data.current.uvi;
          currentWeatherEl.append(currentUvIndex);

          var currentUvIndexValue = data.current.uvi;
          //depending on value of uv index, apply different class - change colour
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
            currentUvIndex.setAttribute("class", "extreme");
          }
        });
    });
}


function fiveDayForecast() {
  event.preventDefault();
  //retrieve forecast data from open weather API
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
      //clear forecastContainer in preparation for new data
      forecastContainer.innerHTML = "";
      //loop through data and create new elements each time. Loops through data at every 8th index as data is given every 3 hours - 8 indexes per day
      // we want to retrieve data for next day, so need to data at every 8th index of array
      for (var i = 0; i < 40; i += 8) {
        var forecastCard = document.createElement("div");
        var forecastDate = document.createElement("h3");
        var forecastIcon = document.createElement("img");
        var forecastTemp = document.createElement("p");
        var forecastWind = document.createElement("p");
        var forecastHumidity = document.createElement("p");

        // set src for icon
        forecastIconProperty = data.list[i].weather[0].icon;
        forecastIconLink =
          "https://openweathermap.org/img/w/" + forecastIconProperty + ".png";
        forecastIcon.setAttribute("src", forecastIconLink);

        //retrieve date from array
        //split date property at each space, [0] is where dd/mm/yyyy is
        var headerDate = data.list[i].dt_txt.split(" ")[0];
        //split date string at every - and assign value at each index to year, month, day variables
        var year = headerDate.split("-")[0];
        var month = headerDate.split("-")[1];
        var day = headerDate.split("-")[2];

        console.log(year);
        console.log(month);
        console.log(day);
        //set text content of variables
        forecastDate.textContent = day + "/" + month + "/" + year;
        forecastTemp.textContent = "Temp: " + data.list[i].main.temp + " °C";
        forecastWind.textContent = "Wind: " + data.list[i].wind.speed + " m/s";
        forecastHumidity.textContent =
          "Humidity: " + data.list[i].main.humidity + "%";
        //append to card
        forecastCard.append(forecastDate);
        forecastCard.append(forecastIcon);
        forecastCard.append(forecastTemp);
        forecastCard.append(forecastWind);
        forecastCard.append(forecastHumidity);
        //append each card to container
        forecastContainer.append(forecastCard);
        //set class to apply styling
        forecastCard.setAttribute("class", "forecast-cards");
      }
    });
}

//store search history
function storeSearchHistory() {
  var cityInput = $("input[name='city-search']");
  var city = cityInput.val();

//create list item for every search value and append to container, when users clicks search

  //if (searchHistory.includes(!city)){
  var searchCity = document.createElement("li");
  searchCity.textContent = city;
  $(searchCity).css("textTransform", "capitalize");
  pastSearchesContainer.append(searchCity);
  searchCity.setAttribute(
    "class",
    "list-group-item list-group-item-action previous-search"
  );
  //push city value into searchHistory array
  searchHistory.push(city);
  //store in local storage and store as string
  localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
  //list items created through this function can be clicked to retrieve data
  searchCity.addEventListener("click", retrieveHistory);
} //}

function displaySearchHistory() {
  //loop through items stored in searchHistory array, create list item, set text content and append
  for (var i = 0; i < searchHistory.length; i++) {
    previousSearchTerm = document.createElement("li");
    previousSearchTerm.textContent = searchHistory[i];
    $(previousSearchTerm).css("textTransform", "capitalize");
    pastSearchesContainer.append(previousSearchTerm);
    previousSearchTerm.setAttribute(
      "class",
      "list-group-item list-group-item-action previous-search"
    );
    previousSearchTerm.addEventListener("click", retrieveHistory);
  }
}

displaySearchHistory();

function retrieveHistory(event) {
  //change value of city variable to text content of element targeted by click event
  var city = event.target.textContent;
  //run same functions again, but with different value for city variable
  function currentWeatherHistory() {
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

        var cityName = document.createElement("h2");
        var currentTemperature = document.createElement("p");
        var currentWind = document.createElement("p");
        var currentHumidity = document.createElement("p");

        $(cityName).css("textTransform", "capitalize");
        cityName.textContent = city + ",    " + dateToday;
        currentTemperature.textContent =
          "Temperature: " + data.main.temp + " °C";
        currentWind.textContent = "Wind: " + data.wind.speed + " m/s";
        currentHumidity.textContent = "Humidity: " + data.main.humidity + "%";

        currentWeatherEl.innerHTML = "";
        currentWeatherEl.append(cityName);
        currentWeatherEl.append(currentTemperature);
        currentWeatherEl.append(currentWind);
        currentWeatherEl.append(currentHumidity);
      });
    uvIndexHistory();
  }
  function uvIndexHistory() {
    event.preventDefault();
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
              currentUvIndex.setAttribute("class", "extreme");
            }
          });
      });
  }
  function fiveDayForecastHistory() {
    event.preventDefault();
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
        forecastContainer.innerHTML = "";
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

          forecastDate.textContent = day + "/" + month + "/" + year;
          forecastTemp.textContent = "Temp: " + data.list[i].main.temp + " °C";
          forecastWind.textContent =
            "Wind: " + data.list[i].wind.speed + " m/s";
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
  currentWeatherHistory();
  fiveDayForecastHistory();
}

//functions called on click of searchBtn
searchBtn.addEventListener("click", currentWeather);

searchBtn.addEventListener("click", fiveDayForecast);

searchBtn.addEventListener("click", storeSearchHistory);
