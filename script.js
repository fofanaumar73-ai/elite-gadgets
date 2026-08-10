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
    let totalQuantity = 0;

    cart.forEach(function(item, index) {

        total += item.price * item.quantity;
        totalQuantity += item.quantity;

        const cartItem = document.createElement("div");

        cartItem.className = "cart-item";

        cartItem.innerHTML = `
            <div>
                <h3>${item.name}</h3>
                <p>₦${item.price.toLocaleString()}</p>
            </div>

            <div class="quantity-controls">
                <button class="quantity-btn decrease-btn">−</button>

                <span>${item.quantity}</span>

                <button class="quantity-btn increase-btn">+</button>
            </div>

            <button class="remove-btn">
                Remove
            </button>
        `;

        const decreaseButton =
            cartItem.querySelector(".decrease-btn");

        const increaseButton =
            cartItem.querySelector(".increase-btn");

        const removeButton =
            cartItem.querySelector(".remove-btn");

        decreaseButton.addEventListener("click", function() {

            if (item.quantity > 1) {
                item.quantity--;
            } else {
                cart.splice(index, 1);
            }

            updateCart();
        });

        increaseButton.addEventListener("click", function() {
            item.quantity++;
            updateCart();
        });

        removeButton.addEventListener("click", function() {
            cart.splice(index, 1);
            updateCart();
        });

        cartItems.appendChild(cartItem);
    });

    cartTotal.textContent = total.toLocaleString();
    cartCount.textContent = totalQuantity;
}


productButtons.forEach(function(button) {

    button.addEventListener("click", function() {

        const productName = button.dataset.product;
        const productPrice = Number(button.dataset.price);

        const existingProduct = cart.find(function(item) {
            return item.name === productName;
        });

        if (existingProduct) {
            existingProduct.quantity++;
        } else {
            cart.push({
                name: productName,
                price: productPrice,
                quantity: 1
            });
        }

        updateCart();

        document.getElementById("cart").scrollIntoView({
            behavior: "smooth"
        });
    });

});


updateCart();
