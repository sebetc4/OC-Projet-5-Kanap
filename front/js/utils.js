//  Méthodes du serveur
const serverUtils = {
    url: "http://localhost:3000/api/products",

    /**
    * Retourne la réponse d'un requête get (fetch)
    * @param { string } target
    * @return { promise }
    */
    get(target) {
        let res = fetch(target)
            .then(function(res){
                if (res.ok) {
                    return res.json();
                } else {
                    this.error("Erreur de serveur: " + res.status);
                }
            })
            .then(res => res)
            .catch(err => this.error("Problème avec l'opération fetch: " + err.message));
        return res;
    },

    /**
    * Affiche les erreurs de get()
    * @param { string } err
    */
    error(err) {
        alert("Problème de serveur, veuillez ressayer ultérieurement.");
        console.error(err);
    }
};


// Méthodes du localStorage
const lSUtils = {
    
    /**
    * Retourne l'item du localStorage
    * @return { object } cart
    */
    get() { 
        return JSON.parse(localStorage.getItem("cart")); 
    },
    
    /**
    * Envoi l'item dans le localStorage
    * @param { object } cart
    */
    set(cart) { 
        localStorage.setItem("cart", JSON.stringify(cart)); 
    }
};


/**
* Retourne la valeur dans l'url du paramètre donné
* @param { string } param
*/
function getValueInUrl(param) { 
    return (new URL(window.location.href)).searchParams.get(param); 
}


export {serverUtils, lSUtils, getValueInUrl};