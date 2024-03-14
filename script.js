const container = document.getElementById('container');
const angleInit = -80;
let cards
// 卡牌數量 獎品名稱 獎品數量 獎品圖片
let rot = true
let bag = false
let numCards = 20;
let angleIncrement = 360 / numCards;
let prizes = [
    { name: '紅卡', quantity: 2, img: 'img/2.png' },
    { name: '橘卡', quantity: 1, img: 'img/3.png' },
    { name: '藍卡', quantity: 3, img: 'img/4.png' }
];

document.getElementById('rotation').addEventListener('click', () => {
    clearInterval(autoRotateInterval);
})

function gameset(){
    numCards=parseInt(document.getElementById('count').value)
    angleIncrement = 360 / numCards;
    rot = document.getElementById('option1').checked
    bag = document.getElementById('option2').checked

}

function generateTableWithInputs(rows) {
    var table = '<table border="1">';
    table += '<tr>';
    table += '<th>名稱</th>';
    table += '<th>3:5圖片源(URL)</th>';
    table += '<th>數量(概率)</th>';
    table += '</tr>';
    for (var row = 0; row < rows; row++) {
        table += '<tr>';
        table += '<td><input name="col0" type="text"></td>';
        table += '<td><input name="col1" type="text"></td>';
        table += '<td><input name="col2" type="number" min=0 value="0"></td>';
        table += '</tr>';
    }

    table += '</table>';
    document.getElementById('table-container1').innerHTML = table;
    document.getElementById('table-container2').innerHTML = table;
    document.getElementById('table-container3').innerHTML = table;
}
generateTableWithInputs(10);

for (var ex=0; ex<prizes.length;ex++){
    document.getElementById('table-container1').querySelectorAll('input[name="col0"]')[ex].value=prizes[ex].name
    document.getElementById('table-container1').querySelectorAll('input[name="col1"]')[ex].value=prizes[ex].img
    document.getElementById('table-container1').querySelectorAll('input[name="col2"]')[ex].value=prizes[ex].quantity
}

function isImageURL(url) {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.svg', 'webp'];
    const lowerCaseURL = url.toLowerCase();
    return imageExtensions.some(ext => lowerCaseURL.endsWith(ext));
}

document.getElementById('game-start').addEventListener('click', () => {
    let _name = '';
    let _quantity = 0;
    let _img = '';
    let _id = 0;
    prizes = [];
    const containers = document.querySelectorAll('.table-container');
    containers.forEach(container => {
        const inputs = container.querySelectorAll('input');
        const filledInputs = Array.from(inputs).filter(input => input.value.trim() !== '');
        filledInputs.forEach(input => {
            if (input.name === 'col0' && input.value.trim() !== '') {
                _name = input.value.trim();
            } else if (input.name === 'col1' && input.value.trim() !== '') {
                _img = input.value.trim();
            } else if (input.name === 'col2' && input.value.trim() !== '') {
                _quantity = parseInt(input.value.trim(), 10);
            }
            if ((_name && _quantity > 0) || (_img && _quantity > 0)) {
                if(isImageURL(_img)){
                    prizes.push({id:_id, name: _name, img:_img, quantity: _quantity });
                }else{
                    prizes.push({id:_id, name: _name, img:'', quantity: _quantity });
                }
                _name = '';
                _quantity = 0;
                _img = '';
                _id++;
            }
        });
        if (filledInputs.length === 0) {
            console.log('沒有填入資料的單元格');
        }
    });
    game()
});


function getRandomlist(list) {
    const randomIndex = Math.floor(Math.random() * list.length);
    return list[randomIndex];
}

function game() {
    gameset()
    clearInterval(autoRotateInterval);
    container.innerHTML = '';
    let totalPrizes = prizes.reduce((acc, prize) => acc + prize.quantity, 0);
    const prizeList = [];
    for (const prize of prizes) {
        if (bag) {
            for (let i = 0; i < prize.quantity * 5; i++) {
                prizeList.push(prize.id);
            }
        } else {
            for (let i = 0; i < prize.quantity; i++) {
                prizeList.push(prize.id);
            }
        }
    };
    if (bag) {
        while (prizeList.length < 500) {
            prizeList.push('');
        }
    } else {
        while (prizeList.length < numCards) {
            prizeList.push('');
        }
    };

    prizeList.sort(() => Math.random() - 0.5);
    console.log(prizeList)

    for (let i = 0; i < numCards; i++) {
        const card = document.createElement('div');
        let prizeId
        card.classList.add('card');
        card.id = i
        //card.textContent = i + 1
        card.addEventListener('click', function () {
            if(bag){
                prizeId = getRandomlist(prizeList);
            }else{
                prizeId = prizeList[i];
            }
            const prize = prizes.find(prize => prize.id === prizeId);
            card.classList.add('opencard');
            if (prize) {
                card.style.backgroundImage = `url(${prize.img})`
                card.textContent = prize.name;
            }
        });

        card.style.transform = `rotateY(${i * angleIncrement + angleInit}deg) translateZ(${numCards * 100 / 3.14/2*1.5}px)`;
        card.style.zIndex = (numCards - i)*2;
        container.appendChild(card);
    }
    const card = document.createElement('div');
    card.id = "wall"
    card.style.zIndex = Math.ceil(numCards / 2) * 2 + 1
    container.appendChild(card);

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
    if (rot){
        clearInterval(autoRotateInterval);
        autoRotateInterval = setInterval(() => {
            mouseX += 1;
            updateCardTransforms();
        }, 100);
    }
    }

let isMouseTracking = false;
function mousestart(){
    if (!isMouseTracking) {
        container.addEventListener('mouseenter', function (event) {
            clearInterval(autoRotateInterval);
        });

        container.addEventListener('mouseleave', function (event) {
            clearInterval(autoRotateInterval);
            autirun()
        });

        container.addEventListener('mousedown', function (event) {
            isDragging = true;
            previousMouseX = event.clientX;
            inertia = 0;
            clearInterval(autoRotateInterval);
        });
        
        document.addEventListener('mouseup', function () {
            isDragging = false;
            clearInterval(autoRotateInterval);
            //autirun()
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

//function updateCardTransforms() {
//    cards.forEach((card, index) => {
//        const rotation = mouseX + index * angleIncrement;
//        card.style.transform = `rotateY(${rotation}deg) translateZ(${numCards * 95 / 3.14 / 2}px)`;
//        const zIndex = numCards - Math.abs(Math.floor(((Math.abs(rotation) - angleInit) % 360) / angleIncrement)) + 1;
//        card.style.zIndex = zIndex;
//    });
//    if (!isDragging) {
//        mouseX += inertia;
//        inertia *= 0.95;
//        if (Math.abs(inertia) < 0.01) {
//            inertia = 0;
//        }
//        requestAnimationFrame(updateCardTransforms);
//    }
//}
//  
function updateCardTransforms() {
    const newStyles = [];
    for (let i = 0; i < cards.length; i++) {
        const rotation = mouseX + i * angleIncrement;
        const zIndex = (numCards - Math.abs(Math.floor(((Math.abs(rotation) - angleInit) % 360) / angleIncrement)))*2;
        const transformValue = `rotateY(${rotation}deg) translateZ(${numCards * 100 / 3.14 / 2}px)`;
        newStyles.push({ transform: transformValue, zIndex: zIndex });
    }
    cards.forEach((card, index) => {
        const { transform, zIndex } = newStyles[index];
        card.style.transform = transform;
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