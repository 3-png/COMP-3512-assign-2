/* Imports */
import { openCircuitPopup, openDriverPopup, openConstructorPopup } from './popup.js';

// DOM
document.addEventListener("DOMContentLoaded", function () {
    const seasonSelect = document.querySelector('#season-select');
    const raceTableBody = document.querySelector('#raceTableBody');
    // const resultsContainer = document.querySelector('#results-container');
    // const raceTitle = document.querySelector('#race-title');
    const qualifyingTableBody = document.querySelector('#qualifyingTableBody');
    const resultsTableBody = document.querySelector('#resultsTableBody');

    // Storing data in local memory -----------------------------------------------------------------
    let raceData = [];

    // Fetching and storing the data
    function fetchRaces(season) {
        const localData = localStorage.getItem(`season_${season}`);
        if (localData) {
            raceData = JSON.parse(localData);
            displayRaces(raceData);
            return;
        }

        const url = `https://www.randyconnolly.com/funwebdev/3rd/api/f1/races.php?season=${season}`;
        fetch(url)
            .then(response => response.json())
            .then(data => {
                raceData = data;
                localStorage.setItem(`season_${season}`, JSON.stringify(data));
                displayRaces(data);
            })
            .catch(error => console.error('Error fetching races:', error));
    }

    // Fetching constructor, driver, and circuit data (once)
    function preloadDetails() {
        const constructorUrl = `https://www.randyconnolly.com/funwebdev/3rd/api/f1/constructors.php`;
        const driverUrl = `https://www.randyconnolly.com/funwebdev/3rd/api/f1/drivers.php`;
        const circuitUrl = `https://www.randyconnolly.com/funwebdev/3rd/api/f1/circuits.php`;

        Promise.all([
            fetch(constructorUrl).then(res => res.json()),
            fetch(driverUrl).then(res => res.json()),
            fetch(circuitUrl).then(res => res.json())
        ])
        .then(([constructors, drivers, circuits]) => {
             // Store data in localStorage for later use
             localStorage.setItem('constructors_data', JSON.stringify(constructors));
             localStorage.setItem('drivers_data', JSON.stringify(drivers));
             localStorage.setItem('circuits_data', JSON.stringify(circuits));
        })
        .catch(error => console.error('Error preloading details:', error));
    }

    // Hides title and tsbles until results view button is clicked ----------------------------------
    const qualifyingTitle = document.querySelector('#qualifying-title');
    const qualifyingTable = document.querySelector('#qualifying-table');
    const raceResultsTitle = document.querySelector('#results-title');
    const raceResultsTable = document.querySelector('#results-table');
    const popupBox = document.querySelector('#popupSection');

    // Hides Qualifying and Race Results initially
    function hideResults() {
        qualifyingTitle.style.display = 'none';
        qualifyingTable.style.display = 'none';
        raceResultsTitle.style.display = 'none';
        raceResultsTable.style.display = 'none';
        popupBox.style.display = 'none';
    }

    // Shows Qualifying and Race Results
    function showResults() {
        qualifyingTitle.style.display = 'block';
        qualifyingTable.style.display = 'table';
        raceResultsTitle.style.display = 'block';
        raceResultsTable.style.display = 'table';
    }

    // Display races in the table with clickable "Results" buttons ----------------------------------
    function displayRaces(races) {
        raceTableBody.innerHTML = ''; // Clears existing data
        races.forEach(race => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${race.round}</td>
                <td><a href="#" class="circuit-link" data-circuit-id="${race.circuit.id}">${race.circuit.name}</td>
                <td><button class="results-btn" data-race-id="${race.id}" data-race-name="${race.name}">Results</button></td>
            `;
            raceTableBody.appendChild(tr);
        });

        // Event listener for circuits (races table) ----------------- testing
        const circuitLinks = document.querySelectorAll('.circuit-link');
        circuitLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const circuitId = link.dataset.circuitId;
                openCircuitPopup(circuitId);
            });
        });
        // ----------------------------------------------------------- testing

        // Event listener for the "Results" buttons
        const resultButtons = document.querySelectorAll('.results-btn');
        resultButtons.forEach(button => {
            button.addEventListener('click', () => {
                const raceId = button.dataset.raceId;
                fetchRaceAndQualifyingResults(raceId);
                showResults(); // Shows Results tables of Qualifying and Races
            });
        });
    }

    // Display qualifying results in the table ------------------------------------------------------
    function displayQualifyingResults(results) {
        qualifyingTableBody.innerHTML = ''; // Clear previous results
        results.forEach(result => {
            // testing
            const driverId = result.driver.id;
            const driverName = `${result.driver.forename} ${result.driver.surname}`;
            const constructorId = result.constructor.id;
            const constructorName = result.constructor.name;
            // ----------

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${result.position}</td>
                <td><a href="#" class="driver-link" data-driver-id="${driverId}">${driverName}</a></td>
                <td><a href="#" class="constructor-link" data-constructor-id="${constructorId}">${constructorName}</a></td>
                <td>${result.q1 || 'N/A'}</td>
                <td>${result.q2 || 'N/A'}</td>
                <td>${result.q3 || 'N/A'}</td>
            `;
            qualifyingTableBody.appendChild(tr);
        });

        initializePopups();
    }

    // Display race results in the table ------------------------------------------------------------
    function displayRaceResults(results) {
        resultsTableBody.innerHTML = ''; // Clear previous results
        results.forEach(result => {

            //testing
            const driverId = result.driver.id;
            const driverName = `${result.driver.forename} ${result.driver.surname}`;
            const constructorId = result.constructor.id;
            const constructorName = result.constructor.name;
            // ----------

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${result.position}</td>
                <td><a href="#" class="driver-link" data-driver-id="${driverId}">${driverName}</a></td>
                <td><a href="#" class="constructor-link" data-constructor-id="${constructorId}">${constructorName}</a></td>
                <td>${result.laps}</td>
                <td>${result.points}</td>
            `;
            resultsTableBody.appendChild(tr);
        });
        
        initializePopups();
    }

    // Quick function for POPUPS (for driver and contructor popups) -----------------------------------
    function initializePopups() {
        driverLink();
        constructorLink();
    }

    // Function for Driver link for POPUP
    function driverLink() {
        const driverLinks = document.querySelectorAll('.driver-link');
        const driversData = JSON.parse(localStorage.getItem('drivers_data')) || [];
    
        driverLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
    
                const driverId = parseInt(link.dataset.driverId);
                const driver = driversData.find(d => d.driverId === driverId);
    
                if (driver) {
                    openDriverPopup(driver);
                } else {
                    console.error('Driver not found:', driverId);
                }
            });
        });
    }

    // Function for Contructor link for POPUP
    function constructorLink() {
        const constructorLinks = document.querySelectorAll('.constructor-link');
        const constructorsData = JSON.parse(localStorage.getItem('constructors_data')) || [];

        constructorLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const constructorId = parseInt(link.dataset.constructorId);
                const constructor = constructorsData.find(c => c.constructorId === constructorId);

                if (constructor) {
                    openConstructorPopup(constructor);
                } else {
                    console.error('Constructor not found');
                }
            });
        });
    }

    // Fetch both race results and qualifying results for a specific race ----------------------------
    function fetchRaceAndQualifyingResults(raceId) {
        const raceUrl = `https://www.randyconnolly.com/funwebdev/3rd/api/f1/results.php?race=${raceId}`;
        const qualifyingUrl = `https://www.randyconnolly.com/funwebdev/3rd/api/f1/qualifying.php?race=${raceId}`;

        Promise.all([
            fetch(raceUrl).then(res => res.json()), 
            fetch(qualifyingUrl).then(res => res.json())
        ])
        .then(([raceResults, qualifyingResults]) => {
            const sortedRaceResults = raceResults.sort((a, b) => a.position - b.position); // Sort race results
            const sortedQualifyingResults = qualifyingResults.sort((a, b) => a.position - b.position); // Sort qualifying
            displayRaceResults(sortedRaceResults);
            displayQualifyingResults(sortedQualifyingResults);
        }) 
        .catch(error => console.error('Error fetching results:', error));
    }


    // Integrate sorting function (with inicators) --------------------------------------------------
    function integrateSort(tableId, tableBody) {
        const table = document.querySelector(`#${tableId}`);
        const headers = table.querySelectorAll('thead th');

        headers.forEach((header, columnIndex) => {
            header.addEventListener('click', () => {
                const isAscending = header.dataset.order === 'asc';
                const newOrder = isAscending ? 'desc' : 'asc';

                // reset headers
                headers.forEach(header => header.classList.remove('asc', 'desc'));
                header.dataset.order = newOrder;
                header.classList.add(newOrder);

                // update with sorted table
                updateSortedTable(tableBody, columnIndex, newOrder);
            });
        });
    }

    // Updated sorting function
    function updateSortedTable(tableBody, columnIndex, order) {
        const rows = Array.from(tableBody.querySelectorAll('tr'));
        const compare = rows.sort((rowA, rowB) => {
            const cellA = rowA.children[columnIndex].textContent.trim();
            const cellB = rowB.children[columnIndex].textContent.trim();
            if (!isNaN(cellA) && !isNaN(cellB)) {
                // numerical sorting
                return order === 'asc' ? cellA - cellB : cellB - cellA;
            } else {
                // string sorting
                return order === 'asc' ? cellA.localeCompare(cellB) : cellB.localeCompare(cellA);
            }
        });
        // append sorted rows to table 
        tableBody.innerHTML = '';
        compare.forEach(row => tableBody.appendChild(row));
    }

    // ----------------------------------------------------------------------------------------------

    // Function call to sort each table
    integrateSort('race-table', raceTableBody);
    integrateSort('qualifying-table', qualifyingTableBody);
    integrateSort('results-table', resultsTableBody);

    // Hides result tables on default
    hideResults();

    // Fetch races: default season (2023)
    fetchRaces('2023');
    preloadDetails();

    // Update races when the user selects a new season
    seasonSelect.addEventListener('change', (e) => {
        fetchRaces(e.target.value);
        hideResults(); // Hides result tables when new select option is selected
    });
});