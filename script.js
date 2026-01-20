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

// Historik för de 5 senaste resultaten
let history = [];

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
// LJUDEFFEKTER
// ============================================================================

/**
 * Spelar ett spinljud när hjulet börjar snurra
 * Använder Web Audio API för att skapa en sinusvåg
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
 * Skapar en ljusare och längre ton än spinljudet
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
 * Använder canvasens 2D-kontext för att rita cirkelsektorer
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
    
    // Rita pekare (triangel överst)
    ctx.beginPath();
    ctx.moveTo(centerX, centerY - radius - 30);
    ctx.lineTo(centerX - 20, centerY - radius - 10);
    ctx.lineTo(centerX + 20, centerY - radius - 10);
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
 * Använder requestAnimationFrame för smidig animation
 */
function spinWheel() {
    if (isSpinning || items.length === 0) return;
    
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
     * Använder easing för att få en naturlig inbromsning
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
 * Baserat på den slutliga rotationen
 */
function getSelectedItem() {
    // Pekaren pekar uppåt, så vi måste kompensera
    const normalizedRotation = (360 - (currentRotation % 360)) % 360;
    const anglePerItem = 360 / items.length;
    const selectedIndex = Math.floor(normalizedRotation / anglePerItem);
    return items[selectedIndex];
}

/**
 * Visar resultat-popup med konfetti-animation
 */
function showResult() {
    const selectedItem = getSelectedItem();
    
    // Lägg till i historik
    history.unshift(selectedItem.text);
    if (history.length > 5) history.pop();
    updateHistory();
    
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
    const newColor = prompt('Ange färg (hex-kod, t.ex. #FF6B6B):', items[index].color);
    
    if (newColor && /^#[0-9A-F]{6}$/i.test(newColor)) {
        items[index].color = newColor;
        drawWheel();
        updateItemsList();
    } else if (newColor) {
        alert('Ogiltig färgkod! Använd format: #RRGGBB');
    }
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

/**
 * Uppdaterar historiken i UI:t
 */
function updateHistory() {
    const historyDiv = document.getElementById('history');
    
    if (history.length === 0) {
        historyDiv.innerHTML = '<p class="text-gray-500 italic">Inga resultat än...</p>';
        return;
    }
    
    historyDiv.innerHTML = history.map((item, index) => `
        <div class="flex items-center gap-2 p-2 bg-gray-50 rounded">
            <span class="text-gray-600 font-medium">${index + 1}.</span>
            <span class="text-gray-800">${item}</span>
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

document.getElementById('lever').addEventListener('mousedown', (e) => {
    leverPulled = true;
    e.target.style.transform = 'rotate(30deg)';
});

document.addEventListener('mouseup', () => {
    if (leverPulled) {
        const lever = document.getElementById('lever');
        lever.style.transform = 'rotate(0deg)';
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