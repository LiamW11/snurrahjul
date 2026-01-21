// ============================================================================
// GLOBALA VARIABLER OCH INITIERING
// ============================================================================

// Lista med standardalternativ när applikationen startar
let items = [
    { text: 'Pizza', color: '#FF6B6B' },
    { text: 'Sushi', color: '#4ECDC4' },
    { text: 'Pasta', color: '#FFD93D' },
    { text: 'Burger', color: '#95E1D3' }
];

// Firebase-relaterade variabler
let currentUser = null;              // Firebase User objekt
let allResults = [];                 // Alla resultat från Firestore
let displayedResults = 20;           // Antal resultat som visas (paginering)
let historyExpanded = false;         // Om historik-dropdown är öppen

// Variabel för att hålla koll på om hjulet snurrar
let isSpinning = false;

// Rotation för hjulet (i grader)
let currentRotation = 0;

// Canvas-element och kontext för att rita hjulet
const canvas = document.getElementById('wheelCanvas');
const ctx = canvas.getContext('2d');

// Ljudeffekter (skapas dynamiskt med Web Audio API)
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

// ============================================================================
// FIREBASE AUTHENTICATION
// ============================================================================

/**
 * Lyssnar på auth state changes
 */
auth.onAuthStateChanged((user) => {
    if (user) {
        currentUser = user;
        onUserLoggedIn();
    } else {
        currentUser = null;
        onUserLoggedOut();
    }
});

/**
 * Hanterar inloggning
 */
document.getElementById('googleLoginBtn').addEventListener('click', async () => {
    try {
        await auth.signInWithPopup(googleProvider);
    } catch (error) {
        console.error('Login error:', error);
        const errorDiv = document.getElementById('loginError');
        errorDiv.textContent = 'Inloggning misslyckades. Försök igen.';
        errorDiv.classList.remove('hidden');
    }
});

/**
 * Hanterar utloggning
 */
document.getElementById('logoutBtn').addEventListener('click', async () => {
    if (confirm('Är du säker på att du vill logga ut?')) {
        await auth.signOut();
    }
});

/**
 * Körs när användare loggat in
 */
function onUserLoggedIn() {
    // Dölj overlay
    document.getElementById('authOverlay').classList.add('hidden');
    
    // Ta bort blur från innehåll
    document.getElementById('mainContent').classList.remove('content-blurred');
    
    // Visa logout-knapp
    document.getElementById('logoutBtn').classList.remove('hidden');
    
    // Ladda användarens historik
    loadUserHistory();
}

/**
 * Körs när användare loggat ut
 */
function onUserLoggedOut() {
    // Visa overlay
    document.getElementById('authOverlay').classList.remove('hidden');
    
    // Lägg till blur på innehåll
    document.getElementById('mainContent').classList.add('content-blurred');
    
    // Dölj logout-knapp
    document.getElementById('logoutBtn').classList.add('hidden');
    
    // Rensa lokal data
    allResults = [];
    displayedResults = 20;
    updateHistoryUI();
}

// ============================================================================
// FIRESTORE OPERATIONS
// ============================================================================

/**
 * Laddar all historik för inloggad användare
 */
async function loadUserHistory() {
    if (!currentUser) return;
    
    try {
        const snapshot = await db
            .collection('users')
            .doc(currentUser.uid)
            .collection('results')
            .orderBy('timestamp', 'desc')
            .get();
        
        allResults = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        
        displayedResults = 20;
        updateHistoryUI();
    } catch (error) {
        console.error('Error loading history:', error);
    }
}

/**
 * Sparar ett resultat till Firestore
 */
async function saveResult(selectedItem, wheelItems) {
    if (!currentUser) return;
    
    try {
        const resultData = {
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            selectedItem: selectedItem,
            wheelItems: wheelItems
        };
        
        const docRef = await db
            .collection('users')
            .doc(currentUser.uid)
            .collection('results')
            .add(resultData);
        
        // Lägg till i lokal array (med klient-timestamp för omedelbar visning)
        allResults.unshift({
            id: docRef.id,
            timestamp: new Date(),
            selectedItem: selectedItem,
            wheelItems: wheelItems
        });
        
        updateHistoryUI();
    } catch (error) {
        console.error('Error saving result:', error);
        alert('Kunde inte spara resultatet. Kontrollera din internetanslutning.');
    }
}

/**
 * Raderar ett resultat från Firestore
 */
async function deleteResult(resultId) {
    if (!currentUser) return;
    
    if (!confirm('Är du säker på att du vill radera detta resultat?')) return;
    
    try {
        await db
            .collection('users')
            .doc(currentUser.uid)
            .collection('results')
            .doc(resultId)
            .delete();
        
        // Ta bort från lokal array
        allResults = allResults.filter(r => r.id !== resultId);
        updateHistoryUI();
    } catch (error) {
        console.error('Error deleting result:', error);
        alert('Kunde inte radera resultatet.');
    }
}

// ============================================================================
// HISTORIK UI
// ============================================================================

/**
 * Uppdaterar historik-UI med resultat från Firestore
 */
function updateHistoryUI() {
    const historyList = document.getElementById('historyList');
    const resultCount = document.getElementById('resultCount');
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    
    // Uppdatera räknare
    resultCount.textContent = allResults.length;
    
    if (allResults.length === 0) {
        historyList.innerHTML = '<p class="text-gray-500 italic">Inga resultat än...</p>';
        loadMoreBtn.classList.add('hidden');
        return;
    }
    
    // Visa bara de första X resultaten
    const resultsToShow = allResults.slice(0, displayedResults);
    
    historyList.innerHTML = resultsToShow.map((result, index) => {
        const timestamp = result.timestamp?.toDate ? result.timestamp.toDate() : result.timestamp;
        const dateStr = formatDate(timestamp);
        
        return `
            <div class="flex items-center justify-between gap-2 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div class="flex-1 min-w-0">
                    <span class="text-gray-600 font-medium">${index + 1}.</span>
                    <span class="text-gray-800 font-semibold">${result.selectedItem}</span>
                    <span class="text-gray-500 text-sm">(${result.wheelItems.length} alternativ)</span>
                    <span class="text-gray-400 text-xs block">${dateStr}</span>
                </div>
                <button onclick="deleteResult('${result.id}')" class="text-red-600 hover:text-red-800 text-xl px-2" title="Radera">
                    🗑️
                </button>
            </div>
        `;
    }).join('');
    
    // Visa/dölj "Visa fler"-knapp
    if (allResults.length > displayedResults) {
        loadMoreBtn.classList.remove('hidden');
    } else {
        loadMoreBtn.classList.add('hidden');
    }
}

/**
 * Formaterar datum för visning
 */
function formatDate(date) {
    if (!date) return '';
    
    const d = new Date(date);
    const now = new Date();
    const diffMs = now - d;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'Nyss';
    if (diffMins < 60) return `${diffMins} min sedan`;
    if (diffHours < 24) return `${diffHours} tim sedan`;
    if (diffDays < 7) return `${diffDays} dag${diffDays > 1 ? 'ar' : ''} sedan`;
    
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return d.toLocaleDateString('sv-SE', options);
}

/**
 * Toggle historik dropdown
 */
document.getElementById('historyHeader').addEventListener('click', () => {
    const dropdown = document.getElementById('historyDropdown');
    const toggle = document.getElementById('historyToggle');
    
    historyExpanded = !historyExpanded;
    
    if (historyExpanded) {
        dropdown.classList.remove('hidden');
        toggle.style.transform = 'rotate(180deg)';
    } else {
        dropdown.classList.add('hidden');
        toggle.style.transform = 'rotate(0deg)';
    }
});

/**
 * Ladda fler resultat (paginering)
 */
document.getElementById('loadMoreBtn').addEventListener('click', () => {
    displayedResults += 20;
    updateHistoryUI();
});

// ============================================================================
// LJUDEFFEKTER
// ============================================================================

/**
 * Spelar ett spinljud när hjulet börjar snurra
 */
function playSpinSound() {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 200;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
}

/**
 * Spelar ett resultatljud när hjulet stannat
 */
function playResultSound() {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 523.25; // C5 ton
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 1);
}

// ============================================================================
// HJUL-RITNING
// ============================================================================

/**
 * Ritar hjulet på canvas baserat på nuvarande objekt och rotation
 */
function drawWheel() {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 200;
    
    // Rensa canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Spara kontexten innan rotation
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate((currentRotation * Math.PI) / 180);
    ctx.translate(-centerX, -centerY);
    
    // Rita varje sektor
    const anglePerItem = (2 * Math.PI) / items.length;
    
    items.forEach((item, index) => {
        const startAngle = index * anglePerItem;
        const endAngle = startAngle + anglePerItem;
        
        // Rita sektorn
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.closePath();
        ctx.fillStyle = item.color;
        ctx.fill();
        
        // Rita kant mellan sektorer
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 3;
        ctx.stroke();
        
        // Rita text
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(startAngle + anglePerItem / 2);
        ctx.textAlign = 'center';
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 18px Arial';
        ctx.clip();
        ctx.fillText(item.text, radius * 0.65, 0);
        ctx.restore();
    });
    
    ctx.restore();
    
    // Rita yttre kant
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 5;
    ctx.stroke();
    
    // Rita pekare (triangel till höger)
    const pointerX = centerX;
    const pointerY = centerY + radius + 30;
    
    ctx.beginPath();
    ctx.moveTo(pointerX + 20, pointerY);
    ctx.lineTo(pointerX - 20, pointerY);
    ctx.lineTo(pointerX, pointerY - 20);
    ctx.closePath();
    ctx.fillStyle = '#FF6B6B';
    ctx.fill();
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.stroke();
}

// ============================================================================
// SNURR-FUNKTIONALITET
// ============================================================================

/**
 * Startar snurret med en slumpmässig rotation
 */
function spinWheel() {
    if (isSpinning || items.length === 0 || !currentUser) return;
    
    isSpinning = true;
    playSpinSound();
    
    // Slumpmässig rotation mellan 720 och 2160 grader (2-6 varv)
    const spinRotation = 720 + Math.random() * 1440;
    const startRotation = currentRotation;
    const targetRotation = startRotation + spinRotation;
    
    const duration = 3000; // 3 sekunder
    const startTime = Date.now();
    
    /**
     * Animationsfunktion som anropas för varje frame
     */
    function animate() {
        const currentTime = Date.now();
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function (ease-out cubic)
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        
        currentRotation = startRotation + spinRotation * easeProgress;
        drawWheel();
        
        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            // Snurret klart - visa resultat
            currentRotation = targetRotation % 360;
            drawWheel();
            isSpinning = false;
            showResult();
        }
    }
    
    animate();
}

/**
 * Räknar ut vilket objekt hjulet landade på
 */
function getSelectedItem() {
    // Pekaren pekar åt höger, kompensera för det
    const normalizedRotation = (90 - (currentRotation % 360) + 360) % 360;
    const anglePerItem = 360 / items.length;
    const selectedIndex = Math.floor(normalizedRotation / anglePerItem);
    return items[selectedIndex];
}

/**
 * Visar resultat-popup med konfetti-animation
 */
function showResult() {
    const selectedItem = getSelectedItem();
    
    // Spara till Firestore
    const wheelItemsText = items.map(item => item.text);
    saveResult(selectedItem.text, wheelItemsText);
    
    // Visa popup
    const popup = document.getElementById('resultPopup');
    const popupContent = document.getElementById('popupContent');
    const resultText = document.getElementById('resultText');
    
    resultText.textContent = selectedItem.text;
    resultText.style.color = selectedItem.color;
    
    popup.classList.remove('hidden');
    popup.classList.add('flex');
    
    // Animera popup
    setTimeout(() => {
        popupContent.style.transform = 'scale(1)';
    }, 10);
    
    // Spela ljud och visa konfetti
    playResultSound();
    createConfetti();
}

// ============================================================================
// KONFETTI-ANIMATION
// ============================================================================

/**
 * Skapar konfetti-element som faller ner över skärmen
 */
function createConfetti() {
    const colors = ['#FF6B6B', '#4ECDC4', '#FFD93D', '#95E1D3', '#A8E6CF'];
    const confettiCount = 50;
    
    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.top = '-10px';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDelay = Math.random() * 0.5 + 's';
        confetti.style.animationDuration = (2 + Math.random()) + 's';
        
        document.body.appendChild(confetti);
        
        // Ta bort efter animation
        setTimeout(() => confetti.remove(), 3500);
    }
}

// ============================================================================
// OBJEKT-HANTERING
// ============================================================================

/**
 * Lägger till ett nytt objekt till hjulet
 */
function addItem() {
    const input = document.getElementById('itemInput');
    const text = input.value.trim();
    
    if (text === '') return;
    
    // Slumpmässig färg för det nya objektet
    const colors = ['#FF6B6B', '#4ECDC4', '#FFD93D', '#95E1D3', '#A8E6CF', '#F38181', '#AA96DA', '#FCBAD3'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    items.push({ text, color: randomColor });
    input.value = '';
    
    drawWheel();
    updateItemsList();
}

/**
 * Tar bort ett objekt från hjulet
 */
function removeItem(index) {
    if (items.length <= 2) {
        alert('Du måste ha minst 2 alternativ på hjulet!');
        return;
    }
    
    items.splice(index, 1);
    drawWheel();
    updateItemsList();
}

/**
 * Ändrar färg på ett objekt
 */
function changeColor(index) {
    // Skapa en temporär color input
    const colorInput = document.createElement('input');
    colorInput.type = 'color';
    colorInput.value = items[index].color;
    
    colorInput.addEventListener('change', (e) => {
        items[index].color = e.target.value;
        drawWheel();
        updateItemsList();
    });
    
    colorInput.click();
}

/**
 * Uppdaterar listan över objekt i UI:t
 */
function updateItemsList() {
    const list = document.getElementById('itemsList');
    
    if (items.length === 0) {
        list.innerHTML = '<p class="text-gray-500 italic">Inga alternativ ännu...</p>';
        return;
    }
    
    list.innerHTML = items.map((item, index) => `
        <div class="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
            <div class="w-6 h-6 rounded-full border-2 border-gray-300" style="background-color: ${item.color}"></div>
            <span class="flex-1 font-medium text-gray-800">${item.text}</span>
            <button onclick="changeColor(${index})" class="text-blue-600 hover:text-blue-800 text-sm font-medium px-2">Färg</button>
            <button onclick="removeItem(${index})" class="text-red-600 hover:text-red-800 text-sm font-medium px-2">Ta bort</button>
        </div>
    `).join('');
}

// ============================================================================
// SPAK-ANIMATION
// ============================================================================

/**
 * Hanterar spakens drag-animation
 */
let leverPulled = false;

document.getElementById('lever').addEventListener('dragstart', (e) => {
    leverPulled = true;
    e.target.style.transform = 'translateY(185px)';
});

document.addEventListener('dragend', () => {
    if (leverPulled) {
        const lever = document.getElementById('lever');
        lever.style.transform = 'translateY(0)';
        leverPulled = false;
        spinWheel();
    }
});

// ============================================================================
// EVENT LISTENERS
// ============================================================================

// Lägg till objekt vid knapptryck
document.getElementById('addBtn').addEventListener('click', addItem);

// Lägg till objekt vid Enter-tryck
document.getElementById('itemInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addItem();
});

// Snurra hjul vid klick på canvas
canvas.addEventListener('click', spinWheel);

// Stäng popup
document.getElementById('closePopup').addEventListener('click', () => {
    const popup = document.getElementById('resultPopup');
    const popupContent = document.getElementById('popupContent');
    
    popupContent.style.transform = 'scale(0)';
    
    setTimeout(() => {
        popup.classList.add('hidden');
        popup.classList.remove('flex');
    }, 300);
});

// ============================================================================
// INITIERING
// ============================================================================

// Rita hjulet och uppdatera listor vid start
drawWheel();
updateItemsList();