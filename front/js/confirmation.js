const display = {
    
    init() {
        orderId = this.getOrderId()
        document.querySelector('#orderId').innerHTML = orderId
    },

    getOrderId() {
        let url = new URL(window.location.href)
        let orderId = url.searchParams.get("orderId")    
        return orderId
    }
}

display.init()
