document.addEventListener("DOMContentLoaded", function () {
  const seasonSelect = document.querySelector('#season-select');
  const raceTableBody = document.querySelector('#raceTableBody');

  // Fetch races for a specific season
  function fetchRaces(season) {
      const url = `https://www.randyconnolly.com/funwebdev/3rd/api/f1/races.php?season=${season}`;
      fetch(url)
          .then(response => response.json())
          .then(data => displayRaces(data))
          .catch(error => console.error('Error fetching races:', error));
  }

  // Display races in the table
  function displayRaces(races) {
      raceTableBody.innerHTML = ''; // Clear existing data
      races.forEach(race => {
          const tr = document.createElement('tr');
          tr.innerHTML = `
              <td>${race.round}</td>
              <td>${race.name}</td>
              <td>${race.date}</td>
              <td>${race.circuit.name}</td>
          `;
          tr.dataset.raceId = race.id; // Attach race ID for potential future use
          raceTableBody.appendChild(tr);

          // Add click event for debugging or future functionality
          tr.addEventListener('click', () => {
              console.log(`Selected Race ID: ${race.id}`);
          });
      });
  }

  // Fetch races for the default season (2023)
  fetchRaces('2023');

  // Update races when the user selects a new season
  seasonSelect.addEventListener('change', (e) => {
      fetchRaces(e.target.value);
  });
}); // <-- Closing bracket for the first event listener

document.addEventListener("DOMContentLoaded", function () {
  const resultsTableBody = document.querySelector('#resultsTableBody');

  // Function to fetch race results for a specific race
  function fetchRaceResults(raceId) {
      const url = `https://www.randyconnolly.com/funwebdev/3rd/api/f1/results.php?race=${raceId}`;
      fetch(url)
          .then(response => response.json())
          .then(data => displayRaceResults(data))
          .catch(error => console.error('Error fetching race results:', error));
  }

  // Function to display race results in the table
  function displayRaceResults(results) {
      resultsTableBody.innerHTML = ''; // Clear previous results

      results.forEach(result => {
          const tr = document.createElement('tr');
          tr.innerHTML = `
              <td>${result.position}</td>
              <td>${result.driver.forename} ${result.driver.surname}</td>
              <td>${result.constructor.name}</td>
              <td>${result.laps}</td>
              <td>${result.time || 'N/A'}</td>
              <td>${result.points}</td>
          `;
          resultsTableBody.appendChild(tr);
      });
  }

  // Example usage: Fetch and display results for a specific race ID
  // Replace '1106' with a real race ID to test
   fetchRaceResults(1106);
 
});







