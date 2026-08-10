console.log("Elite Gadgets is ready!");

const productButtons = document.querySelectorAll(".product-btn");
const cartCount = document.getElementById("cart-count");
const cartItems = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const checkoutButton = document.getElementById("checkout-btn");
// Load saved cart from the browser
let cart = JSON.parse(localStorage.getItem("eliteGadgetsCart")) || [];

function updateCart() {

    // Save the current cart
    localStorage.setItem(
        "eliteGadgetsCart",
        JSON.stringify(cart)
    );

    cartItems.innerHTML = "";

    // If cart is empty
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

                <button class="quantity-btn decrease-btn">
                    −
                </button>

                <span>${item.quantity}</span>

                <button class="quantity-btn increase-btn">
                    +
                </button>

            </div>

            <button class="remove-btn">
                Remove
            </button>
        `;

        // Decrease quantity
        const decreaseButton =
            cartItem.querySelector(".decrease-btn");

        decreaseButton.addEventListener("click", function() {

            if (item.quantity > 1) {

                item.quantity--;

            } else {

                cart.splice(index, 1);

            }

            updateCart();
        });


        // Increase quantity
        const increaseButton =
            cartItem.querySelector(".increase-btn");

        increaseButton.addEventListener("click", function() {

            item.quantity++;

            updateCart();
        });


        // Remove product
        const removeButton =
            cartItem.querySelector(".remove-btn");

        removeButton.addEventListener("click", function() {

            cart.splice(index, 1);

            updateCart();
        });


        cartItems.appendChild(cartItem);
    });


    // Update total price
    cartTotal.textContent = total.toLocaleString();

    // Update cart number
    cartCount.textContent = totalQuantity;
}


// Add products to cart
productButtons.forEach(function(button) {

    button.addEventListener("click", function() {

        const productName =
            button.dataset.product;

        const productPrice =
            Number(button.dataset.price);


        // Check if product already exists
        const existingProduct =
            cart.find(function(item) {

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


        // Update and save cart
        updateCart();


        // Smoothly move to cart
        document.getElementById("cart").scrollIntoView({

            behavior: "smooth"

        });

    });

});


// Display saved cart when page loads
updateCart();
checkoutButton.addEventListener("click", function() {

    if (cart.length === 0) {

        alert("Your cart is empty. Please add a product first.");

        return;
    }

    const checkoutForm = document.getElementById("checkout-form");

    checkoutForm.style.display = "block";

    checkoutForm.scrollIntoView({
        behavior: "smooth"
    });

});

    if (cart.length === 0) {

        alert("Your cart is empty. Please add a product first.");

        return;
    }

    alert("Checkout is ready! We will build the order process next.");

});
