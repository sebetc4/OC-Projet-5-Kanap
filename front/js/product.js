const server = "http://localhost:3000/api/products";

async function get(url, productId) {
    let res = await fetch(url + "/" + productId)
    let result = await res.json()
    .catch(function(err) {
        errorServer()
    });
    return result
}

function createItem(result) {
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
    const colorSelect = document.querySelector('#colors')
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

async function initItem() {
    let productId = getproductId()
    let item = await get(server, productId)
    createItem(item)
}



class itemCart {
    constructor (id, color, value) {
        this.id = id;
        this.color = color;
        this.value = value;
    }
}

document.querySelector('#addToCart').onclick = addToCart;

function addToCart() {
    let numberItem = document.querySelector('#quantity').value
    console.log(numberItem)
}

initItem()
