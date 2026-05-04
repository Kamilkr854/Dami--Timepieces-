const BIN_ID = "69f85b05856a682189a3d205";
const API_KEY = "$2a$10$jtiYE5Bo5i8dQS6UcZRoIuPoKr9T6dlB25klBDRuCXHN08gwnZ5E.";
const URL = `https://api.jsonbin.io/v3/b/${BIN_ID}`;

let watches = []; 

let cart = [];

// --- UPDATE THESE TWO LINES ---
const phoneNumber = "2347074428929"; 
const adminPass = "Dami2024";      

// FETCH FROM CLOUD ON START
async function loadWatches() {
    try {
        const response = await fetch(URL + '/latest', {
            headers: { "X-Master-Key": API_KEY }
        });
        const data = await response.json();
        // This line pulls the watches from your Bin
        watches = data.record.watches || [];
        renderWatches();
    } catch (err) {
        console.error("Cloud load failed:", err);
    }
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

function saveProduct() {
    const category = document.getElementById('watchCategory').value || "General";
    const name = document.getElementById('watchName').value;
    const price = document.getElementById('watchPrice').value;
    const image = document.getElementById('watchImage').value;

    if(!name || !price || !image) return alert("Fill in Name, Price, and Image!");

    watches.push({ category, name, price: parseInt(price), image });
    localStorage.setItem('dami_watches', JSON.stringify(watches));
    
    // Clear inputs
    document.getElementById('watchCategory').value = '';
    document.getElementById('watchName').value = '';
    document.getElementById('watchPrice').value = '';
    document.getElementById('watchImage').value = '';
    
    alert("Watch Added!");
    renderWatches();
}

function deleteProduct(index) {
    if(confirm("Delete this watch?")) {
        watches.splice(index, 1);
        localStorage.setItem('dami_watches', JSON.stringify(watches));
        renderWatches();
    }
}

function renderWatches() {
    const grid = document.getElementById('watch-grid');
    const adminList = document.getElementById('admin-list');
    
    const grouped = watches.reduce((acc, watch) => {
        (acc[watch.category] = acc[watch.category] || []).push(watch);
        return acc;
    }, {});

    grid.innerHTML = Object.keys(grouped).map(cat => `
        <div style="grid-column: 1/-1; text-align:left; padding: 20px 0 10px;">
            <h2 style="font-family:'Cinzel'; border-bottom: 1px solid #ddd; display:inline-block;">${cat}</h2>
        </div>
        ${grouped[cat].map(w => {
            const originalIndex = watches.indexOf(w);
            return `
                <div class="watch-card">
                    <img src="${w.image}" onerror="this.src='https://via.placeholder.com/150?text=Check+Link'">
                    <h3>${w.name}</h3>
                    <p>₦${w.price.toLocaleString()}</p>
                    <button onclick="addToCart(${originalIndex})" class="add-to-cart-small">Add to Cart</button>
                </div>
            `;
        }).join('')}
    `).join('');

    adminList.innerHTML = watches.map((w, index) => `
        <div style="display:flex; justify-content:space-between; background:#fff; padding:10px; margin-bottom:5px; color:#000;">
            <span>${w.category}: ${w.name}</span>
            <button onclick="deleteProduct(${index})" style="background:red; color:white; border:none; padding:5px;">Delete</button>
        </div>
    `).join('');
}

function addToCart(index) {
    cart.push(watches[index]);
    alert(watches[index].name + " added!");
}

function checkoutToWhatsApp() {
    if (cart.length === 0) return alert("Cart is empty!");
    let text = "*New Order from Dami & Co.*\n\n";
    let total = 0;
    cart.forEach(item => {
        text += `• ${item.name} [${item.category}]: ₦${item.price.toLocaleString()}\n`;
        total += item.price;
    });
    text += `\n*Total: ₦${total.toLocaleString()}*`;
        const whatsappURL = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(text)}`;
    
    window.location.href = whatsappURL;
}

loadWatches();
