const serverUtils = {
    url: "http://localhost:3000/api/products",

    get(target) {
        let res = fetch(target)
            .then(function(res){
                if (res.ok){
                return res.json()
                } else {
                    server.error("Erreur de serveur: " + res.status)
                }
            })
            .then(res => res)
            .catch(err => server.error("Problème avec l'opération fetch: " + err.message));
        return res
    },

    error(err) {
        alert("Problème de serveur, veuillez ressayer ultérieurement.")
        console.error(err)
    }
}

const cartUtils = {
    get() {
        let cart = JSON.parse(localStorage.getItem("Cart"));
        return cart
    },
    
    set(cart) {
        localStorage.setItem("Cart", JSON.stringify(cart));
    }
}

export {serverUtils, cartUtils}