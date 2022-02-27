import {serverUtils, cartUtils} from './utils.js';

const cartItemsSection = document.querySelector('#cart__items');
const totalPriceSpan = document.querySelector('#totalPrice');
const totalQuantitySpan = document.querySelector('#totalQuantity');

const form = document.querySelector('.cart__order__form');

// Gère l'affichage du panier
const display = {
    async init() {
        let resApi = await serverUtils.get(serverUtils.url)
        if (resApi) {
            let cart = cartUtils.get()
            if (cart && cart.length != 0) {
                this.createCart(resApi, cart)
                this.createCartInfos(resApi, cart)
                formUtils.init()
            } else {
                this.noCart()
            }
        } 
    },

    createCart(resApi, cart) {
        if (cart) {
            for (let indexItemInCart = 0; indexItemInCart < cart.length; indexItemInCart++) {
                let indexItemInApi = this.getIndexItemInApi(resApi, cart, indexItemInCart)

                // Création de l'atricle
                let itemArticle = document.createElement('article')
                itemArticle.classList.add('cart__item')
                itemArticle.setAttribute('data-id', cart[indexItemInCart]._id)
                itemArticle.setAttribute('data-color', cart[indexItemInCart].color)

                // Création de la div image
                let cartItemImg = document.createElement('div')
                cartItemImg.classList.add('cart__item__img')
                let itemImg = document.createElement('img')
                itemImg.setAttribute('src', resApi[indexItemInApi].imageUrl)
                itemImg.setAttribute('alt', resApi[indexItemInApi].altTxt)
                cartItemImg.appendChild(itemImg)
                itemArticle.appendChild(cartItemImg)

                // Création de la div content
                let cartItemContent = document.createElement('div')
                cartItemContent.classList.add('cart__item__content')
                
                // Création de la div content description
                let cartItemContentDescription = document.createElement('div')
                cartItemContentDescription.classList.add('cart__item__content__description')

                    let cartItemContentDescriptionTitle = document.createElement('h2')
                    cartItemContentDescriptionTitle.innerHTML = resApi[indexItemInApi].name
                    cartItemContentDescription.appendChild(cartItemContentDescriptionTitle)

                    let cartItemContentDescriptionDescription = document.createElement('p')
                    cartItemContentDescriptionDescription.innerHTML = cart[indexItemInCart].color
                    cartItemContentDescription.appendChild(cartItemContentDescriptionDescription)

                    let cartItemContentDescriptionPrice = document.createElement('p')
                    cartItemContentDescriptionPrice.innerHTML = resApi[indexItemInApi].price +"€"
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
                        cartItemContentSettingsQuantityInput.setAttribute('value', cart[indexItemInCart].value)
                        cartItemContentSettingsQuantityInput.addEventListener('change', function() {
                            modifyCartUtils.modifyItem(this, resApi, indexItemInCart)
                        })
                        cartItemContentSettingsQuantity.appendChild(cartItemContentSettingsQuantityInput)

                    let cartItemContentSettingsDelete = document.createElement('div')
                    cartItemContentSettingsDelete.classList.add('cart__item__content__settings__delete')

                    cartItemContentSettings.appendChild(cartItemContentSettingsDelete)

                        let cartItemContentSettingsDeleteP = document.createElement('p')
                        cartItemContentSettingsDeleteP.classList.add('deleteItem')
                        cartItemContentSettingsDeleteP.innerHTML = "Supprimer"
                        cartItemContentSettingsDelete.addEventListener('click', function() {
                            modifyCartUtils.deletItem(resApi, indexItemInCart, itemArticle)
                        })
                        cartItemContentSettingsDelete.appendChild(cartItemContentSettingsDeleteP)

                cartItemContent.appendChild(cartItemContentSettings)


                itemArticle.appendChild(cartItemContent)
                cartItemsSection.appendChild(itemArticle)
            }
        } 
    },

    getIndexItemInApi (resApi, cart, indexItemInCart) {
        for (let indexItemInApi = 0; indexItemInApi < resApi.length; indexItemInApi++) {
            if (resApi[indexItemInApi]._id.includes(cart[indexItemInCart]._id)) {
                return indexItemInApi
            } 
        }
    },

    createCartInfos(resApi, cart) {
        let totalQuantity = 0
        let totalPrice = 0
        for (let indexItemInCart = 0; indexItemInCart < cart.length; indexItemInCart++) {
            let indexItemInApi = display.getIndexItemInApi(resApi, cart, indexItemInCart)
            totalQuantity +=  parseInt(cart[indexItemInCart].value)
            totalPrice +=  parseInt(cart[indexItemInCart].value) * parseInt(resApi[indexItemInApi].price)
        }
        totalQuantitySpan.innerHTML = totalQuantity
        totalPriceSpan.innerHTML = totalPrice
    },

    noCart() {
        document.querySelector('.cartAndFormContainer h1').innerHTML = "Votre panier est vide"
        document.querySelector('.cart__price').remove()
        document.querySelector('.cart__order').remove()
    }

}

const modifyCartUtils = {
    deletItem(resApi, indexItemInCart, itemArticle) {
        if (confirm("Voulez-vous supprimer cet article?")) {
            let cart = cartUtils.get()
            cart.splice(indexItemInCart, 1)
            cartUtils.set(cart)
            display.createCartInfos(resApi, cart)
            itemArticle.remove()
            if (cart.length === 0) {
                display.noCart()
            }
        }    
    },

    modifyItem(target, resApi, indexItemInCart) {
        let oldValue = target.defaultValue
        let newValue = target.value
        console.log(oldValue, newValue)

        let error = modifyCartUtils.checkErrorInput(newValue)
        if (error) {
            target.value = oldValue
        } else {
        target.defaultValue = newValue
        this.changeValueItem(resApi, newValue, indexItemInCart)
        }
    },

    checkErrorInput(newValue) {
        if ( 0 < parseInt(newValue) && parseInt(newValue) <= 100) {
            return false
        } else {
            alert("Veuillez entrer un nombre d'article (1-100)")
            return true
        }
    },

    changeValueItem(resApi, newValue, indexItemInCart){
        let cart = cartUtils.get()
        cart[indexItemInCart].value = newValue.toString() 
        cartUtils.set(cart)
        display.createCartInfos(resApi, cart)                  
    },
}

let allInputs = []

class Input {
    constructor (input, regExp, text) {
        this.input = input;
        this.regExp = regExp;
        this.text = text;
        this.validValue = false;
        allInputs.push(this)
    }
}


const formUtils = {
    init() {
        // Initialisation des inputs
        new Input(form.firstName, /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹ '-]+$/u, "Prénom non valide (ex: <em>Jean</em>)");
        new Input(form.lastName, /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹ '-]+$/u, "Nom non valide (ex: <em>Dubois</em>")
        new Input(form.address, /^[a-zA-Z0-9àáâèéêëėïç '-.]+$/u, "Adresse non valide (ex: <em>101 Rue des Moines</em>)")
        new Input(form.city, /^[0-9]{5} [a-zA-Zàáâèéêëėïç '-.]+$/u, "Ville non valide (ex: <em>75017 Paris</em>)")
        new Input(form.email, /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/, "Adresse email non valide (ex: <em>jean-dubois@gmail.com</em>)")

        for (let i = 0; i < allInputs.length; i++) {
            if (allInputs[i].input.value != '') {
                formUtils.checkValidInput(allInputs[i].input, allInputs[i].regExp, allInputs[i].text, i)
            };

            allInputs[i].input.addEventListener('change', function() {
                formUtils.checkValidInput(this, allInputs[i].regExp, allInputs[i].text, i)
            });
        };

        // Initailisation du bouton de commande
        form.addEventListener('submit', function() {
            console.log('test')
        })
    },

    checkValidInput(input, regExp, text, i) {
        if (regExp.test(input.value)) {
            input.style.boxShadow = '0px 0px 1px 2px #00FF00'
            allInputs[i].validValue = true
        } else {
            input.style.boxShadow = '0px 0px 1px 2px #fbbcbc'
            msg.innerHTML = text
            msg.style.marginTop = '3px'
            msg.style.color = '#fbbcbc'
        }
    },

    checkFormValid() {
        if (this.chekAllInputValid) {
            form.submit.style.display = 'block'
        } else {
            form.submit.style.display = 'none'
        }
    },

    chekAllInputValid() {
        for (let i = 0; i < allInputs.length; i++) {
            if (!allInputs[i].validValue) {
                return flase
            }
            return true
        }
    }
}

display.init()
