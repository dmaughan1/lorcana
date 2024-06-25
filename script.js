let deck = []; // Initialize an empty array for the deck

// Fetch deck data from deck.json
fetch('https://raw.githubusercontent.com/dmaughan1/lorcana/main/heartless.json')
    .then(response => response.json())
    .then(data => {
        deck = data; // Assign the fetched data to the deck array
		deck = shuffleDeck(deck);
        // Now you can use deck array as before
        updateCardCount(); // Call a function to initialize your game logic
    })
    .catch(error => {
        console.error('Error fetching deck:', error);
    });

const deckElement = document.getElementById('deck');
const cardCountElement = document.getElementById('card-count');
const slots = document.querySelectorAll('.slot');
const damageCounterButton = document.getElementById('damage-counter-button');

updateCardCount();

deckElement.addEventListener('click', () => {
    if (deck.length > 0) {
        deck.pop();
        updateCardCount();
    }
});

slots.forEach(slot => {
    slot.addEventListener('click', () => {
        if (deck.length > 0 && slot.children.length === 0) {
            const topCard = deck.pop();
            const img = document.createElement('img');
            img.src = topCard;
            slot.appendChild(img);
            updateCardCount();

            img.addEventListener('click', (event) => {
                event.stopPropagation();
                slot.removeChild(img);
            });
        }
    });
});

damageCounterButton.addEventListener('click', () => {
    const damageCounter = document.createElement('div');
    damageCounter.classList.add('damage-counter');
    document.body.appendChild(damageCounter);
    makeDraggable(damageCounter);
});

function updateCardCount() {
    cardCountElement.textContent = `Cards Remaining: ${deck.length}`;
}

function makeDraggable(element) {
    let isDragging = false;
    let initialX, initialY;

    element.onmousedown = function(event) {
        isDragging = false;
        initialX = event.clientX;
        initialY = event.clientY;

        let shiftX = event.clientX - element.getBoundingClientRect().left;
        let shiftY = event.clientY - element.getBoundingClientRect().top;

        function moveAt(pageX, pageY) {
            element.style.left = pageX - shiftX + 'px';
            element.style.top = pageY - shiftY + 'px';
        }

        function onMouseMove(event) {
            if (Math.abs(event.clientX - initialX) > 3 || Math.abs(event.clientY - initialY) > 3) {
                isDragging = true;
            }
            moveAt(event.pageX, event.pageY);
        }

        document.addEventListener('mousemove', onMouseMove);

        element.onmouseup = function() {
            document.removeEventListener('mousemove', onMouseMove);
            element.onmouseup = null;
            if (!isDragging) {
                document.body.removeChild(element);
            }
        };

        element.ondragstart = function() {
            return false;
        };
    };
}


function shuffleDeck(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
}