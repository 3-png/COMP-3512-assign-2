// Circuit popup
export function openCircuitPopup(circuitId) {
    alert(`Circuit Info: Circuit ID ${circuitId}`);
}

// Driver popup
export function openDriverPopup(driver) {
    const popupContent = `
        <h2 class="titlePOP">${driver.forename} ${driver.surname}</h2>
        <img src="https://placehold.co/200x300" alt="Driver" class="driver-pic">
        <p><strong>Nationality:</strong> ${driver.nationality}</p>
        <p><strong>Date of Birth:</strong> ${driver.dob}</p>
    `;
    const popup = document.getElementById('popupSection');
    const popupBody = popup.querySelector('.popup-body');
    popupBody.innerHTML = popupContent;
    popup.style.display = 'block';
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
