const BIN_ID = "69fcebbe250b1311c31ad406";
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
function adminLogin() {
    const password = prompt("Enter Admin Password:");
    
    if (password === adminPass) {
        // 1. Hide the storefront
        document.getElementById('storefront').classList.add('hidden');
        
        // 2. Show the admin panel
        const adminPanel = document.getElementById('admin-panel');
        adminPanel.classList.remove('hidden');
        
        // 3. Close the hamburger menu automatically
        toggleMenu(); 
        
        // 4. Refresh the grid to show delete buttons
        renderWatches(watches); 
        
        alert("Access Granted. Welcome back, Dami.");
    } else {
        alert("Incorrect password. Access denied.");
    }
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

async function saveProduct() {
    const name = document.getElementById('watchName').value;
    const price = document.getElementById('watchPrice').value;
    const image = document.getElementById('watchImage').value;
    // Make sure this ID 'watchCategory' exists in your HTML select tag!
    const category = document.getElementById('watchCategory').value;

    if (!name || !price || !image) {
        return alert("Please fill all fields!");
    }

    const updatedList = [...watches, { 
        name, 
        price: parseInt(price), 
        image, 
        category 
    }];

    try {
        const response = await fetch(URL, {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
                "X-Master-Key": API_KEY,
                "X-Bin-Versioning": "false"
            },
            body: JSON.stringify({ watches: updatedList })
        });

        if (response.ok) {
            alert("Success! Watch added to Cloud.");
            watches = updatedList;
            renderWatches(watches); // Refresh the display
            
            // Clear the inputs
            document.getElementById('watchName').value = "";
            document.getElementById('watchPrice').value = "";
            document.getElementById('watchImage').value = "";
        } else {
            alert("Cloud rejected the save. Check your API Key.");
        }
    } catch (err) {
        alert("Network error. Check your data connection.");
    }
}


loadWatches();
