//  Méthodes du serveur
const serverUtils = {
    url: "http://localhost:3000/api/products",

    /**
    * Permet de faire une requète get (Fetch)
    * @param { string } target
    * @return { Promise } reponse du serveur 
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
    * @param { string } err
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
    * @return { object } cart
    */
    get() { return JSON.parse(localStorage.getItem("cart")); },
    
    /**
    * Envoi l'item dans le localStorage
    * @param { object } cart
    */
    set(cart) { localStorage.setItem("cart", JSON.stringify(cart)); }
}

export {serverUtils, lSUtils}