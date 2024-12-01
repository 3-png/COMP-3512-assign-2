document.addEventListener("DOMContentLoaded", function () {
  const seasonSelect = document.querySelector('#season-select');
  const raceTableBody = document.querySelector('#raceTableBody');
  const resultsContainer = document.querySelector('#results-container');
  const raceTitle = document.querySelector('#race-title');
  const qualifyingTableBody = document.querySelector('#qualifyingTableBody');
  const resultsTableBody = document.querySelector('#resultsTableBody');

  // Fetch races for a specific season
  function fetchRaces(season) {
      const url = `https://www.randyconnolly.com/funwebdev/3rd/api/f1/races.php?season=${season}`;
      fetch(url)
          .then(response => response.json())
          .then(data => displayRaces(data))
          .catch(error => console.error('Error fetching races:', error));
  }

  // Display races in the table with clickable "Results" buttons
  function displayRaces(races) {
      raceTableBody.innerHTML = ''; // Clear existing data
      races.forEach(race => {
          const tr = document.createElement('tr');
          tr.innerHTML = `
              <td>${race.round}</td>
              <td>${race.circuit.name}</td>
              <td><button class="results-btn" data-race-id="${race.id}" data-race-name="${race.name}">Results</button></td>
          `;
          raceTableBody.appendChild(tr);
      });

      // Add event listeners to the "Results" buttons
      const resultButtons = document.querySelectorAll('.results-btn');
      resultButtons.forEach(button => {
          button.addEventListener('click', () => {
              const raceId = button.dataset.raceId;
              const raceName = button.dataset.raceName;
              raceTitle.textContent = raceName;
              fetchRaceAndQualifyingResults(raceId);
          });
      });
  }

  // Fetch both race results and qualifying results for a specific race
  function fetchRaceAndQualifyingResults(raceId) {
      const raceUrl = `https://www.randyconnolly.com/funwebdev/3rd/api/f1/results.php?race=${raceId}`;
      const qualifyingUrl = `https://www.randyconnolly.com/funwebdev/3rd/api/f1/qualifying.php?race=${raceId}`;

      Promise.all([fetch(raceUrl).then(res => res.json()), fetch(qualifyingUrl).then(res => res.json())])
          .then(([raceResults, qualifyingResults]) => {
              const sortedRaceResults = raceResults.sort((a, b) => a.position - b.position); // Sort race results
              const sortedQualifyingResults = qualifyingResults.sort((a, b) => a.position - b.position); // Sort qualifying
              displayRaceResults(sortedRaceResults);
              displayQualifyingResults(sortedQualifyingResults);
          })
          .catch(error => console.error('Error fetching results:', error));
  }

  // Display race results in the table
  function displayRaceResults(results) {
      resultsTableBody.innerHTML = ''; // Clear previous results
      results.forEach(result => {
          const tr = document.createElement('tr');
          tr.innerHTML = `
              <td>${result.position}</td>
              <td><a href="#">${result.driver.forename} ${result.driver.surname}</a></td>
              <td><a href="#">${result.constructor.name}</a></td>
              <td>${result.laps}</td>
              <td>${result.points}</td>
          `;
          resultsTableBody.appendChild(tr);
      });
  }

  // Display qualifying results in the table
  function displayQualifyingResults(results) {
      qualifyingTableBody.innerHTML = ''; // Clear previous results
      results.forEach(result => {
          const tr = document.createElement('tr');
          tr.innerHTML = `
              <td>${result.position}</td>
              <td><a href="#">${result.driver.forename} ${result.driver.surname}</a></td>
              <td><a href="#">${result.constructor.name}</a></td>
              <td>${result.q1 || 'N/A'}</td>
              <td>${result.q2 || 'N/A'}</td>
              <td>${result.q3 || 'N/A'}</td>
          `;
          qualifyingTableBody.appendChild(tr);
      });
  }

  // Fetch races for the default season (2023)
  fetchRaces('2023');

  // Update races when the user selects a new season
  seasonSelect.addEventListener('change', (e) => {
      fetchRaces(e.target.value);
  });
});