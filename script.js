const BIN_ID = "69f85b05856a682189a3d205";
const API_KEY = "$2a$10$jtiYE5Bo5i8dQS6UcZRoIuPoKr9T6d1B25klBDuCXHN08gwnZ5E";
const URL = `https://api.jsonbin.io/v3/b/${BIN_ID}`;


const phoneNumber = "2347074428929"; 
const adminPass = "Dami2024";

let watches = [];
let cart = [];

// --- 2. CLOUD DATA ENGINE ---

// FETCH watches from cloud when site opens
async function loadWatches() {
    try {
        const response = await fetch(URL + '/latest', {
            headers: { "X-Master-Key": API_KEY }
        });
        const data = await response.json();
        // Extract watches from the JSONBin record structure
        watches = data.record.watches || [];
        renderWatches();
    } catch (err) {
        console.error("Cloud load failed:", err);
    }
}

// SAVE watch to cloud
async function saveProduct() {
    const category = document.getElementById('watchCategory').value || "General";
    const name = document.getElementById('watchName').value;
    const price = document.getElementById('watchPrice').value;
    const image = document.getElementById('watchImage').value;

    if(!name || !price || !image) return alert("Please fill all fields!");

    // Add to the local list
    watches.push({ category, name, price: parseInt(price), image });

    // Sync the entire list to the cloud
    try {
        const response = await fetch(URL, {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
                "X-Master-Key": API_KEY
            },
            body: JSON.stringify({ watches: watches })
        });

        if(response.ok) {
            alert("Success! Watch added to cloud.");
            document.getElementById('watchName').value = "";
            document.getElementById('watchPrice').value = "";
            document.getElementById('watchImage').value = "";
            renderWatches();
        }
    } catch (err) {
        alert("Cloud save failed. Check internet.");
    }
}

// DELETE watch from cloud
async function deleteProduct(index) {
    if(confirm("Are you sure you want to delete this watch?")) {
        watches.splice(index, 1);
        await fetch(URL, {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
                "X-Master-Key": API_KEY
            },
            body: JSON.stringify({ watches: watches })
        });
        renderWatches();
    }
}

// --- 3. UI & DISPLAY LOGIC ---

function renderWatches() {
    const grid = document.getElementById('watchGrid');
    if(!grid) return;
    grid.innerHTML = "";

    watches.forEach((watch, index) => {
        grid.innerHTML += `
            <div class="watch-card">
                <img src="${watch.image}" alt="${watch.name}" onerror="this.src='https://via.placeholder.com/150?text=No+Image'">
                <h3>${watch.name}</h3>
                <p>Category: ${watch.category}</p>
                <p class="price">₦${watch.price.toLocaleString()}</p>
                <button onclick="addToCart(${index})">Add to Cart</button>
                <button class="admin-only delete-btn" onclick="deleteProduct(${index})" style="display:none; background:red;">Delete</button>
            </div>
        `;
    });
    
    // If admin is currently logged in, show delete buttons
    if(!document.getElementById('admin-panel').classList.contains('hidden')) {
        showAdminControls();
    }
}

function showAdminControls() {
    document.querySelectorAll('.admin-only').forEach(btn => btn.style.display = 'block');
}

function toggleAdmin() {
    const adminSection = document.getElementById('admin-panel');
    const storefront = document.getElementById('storefront');

    if (adminSection.classList.contains('hidden')) {
        const password = prompt("Enter Admin Password:");
        if (password === adminPass) {
            adminSection.classList.remove('hidden');
            storefront.classList.add('hidden');
            renderWatches();
        } else {
            alert("Access Denied.");
        }
    } else {
        adminSection.classList.add('hidden');
        storefront.classList.remove('hidden');
    }
}

// --- 4. CART & WHATSAPP ---

function addToCart(index) {
    cart.push(watches[index]);
    alert(`${watches[index].name} added to cart!`);
}

function checkout() {
    if (cart.length === 0) return alert("Your cart is empty!");

    let text = "Hello Dami & Co, I want to order:\n\n";
    let total = 0;

    cart.forEach((item, index) => {
        text += `${index + 1}. ${item.name} - ₦${item.price.toLocaleString()}\n`;
        total += item.price;
    });

    text += `\n*Total: ₦${total.toLocaleString()}*`;

    const whatsappURL = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(text)}`;
    window.location.href = whatsappURL;
}

// --- 5. INITIALIZE ---
loadWatches(); 
                     
