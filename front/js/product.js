const server = "http://localhost:3000/api/products";
const colorSelect = document.querySelector('#colors');


// Fonctions serveur
async function getServer(url, productId) {
    try {
        let response = await fetch(url + "/" + productId)
        if (response.ok) {
            let result = await response.json()
            return result
        } else {
            errorServer(response.status)
        }
    }
    catch(e) {
        console.log(e)
    }
}

function errorServer(error) {
    alert("Problème de serveur, veuillez ressayer ultérieurement.")
    console.error('Erreur de serveur: ' + error)
}

// Fonction affichage de l'item
function getproductId() {
    let url = new URL(window.location.href)
    let productId = url.searchParams.get("productId")    
    return productId
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

async function initDisplayItem() {
    let productId = getproductId()
    let result = await getServer(server, productId)
    if (result) {
        displayItem(result)
        initButtonValid(result)
    }
}


function initButtonValid(result) {
    document.querySelector('#addToCart').addEventListener('click', function() {
        checkErrorInput(new itemCart(result._id, colorSelect.value, document.querySelector('#quantity').value))
    })
}

// Fonctions gestion du Cart
class itemCart {
    constructor (_id, color, value) {
        this._id = _id;
        this.color = color;
        this.value = value;
    }
}

function getCart() {
    let cart = JSON.parse(localStorage.getItem("Cart"));
    return cart
}

function setCart(cart) {
    localStorage.setItem("Cart", JSON.stringify(cart));
}

function checkErrorInput(newAdd) {
    if (newAdd.color && 0 < parseInt(newAdd.value) && parseInt(newAdd.value) <= 100) {
        checkCart(newAdd)
    } else if (!newAdd.color && 0 < parseInt(newAdd.value) && parseInt(newAdd.value) <= 100) {
        alert("Veuillez entrer une couleur")
    } else if (newAdd.color && !(0 < parseInt(newAdd.value) && parseInt(newAdd.value) <= 100)) {
        alert("Veuillez entrer un nombre d'article (1-100)")
    } else if (!newAdd.color && !(0 < parseInt(newAdd.value) && parseInt(newAdd.value) <= 100)) {
        alert("Veuillez entrer un nombre d'article (1-100) et une couleur")
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
    setCart(cart)                  
    if (confirm(`Vous avez ajouté: ${value} article(s) de couleur ${color}\n\nVoulez vous aller au panier?`)) {
        document.location.href='../html/cart.html'
    }
}

initDisplayItem()

