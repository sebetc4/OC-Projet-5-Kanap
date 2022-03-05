import {getValueInUrl} from './utils.js';

class Display {

    constructor() {
        this.orderId = getValueInUrl("orderId");
        this.displayOrderId();
    }
    
    displayOrderId() {
        document.querySelector('#orderId').innerHTML = this.orderId;
    }
}

new Display;
