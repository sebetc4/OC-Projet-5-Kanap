import {serverUtils as servU} from './utils.js';

// Récupération des éléments du DOM
const itemsSection = document.querySelector('#items');

class Display {

    constructor() { 
        this.resApi
        this.initAll() 
    }

    async initAll() {
        this.resApi = await servU.get(servU.url)
        if (this.resApi) {
            this.initItems()
        }
    };

    initItems() {
        for (let i = 0; i < this.resApi.length; i++ ) {
            // Création du lien
            let itemLink = document.createElement('a')
            itemLink.setAttribute('href', '../html/product.html?productId=' + this.resApi[i]._id)
            
                // Création de l'article
                let itemArticle = document.createElement('article')
                itemLink.appendChild(itemArticle)
                
                // Création de l'image
                let itemImg = document.createElement('img')
                itemImg.setAttribute('src', this.resApi[i].imageUrl)
                itemImg.setAttribute('alt', this.resApi[i].altTxt)
                itemArticle.appendChild(itemImg)
                
                // Création du titre
                let itemTitle = document.createElement("h3")
                itemTitle.innerHTML = this.resApi[i].name
                itemArticle.appendChild(itemTitle)
                
                // Création du texte
                let itemText = document.createElement("p")
                itemText.innerHTML = this.resApi[i].description
                itemArticle.appendChild(itemText)

                itemsSection.appendChild(itemLink)
        }
    }
}

new Display