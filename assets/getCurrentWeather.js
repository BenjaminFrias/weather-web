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
