```javascript
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


        // DECREASE QUANTITY

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


        // INCREASE QUANTITY

        const increaseButton =
            cartItem.querySelector(".increase-btn");

        increaseButton.addEventListener("click", function() {

            item.quantity++;

            updateCart();

        });


        // REMOVE PRODUCT

        const removeButton =
            cartItem.querySelector(".remove-btn");

        removeButton.addEventListener("click", function() {

            cart.splice(index, 1);

            updateCart();

        });


        cartItems.appendChild(cartItem);

    });


    // TOTAL PRICE

    cartTotal.textContent =
        total.toLocaleString();


    // CART COUNT

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


        // Check whether product already exists

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

        const cartSection =
            document.getElementById("cart");

        if (cartSection) {

            cartSection.scrollIntoView({
                behavior: "smooth"
            });

        }

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


    // CHECK CUSTOMER DETAILS

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


    // CALCULATE ORDER TOTAL

    let orderTotal = 0;

    cart.forEach(function(item) {

        orderTotal += item.price * item.quantity;

    });


    // GENERATE ORDER ID

    const orderId =
        "EG-" +
        Date.now().toString().slice(-8);


    // CREATE ORDER OBJECT

    const order = {

        orderId: orderId,

        customerName: customerName,

        customerPhone: customerPhone,

        customerAddress: customerAddress,

        items: [...cart],

        total: orderTotal,

        date: new Date().toLocaleString()

    };


    // SAVE ORDER LOCALLY

    localStorage.setItem(
        "eliteGadgetsLastOrder",
        JSON.stringify(order)
    );


    // DISPLAY ORDER ID

    const orderIdElement =
        document.getElementById("order-id");

    if (orderIdElement) {

        orderIdElement.textContent =
            orderId;

    }


    // DISPLAY ORDER DETAILS

    const orderDetails =
        document.getElementById("order-details");


    if (orderDetails) {

        orderDetails.innerHTML = `

            <p>
                <strong>Customer:</strong>
                ${customerName}
            </p>

            <p>
                <strong>Phone:</strong>
                ${customerPhone}
            </p>

            <p>
                <strong>Address:</strong>
                ${customerAddress}
            </p>

            <hr>

            <h3>Order Items</h3>

            ${cart.map(function(item) {

                return `
                    <p>
                        ${item.name}
                        × ${item.quantity}
                        — ₦${(
                            item.price * item.quantity
                        ).toLocaleString()}
                    </p>
                `;

            }).join("")}

            <hr>

            <p>
                <strong>Total:</strong>
                ₦${orderTotal.toLocaleString()}
            </p>

            <p>
                <strong>Date:</strong>
                ${order.date}
            </p>
        `;

    }


    // HIDE CHECKOUT FORM

    const checkoutForm =
        document.getElementById("checkout-form");

    checkoutForm.style.display = "none";


    // SHOW ORDER CONFIRMATION

    const orderConfirmation =
        document.querySelector(".order-confirmation");


    if (orderConfirmation) {

        orderConfirmation.style.display = "block";

        orderConfirmation.scrollIntoView({
            behavior: "smooth"
        });

    }


    // CLEAR CART

    cart = [];

    updateCart();


    // CLEAR CUSTOMER FORM

    document.getElementById("customer-name").value = "";
    document.getElementById("customer-phone").value = "";
    document.getElementById("customer-address").value = "";

});


// ===============================
// LOAD CART WHEN PAGE OPENS
// ===============================

updateCart();
```
