const container = document.getElementById('container');
const angleInit = -80;
let cards
// 卡牌數量 獎品名稱 獎品數量 獎品圖片
const numCards = 20;
const angleIncrement = 360 / numCards;
const prizes = [
    { name: '獎品1', quantity: 2, img: 'img/2.png' },
    { name: '獎品2', quantity: 1, img: 'img/3.png' },
    { name: '獎品3', quantity: 3, img: 'img/4.png' }
];

document.getElementById('game-start').addEventListener('click', () => {
    game()
})

document.getElementById('rotation').addEventListener('click', () => {
    clearInterval(autoRotateInterval);
})


function game() {
    clearInterval(autoRotateInterval);
    container.innerHTML = '';
    let totalPrizes = prizes.reduce((acc, prize) => acc + prize.quantity, 0);
    const prizeList = [];
    for (const prize of prizes) {
        for (let i = 0; i < prize.quantity; i++) {
            prizeList.push(prize.name);
        }
    }

    while (prizeList.length < numCards) {
        prizeList.push('銘謝惠顧');
    }
    prizeList.sort(() => Math.random() - 0.5);

    for (let i = 0; i < numCards; i++) {
        const card = document.createElement('div');
        card.classList.add('card');
        card.id = i
        //card.textContent = i + 1
        card.addEventListener('click', function () {
            const prizeName = prizeList[i];
            const prize = prizes.find(prize => prize.name === prizeName);
            card.classList.add('opencard');
            if (prize) {
                card.style.backgroundImage = `url(${prize.img})`
            }
            card.textContent = ''//prizeName;
        });

        card.style.transform = `rotateY(${i * angleIncrement + angleInit}deg) translateZ(${numCards * 95 / 3.14 / 2}px)`;
        card.style.zIndex = numCards - i;
        container.appendChild(card);
    }
    cards = document.querySelectorAll('.card');
    mousestart()
    autirun()
}

let isDragging = false;
let mouseX = 0;
let previousMouseX = 0;
let inertia = 0.05;

function drawLottery(card) {
    const cardNumber = parseInt(card.textContent);
    console.log('開獎號碼為：', cardNumber);
}

let autoRotateInterval;
function autirun() {
        clearInterval(autoRotateInterval);
        autoRotateInterval = setInterval(() => {
            mouseX += 1;
            updateCardTransforms();
        }, 100);
    }

let isMouseTracking = false;
function mousestart(){
    if (!isMouseTracking) {
        container.addEventListener('mousedown', function (event) {
            isDragging = true;
            previousMouseX = event.clientX;
            inertia = 0;
            clearInterval(autoRotateInterval);
        });
        
        document.addEventListener('mouseup', function () {
            isDragging = false;
            clearInterval(autoRotateInterval);
            autirun()
        });
        
        document.addEventListener('mousemove', function (event) {
            if (isDragging) {
                const delta = event.clientX - previousMouseX;
                mouseX += delta * 0.1;
                previousMouseX = event.clientX;
                updateCardTransforms();
            }
        });
        isMouseTracking = true;
    }
}

function updateCardTransforms() {
    cards.forEach((card, index) => {
        const rotation = mouseX + index * angleIncrement;
        card.style.transform = `rotateY(${rotation}deg) translateZ(${numCards * 95 / 3.14 / 2}px)`;
        const zIndex = numCards - Math.abs(Math.floor(((Math.abs(rotation) - angleInit) % 360) / angleIncrement)) + 1;
        card.style.zIndex = zIndex;
    });
    if (!isDragging) {
        mouseX += inertia;
        inertia *= 0.95;
        if (Math.abs(inertia) < 0.01) {
            inertia = 0;
        }
        requestAnimationFrame(updateCardTransforms);
    }
}
  
