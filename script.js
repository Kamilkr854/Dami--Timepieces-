const BIN_ID = "69f85b05856a682189a3d205";
const API_KEY = "$2a$10$4TKgbm8GW1Hvl/ZKolicOePBDpIBCjFOGZKGOdiwzMT/9izxWlHLK";
const URL = `https://api.jsonbin.io/v3/b/${BIN_ID}`;
const phoneNumber = "2347074428929";
const adminPass = "Dami2024";

let watches = [];
let cart = [];

// LOAD DATA
async function loadWatches() {
    try {
        const response = await fetch(`${URL}/latest`, { headers: { "X-Master-Key": API_KEY } });
        const data = await response.json();
        watches = data.record.watches || [];
        renderWatches(watches);
    } catch (err) { console.error("Load error"); }
}

// RENDER FUNCTION
function renderWatches(dataToRender) {
    const grid = document.getElementById('watchGrid');
    const isAdmin = !document.getElementById('admin-panel').classList.contains('hidden');
    grid.innerHTML = "";

    dataToRender.forEach((watch, index) => {
        grid.innerHTML += `
            <div class="watch-card">
                <img src="${watch.image}" onerror="this.src='https://via.placeholder.com/150'">
                <h3>${watch.name}</h3>
                <p>₦${watch.price.toLocaleString()}</p>
                ${!isAdmin ? `<button onclick="addToCart(${index})">Add to Cart</button>` : ''}
                ${isAdmin ? `<button onclick="deleteProduct(${index})" style="background:red; color:white;">Delete</button>` : ''}
            </div>
        `;
    });
}

// SEARCH
function searchWatches() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    const filtered = watches.filter(w => w.name.toLowerCase().includes(query) || w.category.toLowerCase().includes(query));
    renderWatches(filtered);
}

// HAMBURGER MENU
function toggleMenu() {
    const menu = document.getElementById("sideMenu");
    menu.style.width = menu.style.width === "250px" ? "0" : "250px";
}

function showSection(id) {
    document.getElementById('admin-panel').classList.add('hidden');
    document.getElementById('storefront').classList.add('hidden');
    document.getElementById(id).classList.remove('hidden');
    toggleMenu();
    renderWatches(watches);
}

// CART LOGIC
function openCart() {
    document.getElementById('cartModal').classList.remove('hidden');
    const cartDiv = document.getElementById('cartItems');
    const totalDiv = document.getElementById('cartTotal');
    cartDiv.innerHTML = "";
    let total = 0;

    cart.forEach((item, index) => {
        cartDiv.innerHTML += `<p>${item.name} - ₦${item.price.toLocaleString()} <button onclick="removeFromCart(${index})">❌</button></p>`;
        total += item.price;
    });
    totalDiv.innerText = `₦${total.toLocaleString()}`;
}

function closeCart() { document.getElementById('cartModal').classList.add('hidden'); }

function addToCart(index) {
    cart.push(watches[index]);
    document.getElementById('cartCount').innerText = cart.length;
    alert("Added!");
}

function removeFromCart(index) {
    cart.splice(index, 1);
    document.getElementById('cartCount').innerText = cart.length;
    openCart();
}

// CLOUD SAVE & DELETE (Keep your existing saveProduct and deleteProduct logic here)
// ... [Insert the saveProduct and deleteProduct functions from previous messages here] ...

loadWatches();
