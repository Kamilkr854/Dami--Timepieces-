// --- 1. CONFIGURATION ---
const BIN_ID = "69f97aea36566621a8277050";
const API_KEY = "$2a$10$4TKgbm8GW1Hvl/ZKolicOePBDpIBCjFOGZKGOdiwzMT/9izxWlHLK";
const URL = `https://api.jsonbin.io/v3/b/${BIN_ID}`;

const phoneNumber = "2347074428929";
const adminPass = "Dami2024";

let watches = [];
let cart = [];

// --- 2. CLOUD ENGINE (Load, Save, Delete) ---

async function loadWatches() {
    try {
        const response = await fetch(`${URL}/latest`, {
            headers: { "X-Master-Key": API_KEY }
        });
        const data = await response.json();
        watches = data.record.watches || [];
        renderWatches();
    } catch (err) {
        console.error("Cloud load failed:", err);
    }
}

async function saveProduct() {
    const name = document.getElementById('watchName').value;
    const price = document.getElementById('watchPrice').value;
    const image = document.getElementById('watchImage').value;
    const category = document.getElementById('watchCategory').value;

    if (!name || !price || !image) return alert("Please fill all fields!");

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
            alert("Watch added to Cloud!");
            watches = updatedList;
            renderWatches();
            document.getElementById('watchName').value = "";
            document.getElementById('watchPrice').value = "";
            document.getElementById('watchImage').value = "";
        }
    } catch (err) {
        alert("Save failed. Check network.");
    }
}

async function deleteProduct(index) {
    if (!confirm("Are you sure you want to delete this watch?")) return;

    watches.splice(index, 1);

    try {
        const response = await fetch(URL, {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
                "X-Master-Key": API_KEY,
                "X-Bin-Versioning": "false"
            },
            body: JSON.stringify({ watches: watches })
        });

        if (response.ok) {
            alert("Deleted successfully!");
            renderWatches();
        }
    } catch (err) {
        alert("Delete failed.");
    }
}

// --- 3. UI & ADMIN LOGIC ---

function renderWatches() {
    const grid = document.getElementById('watchGrid');
    if (!grid) return;
    grid.innerHTML = "";

    const isAdmin = !document.getElementById('admin-panel').classList.contains('hidden');

    watches.forEach((watch, index) => {
        grid.innerHTML += `
            <div class="watch-card">
                <img src="${watch.image}" onerror="this.src='https://via.placeholder.com/150?text=No+Image'">
                <h3>${watch.name}</h3>
                <p class="price">₦${watch.price.toLocaleString()}</p>
                
                ${!isAdmin ? `<button onclick="addToCart(${index})">Add to Cart</button>` : ''}
                
                ${isAdmin ? `<button onclick="deleteProduct(${index})" style="background: #ff4444; color: white; margin-top: 10px; border: none; padding: 10px; width: 100%; border-radius: 5px; font-weight: bold;">Delete Item</button>` : ''}
            </div>
        `;
    });
}

function toggleAdmin() {
    const adminPanel = document.getElementById('admin-panel');
    const storefront = document.getElementById('storefront');

    if (adminPanel.classList.contains('hidden')) {
        const pass = prompt("Admin Password:");
        if (pass === adminPass) {
            adminPanel.classList.remove('hidden');
            storefront.classList.add('hidden');
            renderWatches(); // Refresh to show Delete buttons
        } else {
            alert("Wrong Password");
        }
    } else {
        adminPanel.classList.add('hidden');
        storefront.classList.remove('hidden');
        renderWatches(); // Refresh to hide Delete buttons
    }
}

// --- 4. CART & CHECKOUT ---

function addToCart(index) {
    cart.push(watches[index]);
    alert("Added to cart!");
}

function checkout() {
    if (cart.length === 0) return alert("Cart is empty!");
    
    let message = "Hello Dami & Co., I want to buy:\n\n";
    let total = 0;
    
    cart.forEach((item, i) => {
        message += `${i+1}. ${item.name} - ₦${item.price.toLocaleString()}\n`;
        total += item.price;
    });
    
    message += `\nTotal: ₦${total.toLocaleString()}`;
    window.location.href = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
}

// Start the application
loadWatches();
