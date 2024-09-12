import { apiKey } from "./main.js";

export async function getTypeOfWeatherCode(city) {
	try {
		const response = await fetch(
			`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&aqi=no`
		);
		const data = await response.json();

		const weatherType = data.current.condition.code;

		return weatherType;
	} catch (error) {
		console.error("Error:", error);
		throw error;
	}
}
