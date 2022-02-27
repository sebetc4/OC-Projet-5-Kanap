import {serverUtils, cartUtils} from './utils.js';

const colorSelect = document.querySelector('#colors');

// Gère l'affichage de l'item
const display = {
    async init() {
        let productId = this.getProductId()
        let resApi = await serverUtils.get(serverUtils.url + "/" + productId)
        if (resApi) {
            this.createItem(resApi)
            newAddUtils.init(resApi)
        }
    },

    getProductId() {
        let url = new URL(window.location.href)
        let productId = url.searchParams.get("productId")    
        return productId
    },
   
    createItem(resApi) {
        // Ajout de l'image
        let itemImg = document.createElement('img')
        itemImg.setAttribute('src', resApi.imageUrl)
        itemImg.setAttribute('alt', resApi.altTxt)
        document.querySelector('.item__img').appendChild(itemImg)

        // Ajout du titre
        document.querySelector('#title').innerHTML = resApi.name

        // Ajout du prix
        document.querySelector('#price').innerHTML = resApi.price

        // Ajout de la description
        document.querySelector('#description').innerHTML = resApi.description

        // Ajout des options de couleur
        for (let indexItemInApi = 0; indexItemInApi < resApi.colors.length; indexItemInApi++) {
            let colorItem = document.createElement('option')
            colorItem.setAttribute('value', resApi.colors[indexItemInApi])
            colorItem.innerHTML = resApi.colors[indexItemInApi]
            colorSelect.appendChild(colorItem)
        }
    }   
    
}

// Classe d'item dans le panier
class itemCart {
    constructor (_id, color, value) {
        this._id = _id;
        this.color = color;
        this.value = value;
    }
}

// Gère l'ajout au panier
const newAddUtils = {
    init(resApi) {
        document.querySelector('#addToCart').addEventListener('click', function() {
            newAddUtils.checkErrorInput(new itemCart(resApi._id, colorSelect.value, document.querySelector('#quantity').value))
        })
    },

    checkErrorInput(newAdd) {
        if (newAdd.color && 0 < parseInt(newAdd.value) && parseInt(newAdd.value) <= 100) {
            this.checkIfCartExist(newAdd)
        } else if (!newAdd.color && 0 < parseInt(newAdd.value) && parseInt(newAdd.value) <= 100) {
            alert("Veuillez entrer une couleur")
        } else if (newAdd.color && !(0 < parseInt(newAdd.value) && parseInt(newAdd.value) <= 100)) {
            alert("Veuillez entrer un nombre d'article (1-100)")
        } else if (!newAdd.color && !(0 < parseInt(newAdd.value) && parseInt(newAdd.value) <= 100)) {
            alert("Veuillez entrer un nombre d'article (1-100) et une couleur")
        }
    },

    checkIfCartExist(newAdd) {
        let cart = cartUtils.get()
        if (cart === null) {
            cart = [newAdd]
            this.endModify(cart, newAdd.value, newAdd.color)
        } else { 
            this.checkIfItemExist(newAdd, cart)
        }
    },

    checkIfItemExist(newAdd, cart) {
        let existingItem = false
        for (let indexItemInCart = 0; indexItemInCart < cart.length; indexItemInCart++) {
            if (cart[indexItemInCart]._id === newAdd._id && cart[indexItemInCart].color === newAdd.color) {
                existingItem = true
                this.modifyItem(newAdd, cart, indexItemInCart)
                break
            } 
        }
        if (!existingItem) {
            this.addItem(newAdd, cart)
        }
    },

    addItem(newAdd, cart) {
        cart.push(newAdd)
        this.endModify(cart, newAdd.value, newAdd.color)   
    },

    modifyItem(newAdd, cart, indexItemInCart) {
        let newValue = parseInt(cart[indexItemInCart].value) + parseInt(newAdd.value) 
        cart[indexItemInCart].value = newValue.toString() 
        this.endModify(cart, newAdd.value, newAdd.color)
    },
    
    endModify(cart, value, color) {
        cartUtils.set(cart)                  
        if (confirm(`Vous avez ajouté: ${value} article(s) de couleur ${color}\n\nVoulez vous aller au panier?`)) {
            document.location.href='../html/cart.html'
        }
    }
}

display.init()

