import {serverUtils} from './utils.js';
const itemsSection = document.querySelector('#items');

const display = {
    async init() {
        let resApi = await serverUtils.get(serverUtils.url)
        if (resApi) {
            this.createItems(resApi)
        }
    },

    createItems(resApi) {
        for (let indexItemInApi = 0; indexItemInApi < resApi.length; indexItemInApi++ ) {
            // Création du lien
            let itemLink = document.createElement('a')
            itemLink.setAttribute('href', '../html/product.html?productId=' + resApi[indexItemInApi]._id)
            
                // Création de l'article
                let itemArticle = document.createElement('article')
                itemLink.appendChild(itemArticle)
                
                // Création de l'image
                let itemImg = document.createElement('img')
                itemImg.setAttribute('src', resApi[indexItemInApi].imageUrl)
                itemImg.setAttribute('alt', resApi[indexItemInApi].altTxt)
                itemArticle.appendChild(itemImg)
                
                // Création du titre
                let itemTitle = document.createElement("h3")
                itemTitle.innerHTML = resApi[indexItemInApi].name
                itemArticle.appendChild(itemTitle)
                
                // Création du texte
                let itemText = document.createElement("p")
                itemText.innerHTML = resApi[indexItemInApi].description
                itemArticle.appendChild(itemText)

                itemsSection.appendChild(itemLink)
        }
    }
}


display.init()