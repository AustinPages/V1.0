// Game State
let coins = 0;
let prestigeCoins = 0;

let businesses = [
    { name: "Intern Cat", baseCost: 10, income: 1, owned: 0, cost: 10, multiplier: 1, sprite: "assets/cats/intern.png" },
    { name: "Coder Cat", baseCost: 100, income: 10, owned: 0, cost: 100, multiplier: 1, sprite: "assets/cats/coder.png" },
    { name: "Manager Cat", baseCost: 1000, income: 100, owned: 0, cost: 1000, multiplier: 1, sprite: "assets/cats/manager.png" },
    { name: "Director Cat", baseCost: 10000, income: 1000, owned: 0, cost: 10000, multiplier: 1, sprite: "assets/cats/director.png" },
    { name: "VP Cat", baseCost: 100000, income: 10000, owned: 0, cost: 100000, multiplier: 1, sprite: "assets/cats/vp.png" },
    { name: "CEO Cat", baseCost: 1000000, income: 100000, owned: 0, cost: 1000000, multiplier: 1, sprite: "assets/cats/ceo.png" },
];

let departments = [
    { name: "Marketing", unlocked: false, multiplier: 1.2, requirement: 5 },
    { name: "R&D", unlocked: false, multiplier: 1.5, requirement: 10 },
    { name: "Legal", unlocked: false, multiplier: 2, requirement: 20 },
];

// --- Render Businesses ---
function renderBusinesses() {
    const container = document.getElementById('businesses');
    container.innerHTML = '';
    businesses.forEach((b, i) => {
        const div = document.createElement('div');
        div.className = 'business';
        div.innerHTML = `
            <img src="${b.sprite}" alt="${b.name}">
            <h4>${b.name}</h4>
            <p>Income: ${(b.income * b.multiplier).toFixed(0)}/s</p>
            <p>Owned: ${b.owned}</p>
            <p>Cost: ${b.cost}</p>
            <button onclick="buyBusiness(${i})">Hire</button>
            <button onclick="upgradeBusiness(${i})">Upgrade x2</button>
        `;
        container.appendChild(div);
    });
}

// --- Render Departments ---
function renderDepartments() {
    const container = document.getElementById('departments');
    container.innerHTML = '';
    departments.forEach(d => {
        const div = document.createElement('div');
        div.className = 'department';
        div.textContent = `${d.name} ${d.unlocked ? "(Unlocked)" : "(Locked)"}`;
        container.appendChild(div);
    });
}

// --- Buy / Upgrade ---
function buyBusiness(index) {
    const b = businesses[index];
    if (coins >= b.cost) {
        coins -= b.cost;
        b.owned += 1;
        b.cost = Math.floor(b.baseCost * Math.pow(1.15, b.owned));
        checkDepartments();
        updateUI();
    }
}

function upgradeBusiness(index) {
    const b = businesses[index];
    const upgradeCost = b.baseCost * 5;
    if (coins >= upgradeCost) {
        coins -= upgradeCost;
        b.multiplier *= 2;
        updateUI();
    }
}

// --- Income Loop ---
function incomeLoop() {
    let totalIncome = 0;
    businesses.forEach(b => totalIncome += b.income * b.owned * b.multiplier);
    departments.forEach(d => { if (d.unlocked) totalIncome *= d.multiplier; });
    coins += totalIncome;
    updateUI();
}
setInterval(incomeLoop, 1000);

// --- Departments ---
function checkDepartments() {
    let totalCats = businesses.reduce((sum,b)=>sum+b.owned,0);
    departments.forEach(d => { if (!d.unlocked && totalCats >= d.requirement) d.unlocked = true; });
}

// --- Random Event ---
function triggerRandomEvent() {
    const events = [
        { name: "Laser Pointer Frenzy", effect: 2, duration: 10 },
        { name: "Coffee Spill", effect: 0.5, duration: 10 },
        { name: "Team Building", effect: 3, duration: 5 }
    ];
    const event = events[Math.floor(Math.random()*events.length)];
    alert(`Random Event: ${event.name} (${event.effect}x income for ${event.duration}s)`);
    businesses.forEach(b => b.multiplier *= event.effect);
    setTimeout(()=>{ businesses.forEach(b => b.multiplier /= event.effect); }, event.duration*1000);
}

// --- Prestige ---
function prestige() {
    const threshold = 1000000;
    if (coins >= threshold) {
        let earned = Math.floor(coins / threshold);
        prestigeCoins += earned;
        coins = 0;
        businesses.forEach(b => { b.owned = 0; b.cost = b.baseCost; b.multiplier = 1; });
        departments.forEach(d => d.unlocked = false);
        updateUI();
        alert(`Prestige! Earned ${earned} Prestige Coins`);
    } else alert(`Need ${threshold} coins to prestige.`);
}

// --- Update UI ---
function updateUI() {
    document.getElementById('coins').innerText = coins.toFixed(0);
    document.getElementById('prestigeCoins').innerText = prestigeCoins;
    renderBusinesses();
    renderDepartments();
}

// --- Initial Render ---
updateUI();
