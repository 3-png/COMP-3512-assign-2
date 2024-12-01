// URL for F1 races
const url = 'https://www.randyconnolly.com/funwebdev/3rd/api/f1/races.php';

document.addEventListener("DOMContentLoaded", function() {
    // Get references to key elements using querySelector
    const raceList = document.querySelector('#race-list');
    const seasonSelect = document.querySelector('#season-select');

    // Fetch races when the page loads
    function fetchRaces(season) {
        const seasonUrl = `https://www.randyconnolly.com/funwebdev/3rd/api/f1/races.php?season=${season}`;
        
        fetch(seasonUrl)
            .then(resp => resp.json())
            .then(data => {
                displayRaces(data);
            })
            .catch(error => console.error('Error fetching races:', error));
    }

    // Display races in the list
    function displayRaces(races) {
        // Clear existing list items
        raceList.innerHTML = '';

        // Create list items for each race
        races.forEach(race => {
            const item = document.createElement('li');
            item.textContent = race.name;
            item.dataset.raceId = race.id; // Store race ID as a data attribute
            
            // Add click event to show race details
            item.addEventListener('click', (e) => {
                const raceId = e.target.dataset.raceId;
                showRaceDetails(raceId);
            });

            raceList.appendChild(item);
        });
    }

    // Function to show race details (placeholder)
    function showRaceDetails(raceId) {
        console.log(`Clicked race with ID: ${raceId}`);
        // TODO: Implement logic to fetch and display race details
    }

    // Initial load with default season
    fetchRaces('2023');

    // Add event listener to season selector
    seasonSelect.addEventListener('change', (e) => {
        fetchRaces(e.target.value);
    });
});












