const server = "http://localhost:3000/api/products";
const itemsSection = document.querySelector('#items');

// Fonctions server
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


// Fonctions affichage des items
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

async function InitDisplayItems() {
    let result = await getServer(server)
    if (result) {
        displayItems(result)
    }
}

InitDisplayItems()