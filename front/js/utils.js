/**
* Méthodes du serveur
*/
const serverUtils = {
    url: "http://localhost:3000/api/products",

    /**
    * Permet de faire une requète get en utilisant Fetch
    * @param { string } url
    * @return { Promise } réponse 
    */
    get(target) {
        let res = fetch(target)
            .then(function(res){
                if (res.ok){
                return res.json()
                } else {
                    this.error("Erreur de serveur: " + res.status)
                }
            })
            .then(res => res)
            .catch(err => this.error("Problème avec l'opération fetch: " + err.message))
        return res
    },

     /**
    * Gère les erreurs de get()
    * @param { string } text
    */
    error(err) {
        alert("Problème de serveur, veuillez ressayer ultérieurement.");
        console.error(err);
    }
}

const cartUtils = {
    /**
    * Récupère l'item du LocalStorage
    * @retur { string } text
    */
    get() { return JSON.parse(localStorage.getItem("cart")); },
    
    set(cart) { localStorage.setItem("cart", JSON.stringify(cart)); }
}

export {serverUtils, cartUtils}