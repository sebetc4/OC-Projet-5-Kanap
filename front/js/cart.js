import {serverUtils as servU, lSUtils as lSU} from './utils.js';


// Récupération des éléments du DOM
const cartItemsSection = document.querySelector('#cart__items');
const totalPriceSpan = document.querySelector('#totalPrice');
const totalQuantitySpan = document.querySelector('#totalQuantity');
const form = document.querySelector('.cart__order__form');


// Récupération du pannier dans le localStorage
let cart = lSU.get()

// Class d'affichage
class Display {

    constructor() {
        this.resApi;
        this.init();
    }

    // Initialise l'affichage
    async init() {
        this.resApi = await servU.get(servU.url);
        if (this.resApi) {
            if (cart && cart.length !== 0) {
                this.displayCart();
                this.displayCartInfos();
                new Form(this)
            } else {
                this.displayNoCart();
            }
        } else {
            this.displayNoCart();
        }
    }

    // Modification du DOM pour ajouter le panier
    displayCart() {
        for (let iC of cart) {
            let iR = this.getItemInResApi(iC);

            // Création de l'atricle
            let itemArticle = document.createElement('article');
            itemArticle.classList.add('cart__item');
            itemArticle.setAttribute('data-id', iC._id);
            itemArticle.setAttribute('data-color', iC.color);

            // Création de la div image
            let cartItemImg = document.createElement('div');
            cartItemImg.classList.add('cart__item__img');
            let itemImg = document.createElement('img');
            itemImg.setAttribute('src', iR.imageUrl);
            itemImg.setAttribute('alt', iR.altTxt);
            cartItemImg.appendChild(itemImg);
            itemArticle.appendChild(cartItemImg);

            // Création de la div content
            let cartItemContent = document.createElement('div');
            cartItemContent.classList.add('cart__item__content');
            
            // Création de la div content description
            let cartItemContentDescription = document.createElement('div');
            cartItemContentDescription.classList.add('cart__item__content__description');

                let cartItemContentDescriptionTitle = document.createElement('h2');
                cartItemContentDescriptionTitle.innerHTML = iR.name;
                cartItemContentDescription.appendChild(cartItemContentDescriptionTitle);

                let cartItemContentDescriptionDescription = document.createElement('p');
                cartItemContentDescriptionDescription.innerHTML = iC.color;
                cartItemContentDescription.appendChild(cartItemContentDescriptionDescription);

                let cartItemContentDescriptionPrice = document.createElement('p');
                cartItemContentDescriptionPrice.innerHTML = iR.price +"€";
                cartItemContentDescription.appendChild(cartItemContentDescriptionPrice);

            cartItemContent.appendChild(cartItemContentDescription);

            // Création de la div content settings
            let cartItemContentSettings = document.createElement('div');
            cartItemContentSettings.classList.add('cart__item__content__settings');

                let cartItemContentSettingsQuantity = document.createElement('div');
                cartItemContentSettingsQuantity.classList.add('cart__item__content__settings__quantity');
                cartItemContentSettings.appendChild(cartItemContentSettingsQuantity);

                    let cartItemContentSettingsQuantityP = document.createElement('p');
                    cartItemContentSettingsQuantityP.innerHTML = "Qté : ";
                    cartItemContentSettingsQuantity.appendChild(cartItemContentSettingsQuantityP);

                    let cartItemContentSettingsQuantityInput = document.createElement('input');
                    cartItemContentSettingsQuantityInput.setAttribute('type', 'number');
                    cartItemContentSettingsQuantityInput.setAttribute('name', 'itemQuantity');
                    cartItemContentSettingsQuantityInput.setAttribute('min', '1');
                    cartItemContentSettingsQuantityInput.setAttribute('max', '100');
                    cartItemContentSettingsQuantityInput.setAttribute('value', iC.value);
                    cartItemContentSettingsQuantityInput.addEventListener('change', e => new ModifyItemInCart(this, iC._id, iC.color, 'modify', e) );
                    cartItemContentSettingsQuantity.appendChild(cartItemContentSettingsQuantityInput);

                let cartItemContentSettingsDelete = document.createElement('div');
                cartItemContentSettingsDelete.classList.add('cart__item__content__settings__delete');

                cartItemContentSettings.appendChild(cartItemContentSettingsDelete);

                    let cartItemContentSettingsDeleteP = document.createElement('p');
                    cartItemContentSettingsDeleteP.classList.add('deleteItem');
                    cartItemContentSettingsDeleteP.innerHTML = "Supprimer";
                    cartItemContentSettingsDelete.addEventListener('click', () => new ModifyItemInCart(this, iC._id, iC.color, 'delete', itemArticle));
                    cartItemContentSettingsDelete.appendChild(cartItemContentSettingsDeleteP);

            cartItemContent.appendChild(cartItemContentSettings);

            itemArticle.appendChild(cartItemContent);
            cartItemsSection.appendChild(itemArticle);
        } 
    }

    /**
    * Retourne l'objet (dans la réponse API) de l'item demandé
    * @param { object } iC
    * @return { object }
    */
    getItemInResApi (iC) {
        for (let iR of this.resApi) {
            if (iR._id === iC._id) {
                return iR;
            } 
        }
    }

    // Modification du DOM pour ajouter les informations du panier
    displayCartInfos() {
        let totalQuantity = 0;
        let totalPrice = 0;
        for (let iC of cart) {
            let iR = this.getItemInResApi(iC);
            totalQuantity +=  parseInt(iC.value);
            totalPrice +=  parseInt(iC.value) * parseInt(iR.price);
        }
        totalQuantitySpan.innerHTML = totalQuantity;
        totalPriceSpan.innerHTML = totalPrice;
    }

    // Modification du DOM pour afficher que le panier est vide
    displayNoCart() {
        document.querySelector('.cartAndFormContainer h1').innerHTML = "Votre panier est vide";
        document.querySelector('.cart__price').remove();
        document.querySelector('.cart__order').remove();
    }
}


// Classe des Inputs
class Input {

    /**
    * @param { object } form
    * @param { object } input
    * @param { string } regExp
    * @param { string } text
    */
    constructor (form, input, regExp, text) {
        this.input = input;
        this.regExp = regExp;
        this.text = text;
        this.validValue = false;
        form.allInputs.push(this);
    }
}


// Classe du formulaire
class Form {

    /**
    * @param { object } display
    */ 
    constructor(display) {
        this.display = display;
        this.allInputs = [];
        this.init()
    }

    // Initialise le formulaire
    init() {

        // Initialisation des inputs
        new Input(this, form.firstName, /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹ '-]{2,}$/u, "Prénom non valide (ex: <em>Jean</em>)");
        new Input(this, form.lastName, /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹ '-]{2,}$/u, "Nom non valide (ex: <em>Dubois</em>");
        new Input(this, form.address, /^[a-zA-Z0-9àáâèéêëėïç '-.]+$/u, "Adresse non valide (ex: <em>101 Rue des Moines</em>)");
        new Input(this, form.city, /^[0-9]{5} [a-zA-Zàáâèéêëėïç '-.]+$/u, "Ville non valide (ex: <em>75017 Paris</em>)");
        new Input(this, form.email, /^[a-zA-Z0-9_.-]+[@]{1}[a-zA-Z0-9_.-]+[.]{1}[a-z]{2,10}$/, "Adresse email non valide (ex: <em>jean-dubois@gmail.com</em>)");

        for (let i of this.allInputs) {
            // Vérification des inputs au chargement de la page
            if (i.input.value != '') {
                this.checkValidInput(i);
            };
            // Vérification des inputs au changement de valeur
            i.input.addEventListener('change', () => this.checkValidInput(i));
        }

        // Initailisation du bouton pour valider la commande
        form.addEventListener('submit', e => {
            e.preventDefault();
            if (this.checkAllInputValid()) {
                new Request;
            } else {
                alert("Attention, les informations que vous avez saisi ne sont pas toutes valides!")
            }
        })
    }

    /**
    * Vérifie si l'input est valide (modifie la valeur validValue de l'input)
    * @param { object } i
    */
    checkValidInput(i) {
        if (i.regExp.test(i.input.value)) {
            i.input.style.boxShadow = '0px 0px 1px 2px #00FF00';
            i.input.nextElementSibling.innerHTML = '';
            i.validValue = true;
        } else {
            i.input.style.boxShadow = '0px 0px 1px 2px #fbbcbc';
            i.input.nextElementSibling.style.marginTop = '3px';
            i.input.nextElementSibling.innerHTML = i.text;
            i.validValue = false;
        }
    }
    
    /**
    * Retourne le résultat de la vérification de tous les inputs
    * @return { boolean }
    */
    checkAllInputValid() {
        for (let input of this.allInputs) {
            if (!input.validValue) {
                return false;
            }
        }
        return true;
    }
}


// Classe de modification du panier
class ModifyItemInCart {

    /**
    * @param { object } display
    * @param { string } _id
    * @param { string } color
    * @param { string } action
    * @param { object } paramAction
    */
    constructor(display, _id, color, action, paramAction) {
        this.display = display;
        this._id = _id;
        this.color = color;
        this.index = this.getIndexInCart()
        switch (action) {
            case 'delete':
                this.itemArticle = paramAction;
                this.delete();
                break;
            case 'modify':
                this.e = paramAction;
                this.initModifyValue();
        }
    }

    
    /**
    * Retourne l'index de l'aticle dans le Cart
    * @return { number }
    */ 
    getIndexInCart() {
        for (let index in cart) {
            if (this._id === cart[index]._id && this.color === cart[index].color) {
                return index;
            }
        }
    }

    // Supprime un article
    delete() {
        if (confirm("Voulez-vous supprimer cet article?")) {
            cart.splice(this.index, 1)
            lSU.set(cart);
            this.display.displayCartInfos();
            this.itemArticle.remove();
            if (cart.length === 0) {
                this.display.displayNoCart();
            }
        }    
    }

    /**
    * Initialise la  modification de la valeur d'un article
    * @param { object } display
    * @param { object } e
    * @param { number } index
    */
    initModifyValue() {
        let oldValue = this.e.target.defaultValue;
        let newValue = this.e.target.value;
        if (this.checkValidValue(parseInt(newValue))) {
            this.e.target.defaultValue = newValue;
            this.modifyValue(newValue);
        } else {
            this.e.target.value = oldValue;
        }
    }

    /**
    * Vérifie si la valeur demandée est juste
    * @param { number } newValue
    * @return {boolean} 
    */
    checkValidValue(newValue) {
        if ( 0 < newValue && newValue <= 100) {
            return true;
        } else {
            alert("Veuillez entrer un nombre d'article (1-100)")
            return false;
        }
    }

    /**
    * Modifie la valeur d'un article
    * @param { string } newValue
    */
    modifyValue(newValue){
        cart[this.index].value = newValue
        this.display.displayCartInfos()
        lSU.set(cart)
    }
}


// Classe des requètes
class Request {

    constructor(){
        this.order = {
            contact: {
                firstName: form.firstName.value,
                lastName: form.lastName.value,
                address: form.address.value,
                city: form.city.value,
                email: form.email.value
            }, 
            products: this.getProductsPost()
        }
        this.init();
    }

    // Initialise la requète
    async init() {
        let resPost = await this.post();
        if (resPost) {
            document.location.href = '../html/confirmation.html?orderId=' + resPost.orderId
            localStorage.clear('cart');
        }
    };

    /**
    * Retourne la liste des ids des produits
    * @return { array } 
    */
    getProductsPost() {
        let products = []
        for (let iC of cart) {
            if (!products.includes(iC._id))
            products.push((iC._id));
        }
        return products;
    };

    /**
    * Retourne la réponse d'un requête post (fetch)
    * @return { promise }
    */
    post() {
        let resApi = fetch(servU.url + '/order', {
	        method: "POST",
	        headers: { 
                'Accept': 'application/json', 
                'Content-Type': 'application/json' 
            },
	        body: JSON.stringify(this.order)
        })
            .then(function(res){
                if (res.ok){
                return res.json();
                } else {
                    servU.error("Erreur de serveur: " + res.status);
                }
            })
            .catch(err => servU.error("Problème avec l'opération fetch: " + err.message))   
        return resApi;
    }
}

new Display;