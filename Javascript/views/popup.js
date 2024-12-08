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

    // event listener for close button 
    popup.querySelector('.close-btn').addEventListener('click', () => {
        popup.style.display = 'none';
    });

    // event listener for favoriting/unfavoriting
    const popupHeart = popup.querySelector('.heart-icon');
    popupHeart.addEventListener('click', () => {
        if (favorites.includes(driver.driverId)) {
            // removes from favorites
            const index = favorites.indexOf(driver.driverId);
            favorites.splice(index, 1);
            popupHeart.classList.remove('full-heart');
            popupHeart.classList.add('empty-heart');
        } else {
            // adds to favorites
            favorites.push(driver.driverId);
            popupHeart.classList.remove('empty-heart');
            popupHeart.classList.add('full-heart');
        }

        // updates localStorage
        localStorage.setItem('favorites', JSON.stringify(favorites));

        // syncs the table hearts
        updateFavoritesInTables();
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
function updateFavoritesInTables() {
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
