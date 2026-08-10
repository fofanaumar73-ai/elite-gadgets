```javascript
document.addEventListener("DOMContentLoaded", function () {

    console.log("Elite Gadgets is ready!");

    const productButtons = document.querySelectorAll(".product-btn");
    const cartCount = document.getElementById("cart-count");
    const cartItems = document.getElementById("cart-items");
    const cartTotal = document.getElementById("cart-total");
    const checkoutButton = document.getElementById("checkout-btn");

    let cart = JSON.parse(
        localStorage.getItem("eliteGadgetsCart")
    ) || [];


    // ===============================
    // UPDATE CART
    // ===============================

    function updateCart() {

        localStorage.setItem(
            "eliteGadgetsCart",
            JSON.stringify(cart)
        );

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


        cart.forEach(function (item, index) {

            total += item.price * item.quantity;
            totalQuantity += item.quantity;


            const cartItem =
                document.createElement("div");

            cartItem.className = "cart-item";


            cartItem.innerHTML = `
                <div>
                    <h3>${item.name}</h3>
                    <p>₦${item.price.toLocaleString()}</p>
                </div>

                <div class="quantity-controls">

                    <button
                        type="button"
                        class="quantity-btn decrease-btn"
                    >
                        −
                    </button>

                    <span>${item.quantity}</span>

                    <button
                        type="button"
                        class="quantity-btn increase-btn"
                    >
                        +
                    </button>

                </div>

                <button
                    type="button"
                    class="remove-btn"
                >
                    Remove
                </button>
            `;


            // DECREASE

            cartItem
                .querySelector(".decrease-btn")
                .addEventListener("click", function () {

                    if (item.quantity > 1) {

                        item.quantity--;

                    } else {

                        cart.splice(index, 1);

                    }

                    updateCart();

                });


            // INCREASE

            cartItem
                .querySelector(".increase-btn")
                .addEventListener("click", function () {

                    item.quantity++;

                    updateCart();

                });


            // REMOVE

            cartItem
                .querySelector(".remove-btn")
                .addEventListener("click", function () {

                    cart.splice(index, 1);

                    updateCart();

                });


            cartItems.appendChild(cartItem);

        });


        cartTotal.textContent =
            total.toLocaleString();

        cartCount.textContent =
            totalQuantity;

    }



    // ===============================
    // ADD PRODUCT TO CART
    // ===============================

    productButtons.forEach(function (button) {

        button.addEventListener("click", function (event) {

            event.preventDefault();


            const productName =
                button.getAttribute("data-product");


            const productPrice =
                Number(
                    button.getAttribute("data-price")
                );


            if (!productName || !productPrice) {

                console.error(
                    "Product name or price is missing."
                );

                return;
            }


            const existingProduct =
                cart.find(function (item) {

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

    if (checkoutButton) {

        checkoutButton.addEventListener(
            "click",
            function () {

                if (cart.length === 0) {

                    alert(
                        "Your cart is empty. Please add a product first."
                    );

                    return;
                }


                const checkoutForm =
                    document.getElementById(
                        "checkout-form"
                    );


                if (checkoutForm) {

                    checkoutForm.style.display =
                        "block";

                    checkoutForm.scrollIntoView({
                        behavior: "smooth"
                    });

                }

            }
        );

    }



    // ===============================
    // PLACE ORDER
    // ===============================

    const placeOrderButton =
        document.getElementById(
            "place-order-btn"
        );


    if (placeOrderButton) {

        placeOrderButton.addEventListener(
            "click",
            function () {

                const customerName =
                    document
                        .getElementById("customer-name")
                        .value
                        .trim();


                const customerPhone =
                    document
                        .getElementById("customer-phone")
                        .value
                        .trim();


                const customerAddress =
                    document
                        .getElementById("customer-address")
                        .value
                        .trim();


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


                let orderTotal = 0;


                cart.forEach(function (item) {

                    orderTotal +=
                        item.price *
                        item.quantity;

                });


                const orderId =
                    "EG-" +
                    Date.now()
                        .toString()
                        .slice(-8);


                const order = {

                    orderId: orderId,

                    customerName: customerName,

                    customerPhone: customerPhone,

                    customerAddress: customerAddress,

                    items: [...cart],

                    total: orderTotal,

                    date: new Date().toLocaleString()

                };


                localStorage.setItem(
                    "eliteGadgetsLastOrder",
                    JSON.stringify(order)
                );


                const orderIdElement =
                    document.getElementById(
                        "order-id"
                    );


                if (orderIdElement) {

                    orderIdElement.textContent =
                        orderId;

                }


                const orderDetails =
                    document.getElementById(
                        "order-details"
                    );


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

                        ${cart.map(function (item) {

                            return `
                                <p>
                                    ${item.name}
                                    × ${item.quantity}
                                    — ₦${(
                                        item.price *
                                        item.quantity
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


                const checkoutForm =
                    document.getElementById(
                        "checkout-form"
                    );


                if (checkoutForm) {

                    checkoutForm.style.display =
                        "none";

                }


                const orderConfirmation =
                    document.querySelector(
                        ".order-confirmation"
                    );


                if (orderConfirmation) {

                    orderConfirmation.style.display =
                        "block";

                    orderConfirmation.scrollIntoView({
                        behavior: "smooth"
                    });

                }


                cart = [];

                updateCart();


                document.getElementById(
                    "customer-name"
                ).value = "";


                document.getElementById(
                    "customer-phone"
                ).value = "";


                document.getElementById(
                    "customer-address"
                ).value = "";

            }
        );

    }


    // ===============================
    // LOAD CART
    // ===============================

    updateCart();

});
```
