// Data for the hot new item
const newItem = {
    name: "Amazing 3D Print",
    description: "This week's hottest 3D-printed creation!"
};

// Calculate time remaining until next 10 PM
function getTimeUntilNext10PM() {
    const now = new Date();
    const next10PM = new Date();

    // Set next10PM to today at 10 PM
    next10PM.setHours(22, 0, 0, 0);

    // If it's past 10 PM today, move to tomorrow
    if (now > next10PM) {
        next10PM.setDate(next10PM.getDate() + 1);
    }

    return next10PM - now;
}

// Start a countdown timer
function startCountdown(elementId, duration) {
    const element = document.getElementById(elementId);

    function updateTimer() {
        const remainingTime = duration - (Date.now() - startTime);
        if (remainingTime <= 0) {
            element.textContent = "Time's up!";
            clearInterval(interval);
        } else {
            const hours = Math.floor((remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);
            element.textContent = `${hours}h ${minutes}m ${seconds}s remaining`;
        }
    }

    const startTime = Date.now();
    const interval = setInterval(updateTimer, 1000);
    updateTimer(); // Initial update
}

// Load the 24-hour spot
function load24HourSpot() {
    if (document.getElementById("hourly-spot")) {
        document.getElementById("hourly-item-name").textContent = newItem.name;
        document.getElementById("hourly-item-description").textContent = `Exclusive preview! ${newItem.description}`;

        const timeUntilNext10PM = getTimeUntilNext10PM();
        startCountdown("hourly-timer", timeUntilNext10PM);

        setTimeout(() => moveToWeeklySpot(newItem), timeUntilNext10PM);
    }
}

// Load the weekly spot
function loadWeeklySpot() {
    if (document.getElementById("weekly-spot")) {
        const weeklyItem = JSON.parse(localStorage.getItem("weeklyItem"));
        if (weeklyItem) {
            document.getElementById("weekly-item-name").textContent = weeklyItem.name;
            document.getElementById("weekly-item-description").textContent = weeklyItem.description;

            const timeUntilNextSunday = getTimeUntilNextSunday();
            startCountdown("weekly-timer", timeUntilNextSunday);

            setTimeout(() => moveItemToForSale(weeklyItem), timeUntilNextSunday);
        }
    }
}

// Calculate time remaining until next Sunday at midnight
function getTimeUntilNextSunday() {
    const now = new Date();
    const nextSunday = new Date();
    nextSunday.setDate(now.getDate() + (7 - now.getDay()) % 7); // Set to the next Sunday
    nextSunday.setHours(0, 0, 0, 0); // Set time to midnight
    return nextSunday - now;
}

// Move item to weekly spot
function moveToWeeklySpot(item) {
    localStorage.setItem("weeklyItem", JSON.stringify(item));
    loadWeeklySpot();
}

// Move item to for-sale page
function moveItemToForSale(item) {
    const saleItems = JSON.parse(localStorage.getItem("saleItems")) || [];
    saleItems.push(item);
    localStorage.setItem("saleItems", JSON.stringify(saleItems));
}

// Add to cart
function addToCart(type) {
    let item;
    if (type === "hourly") item = newItem;
    else if (type === "weekly") item = JSON.parse(localStorage.getItem("weeklyItem"));
    if (item) {
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        cart.push(item);
        localStorage.setItem("cart", JSON.stringify(cart));
        alert(`${item.name} added to cart!`);
    }
}

// Populate cart page
function populateCart() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const cartList = document.getElementById("cart-list");
    cart.forEach(item => {
        const li = document.createElement("li");
        li.innerHTML = `<strong>${item.name}</strong>: ${item.description}`;
        cartList.appendChild(li);
    });
    if (!cart.length) cartList.innerHTML = "<li>Your cart is empty!</li>";
}

// Populate For Sale page
function populateForSalePage() {
    const saleItems = JSON.parse(localStorage.getItem("saleItems")) || [];
    const saleItemsList = document.getElementById("sale-items");
    saleItems.forEach((item, index) => {
        const li = document.createElement("li");
        li.innerHTML = `
            <strong>${item.name}</strong>: ${item.description}
            <button onclick="addToCartFromSale(${index})">Buy Now</button>
        `;
        saleItemsList.appendChild(li);
    });
    if (!saleItems.length) saleItemsList.innerHTML = "<li>No items for sale.</li>";
}

// Navigate to Cart
function goToCart() {
    window.location.href = "cart.html";
}

// Initialize the correct page
if (document.getElementById("hourly-spot")) load24HourSpot();
else if (document.getElementById("weekly-spot")) loadWeeklySpot();
else if (document.getElementById("cart-list")) populateCart();
else if (document.getElementById("sale-items")) populateForSalePage();
