import {serverUtils as servU, lSUtils as lSU} from './utils.js';

// Récupération des éléments du DOM
const cartItemsSection = document.querySelector('#cart__items');
const totalPriceSpan = document.querySelector('#totalPrice');
const totalQuantitySpan = document.querySelector('#totalQuantity');
const form = document.querySelector('.cart__order__form');

// Récupération du pannier dans le localStorage
let cart = lSU.get()

// Classe des Inputs
class Input {

    /**
    * @param { string } display
    * @param { object } input
    * @param { string } regExp
    * @param { string } text
    */
    constructor (display, input, regExp, text) {
        this.input = input;
        this.regExp = regExp;
        this.text = text;
        this.validValue = false;
        display.allInputs.push(this)
    }
}

// Class d'affichage
class Display {

    constructor() {
        this.resApi
        this.allInputs = []
        this.initAll()
    }

    // Initialise les composants d'affichage
    async initAll() {
        this.resApi = await servU.get(servU.url)
        if (this.resApi) {
            if (cart && cart.length != 0) {
                this.initCart()
                this.initCartInfos()
                this.initForm()
            } else {
                this.noCart()
            }
        } 
    };

    // Initialise l'affichage du panier
    initCart() {
        for (let iC = 0; iC < cart.length; iC++) {
            let iR = this.getIndexItemInResApi(iC)

            // Création de l'atricle
            let itemArticle = document.createElement('article')
            itemArticle.classList.add('cart__item')
            itemArticle.setAttribute('data-id', cart[iC]._id)
            itemArticle.setAttribute('data-color', cart[iC].color)

            // Création de la div image
            let cartItemImg = document.createElement('div')
            cartItemImg.classList.add('cart__item__img')
            let itemImg = document.createElement('img')
            itemImg.setAttribute('src', this.resApi[iR].imageUrl)
            itemImg.setAttribute('alt', this.resApi[iR].altTxt)
            cartItemImg.appendChild(itemImg)
            itemArticle.appendChild(cartItemImg)

            // Création de la div content
            let cartItemContent = document.createElement('div')
            cartItemContent.classList.add('cart__item__content')
            
            // Création de la div content description
            let cartItemContentDescription = document.createElement('div')
            cartItemContentDescription.classList.add('cart__item__content__description')

                let cartItemContentDescriptionTitle = document.createElement('h2')
                cartItemContentDescriptionTitle.innerHTML = this.resApi[iR].name
                cartItemContentDescription.appendChild(cartItemContentDescriptionTitle)

                let cartItemContentDescriptionDescription = document.createElement('p')
                cartItemContentDescriptionDescription.innerHTML = cart[iC].color
                cartItemContentDescription.appendChild(cartItemContentDescriptionDescription)

                let cartItemContentDescriptionPrice = document.createElement('p')
                cartItemContentDescriptionPrice.innerHTML = this.resApi[iR].price +"€"
                cartItemContentDescription.appendChild(cartItemContentDescriptionPrice)

            cartItemContent.appendChild(cartItemContentDescription)

            // Création de la div content settings
            let cartItemContentSettings = document.createElement('div')
            cartItemContentSettings.classList.add('cart__item__content__settings')

                let cartItemContentSettingsQuantity = document.createElement('div')
                cartItemContentSettingsQuantity.classList.add('cart__item__content__settings__quantity')
                cartItemContentSettings.appendChild(cartItemContentSettingsQuantity)

                    let cartItemContentSettingsQuantityP = document.createElement('p')
                    cartItemContentSettingsQuantityP.innerHTML = "Qté : "
                    cartItemContentSettingsQuantity.appendChild(cartItemContentSettingsQuantityP)

                    let cartItemContentSettingsQuantityInput = document.createElement('input')
                    cartItemContentSettingsQuantityInput.setAttribute('type', 'number')
                    cartItemContentSettingsQuantityInput.setAttribute('name', 'itemQuantity')
                    cartItemContentSettingsQuantityInput.setAttribute('min', '1')
                    cartItemContentSettingsQuantityInput.setAttribute('max', '100')
                    cartItemContentSettingsQuantityInput.setAttribute('value', cart[iC].value)
                    cartItemContentSettingsQuantityInput.addEventListener('change', (e) => { modifyCartUtils.initModifyValueItem(this, e, iC) })
                    cartItemContentSettingsQuantity.appendChild(cartItemContentSettingsQuantityInput)

                let cartItemContentSettingsDelete = document.createElement('div')
                cartItemContentSettingsDelete.classList.add('cart__item__content__settings__delete')

                cartItemContentSettings.appendChild(cartItemContentSettingsDelete)

                    let cartItemContentSettingsDeleteP = document.createElement('p')
                    cartItemContentSettingsDeleteP.classList.add('deleteItem')
                    cartItemContentSettingsDeleteP.innerHTML = "Supprimer"
                    cartItemContentSettingsDelete.addEventListener('click', () => { modifyCartUtils.deletItem(this, iC, itemArticle) })
                    cartItemContentSettingsDelete.appendChild(cartItemContentSettingsDeleteP)

            cartItemContent.appendChild(cartItemContentSettings)

            itemArticle.appendChild(cartItemContent)
            cartItemsSection.appendChild(itemArticle)
        }
    };

    /**
    * Récupérer l'id de l'item dans la réponse Api
    * @param { number } iC
    * @return { number }
    */
    getIndexItemInResApi (iC) {
        for (let iR = 0; iR < this.resApi.length; iR++) {
            if (this.resApi[iR]._id.includes(cart[iC]._id)) {
                return iR
            } 
        }
    };

    // Initialise l'affichage des informations du panier
    initCartInfos() {
        let totalQuantity = 0
        let totalPrice = 0
        for (let iC = 0; iC < cart.length; iC++) {
            let iR = this.getIndexItemInResApi(iC)
            totalQuantity +=  parseInt(cart[iC].value)
            totalPrice +=  parseInt(cart[iC].value) * parseInt(this.resApi[iR].price)
        }
        totalQuantitySpan.innerHTML = totalQuantity
        totalPriceSpan.innerHTML = totalPrice
    };

    // Initialise l'affichage si le panier est vide
    noCart() {
        document.querySelector('.cartAndFormContainer h1').innerHTML = "Votre panier est vide"
        document.querySelector('.cart__price').remove()
        document.querySelector('.cart__order').remove()
    };
    
    // Initialise le formulaire
    initForm() {
        // Initialisation des inputs
        new Input(this, form.firstName, /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹ '-]+$/u, "Prénom non valide (ex: <em>Jean</em>)");
        new Input(this, form.lastName, /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹ '-]+$/u, "Nom non valide (ex: <em>Dubois</em>")
        new Input(this, form.address, /^[a-zA-Z0-9àáâèéêëėïç '-.]+$/u, "Adresse non valide (ex: <em>101 Rue des Moines</em>)")
        new Input(this, form.city, /^[0-9]{5} [a-zA-Zàáâèéêëėïç '-.]+$/u, "Ville non valide (ex: <em>75017 Paris</em>)")
        new Input(this, form.email, /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/, "Adresse email non valide (ex: <em>jean-dubois@gmail.com</em>)")

        for (let i = 0; i < this.allInputs.length; i++) {
            // Vérification des inputs au chargement de la page
            if (this.allInputs[i].input.value != '') {
                formValidUtils.checkValidInput(this, this.allInputs[i].input, this.allInputs[i].regExp, this.allInputs[i].text, i)
            };
            // Vérification des inputs au changement de valeur
            this.allInputs[i].input.addEventListener('change', () => { formValidUtils.checkValidInput(this, this.allInputs[i].input, this.allInputs[i].regExp, this.allInputs[i].text, i) })
        };

        // Initailisation du bouton de commande
        form.addEventListener('submit', (e) => {
            e.preventDefault()
            if (formValidUtils.checkAllInputValid(this)) {
                new Request
            }
        })
    };
}

// Utilitaire de modification du panier
const modifyCartUtils = {

    /**
    * Supprime un article
    * @param { object } display
    * @param { number } iC
    * @param { object } itemArticle
    */
    deletItem(display, iC, itemArticle) {
        if (confirm("Voulez-vous supprimer cet article?")) {
            cart = lSU.get()
            cart.splice(iC, 1)
            lSU.set(cart)
            display.initCartInfos()
            itemArticle.remove()
            if (cart.length === 0) {
                display.noCart()
            }
        }    
    },

    /**
    * Initialise la  modification de la valeur d'un article
    * @param { object } display
    * @param { object } e
    * @param { number } iC
    */
    initModifyValueItem(display, e, iC) {
        let oldValue = e.target.defaultValue
        let newValue = e.target.value
        if (modifyCartUtils.checkErrorValue(parseInt(newValue))) {
            e.target.value = oldValue
        } else {
        e.target.defaultValue = newValue
        this.modifyValueItem(display, newValue, iC)
        }
    },

    /**
    * Vérifie si la valeur demandée est juste
    * @param { number } newValue
    * @return {boolean} 
    */
    checkErrorValue(newValue) {
        if ( 0 < newValue && newValue <= 100) {
            return false
        } else {
            alert("Veuillez entrer un nombre d'article (1-100)")
            return true
        }
    },

    /**
    * Modifie la valeur d'un article
    * @param { object } display
    * @param { string } newValue
    * @param { number } iC
    */
    modifyValueItem(display, newValue, iC){
        let cart = lSU.get()
        cart[iC].value = newValue
        lSU.set(cart)
        display.initCartInfos(display.resApi, cart)                  
    },
}

// Utilitaire de validation du formulaire
const formValidUtils = {

    /**
    * Modifie la valeur d'un article
    * @param { object } display
    * @param { string } newValue
    * @param { number } iC
    */
    checkValidInput(display, input, regExp, text, i) {
        if (regExp.test(input.value)) {
            input.style.boxShadow = '0px 0px 1px 2px #00FF00'
            input.nextElementSibling.innerHTML = ''
            display.allInputs[i].validValue = true
        } else {
            input.style.boxShadow = '0px 0px 1px 2px #fbbcbc'
            input.nextElementSibling.style.marginTop = '3px'
            input.nextElementSibling.innerHTML = text
            display.allInputs[i].validValue = false
        }
    },

    checkAllInputValid(display) {
        for (let i = 0; i < display.allInputs.length; i++) {
            if (!display.allInputs[i].validValue) {
                return false
            }
        }
        return true
    },
}

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
        this.initPost()
    }

    async initPost() {
        let resPost = await this.post()
        if (resPost) {
            document.location.href = '../html/confirmation.html?orderId=' + resPost.orderId
            localStorage.clear('cart')
        }
    };

    getProductsPost() {
        let cart = lSU.get()
        let products = []
        for (let indexItemInCart = 0; indexItemInCart < cart.length; indexItemInCart++) {
            if (!products.includes(cart[indexItemInCart]._id))
            products.push((cart[indexItemInCart]._id))
        }
        return products
    };

    post() {
        let res = fetch(servU.url + '/order', {
	        method: "POST",
	        headers: { 
                'Accept': 'application/json', 
                'Content-Type': 'application/json' 
            },
	        body: JSON.stringify(this.order)
        })
        .then(function(res){
            if (res.ok){
            return res.json()
            } else {
                servU.error("Erreur de serveur: " + res.status)
            }
        })
        .then(res => res)
        .catch(err => servU.error("Problème avec l'opération fetch: " + err.message))
        return res
    }
}

new Display