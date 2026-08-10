console.log("Elite Gadgets is ready!");

const productButtons = document.querySelectorAll(".product-btn");
const cartCount = document.getElementById("cart-count");
const cartItems = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");

let cart = [];

function updateCart() {
    cartItems.innerHTML = "";

    if (cart.length === 0) {
        cartItems.innerHTML = `
            <p class="empty-cart">
                Your cart is currently empty.
            </p>
        `;

        cartTotal.textContent = "0";
        cartCount.textContent = "0";
        return;
    }

    let total = 0;

    cart.forEach(function(item) {
        total += item.price;

        const cartItem = document.createElement("div");

        cartItem.innerHTML = `
            <h3>${item.name}</h3>
            <p>₦${item.price.toLocaleString()}</p>
        `;

        cartItems.appendChild(cartItem);
    });

    cartTotal.textContent = total.toLocaleString();
    cartCount.textContent = cart.length;
}

productButtons.forEach(function(button) {
    button.addEventListener("click", function(event) {
        event.preventDefault();

        const productName = button.dataset.product;
        const productPrice = Number(button.dataset.price);

        cart.push({
            name: productName,
            price: productPrice
        });

        updateCart();
    });
});

updateCart();
