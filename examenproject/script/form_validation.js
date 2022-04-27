// Constante variabelen
const iptAchternaam = document.getElementById("iptAchternaam");
const validationAchternaam = document.getElementById("validationAchternaam");

const iptEmail = document.getElementById("iptEmail");
const validationEmail = document.getElementById("validationEmail");

const validationCompleteForm = document.getElementById("validationCompleteForm");

// Handige functies
function toonFout(htmlElement, foutmelding) {
    htmlElement.style.display = "block";
    htmlElement.innerHTML = foutmelding;
}

function verbergFout(htmlElement) {
    htmlElement.style.display = "none";
}

// Validatie functies
function valideerAchternaam() {
    if (iptAchternaam.value.trim().length < 5) {
        toonFout(validationAchternaam, "Je ingevoerde waarde is kleiner dan 5 tekens.");
        return false;
    } else {
        verbergFout(validationAchternaam);
        return true;
    }
}

function valideerEmail() {
    // Regex to match e-mail requirements
    const regex = /^([a-z0-9]+\.)+[a-z0-9]+@(student.)?kdg.be$/gi;

    // Check if the input matches the regex
    if (!regex.test(iptEmail.value)) {
        toonFout(validationEmail, "Je ingevoerde e-mail behoort niet tot het KdG domein.");
        return false;
    } else {
        verbergFout(validationEmail);
        return true;
    }
}

function valideerFormulier(event) {

    // Check of de waarden valide zijn (checkt automatisch ook of ze ingevuld zijn. Achternaam lengte is onder 5 indien leeg & email regex matcht niet indien leeg)
    let achternaamOk = valideerAchternaam();
    let emailOk = valideerEmail();
    
    if(!achternaamOk || !emailOk) {
        event.preventDefault();
        toonFout(validationCompleteForm, "Niet alle velden zijn correct ingevuld.")
    }
}

// Bij het laden van de pagina
window.addEventListener('DOMContentLoaded', () => {
    // We kleuren het veld achternaam geel
    document.getElementById("iptAchternaam").style.backgroundColor = 'yellow';

    // We kleuren het veld email oranje
    document.getElementById("iptEmail").style.backgroundColor = 'orange';

    // Achternaam valideren bij verlaten van het invoerveld
    iptAchternaam.addEventListener('focusout', valideerAchternaam);

    // Email valideren bij input
    iptEmail.addEventListener('input', valideerEmail);

    // Form submit
    document.getElementById("bestelFormulier").addEventListener("submit",valideerFormulier, false);
});



