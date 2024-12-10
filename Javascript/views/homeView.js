// ++++++++++++++++++++++++++++++++++++++++++
// ++++++++++++++++++++++++++++++++++++++++++
// +++ THIS IS THE MAIN CODE ++++++++++++++++
// +++ MIXED OTHER JS FILES INTO HERE +++++++
// +++ BY: SERGEI & FAIZAN ++++++++++++++++++
// ++++++++++++++++++++++++++++++++++++++++++
// ++++++++++++++++++++++++++++++++++++++++++

document.addEventListener("DOMContentLoaded", function () {
    // DOM Elements
    const seasonSelect = document.querySelector('#season-select');
    const raceTableBody = document.querySelector('#raceTableBody');
    const qualifyingTableBody = document.querySelector('#qualifyingTableBody');
    const resultsTableBody = document.querySelector('#resultsTableBody');
    const racesBtn = document.getElementById('racesBtn');
    const favoritesBtn = document.getElementById('favoritesBtn');
    const homeBtn = document.getElementById('homeBtn');
    const homeSection = document.getElementById('home-section');
    const raceSection = document.querySelector('#race-section');
    const popupSection = document.getElementById('popupSection');
    const qualifyingTitle = document.querySelector('#qualifying-title');
    const qualifyingTable = document.querySelector('#qualifying-table');
    const resultsTitle = document.querySelector('#results-title');
    const resultsTable = document.querySelector('#results-table');
    const mainContent = document.querySelector('.main-content');
    const header = document.querySelector('.header');
    const popup = document.querySelector('.popup');
    const seasonSelector = document.querySelector('.season-selector');
    const resultsSection = document.getElementById('results-section');
    const favoritesSection = document.getElementById('favorites-section');
    const video = document.querySelector('.video-box');

    const seasons = [2020, 2021, 2022, 2023];

    initializeSite();

    function initializeSite() {
        preloadSeasonData();
        preloadDetails();
        initializeView();
        addEventListeners();
    }

    // View Switching Functions
    function initializeView() {
        showHomeSection();
    }

    // Add event listeners for navigation
    function addEventListeners() {
        homeBtn.addEventListener('click', () => {
            showHomeSection();
            const sidebar = document.querySelector('.sidebar');
            sidebar.style.backgroundColor = '#ee000000';

        });

        racesBtn.addEventListener('click', () => {
            showRacesSection();
            const sidebar = document.querySelector('.sidebar');
            sidebar.style.backgroundColor = '#000000'; 
        });

        favoritesBtn.addEventListener('click', () => {
            showFavoritesSection();
            const sidebar = document.querySelector('.sidebar');
            sidebar.style.backgroundColor = '#000000'; 
        });

        // Updates races when the user selects a new season
        seasonSelect.addEventListener('change', e => {
            const selectedSeason = e.target.value;
            const localData = localStorage.getItem(`season_${selectedSeason}`);

            if (localData) {
                hideResults();
                displayRaces(JSON.parse(localData));
            } else {
                console.error("Season data not found in localStorage. This should not happen.");
            }
        });
    }

    // Switching Views functions
    function showHomeSection() {
        const sidebar = document.querySelector('.sidebar');
        sidebar.style.backgroundColor = '#ee000000';

        const sidebarLinks = document.querySelectorAll('.sidebar nav ul li a');
        sidebarLinks.forEach(link => {
            link.addEventListener('mouseover', () => {
                link.style.backgroundColor = 'transparent';

                const sLinks = document.querySelectorAll('.sidebar nav ul li a hover');
                sLinks.forEach(link => {
                    link.addEventListener('mouseover', () => {
                        link.style.color = 'rgb(70, 139, 151)';
                    });
                });
            });
        });

        hideAllSections();
    }

    function showRacesSection() {
        showAllSections();

        const sidebar = document.querySelector('.sidebar');
        sidebar.style.backgroundColor = 'black';

        const selectedSeason = seasonSelect.value;
        const localData = localStorage.getItem(`season_${selectedSeason}`);
        if (localData) {
            // popupSection.style.display = 'none';
            // console.log('Popout hidden from showRacesSection.');
            displayRaces(JSON.parse(localData));

        }
    }

    function showFavoritesSection() {
        hideForFav();
        displayFavorites();
    }

    function hideAllSections() {
        mainContent.style.overflow = "hidden";
        mainContent.style.padding = "0px";
        
        header.style.display = 'none';

        seasonSelector.style.display = 'none';
        raceSection.style.display = 'none';

        resultsSection.style.display = 'none';
        favoritesSection.style.display = 'none';
        popup.style.display = 'none';

        video.style.display = '';
    }

    function showAllSections() {
        mainContent.style.overflowY = "auto";
        mainContent.style.padding = "120px 80px 20px 80px";

        header.style.display = '';

        seasonSelector.style.display = '';
        raceSection.style.display = '';
        
        favoritesSection.style.display = 'none';

        popup.style.display = 'none';
    }

    function showTables() {
        resultsSection.style.display = '';
    }

    function hideForFav() {
        mainContent.style.display = '';
        mainContent.style.padding = '';
        
        header.style.display = '';

        seasonSelector.style.display = 'none';
        raceSection.style.display = 'none';

        resultsSection.style.display = 'none';
        favoritesSection.style.display = '';
    }

    // Data Fetching
    // let raceData = [];
    // function fetchRaces(season) {
    //     const localData = localStorage.getItem(`season_${season}`);
    //     if (localData) {
    //         try {
    //             raceData = JSON.parse(localData);
    //             if (Array.isArray(raceData) && raceData.length > 0) {
    //                 displayRaces(raceData);
    //                 return;
    //             }
    //         } catch (e) {
    //             console.error('Error parsing localStorage data:', e);
    //             localStorage.removeItem(`season_${season}`);
    //         }
    //     }
    //     fetch(`https://www.randyconnolly.com/funwebdev/3rd/api/f1/races.php?season=${season}`)
    //         .then(response => response.json())
    //         .then(data => {
    //             raceData = data;
    //             localStorage.setItem(`season_${season}`, JSON.stringify(data));
    //             displayRaces(data);
    //         })
    //         .catch(error => console.error('Error: fetching races:', error));
    // }

    // Fetch data for all seasons and store in localStorage
    function preloadSeasonData() {
        const promises = seasons.map(season => {
            const localData = localStorage.getItem(`season_${season}`);
            if (localData) return Promise.resolve();

            return fetch(`https://www.randyconnolly.com/funwebdev/3rd/api/f1/races.php?season=${season}`)
                .then(response => {
                    if (!response.ok) throw new Error(`Error fetching season ${season}: ${response.status}`);
                    return response.json();
                })
                .then(data => {
                    localStorage.setItem(`season_${season}`, JSON.stringify(data));
                })
                .catch(error => console.error(`Error preloading season ${season}:`, error));
        });

        return Promise.all(promises)
            .then(() => console.log("All season data preloaded."))
            .catch(error => console.error("Error preloading season data:", error));
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
             // Stores data in localStorage for later use
             localStorage.setItem('constructors_data', JSON.stringify(constructors));
             localStorage.setItem('drivers_data', JSON.stringify(drivers));
             localStorage.setItem('circuits_data', JSON.stringify(circuits));
        })
        .catch(error => console.error('Error preloading details:', error));
    }

    // Display Functions
    function displayRaces(races) {
        // hideAllSections();
        // const favoritesGrid = document.getElementById('favorites-grid');
        // favoritesGrid.innerHTML = '';

        raceTableBody.innerHTML = '';
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

        resultClick();
        favClick();
        initializePopups();
    }

    // Display qualifying results in the table ------------------------------------------------------
    function displayQualifyingResults(results) {
        console.log('Displaying qualifying results:', results);

        qualifyingTableBody.innerHTML = '';
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
    
        resultClick();
        favClick();
        initializePopups();
    }
    
    // Display race results in the table ------------------------------------------------------------
    function displayRaceResults(results) {
    // console.log('Displaying race results:', results);

        resultsTableBody.innerHTML = '';
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
    
        showTables();
        favClick();
        initializePopups();
    }

    // Displays Favorites page
    function displayFavorites() {
        const favoritesGrid = document.getElementById('favorites-grid');
        favoritesGrid.innerHTML = '';

        const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        const drivers = JSON.parse(localStorage.getItem('drivers_data')) || [];
        const constructors = JSON.parse(localStorage.getItem('constructors_data')) || [];
        const circuits = JSON.parse(localStorage.getItem('circuits_data')) || [];

        if (favorites.length === 0) {
            favoritesGrid.innerHTML = '<h1>No Favorites Added Yet.</h1>';
            return;
        }

        favorites.forEach(fav => {
            let favoriteItem = null;

            // Identify whatas being favorited based on the type
            if (fav.type === 'driver') {
                favoriteItem = drivers.find(driver => driver.driverId === fav.id);
            } else if (fav.type === 'constructor') {
                favoriteItem = constructors.find(constructor => constructor.constructorId === fav.id);
            } else if (fav.type === 'circuit') {
                favoriteItem = circuits.find(circuit => circuit.circuitId === fav.id);
            }

            if (favoriteItem) {
                const div = document.createElement('div');
                div.classList.add('favorites-grid-item');

                // Defining elements to display
                let title, subtitle, url, thing;

                if (fav.type === 'driver') {
                    // Driver
                    title = `${favoriteItem.forename} ${favoriteItem.surname}`;
                    subtitle = `Nationality: ${favoriteItem.nationality}`;
                    url = favoriteItem.url;
                    thing = "DRIVER";
                } else if (fav.type === 'constructor') {
                    // Constructor
                    title = favoriteItem.name;
                    subtitle = `Nationality: ${favoriteItem.nationality}`;
                    url = favoriteItem.url;
                    thing = "CONSTRUCTOR";
                } else if (fav.type === 'circuit') {
                    // Circuit
                    title = favoriteItem.name;
                    subtitle = `Location: ${favoriteItem.location}`;
                    url = favoriteItem.url;
                    thing = "CIRCUIT";
                }

                div.innerHTML = `
                    <h3>${thing}</h3>
                    <img src="https://placehold.co/200x300" alt="${title}">
                    <h3>${title}</h3>
                    <p><strong>${subtitle}</strong></p>
                    ${url ? `<a href="${url}" target="_blank">Wikipedia</a>` : ''}
                `;

                favoritesGrid.appendChild(div);
            }
        });
    }

    // Quick function for POPUPS (for driver and contructor popups) -----------------------------------
    function initializePopups() {
        driverLink();
        constructorLink();
    }

    // Function for Driver link for POPUP
    function driverLink() {
        // popupSection.style.display = 'none';
        // console.log('Popout hidden from driverLink.');

        const driverLinks = document.querySelectorAll('.driver-link');
        const driversData = JSON.parse(localStorage.getItem('drivers_data')) || [];
    
        driverLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
    
                const driverId = parseInt(link.dataset.driverId);
                const driver = driversData.find(d => d.driverId === driverId);
    
                if (driver) {
                    openDriverPopup(driver);
                    // popupSection.style.display = 'block';
                    // console.log('Popout unhidden from driverLink.');
                } else {
                    console.error('Driver not found:', driverId);
                }
            });
        });
    }

    // Function for Contructor link for POPUP
    function constructorLink() {
        // popupSection.style.display = 'none';
        // console.log('Popout hidden from constructorLink.');

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

    // Favorite Handling
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

    // Driver Popout
    function openDriverPopup(driver) {
        favClick();

        const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        const isFavorite = favorites.includes(driver.driverId);

        const popupContent = `
            <h2 class="titlePOP">${driver.forename} ${driver.surname}</h2>
            <img src="https://placehold.co/200x300" alt="Driver" class="driver-pic">
            <p><strong>Nationality:</strong> ${driver.nationality}</p>
            <p><strong>Date of Birth:</strong> ${driver.dob}</p>
            <span class="heart-icon ${isFavorite ? 'full-heart' : 'empty-heart'}" data-driver-id="${driver.driverId}"></span>
        `;

        const popup = document.getElementById('popupSection');
        const popupBody = popup.querySelector('.popup-body');
        popupBody.innerHTML = popupContent;
        popup.style.display = '';

        // Event listeners for the favorited (heart icon)
        // const heartIcon = popup.querySelector('.heart-icon');
        // heartIcon.addEventListener('click', () => {
        //     const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        //     const driverId = driver.driverId;

        //     if (favorites.includes(driverId)) {
        //         // Removes from favorites
        //         const index = favorites.indexOf(driverId);
        //         favorites.splice(index, 1);
        //         heartIcon.classList.remove('full-heart');
        //         heartIcon.classList.add('empty-heart');
        //     } else {
        //         // Adds to favorites
        //         favorites.push(driverId);
        //         heartIcon.classList.remove('empty-heart');
        //         heartIcon.classList.add('full-heart');
        //     }

            // favClick();
            localStorage.setItem('favorites', JSON.stringify(favorites));
            updateFavoritesInTables();
        // });

        // Event listener for close button 
        popup.querySelector('.close-btn').addEventListener('click', () => {
            updateFavoritesInTables();
            popup.style.display = 'none';
        });
    }

    function openConstructorPopup(constructor) {
        const popupContent = `
            <h1>${constructor.name}</h1>
            <h3><strong>Nationality:</strong> ${constructor.nationality}</h3>
            <p><strong>URL:</strong> ${constructor.url}</p>
        `;
        const popup = document.getElementById('popupSection');
        const popupBody = popup.querySelector('.popup-body');
        popupBody.innerHTML = popupContent;
        popup.style.display = '';

        popup.querySelector('.close-btn').addEventListener('click', () => {
            updateFavoritesInTables();
            popup.style.display = 'none';
        });
    }

    function updateFavoritesInTables() {
        const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        const heartIcons = document.querySelectorAll('.heart-icon');
    
        heartIcons.forEach(icon => {
            let id = null;
            let type = null;
    
            // Checks ID then sets type
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
    
            // Updates the heart icon
            if (id && type) {
                const isFavorite = favorites.some(fav => fav.id === id && fav.type === type);
                if (isFavorite) {
                    icon.classList.add('full-heart');
                    icon.classList.remove('empty-heart');
                } else {
                    icon.classList.add('empty-heart');
                    icon.classList.remove('full-heart');
                }
            }
        });
    }

    // Hide / Show
    function hideResults() {
        qualifyingTitle.style.display = 'none';
        qualifyingTable.style.display = 'none';
        console.log('Qualifying Results hidden.');

        resultsTitle.style.display = 'none';
        resultsTable.style.display = 'none';
        console.log('Qualifying Results & Race Results hidden (from hideResults).');
    }

    function showResults() {
        qualifyingTitle.style.display = 'block';
        qualifyingTable.style.display = 'table';
        resultsTitle.style.display = 'block';
        resultsTable.style.display = 'table';
        console.log('Qualifying Results and Race Results displayed.');
    }

    // Function to popput
    function openPopup(data, type) {
        const popupBody = popupSection.querySelector('.popup-body');
        popupBody.innerHTML = `
            <h2>${type === 'driver' ? `${data.forename} ${data.surname}` : data.name}</h2>
            <p>Nationality: ${data.nationality || data.location}</p>
        `;
        popupSection.style.display = 'block';
    }

    
    // Event Listeners for favorite button & results button
    function favClick() {
        const heartIcons = document.querySelectorAll('.heart-icon');
        heartIcons.forEach(icon => {
            icon.addEventListener('click', event => {
                const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        
                let id = null;
                let type = null;
        
                // Determine the type and ID
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
                    console.error('Error: Not ID/Type Found.');
                    return;
                }
        
                // Checking if already favorited
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
        
                updateFavoritesInTables();
            });
        });
    }
    
    function resultClick() {
        const resultButtons = document.querySelectorAll('.results-btn');
        resultButtons.forEach(button => {
            button.addEventListener('click', () => {
                const raceId = button.dataset.raceId;
                fetchRaceAndQualifyingResults(raceId).catch(error =>
                    console.error('Error in resultClick:', error)
                );
            });
        });
    }

    // Fetch both race results and qualifying results for a specific race ----------------------------
    function fetchRaceAndQualifyingResults(raceId) {
        const raceKey = `race_results_${raceId}`;
        const qualifyingKey = `qualifying_results_${raceId}`;
        
        const raceData = localStorage.getItem(raceKey);
        const qualifyingData = localStorage.getItem(qualifyingKey);
        
        if (raceData && qualifyingData) {
            // Use cached data from localStorage
            displayRaceResults(JSON.parse(raceData));
            displayQualifyingResults(JSON.parse(qualifyingData));
            showResults();
            return Promise.resolve();
        }
        
        const raceUrl = `https://www.randyconnolly.com/funwebdev/3rd/api/f1/results.php?race=${raceId}`;
        const qualifyingUrl = `https://www.randyconnolly.com/funwebdev/3rd/api/f1/qualifying.php?race=${raceId}`;
        
        // Fetch data if not cached
        return Promise.all([
            fetch(raceUrl).then(res => res.json()),
            fetch(qualifyingUrl).then(res => res.json())
        ])
        .then(([raceResults, qualifyingResults]) => {
            const sortedRaceResults = raceResults.sort((a, b) => a.position - b.position);
            const sortedQualifyingResults = qualifyingResults.sort((a, b) => a.position - b.position);
        
            // Cache results in localStorage
            localStorage.setItem(raceKey, JSON.stringify(sortedRaceResults));
            localStorage.setItem(qualifyingKey, JSON.stringify(sortedQualifyingResults));
        
            // Display results
            displayRaceResults(sortedRaceResults);
            displayQualifyingResults(sortedQualifyingResults);
            showResults();

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

    homeBtn.addEventListener('click', showHomeSection);
    racesBtn.addEventListener('click', showRacesSection);
    favoritesBtn.addEventListener('click', showFavoritesSection);

    // Function call to sort each table
    integrateSort('race-table', raceTableBody);
    integrateSort('qualifying-table', qualifyingTableBody);
    integrateSort('results-table', resultsTableBody);

    // Preload details into local storage and initialize the main view
    preloadDetails();
    initializeView();
});