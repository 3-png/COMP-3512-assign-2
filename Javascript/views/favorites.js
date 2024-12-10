document.addEventListener("DOMContentLoaded", function () {
    const favoritesBtn = document.getElementById('favoritesBtn');

    if (favoritesBtn) {
        favoritesBtn.addEventListener('click', (event) => {
            event.preventDefault();
            console.log('Favorites button clicked.'); // Debugging

            showFavoritesSection();
        });
    } else {
        console.error('Favorites Nav Link Not Working.');
    }

    // Function to show Favorites section
    function showFavoritesSection() {
        const favoritesSection = document.getElementById('favorites-section');

        if (favoritesSection) {
            // Hide other sections
            document.querySelectorAll('main-section').forEach(section => {
                section.style.display = 'none';
            });

            // Hide season title, season label, and select dropdown
            const selector = document.querySelector('#season-selector');
            const select = document.querySelector('#season-select');
            const label = document.querySelector('.season-label');

            if (selector) {
                selector.style.display = 'none';
            }
            if (select) {
                select.style.display = 'none';
            }
            if (label) {
                label.style.display = 'none';
            }

            // Show Favorites section
            favoritesSection.style.display = 'block';
            console.log('Favorites section displayed!');

            // Show output/laylout
            displayFavorites();
        } else {
            console.error('Favorites section not found.');
        }
    }

    // Function to show Favorites output/layout
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

            // Identify the favorite item based on its type
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
                let title, subtitle, url;

                if (fav.type === 'driver') {
                    // Driver
                    title = `${favoriteItem.forename} ${favoriteItem.surname}`;
                    subtitle = `Nationality: ${favoriteItem.nationality}`;
                    url = favoriteItem.url;
                } else if (fav.type === 'constructor') {
                    // Constructor
                    title = favoriteItem.name;
                    subtitle = `Nationality: ${favoriteItem.nationality}`;
                    url = favoriteItem.url;
                } else if (fav.type === 'circuit') {
                    // Circuit
                    title = favoriteItem.name;
                    subtitle = `Location: ${favoriteItem.location}`;
                    url = favoriteItem.url;
                }

                div.innerHTML = `
                    <img src="https://placehold.co/200x300" alt="${title}">
                    <h3>${title}</h3>
                    <p><strong>${subtitle}</strong></p>
                    ${url ? `<a href="${url}" target="_blank">Wikipedia</a>` : ''}
                `;

                favoritesGrid.appendChild(div);
            }
        });
    }

});
