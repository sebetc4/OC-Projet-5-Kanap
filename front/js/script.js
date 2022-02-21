const server = "http://localhost:3000/api/products";
const itemsSection = document.querySelector('#items');


async function get(url) {
    let res = await fetch(url)
    let result = await res.json()
    .catch(function(err) {
        errorServer()
    });
    return result
}

function displayItems(result) {
    for (let i = 0; i < result.length; i++ ) {
        itemLink = document.createElement('a')
        itemLink.setAttribute('href', '../html/product.html?productId=' + result[i]._id)
        itemArticle = document.createElement('article')
        itemImg = document.createElement('img')
        itemImg.setAttribute('src', result[i].imageUrl)
        itemImg.setAttribute('alt', result[i].altTxt)
        itemTitle = document.createElement("h3")
        itemTitle.innerHTML = result[i].name
        itemText = document.createElement("p")
        itemText.innerHTML = result[i].description

        itemArticle.appendChild(itemImg)
        itemArticle.appendChild(itemTitle)
        itemArticle.appendChild(itemText)
        itemLink.appendChild(itemArticle)
        itemsSection.appendChild(itemLink)
    }
}

function errorServer() {
    alert("Problème de serveur, veuillez ressayer ultérieurement.")
}

async function InitDisplayItems() {
    let result = await get(server)
    displayItems(result)
}

InitDisplayItems()