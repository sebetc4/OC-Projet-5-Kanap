const server = "http://localhost:3000/api/products";
const colorSelect = document.querySelector('#colors');
let item = undefined


async function get(url, productId) {
    let res = await fetch(url + "/" + productId)
    let result = await res.json()
    .catch(function(err) {
        errorServer()
    });
    return result
}

function displayItem(result) {
    // Ajout de l'image
    itemImg = document.createElement('img')
    itemImg.setAttribute('src', result.imageUrl)
    itemImg.setAttribute('alt', result.altTxt)
    document.querySelector('.item__img').appendChild(itemImg)

    // Ajout du titre
    document.querySelector('#title').innerHTML = result.name

    // Ajout du prix
    document.querySelector('#price').innerHTML = result.price

    // Ajout de la description
    document.querySelector('#description').innerHTML = result.description

    // Ajout des options de couleur
    for (let i = 0; i < result.colors.length; i++) {
        let colorItem = document.createElement('option')
        colorItem.setAttribute('value', result.colors[i])
        colorItem.innerHTML = result.colors[i]
        colorSelect.appendChild(colorItem)
    }
}   

function errorServer() {
    alert("Problème de serveur, veuillez ressayer ultérieurement.")
}

function getproductId() {
    let url = new URL(window.location.href)
    let productId = url.searchParams.get("productId")    
    return productId
}

async function initDisplayItem() {
    let productId = getproductId()
    item = await get(server, productId)
    displayItem(item)
}

class itemCart {
    constructor (_id, color, value) {
        this._id = _id;
        this.color = color;
        this.value = value;
    }
}

function getCart() {
    let objLinea = localStorage.getItem("Cart");
    let cart = JSON.parse(localStorage.getItem("Cart"));
    return cart
}

function setCart(cart) {
    let objLinea = JSON.stringify(cart);
    localStorage.setItem("Cart", objLinea);
}

function checkErrorInput(newAdd) {
    if (newAdd.color && !isNaN(parseInt(newAdd.value))) {
        checkCart(newAdd)
    } else if (!newAdd.color && !isNaN(newAdd.value)) {
        alert("Veuillez entrer une couleur")
    } else if (newAdd.color && isNaN(newAdd.value)) {
        alert("Veuillez entrer un nombre d'article")
    } else if (!newAdd.color && isNaN(newAdd.value)) {
        alert("Veuillez entrer un nombre d'article et une couleur")
    }
}

function checkCart(newAdd) {
    let cart = getCart()
    if (cart === null) {
        cart = [newAdd]
        endModifyCart(cart, newAdd.value, newAdd.color)
    } else { 
        checkItemInCart(newAdd, cart)
    }
}

function checkItemInCart(newAdd, cart) {
    let existingItem = false
    let indexItem = undefined
    for (i = 0; i < cart.length; i++) {
        if (cart[i]._id === newAdd._id && cart[i].color === newAdd.color) {
            existingItem = true
            indexItem = i
            break
        } 
    }
    if (existingItem) {
        modifyItemInCart(newAdd, cart, indexItem)
    } else {
        addItemInCart(newAdd, cart)
    }
}

function modifyItemInCart(newAdd, cart, i) {
    newValue = parseInt(cart[i].value) + parseInt(newAdd.value) 
    cart[i].value = newValue.toString() 
    endModifyCart(cart, newAdd.value, newAdd.color)
}

function addItemInCart(newAdd, cart) {
    cart.push(newAdd)
    endModifyCart(cart, newAdd.value, newAdd.color)   
}

function endModifyCart(cart, value, color) {
    alert(`Vous avez ajouté: ${value} article(s) de couleur ${color}`)
    setCart(cart)                  
}

function addToCart() {
    checkErrorInput(new itemCart(item._id, colorSelect.value, document.querySelector('#quantity').value))
}


initDisplayItem()
document.querySelector('#addToCart').addEventListener('click', addToCart)

