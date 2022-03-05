import {serverUtils as servU, lSUtils as lSU, getValueInUrl} from './utils.js';


// Récupération des éléments du DOM
const colorSelect = document.querySelector('#colors');


// Récupération du pannier dans le localStorage
let cart = lSU.get();


//  Classe d'affichage
class Display {

    constructor () {
        this.productId = getValueInUrl("productId");
        this.resApi;  
        this.init();
    }

    // Initialise l'affichage
    async init() {
        this.resApi = await servU.get(servU.url + "/" + this.productId);
        if (this.resApi) {
            this.displayItem();
            document.querySelector('#addToCart').addEventListener('click', () => new Add(this));
        }
    }
   
    // Modification du DOM pour ajouter l'article
    displayItem() {
        // Ajout de l'image
        let itemImg = document.createElement('img');
        itemImg.setAttribute('src', this.resApi.imageUrl);
        itemImg.setAttribute('alt', this.resApi.altTxt);
        document.querySelector('.item__img').appendChild(itemImg);

        // Ajout du titre
        document.querySelector('#title').innerHTML = this.resApi.name;

        // Ajout du prix
        document.querySelector('#price').innerHTML = this.resApi.price;

        // Ajout de la description
        document.querySelector('#description').innerHTML = this.resApi.description;

        // Ajout des options de couleur
        for (let color of this.resApi.colors) {
            let colorItem = document.createElement('option');
            colorItem.setAttribute('value', color);
            colorItem.innerHTML = color;
            colorSelect.appendChild(colorItem);
        }
    }
}


// Classe d'ajout au panier
class Add {

    constructor (display) {
        this._id = display.resApi._id;
        this.color = colorSelect.value;
        this.value = document.querySelector('#quantity').value;
        this.checkErrorInput();
    }

    // Contôle si la valeur est conforme
    checkErrorInput() {
        let intValue = parseInt(this.value);
        if (this.color && 0 < intValue && intValue <= 100) {
            this.checkIfCartExist();
        } else if (!this.color && 0 < intValue && intValue <= 100) {
            alert("Veuillez entrer une couleur");
        } else if (this.color && !(0 < intValue && intValue <= 100)) {
            alert("Veuillez entrer un nombre d'article (1-100)");
        } else if (!this.color && !(0 < intValue && intValue <= 100)) {
            alert("Veuillez entrer un nombre d'article (1-100) et une couleur");
        }
    }

    // Contrôle si un panier est présent dans le localStorage
    checkIfCartExist() {
        if (cart === null) {
            cart = [this];
            this.endAdd();
        } else { 
            this.checkIfItemExist(false, this.value);
        }
    }

    // Contrôle si l'item existe dans le panier
    checkIfItemExist() {
        let existingItem = false;
        for (let iC of cart) {
            if (iC._id === this._id && iC.color === this.color) {
                existingItem = true;
                this.modifyValueItem(iC);
                break;
            } 
        }
        if (!existingItem) {
            this.addItem();
        }
    }

    // Ajoute l'item dans le panier
    addItem() {
        cart.push(this);
        this.endAdd(false, this.value);
    }

    // Modifie la valeur de l'item
    modifyValueItem(iC) {
        if (iC.value === '100') {
            this.endAdd(true);
        } else {
            let newValue = parseInt(iC.value) + parseInt(this.value);
            if (newValue > 100) {
                newValue = (100 - this.value)
                iC.value = '100'
                this.endAdd(false, newValue);
            } else {
                iC.value = newValue.toString()
                this.endAdd(false, this.value);
            }
        }
    }
    
    // Envoi le panier dans le localStorage et affiche un message à l'utilisateur
    endAdd(maxArticle, value) {
        let sentence
        lSU.set(cart);
        if (maxArticle) {
            sentence = `Impossible d'ajouter cet article!\n\nVous avez atteint le nombre maximum d'articles pour cet item.\n\nVoulez-vous aller au panier?`
        } else {
            sentence = `Vous avez ajouté: ${value} article(s) de couleur ${this.color}\n\nVoulez-vous aller au panier?`
        }          
        if (confirm(sentence)) {
            document.location.href = '../html/cart.html';
        }
    }
}

new Display;
