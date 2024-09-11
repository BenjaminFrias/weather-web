import { apiKey } from "./main.js";

export async function getNextFiveDaysForecast(city) {
	try {
		const response = await fetch(
			`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=6`
		);
		const data = await response.json();

		const nextFivedaysForecastObj = {};

		const nextDaysData = data.forecast.forecastday;

		// Remove today's forecast
		nextDaysData.shift();

		const timeZone = data.location.tz_id;

		nextDaysData.forEach((dayForecast, i) => {
			const dayName = getDayName(dayForecast.date, timeZone);
			const minTemp = dayForecast.day.mintemp_c;
			const maxTemp = dayForecast.day.maxtemp_c;

			nextFivedaysForecastObj[i] = [dayName, minTemp, maxTemp];
		});

		// Change the first day name to tomorrow
		nextFivedaysForecastObj[0][0] = "Tomorrow";

		return nextFivedaysForecastObj;
	} catch (error) {
		console.error("Error:", error);
		throw error;
	}
}

function getDayName(dateString) {
	const daysOfWeek = [
		"Monday",
		"Tuesday",
		"Wednesday",
		"Thursday",
		"Friday",
		"Saturday",
		"Sunday",
	];

	const date = new Date(dateString);

	const dayIndex = date.getDay();
	return daysOfWeek[dayIndex];
}
