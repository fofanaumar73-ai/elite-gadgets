const SUPABASE_URL = "https://qimgbjtotjmhsczhfylu.supabase.co";
const SUPABASE_KEY = "sb_publishable_JTNZLbqNhUk6PQ14D6hQzg_TUgWYbkm";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

console.log("Elite Gadgets is ready!");

const productButtons =
    document.querySelectorAll(".product-btn");

const cartCount =
    document.getElementById("cart-count");

const cartItems =
    document.getElementById("cart-items");

const cartTotal =
    document.getElementById("cart-total");

const checkoutButton =
    document.getElementById("checkout-btn");


// ===============================
// LOAD SAVED CART
// ===============================

let cart =
    JSON.parse(
        localStorage.getItem("eliteGadgetsCart")
    ) || [];


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

        total +=
            item.price * item.quantity;

        totalQuantity +=
            item.quantity;


        const cartItem =
            document.createElement("div");

        cartItem.className =
            "cart-item";


        cartItem.innerHTML = `
            <div>
                <h3>${item.name}</h3>

                <p>
                    ₦${item.price.toLocaleString()}
                </p>
            </div>


            <div class="quantity-controls">

                <button
                    class="quantity-btn decrease-btn"
                >
                    −
                </button>


                <span>
                    ${item.quantity}
                </span>


                <button
                    class="quantity-btn increase-btn"
                >
                    +
                </button>

            </div>


            <button class="remove-btn">
                Remove
            </button>
        `;


        // ===============================
        // DECREASE QUANTITY
        // ===============================

        const decreaseButton =
            cartItem.querySelector(
                ".decrease-btn"
            );


        decreaseButton.addEventListener(
            "click",
            function() {

                if (item.quantity > 1) {

                    item.quantity--;

                } else {

                    cart.splice(index, 1);

                }

                updateCart();

            }
        );


        // ===============================
        // INCREASE QUANTITY
        // ===============================

        const increaseButton =
            cartItem.querySelector(
                ".increase-btn"
            );


        increaseButton.addEventListener(
            "click",
            function() {

                item.quantity++;

                updateCart();

            }
        );


        // ===============================
        // REMOVE PRODUCT
        // ===============================

        const removeButton =
            cartItem.querySelector(
                ".remove-btn"
            );


        removeButton.addEventListener(
            "click",
            function() {

                cart.splice(index, 1);

                updateCart();

            }
        );


        cartItems.appendChild(cartItem);

    });


    // ===============================
    // UPDATE TOTAL
    // ===============================

    cartTotal.textContent =
        total.toLocaleString();


    // ===============================
    // UPDATE CART COUNT
    // ===============================

    cartCount.textContent =
        totalQuantity;

}


// ===============================
// ADD PRODUCT TO CART
// ===============================

productButtons.forEach(function(button) {

    button.addEventListener(
        "click",
        function() {

            const productName =
                button.dataset.product;


            const productPrice =
                Number(button.dataset.price);


            const existingProduct =
                cart.find(function(item) {

                    return item.name ===
                        productName;

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

        }
    );

});


// ===============================
// CHECKOUT
// ===============================

checkoutButton.addEventListener(
    "click",
    function() {

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


        checkoutForm.style.display =
            "block";


        checkoutForm.scrollIntoView({

            behavior: "smooth"

        });

    }
);


// ===============================
// PLACE ORDER
// ===============================

const placeOrderButton =
    document.getElementById(
        "place-order-btn"
    );


placeOrderButton.addEventListener(
    "click",
    async function() {

        const customerName =
            document.getElementById(
                "customer-name"
            ).value.trim();


        const customerPhone =
            document.getElementById(
                "customer-phone"
            ).value.trim();


        const customerAddress =
            document.getElementById(
                "customer-address"
            ).value.trim();


        // ===============================
        // CHECK CUSTOMER DETAILS
        // ===============================

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


        // ===============================
        // CHECK CART
        // ===============================

        if (cart.length === 0) {

            alert(
                "Your cart is empty. Please add a product first."
            );

            return;
        }


        // ===============================
        // CALCULATE TOTAL
        // ===============================

        let orderTotal = 0;


        cart.forEach(function(item) {

            orderTotal +=
                item.price * item.quantity;

        });


        // ===============================
        // CREATE ORDER ID
        // ===============================

        const orderId =
            "EG-" +
            Math.floor(
                100000 +
                Math.random() * 900000
            );


        // ===============================
        // SAVE ORDER TO SUPABASE
        // ===============================

        const { data, error } =
            await supabaseClient
                .from("orders")
                .insert([
                    {
                        id: crypto.randomUUID(),

                        customer_name:
                            customerName,

                        customer_phone:
                            customerPhone,

                        customer_address:
                            customerAddress,

                        items:
                            cart,

                        total:
                            orderTotal,

                        status:
                            "pending"
                    }
                ])
                .select();


        // ===============================
        // CHECK DATABASE ERROR
        // ===============================

if (error) {

    console.error(
        "Order could not be saved:",
        error
    );

    alert(
        "Supabase Error: " +
        error.message
    );

    return;
}
        }


        console.log(
            "Order saved successfully:",
            data
        );


        // ===============================
        // CREATE ORDER ITEMS
        // ===============================

        let orderItems = "";


        cart.forEach(function(item) {

            orderItems += `
                <p>
                    <strong>
                        ${item.name}
                    </strong>

                    × ${item.quantity}

                    — ₦${(
                        item.price *
                        item.quantity
                    ).toLocaleString()}
                </p>
            `;

        });


        // ===============================
        // SHOW ORDER ID
        // ===============================

        document.getElementById(
            "order-id"
        ).textContent = orderId;


        // ===============================
        // SHOW ORDER DETAILS
        // ===============================

        document.getElementById(
            "order-details"
        ).innerHTML = `

            <p>
                <strong>
                    Customer:
                </strong>

                ${customerName}
            </p>


            <p>
                <strong>
                    Phone:
                </strong>

                ${customerPhone}
            </p>


            <p>
                <strong>
                    Delivery Address:
                </strong>

                ${customerAddress}
            </p>


            <h3>
                Order Items
            </h3>


            ${orderItems}


            <h3>
                Total:
                ₦${orderTotal.toLocaleString()}
            </h3>

        `;


        // ===============================
        // SHOW CONFIRMATION
        // ===============================

        const orderConfirmation =
            document.getElementById(
                "order-confirmation"
            );


        orderConfirmation.style.display =
            "block";


        // ===============================
        // HIDE CHECKOUT
        // ===============================

        document.getElementById(
            "checkout-form"
        ).style.display = "none";


        // ===============================
        // CLEAR CART
        // ===============================

        cart = [];

        localStorage.removeItem(
            "eliteGadgetsCart"
        );

        updateCart();


        // ===============================
        // SCROLL TO CONFIRMATION
        // ===============================

        orderConfirmation.scrollIntoView({

            behavior: "smooth"

        });

    }
);


// ===============================
// LOAD CART WHEN PAGE OPENS
// ===============================

updateCart();
