console.log("Elite Gadgets is ready!");
const productButtons = document.querySelectorAll(".product-btn");

productButtons.forEach(function(button) {
    button.addEventListener("click", function(event) {
        event.preventDefault();

        const productName = button.dataset.product;
        const productPrice = button.dataset.price;

        alert(
            "You selected: " +
            productName +
            "\nPrice: ₦" +
            Number(productPrice).toLocaleString()
        );
    });
});
