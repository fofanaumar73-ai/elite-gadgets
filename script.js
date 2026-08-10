console.log("Elite Gadgets is ready!");

const productButtons = document.querySelectorAll(".product-btn");
const cartCount = document.getElementById("cart-count");
const cartItems = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const checkoutButton = document.getElementById("checkout-btn");

// Load saved cart
let cart = JSON.parse(localStorage.getItem("eliteGadgetsCart")) || [];


// ===============================
// UPDATE CART
// ===============================

function updateCart() {

    // Save cart
    localStorage.setItem(
        "eliteGadgetsCart",
        JSON.stringify(cart)
    );

    cartItems.innerHTML = "";

    // Empty cart
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


    // Update total

    cartTotal.textContent =
        total.toLocaleString();


    // Update cart count

    cartCount.textContent =
        totalQuantity;
}



// ===============================
// ADD PRODUCT TO CART
// ===============================

productButtons.forEach(function(button) {

    button.addEventListener("click", function() {

        const productName =
            button.dataset.product;

        const productPrice =
            Number(button.dataset.price);


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


        updateCart();


        // Scroll to cart

        document.getElementById("cart").scrollIntoView({

            behavior: "smooth"

        });

    });

});



// ===============================
// CHECKOUT
// ===============================

checkoutButton.addEventListener("click", function() {

    if (cart.length === 0) {

        alert(
            "Your cart is empty. Please add a product first."
        );

        return;
    }


    const checkoutForm =
        document.getElementById("checkout-form");


    checkoutForm.style.display = "block";


    checkoutForm.scrollIntoView({

        behavior: "smooth"

    });

});



// ===============================
// PLACE ORDER
// ===============================

const placeOrderButton =
    document.getElementById("place-order-btn");


placeOrderButton.addEventListener("click", function() {

    const customerName =
        document.getElementById("customer-name").value.trim();

    const customerPhone =
        document.getElementById("customer-phone").value.trim();

    const customerAddress =
        document.getElementById("customer-address").value.trim();


    // Check customer details

    if (
        customerName === "" ||
        customerPhone === "" ||
        customerAddress === ""
    ) {

        alert(
            "Please fill in all your details before placing your order."
        );

        return;
    }


    // Create Order ID

    const orderId =
        "EG-" + Math.floor(100000 + Math.random() * 900000);


    // Calculate order total

    let orderTotal = 0;

    cart.forEach(function(item) {

        orderTotal +=
            item.price * item.quantity;

    });


    // Create order items

    let orderItems = "";

    cart.forEach(function(item) {

        orderItems += `
            <p>
                <strong>${item.name}</strong>
                × ${item.quantity}
                — ₦${(
                    item.price * item.quantity
                ).toLocaleString()}
            </p>
        `;

    });


    // Show Order ID

    document.getElementById("order-id").textContent =
        orderId;


    // Show Order Details

    document.getElementById("order-details").innerHTML = `

        <p>
            <strong>Customer:</strong>
            ${customerName}
        </p>

        <p>
            <strong>Phone:</strong>
            ${customerPhone}
        </p>

        <p>
            <strong>Delivery Address:</strong>
            ${customerAddress}
        </p>

        <h3>Order Items</h3>

        ${orderItems}

        <h3>
            Total:
            ₦${orderTotal.toLocaleString()}
        </h3>

    `;


    // Show confirmation

    const orderConfirmation =
        document.getElementById("order-confirmation");


    orderConfirmation.style.display =
        "block";


    // Hide checkout form

    document.getElementById("checkout-form").style.display =
        "none";


    // Clear cart

    cart = [];

    localStorage.removeItem("eliteGadgetsCart");

    updateCart();


    // Scroll to confirmation

    orderConfirmation.scrollIntoView({

        behavior: "smooth"

    });

});



// ===============================
// LOAD CART WHEN PAGE OPENS
// ===============================

updateCart();
