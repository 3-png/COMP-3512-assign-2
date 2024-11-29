 HEAD
// Base URL for fetching data
const BASE_URL = "https://www.randyconnolly.com/funwebdev/3rd/api/f1/";

// Fetch races, results, and qualifying for the selected season
function fetchSeasonData(season) {
    // Fetch races for the selected season
    const urlRaces = `${BASE_URL}races.php?season=${season}`;
    fetch(urlRaces)
        .then(response => response.json())
        .then(races => {
            displayRaces(races); // Step 4: Display races
            setupRaceHandlers(races); // Step 5: Set up event handlers
        })
        .catch(err => console.error("Error fetching races:", err));
}

// Display all races for the season
function displayRaces(races) {
    const raceTableBody = document.querySelector("#raceTableBody");
    raceTableBody.innerHTML = ""; // Clear existing rows

    races.forEach(race => displaySingleRace(race, raceTableBody));
}

// Display a single race in a table row
function displaySingleRace(race, tableBody) {
    const tr = document.createElement("tr");
    
    const tdName = document.createElement("td");
    tdName.textContent = race.name;

    const tdDate = document.createElement("td");
    tdDate.textContent = race.date;

    const tdCircuit = document.createElement("td");
    tdCircuit.textContent = race.circuit_name;

    tr.appendChild(tdName);
    tr.appendChild(tdDate);
    tr.appendChild(tdCircuit);
    tableBody.appendChild(tr);

    // Step 5: Add click event handler for each race
    tr.addEventListener("click", () => handleRaceSelection(race));
}

// Handle race selection and filter results/qualifying data
function handleRaceSelection(selectedRace) {
    console.log("Selected Race:", selectedRace);

    // Fetch and filter results and qualifying data
    const season = selectedRace.season;
    Promise.all([
        fetch(`${BASE_URL}results.php?season=${season}`).then(res => res.json()),
        fetch(`${BASE_URL}qualifying.php?season=${season}`).then(res => res.json())
    ])
        .then(([results, qualifying]) => {
            const filteredResults = results.filter(r => r.race_id === selectedRace.id);
            const filteredQualifying = qualifying.filter(q => q.race_id === selectedRace.id);

            displayResults(filteredResults); // Step 5b: Display filtered results
            displayQualifying(filteredQualifying); // Step 5c: Display qualifying
        })
        .catch(err => console.error("Error fetching results/qualifying:", err));
}

// Display filtered results
function displayResults(results) {
    const resultsTableBody = document.querySelector("#resultsTableBody");
    resultsTableBody.innerHTML = ""; // Clear existing rows

    results.forEach(result => displaySingleResult(result, resultsTableBody));
}

// Display a single result in the results table
function displaySingleResult(result, tableBody) {
    const tr = document.createElement("tr");

    const tdPosition = document.createElement("td");
    tdPosition.textContent = result.position;

    const tdDriver = document.createElement("td");
    tdDriver.textContent = `${result.driver_firstname} ${result.driver_lastname}`;
    tdDriver.addEventListener("click", () => displayDriverPopup(result.driver_id)); // Setup popup handler for driver

    const tdConstructor = document.createElement("td");
    tdConstructor.textContent = result.constructor_name;
    tdConstructor.addEventListener("click", () => displayConstructorPopup(result.constructor_id)); // Setup popup handler for constructor

    tr.appendChild(tdPosition);
    tr.appendChild(tdDriver);
    tr.appendChild(tdConstructor);
    tableBody.appendChild(tr);
}

// Display qualifying data
function displayQualifying(qualifying) {
    const qualifyingTableBody = document.querySelector("#qualifyingTableBody");
    qualifyingTableBody.innerHTML = ""; // Clear existing rows

    qualifying.forEach(q => {
        const tr = document.createElement("tr");

        const tdPosition = document.createElement("td");
        tdPosition.textContent = q.position;

        const tdDriver = document.createElement("td");
        tdDriver.textContent = `${q.driver_firstname} ${q.driver_lastname}`;
        tdDriver.addEventListener("click", () => displayDriverPopup(q.driver_id)); // Setup popup handler for driver

        const tdConstructor = document.createElement("td");
        tdConstructor.textContent = q.constructor_name;
        tdConstructor.addEventListener("click", () => displayConstructorPopup(q.constructor_id)); // Setup popup handler for constructor

        tr.appendChild(tdPosition);
        tr.appendChild(tdDriver);
        tr.appendChild(tdConstructor);
        qualifyingTableBody.appendChild(tr);
    });
}

// Popup for displaying driver details
function displayDriverPopup(driverId) {
    console.log("Display driver popup for ID:", driverId);
    // Fetch and display driver details in a modal
}

// Popup for displaying constructor details
function displayConstructorPopup(constructorId) {
    console.log("Display constructor popup for ID:", constructorId);
    // Fetch and display constructor details in a modal
}

// Event listener for season selection
document.querySelector("#season-select").addEventListener("change", e => {
    const season = e.target.value;
    fetchSeasonData(season); // Step 1: Fetch races for selected season
});












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
 ef2631afa96d0cfa364ab6102c90632820faf2cf
