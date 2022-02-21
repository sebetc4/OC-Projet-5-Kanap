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

function addToCart() {
    let numberItem = document.querySelector('#quantity').value
    let colorItem = colorSelect.value
    let newAdd = new itemCart(item._id, colorItem, numberItem)
    modifyCart(newAdd)
}

function getCart() {
    let objLinea = localStorage.getItem("Cart");
    let cart = JSON.parse(objLinea);
    return cart
}

function setCart(cart) {
    let objLinea = JSON.stringify(cart);
    localStorage.setItem("Cart", objLinea);
}

function modifyCart(newAdd) {
    newAdd.value = parseInt(newAdd.value)
    let cart = getCart()
    if (newAdd.color && !isNaN(newAdd.value)) {
        if (cart === null) {
            cart = [newAdd]
            alert(`Vous avez ajouté: ${newAdd.value} article(s) de couleur ${newAdd.color}`)
        } else {
            for (i = 0; i < cart.length; i++) {
                if (cart[i]._id === newAdd._id && cart[i].color === newAdd.color) {
                    newValue = parseInt(cart[i].value) + newAdd.value 
                    if (newValue > 100) {
                        newValue = 100
                    }
                    cart[i].value = newValue.toString()                  
                    break
                } else {
                    cart.push(newAdd)
                    alert(`Vous avez ajouté: ${newAdd.value} article(s) de couleur ${newAdd.color}`)
                }
            }
        }
        setCart(cart) 
    } else if (!newAdd.color && !isNaN(newAdd.value)) {
        alert("Veuillez entrer une couleur")
    } else if (newAdd.color && isNaN(newAdd.value)) {
        alert("Veuillez entrer un nombre d'article")
    } else if (!newAdd.color && isNaN(newAdd.value)) {
        alert("Veuillez entrer un nombre d'article et une couleur")
    }
}

initDisplayItem()
document.querySelector('#addToCart').addEventListener('click', addToCart)

