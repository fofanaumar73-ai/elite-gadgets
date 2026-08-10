console.log("Elite Gadgets is ready!");
const productButtons = document.querySelectorAll(".product-btn");

productButtons.forEach(function(button) {
    button.addEventListener("click", function(event) {
        event.preventDefault();
        alert("Product selected!");
    });
});
