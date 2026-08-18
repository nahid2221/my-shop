/* =====================================================
   VENDAVIBE
   PRODUCT + CART + DETAILS + WHATSAPP ORDER
   ===================================================== */


/* =====================================================
   STORE SETTINGS
   ===================================================== */

const STORE_NAME = "VendaVibe";

/*
   IMPORTANT:
   এখানে তোমার WhatsApp Business/Personal নম্বর দেবে।

   Bangladesh country code = 880

   Example:
   01712345678
   becomes:
   8801712345678

   শুধু সংখ্যা রাখবে।
*/

const WHATSAPP_NUMBER = "8801603560026";


/* DELIVERY CHARGE */

const DELIVERY_CHARGE = {

    insideDhaka: 80,

    outsideDhaka: 150

};


/* =====================================================
   PRODUCT DATABASE
   ===================================================== */

const products = [

    {
        id: 1,

        name: "Premium T-Shirt",

        category: "Fashion",

        buyPrice: 400,

        sellPrice: 650,

        stock: 25,

        image: "",

        description:
            "Premium quality comfortable cotton T-Shirt. Perfect for everyday wear.",

        supplier:
            "Demo Fashion Supplier",

        supplierPhone:
            "01XXXXXXXXX"
    },


    {
        id: 2,

        name: "Beauty Product",

        category: "Cosmetics",

        buyPrice: 280,

        sellPrice: 450,

        stock: 18,

        image: "",

        description:
            "Beautiful everyday beauty product with a simple and elegant design.",

        supplier:
            "Demo Cosmetics Supplier",

        supplierPhone:
            "01XXXXXXXXX"
    },


    {
        id: 3,

        name: "Cute Mini Toy",

        category: "Toys",

        buyPrice: 180,

        sellPrice: 300,

        stock: 30,

        image: "",

        description:
            "Cute and fun mini toy that children will love.",

        supplier:
            "Demo Toy Supplier",

        supplierPhone:
            "01XXXXXXXXX"
    }

];


/* =====================================================
   VARIABLES
   ===================================================== */

let cart =
    JSON.parse(
        localStorage.getItem(
            "vendaviveCart"
        )
    ) || [];


let selectedCategory = "All";

let searchTerm = "";

let selectedProduct = null;

let modalQuantity = 1;


/* =====================================================
   DOM ELEMENTS
   ===================================================== */

const productGrid =
    document.getElementById(
        "productGrid"
    );

const categoryList =
    document.getElementById(
        "categoryList"
    );

const productCount =
    document.getElementById(
        "productCount"
    );

const noProducts =
    document.getElementById(
        "noProducts"
    );

const cartCount =
    document.getElementById(
        "cartCount"
    );

const cartDrawer =
    document.getElementById(
        "cartDrawer"
    );

const overlay =
    document.getElementById(
        "overlay"
    );

const cartItems =
    document.getElementById(
        "cartItems"
    );

const cartTotal =
    document.getElementById(
        "cartTotal"
    );

const searchContainer =
    document.getElementById(
        "searchContainer"
    );

const searchInput =
    document.getElementById(
        "searchInput"
    );

const clearSearch =
    document.getElementById(
        "clearSearch"
    );

const searchToggle =
    document.getElementById(
        "searchToggle"
    );

const cartButton =
    document.getElementById(
        "cartButton"
    );

const closeCart =
    document.getElementById(
        "closeCart"
    );

const shopNow =
    document.getElementById(
        "shopNow"
    );

const checkoutBtn =
    document.getElementById(
        "checkoutBtn"
    );


/* =====================================================
   PRODUCT MODAL
   ===================================================== */

const productModal =
    document.getElementById(
        "productModal"
    );

const closeProductModal =
    document.getElementById(
        "closeProductModal"
    );

const modalProductImage =
    document.getElementById(
        "modalProductImage"
    );

const modalProductCategory =
    document.getElementById(
        "modalProductCategory"
    );

const modalProductName =
    document.getElementById(
        "modalProductName"
    );

const modalProductPrice =
    document.getElementById(
        "modalProductPrice"
    );

const modalProductStock =
    document.getElementById(
        "modalProductStock"
    );

const modalProductDescription =
    document.getElementById(
        "modalProductDescription"
    );

const modalMinus =
    document.getElementById(
        "modalMinus"
    );

const modalPlus =
    document.getElementById(
        "modalPlus"
    );

const modalQuantityElement =
    document.getElementById(
        "modalQuantity"
    );

const modalAddCart =
    document.getElementById(
        "modalAddCart"
    );

const modalOrder =
    document.getElementById(
        "modalOrder"
    );


/* =====================================================
   ORDER MODAL
   ===================================================== */

const orderModal =
    document.getElementById(
        "orderModal"
    );

const closeOrderModal =
    document.getElementById(
        "closeOrderModal"
    );

const orderForm =
    document.getElementById(
        "orderForm"
    );

const customerName =
    document.getElementById(
        "customerName"
    );

const customerPhone =
    document.getElementById(
        "customerPhone"
    );

const customerAddress =
    document.getElementById(
        "customerAddress"
    );

const orderSummary =
    document.getElementById(
        "orderSummary"
    );


/* =====================================================
   PRICE FORMAT
   ===================================================== */

function formatPrice(price) {

    return (
        "৳" +
        Number(price).toLocaleString(
            "en-BD"
        )
    );

}


/* =====================================================
   CATEGORIES
   ===================================================== */

function getCategories() {

    return [

        "All",

        ...new Set(
            products.map(
                product =>
                    product.category
            )
        )

    ];

}


function renderCategories() {

    categoryList.innerHTML = "";


    getCategories().forEach(
        category => {

            const button =
                document.createElement(
                    "button"
                );


            button.className =
                "category";


            if (
                category ===
                selectedCategory
            ) {

                button.classList.add(
                    "active"
                );

            }


            button.textContent =
                category === "All"
                    ? "✨ All"
                    : category;


            button.addEventListener(
                "click",
                () => {

                    selectedCategory =
                        category;

                    renderCategories();

                    renderProducts();

                }
            );


            categoryList.appendChild(
                button
            );

        }
    );

}


/* =====================================================
   FILTER PRODUCTS
   ===================================================== */

function getFilteredProducts() {

    return products.filter(
        product => {

            const categoryMatch =
                selectedCategory ===
                    "All" ||
                product.category ===
                    selectedCategory;


            const text =
                searchTerm
                    .toLowerCase()
                    .trim();


            const searchMatch =
                !text ||

                product.name
                    .toLowerCase()
                    .includes(text) ||

                product.category
                    .toLowerCase()
                    .includes(text) ||

                product.description
                    .toLowerCase()
                    .includes(text);


            return (
                categoryMatch &&
                searchMatch
            );

        }
    );

}


/* =====================================================
   RENDER PRODUCTS
   ===================================================== */

function renderProducts() {

    const list =
        getFilteredProducts();


    productGrid.innerHTML = "";


    productCount.textContent =
        `${list.length} Products`;


    noProducts.hidden =
        list.length !== 0;


    list.forEach(
        product => {

            const card =
                document.createElement(
                    "article"
                );


            card.className =
                "product-card";


            const imageHTML =
                product.image

                    ? `
                        <img
                            src="${product.image}"
                            alt="${product.name}"
                            loading="lazy"
                        >
                    `

                    : `
                        <div
                            class="product-placeholder">
                            🛍️
                        </div>
                    `;


            let stockText;


            if (
                product.stock <= 0
            ) {

                stockText =
                    "Out of stock";

            }

            else if (
                product.stock <= 5
            ) {

                stockText =
                    `Only ${product.stock} left`;

            }

            else {

                stockText =
                    `${product.stock} in stock`;

            }


            card.innerHTML = `

                <div class="product-image">

                    ${imageHTML}

                </div>


                <div class="product-info">

                    <span
                        class="product-category">

                        ${product.category}

                    </span>


                    <h3>

                        ${product.name}

                    </h3>


                    <p
                        class="product-description">

                        ${product.description}

                    </p>


                    <div
                        class="product-bottom">

                        <div>

                            <div class="price">

                                ${formatPrice(
                                    product.sellPrice
                                )}

                            </div>


                            <span class="stock">

                                ${stockText}

                            </span>

                        </div>


                        <button
                            class="add-cart"
                            data-id="${product.id}"
                            ${
                                product.stock <= 0
                                    ? "disabled"
                                    : ""
                            }>

                            ${
                                product.stock <= 0
                                    ? "Sold Out"
                                    : "View Details"
                            }

                        </button>

                    </div>

                </div>

            `;


            const button =
                card.querySelector(
                    ".add-cart"
                );


            if (
                product.stock > 0
            ) {

                button.addEventListener(
                    "click",
                    () => {

                        openProductModal(
                            product.id
                        );

                    }
                );

            }


            productGrid.appendChild(
                card
            );

        }
    );

}


/* =====================================================
   PRODUCT DETAILS
   ===================================================== */

function openProductModal(
    productId
) {

    const product =
        products.find(
            item =>
                item.id === productId
        );


    if (!product)
        return;


    selectedProduct =
        product;


    modalQuantity =
        1;


    modalQuantityElement.textContent =
        modalQuantity;


    modalProductCategory.textContent =
        product.category;


    modalProductName.textContent =
        product.name;


    modalProductPrice.textContent =
        formatPrice(
            product.sellPrice
        );


    modalProductDescription.textContent =
        product.description;


    modalProductStock.textContent =
        `${product.stock} in stock`;


    if (product.image) {

        modalProductImage.innerHTML = `

            <img
                src="${product.image}"
                alt="${product.name}"
            >

        `;

    }

    else {

        modalProductImage.innerHTML = `

            <div
                class="product-placeholder">

                🛍️

            </div>

        `;

    }


    productModal.classList.add(
        "active"
    );


    document.body.style.overflow =
        "hidden";

}


function closeProductDetails() {

    productModal.classList.remove(
        "active"
    );


    document.body.style.overflow =
        "";


    selectedProduct =
        null;

}


/* =====================================================
   MODAL EVENTS
   ===================================================== */

closeProductModal.addEventListener(
    "click",
    closeProductDetails
);


productModal.addEventListener(
    "click",
    event => {

        if (
            event.target ===
            productModal
        ) {

            closeProductDetails();

        }

    }
);


modalMinus.addEventListener(
    "click",
    () => {

        if (
            modalQuantity > 1
        ) {

            modalQuantity--;

            modalQuantityElement.textContent =
                modalQuantity;

        }

    }
);


modalPlus.addEventListener(
    "click",
    () => {

        if (!selectedProduct)
            return;


        if (
            modalQuantity <
            selectedProduct.stock
        ) {

            modalQuantity++;

            modalQuantityElement.textContent =
                modalQuantity;

        }

        else {

            alert(
                "Maximum available stock reached."
            );

        }

    }
);


/* =====================================================
   CART FUNCTIONS
   ===================================================== */

function addMultipleToCart(
    productId,
    quantity
) {

    const product =
        products.find(
            item =>
                item.id === productId
        );


    if (!product)
        return;


    const existing =
        cart.find(
            item =>
                item.id === productId
        );


    if (existing) {

        existing.quantity =
            Math.min(
                existing.quantity +
                quantity,

                product.stock
            );

    }

    else {

        cart.push({

            id: productId,

            quantity:
                Math.min(
                    quantity,
                    product.stock
                )

        });

    }


    saveCart();

    updateCartUI();

}


function addToCart(
    productId
) {

    addMultipleToCart(
        productId,
        1
    );

}


/* =====================================================
   MODAL ADD CART
   ===================================================== */

modalAddCart.addEventListener(
    "click",
    () => {

        if (!selectedProduct)
            return;


        addMultipleToCart(
            selectedProduct.id,
            modalQuantity
        );


        closeProductDetails();

        openCart();

    }
);


/* =====================================================
   REMOVE CART ITEM
   ===================================================== */

function removeFromCart(
    productId
) {

    cart =
        cart.filter(
            item =>
                item.id !== productId
        );


    saveCart();

    updateCartUI();

}


/* =====================================================
   CHANGE CART QUANTITY
   ===================================================== */

function changeQuantity(
    productId,
    change
) {

    const item =
        cart.find(
            item =>
                item.id === productId
        );


    const product =
        products.find(
            item =>
                item.id === productId
        );


    if (!item || !product)
        return;


    item.quantity +=
        change;


    if (
        item.quantity <= 0
    ) {

        removeFromCart(
            productId
        );

        return;

    }


    if (
        item.quantity >
        product.stock
    ) {

        item.quantity =
            product.stock;

    }


    saveCart();

    updateCartUI();

}


/* =====================================================
   SAVE CART
   ===================================================== */

function saveCart() {

    localStorage.setItem(
        "vendaviveCart",
        JSON.stringify(cart)
    );

}


/* =====================================================
   CART COUNT
   ===================================================== */

function updateCartCount() {

    const count =
        cart.reduce(
            (
                total,
                item
            ) =>
                total +
                item.quantity,

            0
        );


    cartCount.textContent =
        count;

}


/* =====================================================
   CART TOTAL
   ===================================================== */

function calculateCartTotal() {

    return cart.reduce(
        (
            total,
            item
        ) => {

            const product =
                products.find(
                    product =>
                        product.id ===
                        item.id
                );


            if (!product)
                return total;


            return (
                total +

                product.sellPrice *
                item.quantity
            );

        },

        0
    );

}


/* =====================================================
   RENDER CART
   ===================================================== */

function renderCart() {

    if (
        cart.length === 0
    ) {

        cartItems.innerHTML = `

            <div class="empty-cart">

                <div>
                    🛒
                </div>

                <h3>
                    Your cart is empty
                </h3>

                <p>
                    Add something you love!
                </p>

            </div>

        `;


        cartTotal.textContent =
            formatPrice(0);


        return;

    }


    cartItems.innerHTML = "";


    cart.forEach(
        item => {

            const product =
                products.find(
                    product =>
                        product.id ===
                        item.id
                );


            if (!product)
                return;


            const cartItem =
                document.createElement(
                    "div"
                );


            cartItem.style.cssText = `
                display:flex;
                gap:12px;
                padding:12px 0;
                border-bottom:1px solid #eee;
                align-items:center;
            `;


            cartItem.innerHTML = `

                <div style="
                    width:65px;
                    height:65px;
                    border-radius:12px;
                    background:#f1f1f1;
                    display:flex;
                    align-items:center;
                    justify-content:center;
                    overflow:hidden;
                    flex-shrink:0;
                ">

                    ${
                        product.image

                        ? `
                            <img
                                src="${product.image}"
                                style="
                                    width:100%;
                                    height:100%;
                                    object-fit:cover;
                                "
                            >
                        `

                        : `
                            <span
                                style="
                                    font-size:28px;
                                ">
                                🛍️
                            </span>
                        `
                    }

                </div>


                <div style="
                    flex:1;
                    min-width:0;
                ">

                    <strong style="
                        display:block;
                        font-size:14px;
                        margin-bottom:4px;
                    ">

                        ${product.name}

                    </strong>


                    <div style="
                        font-weight:800;
                        margin-bottom:7px;
                    ">

                        ${formatPrice(
                            product.sellPrice
                        )}

                    </div>


                    <div style="
                        display:flex;
                        align-items:center;
                        gap:8px;
                    ">

                        <button
                            class="qty-btn"
                            data-action="minus"
                            data-id="${product.id}"
                            style="
                                width:27px;
                                height:27px;
                                border:0;
                                border-radius:8px;
                                background:#f1f1f1;
                            "
                        >
                            −
                        </button>


                        <span>
                            ${item.quantity}
                        </span>


                        <button
                            class="qty-btn"
                            data-action="plus"
                            data-id="${product.id}"
                            style="
                                width:27px;
                                height:27px;
                                border:0;
                                border-radius:8px;
                                background:#111;
                                color:white;
                            "
                        >
                            +
                        </button>

                    </div>

                </div>


                <button
                    class="remove-item"
                    data-id="${product.id}"
                    style="
                        border:0;
                        background:transparent;
                        color:#999;
                        font-size:20px;
                    "
                >
                    ×
                </button>

            `;


            cartItems.appendChild(
                cartItem
            );

        }
    );


    cartItems
        .querySelectorAll(
            ".qty-btn"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        changeQuantity(

                            Number(
                                button.dataset.id
                            ),

                            button.dataset.action ===
                                "plus"
                                ? 1
                                : -1

                        );

                    }
                );

            }
        );


    cartItems
        .querySelectorAll(
            ".remove-item"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        removeFromCart(
                            Number(
                                button.dataset.id
                            )
                        );

                    }
                );

            }
        );


    cartTotal.textContent =
        formatPrice(
            calculateCartTotal()
        );

}


/* =====================================================
   CART UI
   ===================================================== */

function updateCartUI() {

    updateCartCount();

    renderCart();

}


/* =====================================================
   CART OPEN / CLOSE
   ===================================================== */

function openCart() {

    cartDrawer.classList.add(
        "active"
    );

    overlay.classList.add(
        "active"
    );

    document.body.style.overflow =
        "hidden";

}


function closeCartDrawer() {

    cartDrawer.classList.remove(
        "active"
    );

    overlay.classList.remove(
        "active"
    );

    document.body.style.overflow =
        "";

}


/* =====================================================
   ORDER MODAL
   ===================================================== */

function openOrderModal(
    items
) {

    if (
        !items ||
        items.length === 0
    ) {

        alert(
            "Your cart is empty."
        );

        return;

    }


    orderSummary.innerHTML = `

        <div class="order-summary-title">

            Order Summary

        </div>

    `;


    let productTotal = 0;


    items.forEach(
        item => {

            const product =
                products.find(
                    product =>
                        product.id ===
                        item.id
                );


            if (!product)
                return;


            const itemTotal =
                product.sellPrice *
                item.quantity;


            productTotal +=
                itemTotal;


            const row =
                document.createElement(
                    "div"
                );


            row.className =
                "order-summary-item";


            row.innerHTML = `

                <span>

                    ${product.name}
                    × ${item.quantity}

                </span>


                <strong>

                    ${formatPrice(
                        itemTotal
                    )}

                </strong>

            `;


            orderSummary.appendChild(
                row
            );

        }
    );


    const deliveryBox =
        document.createElement(
            "div"
        );


    deliveryBox.innerHTML = `

        <div
            class="order-summary-item"
            style="
                margin-top:10px;
                border-bottom:none;
            ">

            <span>
                Delivery
            </span>

            <strong id="summaryDelivery">
                Select location
            </strong>

        </div>


        <div
            class="delivery-options"
            style="
                display:flex;
                flex-direction:column;
                gap:8px;
                margin-top:10px;
            ">

            <label style="
                display:flex;
                align-items:center;
                gap:8px;
                cursor:pointer;
            ">

                <input
                    type="radio"
                    name="deliveryLocation"
                    value="inside"
                >

                <span>
                    Inside Dhaka — ৳80
                </span>

            </label>


            <label style="
                display:flex;
                align-items:center;
                gap:8px;
                cursor:pointer;
            ">

                <input
                    type="radio"
                    name="deliveryLocation"
                    value="outside"
                >

                <span>
                    Outside Dhaka — ৳150
                </span>

            </label>

        </div>


        <div
            class="order-summary-total">

            <span>
                Grand Total
            </span>

            <strong id="summaryGrandTotal">
                ${formatPrice(
                    productTotal
                )}
            </strong>

        </div>

    `;


    orderSummary.appendChild(
        deliveryBox
    );


    orderModal.dataset.productTotal =
        productTotal;


    orderModal.classList.add(
        "active"
    );


    document.body.style.overflow =
        "hidden";

}


function closeOrderForm() {

    orderModal.classList.remove(
        "active"
    );


    document.body.style.overflow =
        "";

}


/* =====================================================
   DELIVERY CALCULATION
   ===================================================== */

orderModal.addEventListener(
    "change",
    event => {

        if (
            event.target.name !==
            "deliveryLocation"
        ) {

            return;

        }


        const productTotal =
            Number(
                orderModal.dataset.productTotal
            );


        const deliveryCharge =
            event.target.value ===
                "inside"

                ? DELIVERY_CHARGE.insideDhaka

                : DELIVERY_CHARGE.outsideDhaka;


        const grandTotal =
            productTotal +
            deliveryCharge;


        const deliveryElement =
            document.getElementById(
                "summaryDelivery"
            );


        const totalElement =
            document.getElementById(
                "summaryGrandTotal"
            );


        if (deliveryElement) {

            deliveryElement.textContent =
                formatPrice(
                    deliveryCharge
                );

        }


        if (totalElement) {

            totalElement.textContent =
                formatPrice(
                    grandTotal
                );

        }

    }
);


/* =====================================================
   OPEN ORDER FROM PRODUCT
   ===================================================== */

function orderSingleProduct() {

    if (!selectedProduct)
        return;


    const items = [

        {
            id:
                selectedProduct.id,

            quantity:
                modalQuantity

        }

    ];


    closeProductDetails();

    openOrderModal(
        items
    );

}


/* =====================================================
   PRODUCT ORDER BUTTON
   ===================================================== */

modalOrder.addEventListener(
    "click",
    orderSingleProduct
);


/* =====================================================
   CART CHECKOUT
   ===================================================== */

checkoutBtn.addEventListener(
    "click",
    () => {

        if (
            cart.length === 0
        ) {

            alert(
                "Your cart is empty."
            );

            return;

        }


        closeCartDrawer();

        openOrderModal(
            cart
        );

    }
);


/* =====================================================
   ORDER FORM SUBMIT
   ===================================================== */

orderForm.addEventListener(
    "submit",
    event => {

        event.preventDefault();


        const name =
            customerName.value.trim();


        const phone =
            customerPhone.value.trim();


        const address =
            customerAddress.value.trim();


        const delivery =
            document.querySelector(
                'input[name="deliveryLocation"]:checked'
            );


        if (!delivery) {

            alert(
                "Please select your delivery location."
            );

            return;

        }


        if (
            !name ||
            !phone ||
            !address
        ) {

            alert(
                "Please complete all information."
            );

            return;

        }


        const items =
            orderModal.dataset.items
                ? JSON.parse(
                    orderModal.dataset.items
                )
                : null;


        let orderItems =
            items;


        /*
           If order came from Product Details,
           use the temporary product order.
        */

        if (
            !orderItems ||
            orderItems.length === 0
        ) {

            orderItems =
                window.currentOrderItems;

        }


        if (
            !orderItems ||
            orderItems.length === 0
        ) {

            alert(
                "Unable to find your order."
            );

            return;

        }


        let productTotal = 0;

        let productText = "";


        orderItems.forEach(
            item => {

                const product =
                    products.find(
                        product =>
                            product.id ===
                            item.id
                    );


                if (!product)
                    return;


                const itemTotal =
                    product.sellPrice *
                    item.quantity;


                productTotal +=
                    itemTotal;


                productText +=
                    `• ${product.name} × ${item.quantity} = ${formatPrice(itemTotal)}\n`;

            }
        );


        const deliveryCharge =
            delivery.value ===
                "inside"

                ? DELIVERY_CHARGE.insideDhaka

                : DELIVERY_CHARGE.outsideDhaka;


        const deliveryText =
            delivery.value ===
                "inside"

                ? "Inside Dhaka"

                : "Outside Dhaka";


        const grandTotal =
            productTotal +
            deliveryCharge;


        const message =

`🛍️ *NEW ORDER — ${STORE_NAME}*

👤 *Customer:* ${name}

📞 *Phone:* ${phone}

📦 *Products:*

${productText}
💰 *Product Total:* ${formatPrice(productTotal)}

🚚 *Delivery:* ${deliveryText}

💵 *Delivery Charge:* ${formatPrice(deliveryCharge)}

━━━━━━━━━━━━━━

💰 *GRAND TOTAL:* ${formatPrice(grandTotal)}

📍 *Delivery Address:*

${address}

━━━━━━━━━━━━━━

Please confirm my order.`;


        const whatsappURL =
            `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;


        window.open(
            whatsappURL,
            "_blank"
        );

    }
);


/* =====================================================
   ORDER MODAL CLOSE
   ===================================================== */

closeOrderModal.addEventListener(
    "click",
    closeOrderForm
);


orderModal.addEventListener(
    "click",
    event => {

        if (
            event.target ===
            orderModal
        ) {

            closeOrderForm();

        }

    }
);


/* =====================================================
   SEARCH
   ===================================================== */

searchToggle.addEventListener(
    "click",
    () => {

        searchContainer.classList.toggle(
            "active"
        );


        if (
            searchContainer.classList.contains(
                "active"
            )
        ) {

            setTimeout(
                () => {

                    searchInput.focus();

                },

                200
            );

        }

    }
);


searchInput.addEventListener(
    "input",
    event => {

        searchTerm =
            event.target.value;

        renderProducts();

    }
);


clearSearch.addEventListener(
    "click",
    () => {

        searchInput.value = "";

        searchTerm = "";

        renderProducts();

        searchInput.focus();

    }
);


/* =====================================================
   BUTTON EVENTS
   ===================================================== */

cartButton.addEventListener(
    "click",
    openCart
);


closeCart.addEventListener(
    "click",
    closeCartDrawer
);


overlay.addEventListener(
    "click",
    closeCartDrawer
);


shopNow.addEventListener(
    "click",
    () => {

        document
            .getElementById(
                "productsSection"
            )
            .scrollIntoView({
                behavior:
                    "smooth"
            });

    }
);


/* =====================================================
   ORDER DATA FIX
   ===================================================== */

const originalOpenOrderModal =
    openOrderModal;


/*
   Override function so order items
   are remembered for submit.
*/

openOrderModal =
    function(items) {

        window.currentOrderItems =
            items;

        originalOpenOrderModal(
            items
        );

    };


/* =====================================================
   INITIALIZE
   ===================================================== */

function initializeWebsite() {

    renderCategories();

    renderProducts();

    updateCartUI();

}


initializeWebsite();
