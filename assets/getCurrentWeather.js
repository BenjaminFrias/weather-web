import { apiKey } from "./main.js";

// Get current weather data

export async function getCurrentWeatherData(city) {
	try {
		const response = await fetch(
			`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&aqi=no`
		);
		const data = await response.json();

		const currentTemperature = data.current.temp_c;
		const currentWeatherDescription = data.current.condition.text;

		return [currentTemperature, currentWeatherDescription]; // Return array directly
	} catch (error) {
		console.error("Error:", error);
		throw error; // Re-throw the error for handling in main.js
	}
}

// export async function getCurrentWeatherData(city) {
// 	let currentWeather = [];
// 	fetch(
// 		`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&aqi=no`
// 	)
// 		.then((response) => response.json())
// 		.then((data) => {
// 			const currentTemperature = data.current.temp_c;
// 			const currentWeatherDescription = data.current.condition.text;

// 			currentWeather.push(currentTemperature);
// 			currentWeather.push(currentWeatherDescription);
// 		})
// 		.catch((error) => {
// 			console.error("Error:", error);
// 		});

// 	return currentWeather;
// }
