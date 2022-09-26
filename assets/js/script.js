window.onload = function () {
  const { cities } = fetchLocalStorageData();
  renderCities(cities);
};

var searchForm = document.querySelector("#searchForm");

searchForm.addEventListener("submit", function (event) {
  event.preventDefault();
  var userInput = document.querySelector("#city").value;
  getCoordinates(userInput);
});

function getCoordinates(cityName) {
  let apiKey = "6126c30186cf07e96a8caf36edb6d33f";
  let url = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=5&appid=${apiKey}`;

  //START & COMPLETE FETCH
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      document.querySelector("#city").value = "";
      const { lat, lon } = data[0];
      getForecast(lat, lon, apiKey, cityName);
    })
    .catch((error) => alert(error.message));
}

function getForecast(lat, lon, apiKey, cityName) {
  let url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=hourly,minutely&units=imperial&appid=${apiKey}`;
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      let {
        current: { dt, humidity, uvi, wind_speed, temp },
        daily,
      } = data;
      let currentForecast = { dt, humidity, uvi, wind_speed, temp };
      renderCurrent(currentForecast, cityName);
      let nextFiveDays = daily.slice(1, 6);
      renderFiveDay(nextFiveDays)
      addToLocalStorage(cityName, currentForecast, nextFiveDays);
    })
    .catch((error) => {
      console.log(error);
      alert(error.message);
    });
}

function renderCurrent(current, cityName) {
  // City name, Current Date, Temp, Wind, Humidity, UV Index
  let currentDiv = document.querySelector("#current-weather");
  let UVcolor;
  if (current.uvi < 3) {
    UVcolor = "low";
  } else if (current.uvi < 6 && current.uvi > 2) {
    UVcolor = "moderate";
  } else {
    UVcolor = "high";
  }

  currentDiv.innerHTML = `<h3>${cityName} <span>(${dayjs().format(
    "MM/DD/YY"
  )})</span></h3>
  <p>Temp: ${current.temp} &#8457;</p>
  <p>Wind: ${current.wind_speed} MPH</p>
  <p>Humidity: ${current.humidity} %</p>
  <p>UV Index: <span class="${UVcolor}">${current.uvi}</span></p>`;
}

function renderFiveDay(foreCastArray)  {
  let fiveDayDiv = document.querySelector('#forecast-cards')
  fiveDayDiv.innerHTML = '';
  for (let day of foreCastArray)  {
    let dayDiv = document.createElement('div')
    dayDiv.classList.add('card', 'col')
    dayDiv.innerHTML  = `<h3>${dayjs(new Date(day.dt*1000)).format("MM/DD/YY")}</h3>
    <p>Temp: ${day.temp.day} &#8457;</p>
    <p>Wind: ${day.wind_speed} MPH</p>
    <p>Humidity: ${day.humidity} %</p>`
    fiveDayDiv.appendChild(dayDiv)
  }
}

function addToLocalStorage(cityName, current, daily) {
  let { cities } = fetchLocalStorageData();
  let lowerCaseCities = cities.map((city) => city.toLowerCase());
  let cityIncluded = lowerCaseCities.includes(cityName.toLowerCase());
  if (!cityIncluded) {
    cities.push(cityName);
  }
  localStorage.setItem("cities", JSON.stringify(cities));
  localStorage.setItem("current", JSON.stringify(current));
  localStorage.setItem("daily", JSON.stringify(daily));
  renderCities(cities);
}

function fetchLocalStorageData() {
  let cities = localStorage.getItem("cities");
  let current = localStorage.getItem("current");
  let daily = localStorage.getItem("daily");
  return {
    cities: cities != null ? JSON.parse(cities) : [],
    current: current != null ? JSON.parse(current) : {},
    daily: daily != null ? JSON.parse(daily) : [],
  };
}

function renderCities(cities) {
  let cityList = document.querySelector("#city-list");
  cityList.innerHTML = "";
  cities.forEach((city) => {
    let li = document.createElement("li");
    li.innerText = city;
    cityList.appendChild(li);
  });
}
