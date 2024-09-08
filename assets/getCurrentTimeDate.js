import { apiKey } from "./main.js";

export async function getCurrentTimeDate(city) {
	try {
		const response = await fetch(
			`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&aqi=no`
		);
		const data = await response.json();

		const [currentDate, currentTime] = data.location.localtime.split(" ");

		// Formmated hour
		const [hour, minutes] = currentTime.split(":");
		const period = hour >= 12 ? "PM" : "AM";
		const formattedHour = hour % 12 || 12;

		// Formmated date
		const [year, month, day] = currentDate.split("-");

		const monthName = getMonthName(month);

		// RETURN formmated date and time
		const formattedTimeDate = `${formattedHour}:${minutes} ${period}, ${monthName} ${day}`;

		return formattedTimeDate;
	} catch (error) {
		console.error("Error:", error);
		throw error;
	}
}

function getMonthName(month) {
	let monthName;
	const monthNames = [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December",
	];

	if (month[0] == "0") {
		monthName = monthNames[month[1] - 1];
	} else {
		monthName = monthNames[month];
	}

	return monthName;
}
