const server = "http://localhost:3000/api/products";
const cartItemsSection = document.querySelector('#cart__items');


async function get(url) {
    let res = await fetch(url)
    let result = await res.json()
    .catch(function(err) {
        errorServer()
    });
    return result
}

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
    let objLinea = localStorage.getItem("Cart");
    let cart = JSON.parse(objLinea);
    return cart
}

async function initDisplayCart() {
    let result = await get(server)
    let cart = await getCart()
    displayCart(result, cart)
}

initDisplayCart()