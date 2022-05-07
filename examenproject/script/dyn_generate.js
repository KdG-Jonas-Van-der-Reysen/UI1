let filterLijnen = [
    "filterZadelkleur;alleKleuren;zwart;bruin;grijs",
    "filterMateriaal;alleMaterialen;leer;kunstleer;kunststof",
]

class Product {
    constructor(allesInString) {
        // PRODUCT; categorie;kleur;zadelmateriaal;naam;prijs;thumb;

        // We starten op 1 omdat we "PRODUCT" negeren
        let details = allesInString.split(";");
        this._categorie = details[1];
        this._kleur = details[2];
        this._zadelmateriaal = details[3];
        this._naam = details[4];
        this._prijs = details[5];
        this._thumb = details[6];
        this._kortereNaam = details[7];
    }

    toHtml() {
        return `
        <a class="productLink ${this.kleur} ${this.zadelmateriaal}" href="detailpaginas/detail-${this.gestripteNaam}.html">
            <section class="product">
                <img src="../media/${this.thumb}" alt="Thumbnail van ${this.naam}"
                    class="productThumbnail">
                <h4 class="productName">${this.geformatteerdeNaam}</h4>
                <p class="productPrice">&euro; ${this.geformatteerdePrijs}</p>
            </section>
        </a>`;
    }

    get categorie() {
        return this._categorie;
    }

    set categorie(value) {
        this._categorie = value;
    }

    get kleur() {
        return this._kleur;
    }

    get zadelmateriaal() {
        return this._zadelmateriaal;
    }

    get naam() {
        return this._naam;
    }

    get gestripteNaam() {
        return this.naam.trim().replaceAll(" ", "").toLowerCase();
    }

    get geformatteerdeNaam() {
        let teGebruikenNaam = this.kortereNaam ? this.kortereNaam : this.naam;
        return teGebruikenNaam.trim();
    }

    set naam(value) {
        this._naam = value;
    }

    get prijs() {
        return this._prijs;
    }

    get geformatteerdePrijs() {
        return parseInt(this.prijs).toLocaleString(undefined, {
            minimumFractionDigits: 2,
        });
    }

    get thumb() {
        return this._thumb;
    }

    get kortereNaam() {
        return this._kortereNaam;
    }
}
class ProductCategorie {
    constructor(naam, title, isFirstCategory) {
        this._naam = naam;
        this._title = title;
        this._isFirstCategory = isFirstCategory;
        this._producten = [];
    }

    addProduct(product) {
        this._producten.push(product);
    }

    toHtml() {
        return `
        <section class="productCategory${this.isFirstCategory ? " no-top-margin" : ""
            }" id="${this.naam.toLowerCase()}">
            <h3 ${this.isFirstCategory ? 'class="no-top-margin"' : ""
            }>${capitalizeFirstLetter(this.title)} brommers</h3>
        </section>`;
    }

    get naam() {
        return this._naam;
    }

    set naam(value) {
        this._naam = value;
    }

    get title() {
        return this._title;
    }

    set title(value) {
        this._title = value;
    }

    get isFirstCategory() {
        return this._isFirstCategory;
    }

    set isFirstCategory(value) {
        this._isFirstCategory = value;
    }

    get producten() {
        return this._producten;
    }

    set producten(value) {
        this._producten = value;
    }
}

let producten = [];
let filters = [];
let categorieen = [];

function capitalizeFirstLetter(text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
}

function init() {
    // Knop toevoegen naar statische versie
    document.getElementById("menu").insertAdjacentHTML(
        "beforeend",
        `
    <li>
        <a href="../html/productoverzicht.html">Statische producten</a>
    </li>
    `
    );

    // Filter section toevoegen
    document.getElementById("producten").insertAdjacentHTML("beforebegin", '<section id="filter"></section>');
    // Reverse knop toevoegen
    document.getElementById("filter").insertAdjacentHTML('beforeend', `
    <button id="btnReverse">Reverse</button>
  `);
    // Reverse functie koppelen
    document.getElementById("btnReverse").addEventListener("click", reverse);

    // Data verwerken
    verwerkData();

    // Producten tonen
    toonProducten();    
}

function verwerkData() {
    eraseProducten();

    // Gegevens prepareren
    let categorieLijnen;
    let productLijnen;

    const filterSection = document.getElementById("filter");
    const productMain = document.getElementById("producten");

    // Filters
    filterLijnen.forEach((lijn) => {
        let gesplit = lijn.split(";");
        filters.push(gesplit);
    });

     // Eerst filters genereren
    // -- Titel
    filterSection.insertAdjacentHTML("beforeend", "<h2>Filter</h2>");
    filters.forEach((filter) => {
        // Reset knop
        const filterId = filter[0];
        filterSection.insertAdjacentHTML(
            "beforeend",
            `
        <section id="${filterId}" class="filterOption">
            <h3>Kies je ${filterId.substring(6).toLowerCase()}</h3>
            <label class="filterLabel" for="${filter[1]}">Toon alles</label>
        </section>
        `
        );
        productMain.insertAdjacentHTML(
            "beforeend",
            `
            <input class="hide" type="radio" name="${filterId
                .substring(6)
                .toLowerCase()}" value="${filter[1]}" id="${filter[1]}">
        `
        );

        // 3 eerste elementen van de array weggooien, hebben we niet meer nodig
        filter.shift();
        filter.shift();

        filter.forEach((waarde) => {
            document.getElementById(filterId).insertAdjacentHTML(
                "beforeend",
                `
                <label class="filterLabel" for="${waarde}">${capitalizeFirstLetter(
                    waarde
                )}</label>
            `
            );
            productMain.insertAdjacentHTML(
                "beforeend",
                `
                <input class="hide" type="radio" name="${filterId
                    .substring(6)
                    .toLowerCase()}" value="${waarde}" id="${waarde}">
            `
            );
        });
    });

    // Categorieen
    categorieLijnen = data.filter((lijn) => lijn.split(";")[0] === "CATEGORIE");

    // Producten
    productLijnen = data.filter((lijn) => lijn.split(";")[0] === "PRODUCT");

    // Producten aanmaken
    productLijnen.forEach((lijn) => {
        let product = new Product(lijn);
        producten.push(product);
    });

    // Categorieen aanmaken
    let catTeller = 0;
    categorieLijnen.forEach((lijn) => {
        let categorie = new ProductCategorie(
            lijn.split(";")[1],
            lijn.split(";")[2],
            catTeller === 0
        );
        categorieen.push(categorie);
        catTeller++;
    });

    // Producten toevoegen aan categorieen
    categorieen.forEach((categorie) => {
        producten.forEach((product) => {
            if (categorie.naam === product.categorie) {
                categorie.addProduct(product);
            }
        });
    });

    console.log(categorieen);
}
function eraseProducten() {
    // PAGINA LEEGMAKEN
    const productMain = document.getElementById("producten");
    productMain.innerHTML = "";
}
function toonProducten() {
    // Webpagina genereren
    const productMain = document.getElementById("producten");

    // Producten toevoegen aan pagina
    productMain.insertAdjacentHTML("beforeend", `<section></section>`);
    const productSection = document.querySelector("#producten>section");
    productSection.insertAdjacentHTML("beforeend", `<h2>Producten</h2>`);

    categorieen.forEach((categorie) => {
        productSection.insertAdjacentHTML("beforeend", categorie.toHtml());
        categorie.producten.forEach((product) => {
            productSection.lastElementChild.insertAdjacentHTML(
                "beforeend",
                product.toHtml()
            );
        });
    });
}
function reverse() {
    // Door categorieen heen
    categorieen.forEach((categorie) => {
        categorie.producten.reverse();
    });

    // Categorieen ook reversen
    categorieen.reverse();

    // Vertellen aan de categorieën of ze de eerste of zijn of niet
    categorieen[0].isFirstCategory = true;
    categorieen[categorieen.length - 1].isFirstCategory = false;

    // Pagina opnieuw laden
    eraseProducten();
    toonProducten();
   
}

window.addEventListener("load", init);
