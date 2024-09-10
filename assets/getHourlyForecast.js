import { apiKey } from "./main.js";

// Get hourly forecast data

export async function getHourlyForecast(city) {
	try {
		const response = await fetch(
			`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}`
		);
		const data = await response.json();

		const currentHour = data.location.localtime.split(" ")[1].split(":")[0];
		const hourlyForecastArray = data.forecast.forecastday[0].hour;

		const nextFiveHoursForecast = {};

		hourlyForecastArray.forEach((forecast) => {
			const forecastHour = forecast.time.split(" ")[1].split(":")[0];

			// Get at least the next five forecastf from current hour
			const forecastLength = Object.keys(nextFiveHoursForecast).length;

			if (forecastHour > currentHour && forecastLength < 5) {
				const forecastIcon = forecast.condition.icon;

				// Formatted hour to 12 hours format
				const period = forecastHour >= 12 ? "PM" : "AM";
				const formattedHour = `${forecastHour % 12 || 12} ${period}`;

				nextFiveHoursForecast[forecastLength] = [
					formattedHour,
					forecastIcon,
				];
			}
		});
		// Formmated hour

		return nextFiveHoursForecast;
	} catch (error) {
		console.error("Error:", error);
		throw error; // Re-throw the error for handling in main.js
	}
}
