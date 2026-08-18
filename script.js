/* =====================================================
   VENDAVIBE
   Dynamic Product + Search + Category + Cart System
   ===================================================== */


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
            "Premium quality comfortable cotton T-Shirt.",
        supplier: "Demo Fashion Supplier",
        supplierPhone: "01XXXXXXXXX"
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
            "Beautiful everyday beauty product.",
        supplier: "Demo Cosmetics Supplier",
        supplierPhone: "01XXXXXXXXX"
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
            "Cute and fun mini toy for kids.",
        supplier: "Demo Toy Supplier",
        supplierPhone: "01XXXXXXXXX"
    }

];


/* =====================================================
   GLOBAL VARIABLES
   ===================================================== */

let cart = JSON.parse(
    localStorage.getItem("vendavibeCart")
) || [];

let selectedCategory = "All";

let searchTerm = "";


/* =====================================================
   DOM ELEMENTS
   ===================================================== */

const productGrid =
    document.getElementById("productGrid");

const categoryList =
    document.getElementById("categoryList");

const productCount =
    document.getElementById("productCount");

const noProducts =
    document.getElementById("noProducts");

const cartCount =
    document.getElementById("cartCount");

const cartDrawer =
    document.getElementById("cartDrawer");

const overlay =
    document.getElementById("overlay");

const cartItems =
    document.getElementById("cartItems");

const cartTotal =
    document.getElementById("cartTotal");

const searchContainer =
    document.getElementById("searchContainer");

const searchInput =
    document.getElementById("searchInput");

const clearSearch =
    document.getElementById("clearSearch");

const searchToggle =
    document.getElementById("searchToggle");

const cartButton =
    document.getElementById("cartButton");

const closeCart =
    document.getElementById("closeCart");

const shopNow =
    document.getElementById("shopNow");

const checkoutBtn =
    document.getElementById("checkoutBtn");


/* =====================================================
   FORMAT PRICE
   ===================================================== */

function formatPrice(price) {

    return "৳" + Number(price).toLocaleString("en-BD");

}


/* =====================================================
   GET CATEGORIES
   ===================================================== */

function getCategories() {

    const categories = [
        "All",
        ...new Set(
            products.map(product => product.category)
        )
    ];

    return categories;

}


/* =====================================================
   RENDER CATEGORIES
   ===================================================== */

function renderCategories() {

    const categories = getCategories();

    categoryList.innerHTML = "";

    categories.forEach(category => {

        const button =
            document.createElement("button");

        button.className =
            "category";

        if (category === selectedCategory) {

            button.classList.add("active");

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

        categoryList.appendChild(button);

    });

}


/* =====================================================
   FILTER PRODUCTS
   ===================================================== */

function getFilteredProducts() {

    return products.filter(product => {

        const matchesCategory =
            selectedCategory === "All" ||
            product.category === selectedCategory;

        const searchText =
            searchTerm.toLowerCase().trim();

        const matchesSearch =
            !searchText ||

            product.name
                .toLowerCase()
                .includes(searchText) ||

            product.category
                .toLowerCase()
                .includes(searchText) ||

            product.description
                .toLowerCase()
                .includes(searchText);

        return (
            matchesCategory &&
            matchesSearch
        );

    });

}


/* =====================================================
   RENDER PRODUCTS
   ===================================================== */

function renderProducts() {

    const filteredProducts =
        getFilteredProducts();

    productGrid.innerHTML = "";

    productCount.textContent =
        `${filteredProducts.length} Products`;

    if (filteredProducts.length === 0) {

        noProducts.hidden = false;

        return;

    }

    noProducts.hidden = true;


    filteredProducts.forEach(product => {

        const card =
            document.createElement("article");

        card.className =
            "product-card";


        /* PRODUCT IMAGE */

        let imageHTML = "";

        if (product.image) {

            imageHTML = `
                <img
                    src="${product.image}"
                    alt="${product.name}"
                    loading="lazy"
                >
            `;

        } else {

            imageHTML = `
                <div class="product-placeholder">
                    🛍️
                </div>
            `;

        }


        /* STOCK */

        let stockText = "";

        if (product.stock <= 0) {

            stockText =
                "Out of stock";

        } else if (product.stock <= 5) {

            stockText =
                `Only ${product.stock} left`;

        } else {

            stockText =
                `${product.stock} in stock`;

        }


        card.innerHTML = `

            <div class="product-image">

                ${imageHTML}

            </div>


            <div class="product-info">

                <span class="product-category">

                    ${product.category}

                </span>


                <h3>

                    ${product.name}

                </h3>


                <p class="product-description">

                    ${product.description}

                </p>


                <div class="product-bottom">

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
                        ${product.stock <= 0
                            ? "disabled"
                            : ""}
                    >

                        ${
                            product.stock <= 0
                                ? "Sold Out"
                                : "Add 🛒"
                        }

                    </button>

                </div>

            </div>

        `;


        const addButton =
            card.querySelector(".add-cart");


        if (addButton) {

            addButton.addEventListener(
                "click",
                () => {

                    addToCart(product.id);

                }
            );

        }


        productGrid.appendChild(card);

    });

}


/* =====================================================
   ADD TO CART
   ===================================================== */

function addToCart(productId) {

    const product =
        products.find(
            item => item.id === productId
        );

    if (!product) return;


    const existingItem =
        cart.find(
            item => item.id === productId
        );


    if (existingItem) {

        if (
            existingItem.quantity <
            product.stock
        ) {

            existingItem.quantity++;

        } else {

            alert(
                "Maximum available stock reached."
            );

            return;

        }

    } else {

        cart.push({

            id: product.id,

            quantity: 1

        });

    }


    saveCart();

    updateCartUI();

    openCart();

}


/* =====================================================
   REMOVE FROM CART
   ===================================================== */

function removeFromCart(productId) {

    cart =
        cart.filter(
            item => item.id !== productId
        );

    saveCart();

    updateCartUI();

}


/* =====================================================
   CHANGE QUANTITY
   ===================================================== */

function changeQuantity(
    productId,
    change
) {

    const item =
        cart.find(
            cartItem =>
                cartItem.id === productId
        );

    const product =
        products.find(
            productItem =>
                productItem.id === productId
        );

    if (!item || !product) return;


    item.quantity += change;


    if (item.quantity <= 0) {

        removeFromCart(productId);

        return;

    }


    if (
        item.quantity >
        product.stock
    ) {

        item.quantity =
            product.stock;

        alert(
            "You reached the available stock."
        );

    }


    saveCart();

    updateCartUI();

}


/* =====================================================
   SAVE CART
   ===================================================== */

function saveCart() {

    localStorage.setItem(
        "vendavibeCart",
        JSON.stringify(cart)
    );

}


/* =====================================================
   CART COUNT
   ===================================================== */

function updateCartCount() {

    const totalItems =
        cart.reduce(
            (total, item) =>
                total + item.quantity,
            0
        );

    cartCount.textContent =
        totalItems;

}


/* =====================================================
   CART TOTAL
   ===================================================== */

function calculateCartTotal() {

    return cart.reduce(
        (total, item) => {

            const product =
                products.find(
                    product =>
                        product.id === item.id
                );

            if (!product) {
                return total;
            }

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

    if (cart.length === 0) {

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


    cart.forEach(item => {

        const product =
            products.find(
                product =>
                    product.id === item.id
            );

        if (!product) return;


        const cartItem =
            document.createElement("div");


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
                            alt="${product.name}"
                        >
                    `

                    : `
                        <span
                            style="
                                font-size:28px;
                            "
                        >
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


        cartItems.appendChild(cartItem);

    });


    const quantityButtons =
        cartItems.querySelectorAll(
            ".qty-btn"
        );


    quantityButtons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const id =
                    Number(
                        button.dataset.id
                    );

                const action =
                    button.dataset.action;

                changeQuantity(
                    id,
                    action === "plus"
                        ? 1
                        : -1
                );

            }
        );

    });


    const removeButtons =
        cartItems.querySelectorAll(
            ".remove-item"
        );


    removeButtons.forEach(button => {

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

    });


    cartTotal.textContent =
        formatPrice(
            calculateCartTotal()
        );

}


/* =====================================================
   UPDATE CART UI
   ===================================================== */

function updateCartUI() {

    updateCartCount();

    renderCart();

}


/* =====================================================
   OPEN CART
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


/* =====================================================
   CLOSE CART
   ===================================================== */

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
   CART EVENTS
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


/* =====================================================
   SHOP NOW
   ===================================================== */

shopNow.addEventListener(
    "click",
    () => {

        document
            .getElementById(
                "productsSection"
            )
            .scrollIntoView({
                behavior: "smooth"
            });

    }
);


/* =====================================================
   CHECKOUT
   ===================================================== */

checkoutBtn.addEventListener(
    "click",
    () => {

        if (cart.length === 0) {

            alert(
                "Your cart is empty."
            );

            return;

        }


        alert(
            "Order system will be connected in the next step."
        );

    }
);


/* =====================================================
   INITIALIZE WEBSITE
   ===================================================== */

function initializeWebsite() {

    renderCategories();

    renderProducts();

    updateCartUI();

}


/* =====================================================
   START
   ===================================================== */

initializeWebsite();
