function getUrlParam(name) {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    return urlParams.get(name)
}

function vulWaardeIn(waardeNaam) {
    const element = document.getElementById("value" + waardeNaam);
    const waarde = getUrlParam(waardeNaam.toLowerCase());

    if (waarde != null) {
        element.innerHTML = waarde;
    }
}

// Wachten tot de pagina geladen is
addEventListener("load", init);
function init() {
    vulWaardeIn("Voornaam");
    vulWaardeIn("Achternaam");
    vulWaardeIn("Email");
    vulWaardeIn("Telefoonnummer");

    document.getElementById("valueAdres").innerHTML = getUrlParam("straatnaam") + ", " + getUrlParam("postcode") + " " + getUrlParam("gemeente") + ", " + getUrlParam("land");

    vulWaardeIn("Productkeuze");
    vulWaardeIn("Snelheid");
    vulWaardeIn("Kleur");

    let opties = [];

    if (getUrlParam("cruiseControl") != null) {
        opties.push("Cruise Control");
    }

    if (getUrlParam("abs") != null) {
        opties.push("ABS");
    }

    if (getUrlParam("winterbanden") != null) {
        opties.push("winterbanden");
    }

    document.getElementById("valueExtraOpties").innerHTML =opties.join(", ")
}
