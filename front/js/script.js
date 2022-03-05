import {serverUtils as servU} from './utils.js';


// Récupération des éléments du DOM
const itemsSection = document.querySelector('#items');


// Classe d'affichage
class Display {

    constructor() { 
        this.resApi;
        this.init();
    }

    // Initialise l'affichage
    async init() {
        this.resApi = await servU.get(servU.url);
        if (this.resApi) {
            this.displayItems();
        }
    }

    // Modification du DOM pour ajouter les articles
    displayItems() {
        for (let iR of this.resApi) {

            // Création du lien
            let itemLink = document.createElement('a');
            itemLink.setAttribute('href', '../html/product.html?productId=' + iR._id);
            
                // Création de l'article
                let itemArticle = document.createElement('article');
                itemLink.appendChild(itemArticle);
                
                // Création de l'image
                let itemImg = document.createElement('img');
                itemImg.setAttribute('src', iR.imageUrl);
                itemImg.setAttribute('alt', iR.altTxt);
                itemArticle.appendChild(itemImg);
                
                // Création du titre
                let itemTitle = document.createElement("h3");
                itemTitle.innerHTML = iR.name;
                itemArticle.appendChild(itemTitle);
                
                // Création du texte
                let itemText = document.createElement("p");
                itemText.innerHTML = iR.description;
                itemArticle.appendChild(itemText);

            itemsSection.appendChild(itemLink);
        }
    }
}


new Display;