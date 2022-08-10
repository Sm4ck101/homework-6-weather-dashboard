var searchForm = document.querySelector('#searchForm');

searchForm.addEventListener('submit', function(event) {
  event.preventDefault();
  var userInput = document.querySelector('#city').value
  getCoordinates(userInput);
})

function getCoordinates(cityName) {
  let url = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=5&appid=[ENTER OWN API KEY]`
  
  //START & COMPLETE FETCH (refer to 06-Server-Side Activity 01-Create-Fetch)
}

