const server = "http://localhost:3000/api/products";
const cartItemsSection = document.querySelector('#cart__items');
const totalPriceSpan = document.querySelector('#totalPrice')
const totalQuantitySpan = document.querySelector('#totalQuantity')

// Fonctions serveur
async function getServer(url) {
    try {
        let response = await fetch(url)
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

// Fonction affichage du Cart
function getIndexItem (result, cart, i) {
    for (let j = 0; j < result.length; j++) {
        if (result[j]._id.includes(cart[i]._id)) {
            indexItem = j
            return indexItem            
        } 
    }
}

function displayCart(result, cart) {
    if (cart) {
        for (i = 0; i < cart.length; i++) {
            let indexItem = getIndexItem (result, cart, i)

            // Création de l'atricle
            let itemArticle = document.createElement('article')
            itemArticle.classList.add('cart__item')
            itemArticle.setAttribute('data-id', cart[i]._id)
            itemArticle.setAttribute('data-color', cart[i].color)

            // Création de la div image
            let cartItemImg = document.createElement('div')
            cartItemImg.classList.add('cart__item__img')
            let itemImg = document.createElement('img')
            itemImg.setAttribute('src', result[indexItem].imageUrl)
            itemImg.setAttribute('alt', result[indexItem].altTxt)
            cartItemImg.appendChild(itemImg)
            itemArticle.appendChild(cartItemImg)

            // Création de la div content
            let cartItemContent = document.createElement('div')
            cartItemContent.classList.add('cart__item__content')
            
            // Création de la div content description
            let cartItemContentDescription = document.createElement('div')
            cartItemContentDescription.classList.add('cart__item__content__description')

                let cartItemContentDescriptionTitle = document.createElement('h2')
                cartItemContentDescriptionTitle.innerHTML = result[indexItem].name
                cartItemContentDescription.appendChild(cartItemContentDescriptionTitle)

                let cartItemContentDescriptionDescription = document.createElement('p')
                cartItemContentDescriptionDescription.innerHTML = cart[i].color
                cartItemContentDescription.appendChild(cartItemContentDescriptionDescription)

                let cartItemContentDescriptionPrice = document.createElement('p')
                cartItemContentDescriptionPrice.innerHTML = result[indexItem].price +"€"
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
                    cartItemContentSettingsQuantityInput.setAttribute('value', cart[i].value)
                    cartItemContentSettingsQuantity.appendChild(cartItemContentSettingsQuantityInput)

                let cartItemContentSettingsDelete = document.createElement('div')
                cartItemContentSettingsDelete.classList.add('cart__item__content__settings__delete')
                cartItemContentSettingsDelete.addEventListener('click', function(i) {
                    if (confirm("Voulez-vous supprimer cet article?")) {
                        let cart = getCart()
                        cart.splice(i, 1)
                        setCart(cart)
                        displayCartInfos(result, cart)
                        itemArticle.remove()
                    }
                })
                cartItemContentSettings.appendChild(cartItemContentSettingsDelete)

                    let cartItemContentSettingsDeleteP = document.createElement('p')
                    cartItemContentSettingsDeleteP.classList.add('deleteItem')
                    cartItemContentSettingsDeleteP.innerHTML = "Supprimer"
                    cartItemContentSettingsDelete.appendChild(cartItemContentSettingsDeleteP)

            cartItemContent.appendChild(cartItemContentSettings)


            itemArticle.appendChild(cartItemContent)
            cartItemsSection.appendChild(itemArticle)
        }
    } 
}

function getCart() {
    let cart = JSON.parse(localStorage.getItem("Cart"));
    return cart
}

function setCart(cart) {
    localStorage.setItem("Cart", JSON.stringify(cart));
}

function displayCartInfos(result, cart) {
    let totalQuantity = 0
    let totalPrice = 0
    for (i = 0; i < cart.length; i++) {
        indexItem = getIndexItem(result, cart, i)
        totalQuantity +=  parseInt(cart[i].value)
        totalPrice +=  parseInt(cart[i].value) * parseInt(result[indexItem].price)
    }
    totalQuantitySpan.innerHTML = totalQuantity
    totalPriceSpan.innerHTML = totalPrice
}

async function initDisplayCart() {
    let result = await getServer(server)
    if (result) {
        let cart = getCart()
        displayCart(result, cart)
        displayCartInfos(result, cart)
    } 
}

initDisplayCart()