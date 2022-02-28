import {serverUtils as servU, lSUtils as lSU} from './utils.js';

// Récupération des éléments du DOM
const colorSelect = document.querySelector('#colors');

// Récupération du pannier dans le localStorage
let cart = lSU.get()

//  Class d'affichage
class Display {

    constructor () {
        this.productId = this.getProductId();
        this.resApi  
        this.initAll()
    }

    async initAll() {
        this.resApi = await servU.get(servU.url + "/" + this.productId);
        if (this.resApi) {
            this.initItem()
            document.querySelector('#addToCart').addEventListener('click', () => { new Add(this) })
        }
    }

    getProductId() { 
        return (new URL(window.location.href)).searchParams.get("productId") 
    }
   
    initItem() {
        // Ajout de l'image
        let itemImg = document.createElement('img')
        itemImg.setAttribute('src', this.resApi.imageUrl)
        itemImg.setAttribute('alt', this.resApi.altTxt)
        document.querySelector('.item__img').appendChild(itemImg)

        // Ajout du titre
        document.querySelector('#title').innerHTML = this.resApi.name

        // Ajout du prix
        document.querySelector('#price').innerHTML = this.resApi.price

        // Ajout de la description
        document.querySelector('#description').innerHTML = this.resApi.description

        // Ajout des options de couleur
        for (let i = 0; i < this.resApi.colors.length; i++) {
            let colorItem = document.createElement('option')
            colorItem.setAttribute('value', this.resApi.colors[i])
            colorItem.innerHTML = this.resApi.colors[i]
            colorSelect.appendChild(colorItem)
        }
    }   
}

// Gère l'ajout au panier
class Add {

    constructor (display) {
        this._id = display.resApi._id;
        this.color = colorSelect.value;
        this.value = document.querySelector('#quantity').value;
        this.checkErrorInput()
    }

    checkErrorInput() {
        let intValue = parseInt(this.value)
        if (this.color && 0 < intValue && intValue <= 100) {
            this.checkIfCartExist()
        } else if (!this.color && 0 < intValue && intValue <= 100) {
            alert("Veuillez entrer une couleur")
        } else if (this.color && !(0 < intValue && intValue <= 100)) {
            alert("Veuillez entrer un nombre d'article (1-100)")
        } else if (!this.color && !(0 < intValue && intValue <= 100)) {
            alert("Veuillez entrer un nombre d'article (1-100) et une couleur")
        }
    }

    checkIfCartExist() {
        cart = lSU.get()
        if (cart === null) {
            cart = [this]
            this.endAdd()
        } else { 
            this.checkIfItemExist()
        }
    }

    checkIfItemExist() {
        let existingItem = false
        for (let i = 0; i < cart.length; i++) {
            if (cart[i]._id === this._id && cart[i].color === this.color) {
                existingItem = true
                this.modifyItem(i)
                break
            } 
        }
        if (!existingItem) {
            this.addItem(this)
        }
    }

    addItem() {
        cart.push(this)
        this.endAdd()   
    }

    modifyItem(i) {
        cart[i].value = (parseInt(cart[i].value) + parseInt(this.value)).toString() 
        this.endAdd()
    }
    
    endAdd() {
        lSU.set(cart)                  
        if (confirm(`Vous avez ajouté: ${this.value} article(s) de couleur ${this.color}\n\nVoulez vous aller au panier?`)) {
            document.location.href = '../html/cart.html'
        }
    }
}

new Display
