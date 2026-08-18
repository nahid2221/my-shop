/* =====================================================
   VENDA VIBE
   COMPLETE SHOPPING SYSTEM
   ===================================================== */


/* ================= STORE SETTINGS ================= */

const STORE_NAME = "VendaVibe";

/*
   IMPORTANT:
   নিজের WhatsApp number এখানে বসাবে।

   Example:
   01712345678

   হবে:
   8801712345678
*/

const WHATSAPP_NUMBER = "8801603560026";


/* ================= DELIVERY ================= */

const DELIVERY_CHARGE = {
    inside: 80,
    outside: 150
};


/* ================= PRODUCTS ================= */

const products = [

    {
        id: 1,
        name: "Premium T-Shirt",
        category: "Fashion",
        price: 650,
        stock: 25,
        image: "",
        description:
            "Premium quality comfortable cotton T-Shirt. Perfect for everyday wear."
    },

    {
        id: 2,
        name: "Beauty Product",
        category: "Cosmetics",
        price: 450,
        stock: 18,
        image: "",
        description:
            "Beautiful everyday beauty product with a simple and elegant design."
    },

    {
        id: 3,
        name: "Cute Mini Toy",
        category: "Toys",
        price: 300,
        stock: 30,
        image: "",
        description:
            "Cute and fun mini toy that children will love."
    }

];


/* ================= CART ================= */

let cart = [];

try {
    cart =
        JSON.parse(
            localStorage.getItem("vendavibeCart")
        ) || [];
} catch (error) {
    cart = [];
}


/* ================= STATE ================= */

let selectedCategory = "All";

let searchTerm = "";

let selectedProduct = null;

let modalQuantity = 1;

let currentOrderItems = [];


/* ================= HELPERS ================= */

function $(id) {
    return document.getElementById(id);
}


function formatPrice(price) {

    return (
        "৳" +
        Number(price).toLocaleString("en-BD")
    );

}


function getProduct(id) {

    return products.find(
        product =>
            product.id === Number(id)
    );

}


/* ================= DOM ================= */

const productGrid = $("productGrid");

const categoryList = $("categoryList");

const productCount = $("productCount");

const noProducts = $("noProducts");

const cartCount = $("cartCount");

const cartDrawer = $("cartDrawer");

const overlay = $("overlay");

const cartItems = $("cartItems");

const cartTotal = $("cartTotal");

const searchContainer = $("searchContainer");

const searchInput = $("searchInput");

const clearSearch = $("clearSearch");

const searchToggle = $("searchToggle");

const cartButton = $("cartButton");

const closeCart = $("closeCart");

const shopNow = $("shopNow");

const checkoutBtn = $("checkoutBtn");


/* ================= PRODUCT MODAL ================= */

const productModal = $("productModal");

const closeProductModal =
    $("closeProductModal");

const modalProductImage =
    $("modalProductImage");

const modalProductCategory =
    $("modalProductCategory");

const modalProductName =
    $("modalProductName");

const modalProductPrice =
    $("modalProductPrice");

const modalProductStock =
    $("modalProductStock");

const modalProductDescription =
    $("modalProductDescription");

const modalMinus =
    $("modalMinus");

const modalPlus =
    $("modalPlus");

const modalQuantityElement =
    $("modalQuantity");

const modalAddCart =
    $("modalAddCart");

const modalOrder =
    $("modalOrder");


/* ================= ORDER MODAL ================= */

const orderModal =
    $("orderModal");

const closeOrderModal =
    $("closeOrderModal");

const orderForm =
    $("orderForm");

const customerName =
    $("customerName");

const customerPhone =
    $("customerPhone");

const customerAddress =
    $("customerAddress");

const orderSummary =
    $("orderSummary");


/* =====================================================
   CATEGORIES
   ===================================================== */

function renderCategories() {

    if (!categoryList) return;

    const categories = [
        "All",
        ...new Set(
            products.map(
                product =>
                    product.category
            )
        )
    ];

    categoryList.innerHTML = "";

    categories.forEach(
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
   FILTER
   ===================================================== */

function getFilteredProducts() {

    return products.filter(
        product => {

            const categoryOK =
                selectedCategory ===
                    "All" ||
                product.category ===
                    selectedCategory;

            const search =
                searchTerm
                    .trim()
                    .toLowerCase();

            const searchOK =
                !search ||
                product.name
                    .toLowerCase()
                    .includes(search) ||
                product.category
                    .toLowerCase()
                    .includes(search) ||
                product.description
                    .toLowerCase()
                    .includes(search);

            return (
                categoryOK &&
                searchOK
            );

        }
    );

}


/* =====================================================
   PRODUCTS
   ===================================================== */

function renderProducts() {

    if (!productGrid) return;

    const list =
        getFilteredProducts();

    productGrid.innerHTML = "";


    if (productCount) {

        productCount.textContent =
            `${list.length} Products`;

    }


    if (noProducts) {

        noProducts.hidden =
            list.length > 0;

    }


    list.forEach(
        product => {

            const card =
                document.createElement(
                    "article"
                );

            card.className =
                "product-card";


            const image =

                product.image

                ? `
                    <img
                        src="${product.image}"
                        alt="${product.name}"
                    >
                `

                : `
                    <div
                        class="product-placeholder">
                        🛍️
                    </div>
                `;


            const stockText =
                product.stock > 5

                ? `${product.stock} in stock`

                : product.stock > 0

                    ? `Only ${product.stock} left`

                    : "Out of stock";


            card.innerHTML = `

                <div class="product-image">

                    ${image}

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
                                    product.price
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

function openProductModal(id) {

    const product =
        getProduct(id);

    if (!product) return;


    selectedProduct =
        product;

    modalQuantity = 1;


    if (modalQuantityElement) {

        modalQuantityElement.textContent =
            modalQuantity;

    }


    if (modalProductCategory) {

        modalProductCategory.textContent =
            product.category;

    }


    if (modalProductName) {

        modalProductName.textContent =
            product.name;

    }


    if (modalProductPrice) {

        modalProductPrice.textContent =
            formatPrice(
                product.price
            );

    }


    if (modalProductStock) {

        modalProductStock.textContent =
            `${product.stock} in stock`;

    }


    if (modalProductDescription) {

        modalProductDescription.textContent =
            product.description;

    }


    if (modalProductImage) {

        if (product.image) {

            modalProductImage.innerHTML = `

                <img
                    src="${product.image}"
                    alt="${product.name}"
                >

            `;

        } else {

            modalProductImage.innerHTML = `

                <div
                    class="product-placeholder">

                    🛍️

                </div>

            `;

        }

    }


    if (productModal) {

        productModal.classList.add(
            "active"
        );

        document.body.style.overflow =
            "hidden";

    }

}


function closeProductDetails() {

    if (productModal) {

        productModal.classList.remove(
            "active"
        );

    }

    document.body.style.overflow = "";

    selectedProduct = null;

}


/* =====================================================
   CART
   ===================================================== */

function saveCart() {

    localStorage.setItem(
        "vendaviveCart",
        JSON.stringify(cart)
    );

}


function updateCartCount() {

    if (!cartCount) return;

    const count =
        cart.reduce(
            (total, item) =>
                total +
                Number(item.quantity || 0),
            0
        );

    cartCount.textContent =
        count;

}


function addToCart(
    productId,
    quantity = 1
) {

    const product =
        getProduct(productId);

    if (!product) return;


    const existing =
        cart.find(
            item =>
                item.id ===
                product.id
        );


    if (existing) {

        existing.quantity =
            Math.min(
                existing.quantity +
                    quantity,

                product.stock
            );

    } else {

        cart.push({

            id:
                product.id,

            quantity:
                Math.min(
                    quantity,
                    product.stock
                )

        });

    }


    saveCart();

    renderCart();

    updateCartCount();

}


function removeFromCart(id) {

    cart =
        cart.filter(
            item =>
                item.id !== Number(id)
        );

    saveCart();

    renderCart();

    updateCartCount();

}


function changeQuantity(
    id,
    change
) {

    const item =
        cart.find(
            item =>
                item.id === Number(id)
        );

    const product =
        getProduct(id);

    if (!item || !product)
        return;


    item.quantity +=
        change;


    if (
        item.quantity <= 0
    ) {

        removeFromCart(id);

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

    renderCart();

    updateCartCount();

}


function getCartTotal() {

    return cart.reduce(
        (total, item) => {

            const product =
                getProduct(
                    item.id
                );

            if (!product)
                return total;

            return (
                total +
                product.price *
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

    if (!cartItems) return;


    if (
        cart.length === 0
    ) {

        cartItems.innerHTML = `

            <div class="empty-cart">

                <div>🛒</div>

                <h3>
                    Your cart is empty
                </h3>

                <p>
                    Add something you love!
                </p>

            </div>

        `;


        if (cartTotal) {

            cartTotal.textContent =
                formatPrice(0);

        }

        return;

    }


    cartItems.innerHTML = "";


    cart.forEach(
        item => {

            const product =
                getProduct(
                    item.id
                );

            if (!product)
                return;


            const row =
                document.createElement(
                    "div"
                );


            row.style.cssText = `

                display:flex;
                gap:12px;
                padding:12px 0;
                border-bottom:1px solid #eee;
                align-items:center;

            `;


            row.innerHTML = `

                <div style="
                    width:60px;
                    height:60px;
                    border-radius:12px;
                    background:#f2f2f2;
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
                                alt="${product.name}"
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

                    <strong>

                        ${product.name}

                    </strong>


                    <div style="
                        font-weight:800;
                        margin:5px 0;
                    ">

                        ${formatPrice(
                            product.price
                        )}

                    </div>


                    <div style="
                        display:flex;
                        align-items:center;
                        gap:8px;
                    ">

                        <button
                            data-action="minus"
                            data-id="${product.id}"
                            class="qty-btn">

                            −

                        </button>


                        <span>

                            ${item.quantity}

                        </span>


                        <button
                            data-action="plus"
                            data-id="${product.id}"
                            class="qty-btn">

                            +

                        </button>

                    </div>

                </div>


                <button
                    data-remove="${product.id}"
                    class="remove-item">

                    ×

                </button>

            `;


            cartItems.appendChild(
                row
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

                        const id =
                            Number(
                                button.dataset.id
                            );

                        const change =
                            button.dataset.action ===
                                "plus"
                                ? 1
                                : -1;

                        changeQuantity(
                            id,
                            change
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
                            button.dataset.remove
                        );

                    }
                );

            }
        );


    if (cartTotal) {

        cartTotal.textContent =
            formatPrice(
                getCartTotal()
            );

    }

}


/* =====================================================
   CART OPEN / CLOSE
   ===================================================== */

function openCart() {

    if (cartDrawer) {

        cartDrawer.classList.add(
            "active"
        );

    }

    if (overlay) {

        overlay.classList.add(
            "active"
        );

    }

    document.body.style.overflow =
        "hidden";

}


function closeCartDrawer() {

    if (cartDrawer) {

        cartDrawer.classList.remove(
            "active"
        );

    }

    if (overlay) {

        overlay.classList.remove(
            "active"
        );

    }

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


    currentOrderItems =
        items.map(
            item => ({
                id:
                    Number(item.id),

                quantity:
                    Number(item.quantity)
            })
        );


    renderOrderSummary();


    if (orderModal) {

        orderModal.classList.add(
            "active"
        );

        document.body.style.overflow =
            "hidden";

    }

}


function closeOrderForm() {

    if (orderModal) {

        orderModal.classList.remove(
            "active"
        );

    }

    document.body.style.overflow =
        "";

}


/* =====================================================
   ORDER SUMMARY
   ===================================================== */

function renderOrderSummary() {

    if (!orderSummary)
        return;


    let productTotal = 0;


    let html = `

        <div class="order-summary-title">

            Order Summary

        </div>

    `;


    currentOrderItems.forEach(
        item => {

            const product =
                getProduct(
                    item.id
                );

            if (!product)
                return;


            const itemTotal =
                product.price *
                item.quantity;


            productTotal +=
                itemTotal;


            html += `

                <div
                    class="order-summary-item">

                    <span>

                        ${product.name}
                        × ${item.quantity}

                    </span>

                    <strong>

                        ${formatPrice(
                            itemTotal
                        )}

                    </strong>

                </div>

            `;

        }
    );


    html += `

        <div style="
            margin-top:15px;
            font-weight:800;
        ">

            Delivery Location

        </div>


        <label style="
            display:flex;
            gap:8px;
            align-items:center;
            margin-top:10px;
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
            gap:8px;
            align-items:center;
            margin-top:8px;
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


        <div
            class="order-summary-item"
            style="
                margin-top:12px;
            ">

            <span>
                Product Total
            </span>

            <strong>
                ${formatPrice(
                    productTotal
                )}
            </strong>

        </div>


        <div
            class="order-summary-item">

            <span>
                Delivery Charge
            </span>

            <strong id="summaryDelivery">
                ৳0
            </strong>

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


    orderSummary.innerHTML =
        html;


    orderSummary
        .querySelectorAll(
            'input[name="deliveryLocation"]'
        )
        .forEach(
            radio => {

                radio.addEventListener(
                    "change",
                    () => {

                        updateDeliveryTotal(
                            productTotal
                        );

                    }
                );

            }
        );

}


function updateDeliveryTotal(
    productTotal
) {

    const selected =
        document.querySelector(
            'input[name="deliveryLocation"]:checked'
        );


    if (!selected)
        return;


    const deliveryCharge =
        selected.value === "inside"

            ? DELIVERY_CHARGE.inside

            : DELIVERY_CHARGE.outside;


    const grandTotal =
        productTotal +
        deliveryCharge;


    const deliveryElement =
        $("summaryDelivery");

    const grandElement =
        $("summaryGrandTotal");


    if (deliveryElement) {

        deliveryElement.textContent =
            formatPrice(
                deliveryCharge
            );

    }


    if (grandElement) {

        grandElement.textContent =
            formatPrice(
                grandTotal
            );

    }

}


/* =====================================================
   ORDER NOW — SINGLE PRODUCT
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
   WHATSAPP ORDER
   ===================================================== */

function sendWhatsAppOrder() {

    const name =
        customerName
            ? customerName.value.trim()
            : "";


    const phone =
        customerPhone
            ? customerPhone.value.trim()
            : "";


    const address =
        customerAddress
            ? customerAddress.value.trim()
            : "";


    const delivery =
        document.querySelector(
            'input[name="deliveryLocation"]:checked'
        );


    if (!name) {

        alert(
            "Please enter your name."
        );

        return;

    }


    if (!phone) {

        alert(
            "Please enter your phone number."
        );

        return;

    }


    if (!address) {

        alert(
            "Please enter your delivery address."
        );

        return;

    }


    if (!delivery) {

        alert(
            "Please select your delivery location."
        );

        return;

    }


    if (
        !WHATSAPP_NUMBER ||
        WHATSAPP_NUMBER.includes("X")
    ) {

        alert(
            "Please add your WhatsApp number in script.js first."
        );

        return;

    }


    let productTotal = 0;

    let productText = "";


    currentOrderItems.forEach(
        item => {

            const product =
                getProduct(
                    item.id
                );

            if (!product)
                return;


            const itemTotal =
                product.price *
                item.quantity;


            productTotal +=
                itemTotal;


            productText +=
                `• ${product.name} × ${item.quantity} = ${formatPrice(itemTotal)}\n`;

        }
    );


    const deliveryCharge =
        delivery.value === "inside"

            ? DELIVERY_CHARGE.inside

            : DELIVERY_CHARGE.outside;


    const deliveryText =
        delivery.value === "inside"

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


    const url =
        "https://wa.me/" +
        WHATSAPP_NUMBER +
        "?text=" +
        encodeURIComponent(
            message
        );


    window.open(
        url,
        "_blank"
    );

}


/* =====================================================
   EVENT LISTENERS
   ===================================================== */

if (closeProductModal) {

    closeProductModal.addEventListener(
        "click",
        closeProductDetails
    );

}


if (productModal) {

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

}


if (modalMinus) {

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

}


if (modalPlus) {

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

        }
    );

}


if (modalAddCart) {

    modalAddCart.addEventListener(
        "click",
        () => {

            if (!selectedProduct)
                return;


            addToCart(
                selectedProduct.id,
                modalQuantity
            );


            closeProductDetails();

            openCart();

        }
    );

}


if (modalOrder) {

    modalOrder.addEventListener(
        "click",
        orderSingleProduct
    );

}


if (cartButton) {

    cartButton.addEventListener(
        "click",
        openCart
    );

}


if (closeCart) {

    closeCart.addEventListener(
        "click",
        closeCartDrawer
    );

}


if (overlay) {

    overlay.addEventListener(
        "click",
        closeCartDrawer
    );

}


if (checkoutBtn) {

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

}


if (closeOrderModal) {

    closeOrderModal.addEventListener(
        "click",
        closeOrderForm
    );

}


if (orderModal) {

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

}


if (orderForm) {

    orderForm.addEventListener(
        "submit",
        event => {

            event.preventDefault();

            sendWhatsAppOrder();

        }
    );

}


/* ================= SEARCH ================= */

if (searchToggle) {

    searchToggle.addEventListener(
        "click",
        () => {

            if (searchContainer) {

                searchContainer.classList.toggle(
                    "active"
                );

            }

            if (searchInput) {

                searchInput.focus();

            }

        }
    );

}


if (searchInput) {

    searchInput.addEventListener(
        "input",
        event => {

            searchTerm =
                event.target.value;

            renderProducts();

        }
    );

}


if (clearSearch) {

    clearSearch.addEventListener(
        "click",
        () => {

            if (searchInput) {

                searchInput.value = "";

            }

            searchTerm = "";

            renderProducts();

        }
    );

}


/* ================= SHOP NOW ================= */

if (shopNow) {

    shopNow.addEventListener(
        "click",
        () => {

            const section =
                $("productsSection");

            if (section) {

                section.scrollIntoView({
                    behavior:
                        "smooth"
                });

            }

        }
    );

}


/* =====================================================
   START
   ===================================================== */

renderCategories();

renderProducts();

renderCart();

updateCartCount();

console.log(
    "VendaVibe loaded successfully."
);
