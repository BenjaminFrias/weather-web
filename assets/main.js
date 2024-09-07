const closePopUp = document.querySelector("#close-pop-up");
const popUp = document.querySelector(".pop-up-search");
const currentWeatherContainer = document.querySelector(".current-weather");
const currentTemperature = document.querySelector("#current-temperature");
const currentTypeOfWeather = document.querySelector("#weather-type");
const currentTime = document.querySelector("#current-time .time");
const currentDate = document.querySelector("#current-time .date");
const searchCityBtn = document.querySelector("#pop-up-search-btn");
const citiesSuggestionList = document.querySelector(".city-suggestions ul");
const cityInput = document.querySelector("#city-input");

// Search and show cities
const apiKey = "323d066f1e3a4c378e3154049240509";

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
						popUp.classList.add("hidden");
						cityInput.value = "";
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
