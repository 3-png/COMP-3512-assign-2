// Circuit popup
export function openCircuitPopup(circuitId) {
    alert(`Circuit Info: Circuit ID ${circuitId}`);
}

// Driver popup
export function openDriverPopup(driver) {

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
    popup.style.display = 'block';


    // Event listeners for the favorited (heart icon)
    const heartIcon = popup.querySelector('.heart-icon');
    heartIcon.addEventListener('click', () => {
        const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        const driverId = driver.driverId;

        if (favorites.includes(driverId)) {
            // Removes from favorites
            const index = favorites.indexOf(driverId);
            favorites.splice(index, 1);
            heartIcon.classList.remove('full-heart');
            heartIcon.classList.add('empty-heart');
        } else {
            // Adds to favorites
            favorites.push(driverId);
            heartIcon.classList.remove('empty-heart');
            heartIcon.classList.add('full-heart');
        }

        localStorage.setItem('favorites', JSON.stringify(favorites));
        updateFavoritesInTables();
    });

    // Event listener for close button 
    popup.querySelector('.close-btn').addEventListener('click', () => {
        popup.style.display = 'none';
    });
}

// Constructor popup
export function openConstructorPopup(constructor) {
    const popupContent = `
        <h1>${constructor.name}</h1>
        <h3><strong>Nationality:</strong> ${constructor.nationality}</h3>
        <p><strong>URL:</strong> ${constructor.url}</p>
    `;
    const popup = document.getElementById('popupSection');
    const popupBody = popup.querySelector('.popup-body');
    popupBody.innerHTML = popupContent;
    popup.style.display = 'block';
    popup.querySelector('.close-btn').addEventListener('click', () => {
        popup.style.display = 'none';
    });
}

// Function to update hearts in all tables
export function updateFavoritesInTables() {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const heartIcons = document.querySelectorAll('.heart-icon');

    heartIcons.forEach(icon => {
        const driverId = parseInt(icon.dataset.driverId);
        if (favorites.includes(driverId)) {
            icon.classList.add('full-heart');
            icon.classList.remove('empty-heart');
        } else {
            icon.classList.add('empty-heart');
            icon.classList.remove('full-heart');
        }
    });
}