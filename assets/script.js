var searchBtn = document.querySelector("#searchBtn");
var searchInput = document.querySelector("#search");
var listEl = document.querySelector("ul");
var jumbotron = document.querySelector("#jumbotron");
var cards =  document.querySelector("#cards");

const apiKey = "95112ca064f77491ff012ecebc538edb";
var storedCities = [];

function geocodingApiCall (city) {
  return `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`;
}

function weatherApiCall (lat, lon) {
  return `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`;
}

//Performs API call and Renders Forecast
function apiCall (city) {
  fetch (geocodingApiCall(city))
    .then (response => response.json())
    .then (data => {
      var lat = data[0].lat;
      var lon = data[0].lon;

      fetch (weatherApiCall(lat, lon))
        .then (response => response.json())
        .then (data => {
          renderForecast(data);
        });
    });
}

function weatherIcon (weather) {
  switch (weather) {
    case "Thunderstorm":
      return "⛈️";
      break;
    case "Drizzle":
      return "🌦️";
      break;
    case "Rain":
      return "🌧️";
      break;
    case "Snow":
      return "🌨️";
      break;
    case "Clear":
      return "☀️";
      break;
    case "Clouds":
      return "⛅";
      break;
    default:
      return "🌤️";
  }
}

function renderForecast (data) {
  console.log(data);

  //Renders Jumbotron
  const today = data.list[0];
  jumbotron.innerHTML = "";

  var cityTemp = document.createElement("h2");
  var temp = document.createElement("span");
  var wind = document.createElement("span");
  var hum = document.createElement("span");

  cityTemp.textContent = `${data.city.name} - ${moment.unix(today.dt).format("MMM Do, YYYY")} ${weatherIcon(today.weather[0].main)}`;
  temp.textContent = `Temprature: ${today.main.temp_max}°F`;
  wind.textContent = `Wind: ${today.wind.speed} MPH`;
  hum.textContent = `Humidity: ${today.main.humidity}%`;

  jumbotron.appendChild(cityTemp);
  jumbotron.appendChild(temp);
  jumbotron.appendChild(wind);
  jumbotron.appendChild(hum);

  //Renders 5 day forecast
  cards.innerHTML = "";

  for (let i = 7; i < data.list.length; i += 8) {
    let day = data.list[i];

    let figure = document.createElement("figure");
    let date = document.createElement("span");
    let temp = document.createElement("span");
    let wind = document.createElement("span");
    let hum = document.createElement("span");

    date.textContent = moment.unix(day.dt).format("MMM Do") + " " + weatherIcon(day.weather[0].main);
    temp.textContent = `Temp: ${day.main.temp_max}°F`;
    wind.textContent = `Wind: ${day.wind.speed} MPH`;
    hum.textContent = `Humidity: ${day.main.humidity}%`;

    cards.appendChild(figure);
    figure.appendChild(date);
    figure.appendChild(temp);
    figure.appendChild(wind);
    figure.appendChild(hum);
  }
}

//Local Storage
function store (city) {
  storedCities.push(city);
  localStorage.setItem("storedCities", JSON.stringify(storedCities));
  renderCities();
}

function renderCities() {
  listEl.innerHTML = "";

  for (let i = 0; i < storedCities.length; i++) {
    var li = document.createElement("li");
    li.textContent = storedCities[i];
    listEl.appendChild(li);
  }
}

//Search Button Event Listener
searchBtn.addEventListener("click", function(event) {
  event.preventDefault();

  var input = searchInput.value.trim();

  if (input) {
    console.log(input);
    store(input);
    apiCall(input);
    searchInput.value = "";
  } else {
    console.log("Please enter a valid city name");
  }
});

//Saved City event listener

listEl.addEventListener("click", function(event) {
  if (event.target.constructor.name === "HTMLLIElement"){
    var city = event.target.textContent;
    apiCall(city);
  }
});

if (localStorage.getItem("storedCities")) {
  console.log("Returned True");
  storedCities = JSON.parse(localStorage.getItem("storedCities"));
  renderCities();
} else {
  console.log("Returned False");
}
