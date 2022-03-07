import {getValueInUrl} from './utils.js';

// Class d'affichage
class Display {

    constructor() {
        this.orderId = getValueInUrl("orderId");
        this.init();
    }
    
    // Initialise l'affichage
    init() {
        document.querySelector('#orderId').innerHTML = this.orderId;
    }
}

new Display;
