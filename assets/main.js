import { getCurrentWeatherData } from "./getCurrentWeather.js";
import { getCurrentTimeDate } from "./getCurrentTimeDate.js";
import { getHourlyForecast } from "./getHourlyForecast.js";
import { getNextFiveDaysForecast } from "./getNextFiveDaysForecast.js";
import { getTypeOfWeatherCode } from "./getTypeOfWeather.js";

const rootElement = document.documentElement;
const closePopUp = document.querySelector("#close-pop-up");
const popUp = document.querySelector(".pop-up-search");
const currentWeatherContainer = document.querySelector(".current-weather");
const currentTemperature = document.querySelector("#current-temperature");
const currentWeatherDescription = document.querySelector("#weather-type");
const currentTimeDate = document.querySelector("#current-time");
const searchCityBtn = document.querySelector("#pop-up-search-btn");
const citiesSuggestionList = document.querySelector(".city-suggestions ul");
const cityInput = document.querySelector("#city-input");
const hourlyForecastList = document.querySelector(".hour-list");
const nextFiveDaysList = document.querySelector(".five-days-list");

let currentGlobalCity = "London";
export const apiKey = "323d066f1e3a4c378e3154049240509";

// Search and show cities

cityInput.addEventListener("input", async (event) => {
	let city = event.target.value;

	if (city.length > 2) {
		fetch(
			`https://api.weatherapi.com/v1/search.json?q=${city}&key=${apiKey}`
		)
			.then((response) => response.json())
			.then((data) => {
				citiesSuggestionList.innerHTML = "";

				data.forEach((citySuggestion) => {
					const listItem = document.createElement("li");
					listItem.textContent = `${citySuggestion.name}, ${citySuggestion.country}`;

					listItem.addEventListener("click", () => {
						currentGlobalCity = citySuggestion.name;
						searchCityBtn.textContent = currentGlobalCity;

						popUp.classList.add("hidden");
						cityInput.value = "";

						updateWeather();
					});

					citiesSuggestionList.appendChild(listItem);
				});
			})
			.catch((error) => {
				console.error("Error:", error);
				citiesSuggestionList.innerHTML = "";
			});
	}
});

// Show current weather

async function updateWeather() {
	try {
		await updateCurrentWeather(currentGlobalCity);
		toggleColors();
		await updateHourlyForecast(currentGlobalCity);
		await updateNextFiveDaysForecast(currentGlobalCity);
	} catch (error) {
		console.error("Error fetching weather data:", error);
	}
}

updateWeather();

// Show hourly forecast

async function updateHourlyForecast(city) {
	try {
		// Clean current hourly forecast list
		hourlyForecastList.innerHTML = "";

		const hourlyForecastsData = await getHourlyForecast(city);

		// If there aren't more forecast show message
		if (hourlyForecastsData.length == 0) {
			const ListItem = document.createElement("li");
			ListItem.classList.add("hour-item");
			ListItem.classList.add("message");
			ListItem.textContent = "There aren't more forecast for this day.";
			hourlyForecastList.appendChild(ListItem);
		}

		// Set hourly forecast hours and icon
		for (let forecast in hourlyForecastsData) {
			const hourForecast = hourlyForecastsData[forecast][0];
			const iconForecast = hourlyForecastsData[forecast][1];

			// Create hour and icon div elements
			const paragraphItem = document.createElement("p");
			const iconDiv = document.createElement("div");
			const iconImgElem = document.createElement("img");
			iconDiv.appendChild(iconImgElem);

			iconImgElem.src = `https:${iconForecast}`;
			iconImgElem.alt = hourlyForecastsData[forecast][2];

			paragraphItem.textContent = hourForecast;

			// Create hour forecast list item and append elements
			const hourListItem = document.createElement("li");
			hourListItem.classList.add("hour-item");

			hourListItem.appendChild(paragraphItem);
			hourListItem.appendChild(iconDiv);

			// Add list item to hourly Forecast List
			hourlyForecastList.appendChild(hourListItem);
		}
	} catch (error) {
		console.log(error);
	}
}

async function updateCurrentWeather(city) {
	try {
		const [temperature, weatherDescription] = await getCurrentWeatherData(
			city
		);

		currentTemperature.textContent = `${temperature}°`;
		currentWeatherDescription.textContent = weatherDescription;

		searchCityBtn.textContent = city;

		// Show date and time
		currentTimeDate.textContent = await getCurrentTimeDate(city);
	} catch (error) {
		console.log(error);
	}
}

async function updateNextFiveDaysForecast(city) {
	nextFiveDaysList.textContent = "";

	try {
		const nextFiveDaysData = await getNextFiveDaysForecast(city);

		for (let day in nextFiveDaysData) {
			const dayItem = document.createElement("li");
			dayItem.classList.add("day-item");

			// Create day name
			const dayName = document.createElement("p");
			dayName.textContent = nextFiveDaysData[day][0];

			// Create the min max element
			const minMax = document.createElement("p");

			const minSpan = document.createElement("span");
			minSpan.textContent = `${nextFiveDaysData[day][1]}°`;

			const maxSpan = document.createElement("span");
			maxSpan.textContent = `${nextFiveDaysData[day][2]}°`;

			// Append the every element in the minmax p element
			minMax.appendChild(document.createTextNode("Min: "));
			minMax.appendChild(minSpan);
			minMax.appendChild(document.createTextNode(" | "));
			minMax.appendChild(document.createTextNode("Max: "));
			minMax.appendChild(maxSpan);

			// Append the name and the minmax to list item
			dayItem.appendChild(dayName);
			dayItem.appendChild(minMax);

			// Append the day item to the list
			nextFiveDaysList.appendChild(dayItem);
		}

		// Create list item
	} catch (error) {
		console.log(error);
	}
}

// Toggle colors

async function toggleColors() {
	const weatherTypeCode = await getTypeOfWeatherCode(currentGlobalCity);

	const rainyConditions = [
		1063, 1066, 1069, 1072, 1150, 1153, 1168, 1171, 1180, 1183, 1186, 1189,
		1192, 1195, 1198, 1201, 1204, 1207, 1210, 1213, 1216, 1219, 1222, 1225,
		1237, 1240, 1243, 1246, 1249, 1252, 1255, 1258, 1261, 1264, 1273, 1276,
		1279, 1282,
	];
	const sunnyConditions = [1000];
	const cloudyConditions = [1003, 1006, 1009, 1135, 1147];

	if (rainyConditions.includes(weatherTypeCode)) {
		rootElement.className = "rainy";
	} else if (sunnyConditions.includes(weatherTypeCode)) {
		rootElement.className = "sunny";
	} else if (cloudyConditions.includes(weatherTypeCode)) {
		rootElement.className = "cloudy";
	} else {
		rootElement.className = "";
	}
}

// Close pop up
closePopUp.addEventListener("click", () => {
	popUp.classList.add("hidden");
	cityInput.value = "";
});

// Show search input pop up
searchCityBtn.addEventListener("click", () => {
	citiesSuggestionList.innerHTML = "";
	popUp.classList.remove("hidden");
	cityInput.focus();
});
