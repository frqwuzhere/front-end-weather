const input = document.querySelector(".search-txt");
const weatherDetails = document.querySelector(".weather-details");
const viewDetail = document.querySelector("article");
const loadAnimation = document.querySelector(".half-ring");
const container = document.querySelector(".container");

// get data when browser on load
window.addEventListener("load", function () {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(successFunction);
  } else {
    alert("It seems like Geolocation, which is required for this page, is not enabled in your browser.");
  }
});

async function successFunction(position) {
  let lat = position.coords.latitude;
  let long = position.coords.longitude;
  viewDetail.style.opacity = "1";
  weatherDetails.style.opacity = "1";
  const input = await getCurrentWeather(long, lat);
  const details = await getWeather(input[0].name);
  hideLoading();
  const icon = getIcon(details);
  updateUi(details, icon);
  updateDetailWeather(details);
  updateBackground(details);
}

// show data when type on a search form input
input.addEventListener("keypress", async function (event) {
  if (event.key === "Enter" && input.value !== "") {
    viewDetail.style.opacity = "1";
    weatherDetails.style.opacity = "1";
    const input = document.querySelector(".search-txt");
    const details = await getWeather(input.value);
    hideLoading();
    const icon = getIcon(details);
    updateUi(details, icon);
    updateDetailWeather(details);
    updateBackground(details);
    input.value = "";
  } else if (event.key === "Enter" && input.value === "") {
    alert("please type the location");
  }
});

function getCurrentWeather(long, lat) {
  return fetch(`http://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${long}&limit=5&appid=4458d17046c313f333e7df759c7a061a`)
    .then((response) => response.json())
    .then((response) => response);
}

function getWeather(input) {
  displayLoading();
  return fetch(`https://api.openweathermap.org/data/2.5/weather?q=${input}&appid=4458d17046c313f333e7df759c7a061a`)
    .then((response) => response.json())
    .then((response) => response);
}

function getIcon(m) {
  return `https://openweathermap.org/img/wn/${m.weather[0].icon}@2x.png`;
}

function updateUi(m, i) {
  const mainContent = document.querySelector("article");
  mainContent.innerHTML = showView(m, i);
}

function updateDetailWeather(key) {
  const detailWeather = document.querySelector(".weather-details");
  detailWeather.innerHTML = showDetail(key);
}

function updateBackground(picture) {
  let iconTime = picture.weather[0].icon;
  if (iconTime.includes("n")) {
    container.style.backgroundColor = "var(--dark-container)";
    // console.log(iconTime)
  } else {
    container.style.backgroundColor = "var(--blue-container)";
    // console.log(iconTime);
  }
}

function showDetail(m) {
  return `
  <h2>Weather Details</h2>
  <div class="weather-detail-list">
    <li><span>Humidity</span><span>${m.main["humidity"]}%</span></li>
    <li><span>Wind</span><span>${m.wind["speed"]}km/h</span></li>
    <li><span>Cloud</span><span>${m.clouds["all"]}%</span></li>
  </div>
      
    `;
}

function showView(m, i) {
  return `
  <span class="degree-desc">${Math.round(m["main"]["temp"] - 273.15)}°C</span>
  <div class="detail-item">
    <span class="location-desc">${m.name}, ${m.sys["country"]}</span>
    </div>
    <div class="weather-desc">
    <img class="weather-icon" src="${i}" alt="" />
    <span>${m.weather[0].main}</span>
    <span>${m.weather[0].description}</span>
    </div>
    `;
}

function displayLoading() {
  loadAnimation.classList.add("display");
  // to stop loading after some time
  setTimeout(() => {
    loadAnimation.classList.remove("display");
  }, 5000);
}

// hiding loading
function hideLoading() {
  setTimeout(() => {
    loadAnimation.classList.remove("display");
  }, 1000);
}
