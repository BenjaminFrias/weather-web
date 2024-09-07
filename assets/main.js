import { getCurrentWeatherData } from "./getCurrentWeather.js";

const closePopUp = document.querySelector("#close-pop-up");
const popUp = document.querySelector(".pop-up-search");
const currentWeatherContainer = document.querySelector(".current-weather");
const currentTemperature = document.querySelector("#current-temperature");
const currentWeatherDescription = document.querySelector("#weather-type");
const currentTime = document.querySelector("#current-time .time");
const currentDate = document.querySelector("#current-time .date");
const searchCityBtn = document.querySelector("#pop-up-search-btn");
const citiesSuggestionList = document.querySelector(".city-suggestions ul");
const cityInput = document.querySelector("#city-input");

let currentGlobalCity = "London";

// Search and show cities
export const apiKey = "323d066f1e3a4c378e3154049240509";

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
						popUp.classList.add("hidden");
						cityInput.value = "";

						showCurrentWeather();
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

async function showCurrentWeather() {
	try {
		const currentWeather = await getCurrentWeatherData(currentGlobalCity);
		const [temperature, weatherDescription] = currentWeather;

		currentTemperature.textContent = `${temperature}°`;
		currentWeatherDescription.textContent = weatherDescription;
	} catch (error) {
		console.error("Error fetching weather data:", error);
	}
}

showCurrentWeather();

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
