//  Méthodes du serveur
const serverUtils = {
    url: "http://localhost:3000/api/products",

    /**
    * Permet de faire une requète get (Fetch)
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

// Méthodes du localStorage
const lSUtils = {
    
    /**
    * Récupère l'item du localStorage
    * @return { object } item
    */
    get() { return JSON.parse(localStorage.getItem("cart")); },
    
    /**
    * Envoi l'item dans le localStorage
    * @param { object } item
    */
    set(cart) { localStorage.setItem("cart", JSON.stringify(cart)); }
}

export {serverUtils, lSUtils}