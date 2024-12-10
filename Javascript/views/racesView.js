// /* Imports */
// import { openCircuitPopup, openDriverPopup, openConstructorPopup, updateFavoritesInTables } from './popup.js';

// // DOM
// document.addEventListener("DOMContentLoaded", function () {
//     const seasonSelect = document.querySelector('#season-select');
//     const raceTableBody = document.querySelector('#raceTableBody');
//     const qualifyingTableBody = document.querySelector('#qualifyingTableBody');
//     const resultsTableBody = document.querySelector('#resultsTableBody');
//     const racesBtn = document.getElementById('.racesBtn');
    
//     // Function to show Races section
//     function showRacesSection() {
//         const racesSection = document.getElementById('race-section');
        
//         if (racesSection) {
//             document.querySelectorAll('main section').forEach(section => {
//                 section.style.display = 'none';
//             });

//             // Show season selector
//             const selector = document.querySelector('#season-selector');
//             selector.style.display = 'block';

//             // Show Races section
//             racesSection.style.display = 'block';
//             console.log('Races section displayed!');

//             // Fetch data for the current season
//             fetchRaces(seasonSelect.value);
//         } else {
//             console.error('Error: Races section not found.');
//         }
//     }

//     // Storing data in local memory -----------------------------------------------------------------
    let raceData = [];

//     // Fetching and storing the data
    function fetchRaces(season) {
        const localData = localStorage.getItem(`season_${season}`);
        if (localData) {
            try {
                raceData = JSON.parse(localData);
                if (Array.isArray(raceData) && raceData.length > 0) {
                    displayRaces(raceData);
                    return;
                }
            } catch (e) {
                console.error('Error: Getting localStorage data.', e);
                localStorage.removeItem(`season_${season}`);
            }
        }

        const url = `https://www.randyconnolly.com/funwebdev/3rd/api/f1/races.php?season=${season}`;
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Error: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                if (Array.isArray(data) && data.length > 0) {
                    raceData = data;
                    localStorage.setItem(`season_${season}`, JSON.stringify(data));
                    displayRaces(data);
                } else {
                    throw new Error('Error: Invalid API response.');
                }
            })
            .catch(error => {
                console.error('Error: Failed fetching races.', error);
                alert('Failed to fetch race data.');
            });
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

//     // Hides things
    function hideResults() {
        document.querySelector('#qualifying-title').style.display = 'none';
        document.querySelector('#qualifying-table').style.display = 'none';
        console.log('Qualifying Results hidden.');
        document.querySelector('#results-title').style.display = 'none';
        document.querySelector('#results-table').style.display = 'none';
        console.log('Race Results hidden.');
        document.querySelector('#popupSection').style.display = 'none';
        console.log('Popout hidden.');
    }

//     // Shows everything
    function showResults() {
        document.querySelector('#qualifying-title').style.display = 'block';
        document.querySelector('#qualifying-table').style.display = 'table';
        console.log('Qualifying Results displayed.');
        document.querySelector('#results-title').style.display = 'block';
        document.querySelector('#results-table').style.display = 'table';
        console.log('Race Results displayed.');
    }

//     // Display races in the table  ----------------------------------
    function displayRaces(races) {
        raceTableBody.innerHTML = ''; // Clears existing data
        const favorites = JSON.parse(localStorage.getItem('favorites')) || [];

        races.forEach(race => {
            const circuitId = race.circuit.id; 
            const isFavorite = favorites.some(fav => fav.id === circuitId && fav.type === 'circuit');

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${race.round}</td>
                <td>
                    <span class="heart-icon ${isFavorite ? 'full-heart' : 'empty-heart'}" data-circuit-id="${circuitId}"></span>
                    <a href="#" class="circuit-link" data-circuit-id="${circuitId}">${race.circuit.name}</a>
                </td>
                <td><button class="results-btn" data-race-id="${race.id}" data-race-name="${race.name}">Results</button></td>
            `;
            raceTableBody.appendChild(tr);
        });

        clickEvent();
        initializePopups();
    }

    // Display qualifying results in the table ------------------------------------------------------
    function displayQualifyingResults(results) {
        qualifyingTableBody.innerHTML = ''; // Clear previous results
        const favorites = JSON.parse(localStorage.getItem('favorites')) || [];

        results.forEach(result => {
            const driverId = result.driver.id;
            const driverName = `${result.driver.forename} ${result.driver.surname}`;
            const driverFavorite = favorites.some(fav => fav.id === driverId && fav.type === 'driver');
            const constructorId = result.constructor.id;
            const constructorName = result.constructor.name;
            const constFavorite = favorites.some(fav => fav.id === constructorId && fav.type === 'constructor');

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${result.position}</td>
                <td>
                    <span class="heart-icon ${driverFavorite ? 'full-heart' : 'empty-heart'}" data-driver-id="${driverId}"></span>
                    <a href="#" class="driver-link" data-driver-id="${driverId}">${driverName}</a>
                </td>
                <td>
                    <span class="heart-icon ${constFavorite ? 'full-heart' : 'empty-heart'}" data-constructor-id="${constructorId}"></span>
                    <a href="#" class="constructor-link" data-constructor-id="${constructorId}">${constructorName}</a>
                </td>
                <td>${result.q1 || 'N/A'}</td>
                <td>${result.q2 || 'N/A'}</td>
                <td>${result.q3 || 'N/A'}</td>
            `;
            qualifyingTableBody.appendChild(tr);
        });

        clickEvent();
        initializePopups();
    }

    // Display race results in the table ------------------------------------------------------------
    function displayRaceResults(results) {
        resultsTableBody.innerHTML = ''; // Clear previous results
        const favorites = JSON.parse(localStorage.getItem('favorites')) || [];

        results.forEach(result => {
            const driverId = result.driver.id;
            const driverName = `${result.driver.forename} ${result.driver.surname}`;
            const driverFavorite = favorites.some(fav => fav.id === driverId && fav.type === 'driver');
            const constructorId = result.constructor.id;
            const constructorName = result.constructor.name;
            const constFavorite = favorites.some(fav => fav.id === constructorId && fav.type === 'constructor');

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${result.position}</td>
                <td>
                    <span class="heart-icon ${driverFavorite ? 'full-heart' : 'empty-heart'}" data-driver-id="${driverId}"></span>
                    <a href="#" class="driver-link" data-driver-id="${driverId}">${driverName}</a>
                </td>
                <td>
                    <span class="heart-icon ${constFavorite ? 'full-heart' : 'empty-heart'}" data-constructor-id="${constructorId}"></span>
                    <a href="#" class="constructor-link" data-constructor-id="${constructorId}">${constructorName}</a>
                </td>
                <td>${result.laps}</td>
                <td>${result.points}</td>
                `;
            resultsTableBody.appendChild(tr);
        });

        clickEvent();
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
        .catch(error => console.error('Error: fetching results.', error));
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

    // Event Listeners for favorite button & results button
    function clickEvent() {
        // Favorite icons
        const heartIcons = document.querySelectorAll('.heart-icon');
        heartIcons.forEach(icon => {
            icon.addEventListener('click', makeFavorite);
        });

        // Results buttons
        const resultButtons = document.querySelectorAll('.results-btn');
        resultButtons.forEach(button => {
            button.addEventListener('click', () => {
                const raceId = button.dataset.raceId;
                fetchRaceAndQualifyingResults(raceId);
                showResults();
            });
        });
    }

//     // Toggling favorite icon
    function makeFavorite(event) {
        const icon = event.target;
        const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    
        let id = null;
        let type = null;

        if (icon.dataset.driverId) {
            id = parseInt(icon.dataset.driverId);
            type = 'driver';
        } else if (icon.dataset.circuitId) {
            id = parseInt(icon.dataset.circuitId);
            type = 'circuit';
        } else if (icon.dataset.constructorId) {
            id = parseInt(icon.dataset.constructorId);
            type = 'constructor';
        }

        if (!id || !type) {
            console.error('Error: No Id/Type Found.');
            return;
        }

        // Checking if exists
        const existingFavorite = favorites.find(fav => fav.id === id && fav.type === type);

        if (existingFavorite) {
            // Removes from favorites
            const updatedFavorites = favorites.filter(fav => !(fav.id === id && fav.type === type));
            localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
            icon.classList.remove('full-heart');
            icon.classList.add('empty-heart');
        } else {
            // Adds to favorites
            favorites.push({ id, type });
            localStorage.setItem('favorites', JSON.stringify(favorites));
            icon.classList.remove('empty-heart');
            icon.classList.add('full-heart');
        }
    }


//     // Races button event listener
//     if (racesBtn) {
//         racesBtn.addEventListener('click', (event) => {
//             event.preventDefault();
//             showRacesSection();
//         });
//     }

//     // Initial fetch
//     // preloadDetails();
//     // fetchRaces('2023');
// // });

//     // ----------------------------------------------------------------------------------------------

    // Function call to sort each table
    integrateSort('race-table', raceTableBody);
    integrateSort('qualifying-table', qualifyingTableBody);
    integrateSort('results-table', resultsTableBody);

//     // Hides result tables on default
//     hideResults();
    
    preloadDetails();

//     // Fetch races: default season (2023)
    fetchRaces('2023');

//     // Update races when the user selects a new season
//     seasonSelect.addEventListener('change', (e) => {
//         fetchRaces(e.target.value);
//         hideResults(); // Hides result tables when new select option is selected
//     });
// });