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

       
     
  }

  fetchRaces('2023');
  

});

