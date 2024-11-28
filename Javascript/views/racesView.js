import { fetchJSON } from './api.js'; // Reuse API logic if available

const urlRaces = "";
const urlResults = "";
const urlQualifying = "";

// Fetch race data based on the selected season
export function fetchRaces(season) {
    fetchJSON(urlRaces + "?season=" + season.value)
        .then(races => displayRaces(races))
        .catch(err => console.error("Error fetching races:", err));
}

// Display fetched race data in the #listRaces element
function displayRaces(races) {
    const ul = document.querySelector("#listRaces");
    ul.innerHTML = ""; // Clear the list before populating

    // Create a list item for each race
    races.forEach(r => {
        const li = document.createElement("li");
        li.textContent = r.name;
        li.dataset.raceId = r.id; // Store the race ID for later use
        ul.appendChild(li);
    });

    // Add event listener to handle race selection
    ul.addEventListener("click", handleRaceSelection);
}

// Handle race selection from the list
function handleRaceSelection(event) {
    const selectedRace = event.target; // Get the clicked list item
    if (selectedRace.tagName === "LI") {
        const raceId = selectedRace.dataset.raceId; // Retrieve race ID
        console.log("Selected Race ID:", raceId);

        // Retrieve race results and qualifying data
        retrieveResultData(raceId);
        retrieveQualifyingData(raceId);
    }
}

// Fetch and display race result data
function retrieveResultData(raceId) {
    fetchJSON(`${urlResults}?raceId=${raceId}`)
        .then(results => {
            console.log("Race Results:", results);
            // Process and display race results here
        })
        .catch(err => console.error("Error fetching race results:", err));
}

// Fetch and display qualifying data
function retrieveQualifyingData(raceId) {
    fetchJSON(`${urlQualifying}?raceId=${raceId}`)
        .then(qualifying => {
            console.log("Qualifying Data:", qualifying);
            // Process and display qualifying data here
        })
        .catch(err => console.error("Error fetching qualifying data:", err));
}
