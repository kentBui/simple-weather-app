const key = "0de65d7184d302406cdfa11f506f07d6";
// api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}
let city = document.getElementById("city");
const timeLoop = 30000; // time for update data.

// get city and find weather data
function getCity() {
  if (city.value === "") {
    fetchData();
  } else {
    fetchData(city.value);
  }
  city.value = "";
}

// fetch data from api
async function fetchData(city = "ha noi") {
  const result = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${key}`
  );
  const data = await result.json();
  // console.log(data);
  const { weather, main, name } = data;
  const { description } = weather[0];
  const weatherMain = weather[0].main;
  const { temp, temp_min, temp_max, pressure, humidity } = main;

  const cityData = { temp, name, weatherMain, description };

  render(
    cityData.temp,
    cityData.name,
    cityData.weatherMain,
    cityData.description
  );

  localStorage.setItem("cityData", JSON.stringify(cityData));
}

// render data
function render(
  temp = 0,
  name = "Loading...",
  weatherMain = "Loading...",
  description = "Loading..."
) {
  // get time
  let time = new Date();
  let hour = `0${time.getHours()}`.slice(-2);
  let minute = `0${time.getMinutes()}`.slice(-2);
  // get icon
  let icon;
  switch (weatherMain) {
    case "Rain":
      icon = `<i class="fas fa-cloud-rain"></i>`;
      break;
    case "Clouds":
      icon = `<i class="fas fa-cloud-sun"></i>`;
      break;
    default:
      icon = `<i class="fas fa-sun"></i>`;
      break;
  }
  // render content for display
  let content = `<div class="box__title">
                  <h2>${temp} <sup>o</sup>C</h2>
                  <h1 class="city">${name}</h1>
                  <p>Time: ${hour}:${minute}</p>
                </div>
                <div class="box__show">
                  <div class="show__weather">
                    <div class="icon">
                      ${icon}
                    </div>
                    <div class="info">
                      <h4>${weatherMain}</h4>
                      <p>${description}</p>
                    </div>
                  </div>`;

  let weatherBox = document.querySelector(".weather__box");
  weatherBox.innerHTML = content;
}

//first load data. get data from localstorage
window.onload = function () {
  let cityData = JSON.parse(localStorage.getItem("cityData"));
  if (cityData) {
    cityData.temp, cityData.name, cityData.weatherMain, cityData.description;
    render(
      cityData.temp,
      cityData.name,
      cityData.weatherMain,
      cityData.description
    );
  } else {
    render();
  }
};

// get data when user find data weather for city
document.getElementById("btn-search").addEventListener("click", getCity);

// create timer for auto update data
setInterval(() => {
  let cityData = JSON.parse(localStorage.getItem("cityData"));
  if (cityData) {
    fetchData(cityData.name);
  } else {
    fetchData();
  }
}, timeLoop);
