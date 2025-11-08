function watchAd() {
    alert("Simulated Ad watched! Coins doubled for 30s.");
    businesses.forEach(b => b.multiplier *= 2);
    setTimeout(() => {
        businesses.forEach(b => b.multiplier /= 2);
        alert("Ad bonus ended.");
    }, 30000); // 30 seconds
}
