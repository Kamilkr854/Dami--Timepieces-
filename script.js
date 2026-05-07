// --- 1. CONFIGURATION ---
const BIN_ID = "69f97aea36566621a8277050";
const API_KEY = "$2a$10$jtiYE5Bo5i8dQS6UcZRoIuPoKr9T6dlB25klBDRuCXHN08gwnZ5E."; // Removed period
const URL = `https://api.jsonbin.io/v3/b/${BIN_ID}`;

const phoneNumber = "2347074428929";
const adminPass = "Dami2024";

let watches = [];
let cart = [];

// --- 2. CLOUD ENGINE ---

async function loadWatches() {
    try {
        const response = await fetch(`${URL}/latest`, {
            headers: { "X-Master-Key": API_KEY }
        });
        const data = await response.json();
        // Correctly target the 'watches' array inside the record
        watches = data.record.watches || [];
        renderWatches();
    } catch (err) {
        console.error("Load failed:", err);
    }
}

async function saveProduct() {
    const name = document.getElementById('watchName').value;
    const price = document.getElementById('watchPrice').value;
    const image = document.getElementById('watchImage').value;
    const category = document.getElementById('watchCategory').value;

    if (!name || !price || !image) return alert("Please fill all fields!");

    // Create a new list including the new watch
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
            alert("Watch successfully uploaded to Dami & Co. Cloud!");
            watches = updatedList;
            renderWatches();
            // Clear inputs
            document.getElementById('watchName').value = "";
            document.getElementById('watchPrice').value = "";
            document.getElementById('watchImage').value = "";
        } else {
            const errorData = await response.json();
            alert("Cloud Error: " + errorData.message);
        }
    } catch (err) {
        alert("Network error. Please try again.");
    }
}

async function deleteProduct(index) {
    if (!confirm("Are you sure you want to delete this watch from the cloud?")) return;

    // Remove from local list
    watches.splice(index, 1);

    try {
        const response = await fetch(URL, {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
                "X-Master-Key": API_KEY,
                "X-Bin-Versioning": "false"
            },
            body: JSON.stringify({ watches: watches }) // Send the updated list
        });

        if (response.ok) {
            alert("Watch deleted successfully!");
            renderWatches();
        } else {
            alert("Delete failed on cloud.");
        }
    } catch (err) {
        alert("Network error while deleting.");
    }
    }

// --- 3. UI LOGIC ---

function renderWatches() {
    const grid = document.getElementById('watchGrid');
    if (!grid) return;
    grid.innerHTML = "";

    // This checks if the Admin Panel is visible
    const isAdmin = !document.getElementById('admin-panel').classList.contains('hidden');

    watches.forEach((watch, index) => {
        grid.innerHTML += `
            <div class="watch-card">
                <img src="${watch.image}" onerror="this.src='https://via.placeholder.com/150?text=No+Image'">
                <h3>${watch.name}</h3>
                <p class="price">₦${watch.price.toLocaleString()}</p>
                
                ${!isAdmin ? `<button onclick="addToCart(${index})">Add to Cart</button>` : ''}
                
                ${isAdmin ? `<button onclick="deleteProduct(${index})" style="background: #ff4444; color: white; margin-top: 10px; border: none; padding: 10px; border-radius: 5px; width: 100%;">Delete Item</button>` : ''}
            </div>
        `;
    });
}

function toggleAdmin() {
    const adminSection = document.getElementById('admin-panel');
    const storefront = document.getElementById('storefront');

    if (adminSection.classList.contains('hidden')) {
        const password = prompt("Enter Admin Password:");
        if (password === adminPass) {
            adminSection.classList.remove('hidden');
            storefront.classList.add('hidden');
            // THIS LINE IS THE KEY: It forces the screen to redraw with Delete buttons
            renderWatches(); 
        } else {
            alert("Access Denied.");
        }
    } else {
        adminSection.classList.add('hidden');
        storefront.classList.remove('hidden');
        // Redraw to remove Delete buttons for security
        renderWatches(); 
    }
}

// --- 4. CART & WHATSAPP ---

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

// Start the app
loadWatches();
