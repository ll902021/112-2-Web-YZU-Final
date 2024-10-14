//結算部分
var score = []; //存放十天的餘額

//其他人寫的時間
let currentDay = 1; // 初始天數

var exchange_text = document.getElementById('exchange'); //匯率
var exchange = document.getElementById('exchange').textContent;     //如果直接讀html的文字要用textcontent，如果是input型態用value
exchange = Number(exchange);

var wallet_text = document.getElementById('wallet'); //錢包
var wallet = document.getElementById('wallet').textContent;
wallet = Number(wallet);

var price_text = document.querySelectorAll('.price');    //調整價格
var price_values = [];
price_text.forEach(function(price) {
    var num = Number(price.textContent);
    price_values.push(num);
});

var productQuantity_text = document.querySelectorAll('.productQuantity');  //庫存食材
var productQuantity_values = [];
productQuantity_text.forEach(function(productQuantity) {
    var num = Number(productQuantity.textContent);
    productQuantity_values.push(num);
});

var gaincuisine_text = document.querySelectorAll('.gaincuisine');  //收成料理
var gaincuisine_values = [];
gaincuisine_text.forEach(function(gaincuisine) {
    var num = Number(gaincuisine.textContent);
    gaincuisine_values.push(num);
});

const nick    = new Image();
const talkbox = new Image();
const nick2   = new Image(); 

const page1   = new Image();
const page2   = new Image();
const page3   = new Image();
const page4   = new Image();

const right   = new Image();
const left    = new Image();
const ingredients  = new Image();
const cooked       = new Image();

const image = {
    pot1: new Image(),
    pot2: new Image(),
    pot3: new Image()
}
image.pot1.src = '/static/images/pot.png';
image.pot2.src = '/static/images/pot.png';
image.pot3.src = '/static/images/pot.png';

const pot = new Image();
var page = 0;
const potPositions = []; // 用來儲存pot圖片的位置
var clickCount = 0;

//紀錄鍋子是否在煮食物
const start = [false, false, false];
//計時器圖片的位置和狀態
const stoves = [
    { x: 550, y: 410, state: 0, timer: null },
    { x: 510, y: 470, state: 0, timer: null },
    { x: 470, y: 530, state: 0, timer: null }
];

//鍋子的位置及是否載入
const pots = [
    { x: 475, y: 410, bool: false },
    { x: 435, y: 470, bool: false },
    { x: 395, y: 530, bool: false }
]; 

//倒數計時相關物件
const imgCook = new Image();
const imgDone = new Image();
imgCook.src = '/static/images/clock/計時器.png';
imgDone.src = '/static/images/clock/完成.png';

let nickVisable    = true;
let nick2Visable   = false;
let talkboxVisable = false;
let marketVisable  = false;
let ingredientsVisable  = false;
let cookedVisable       = false;
let foodVisable         = false;

let currentRequest = null;
const potWidth = image.pot1.width*0.4;
const potHeight = image.pot1.height*0.4;

const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

nick.src = '/static/images/nick.png';
const nickWidth  = nick.width / 2.3;
const nickHeight = nick.height / 2.3;

nick2.src = '/static/images/nick2.png';
const nick2Width  = nick2.width*1.2;
const nick2Height = nick2.height*1.2;

const page1Width  = page1.width/1.2;
const page1Height = page1.height/1.2;

page2.src = '/static/images/food_market/page2.png';
const page2Width  = page2.width/1.2;
const page2Height = page2.height/1.2;

const page3Width  = page3.width/1.2;
const page3Height = page3.height/1.2;
page3.src = '/static/images/food_market/page3.png';

const page4Width  = page4.width/1.2;
const page4Height = page4.height/1.2;
page4.src = '/static/images/food_market/page4.png';


right.src = '/static/images/food_market/right.png';
const rightWidth  = right.width/6;
const rightHeight = right.height/6;
    
left.src = '/static/images/food_market/left.png';
const leftWidth  = left.width/6;
const leftHeight = left.height/6;


cooked.src = '/static/images/recipe/cooked.png';
const cookedWidth  = cooked.width/1.2;
const cookedHeight = cooked.height/1.2;

ingredients.src = '/static/images/recipe/ingredients.png';
const ingredientsWidth  = ingredients.width/1.5;
const ingredientsHeight = ingredients.height/1.5;

talkbox.src = '/static/images/talkbox.png';
const talkboxWidth  = talkbox.width*1.8;
const talkboxHeight = talkbox.height*1.8;

nick.onload = function() {
    ctx.drawImage(nick, 1100, 550, nickWidth, nickHeight); 
    nickVisable = true;
};



function Nick(){
    if(!marketVisable && !foodVisable && !ingredientsVisable) {
        ctx.clearRect(1100, 550, nickWidth, nickHeight);
        //nick2出現
        nick2.onload = function() {
            ctx.drawImage(nick2, 50, 490, nick2Width, nick2Height);
            nick2Visable = true;
        };
        nick2.src = '/static/images/nick2.png';
            
        //talkbox出現
        talkbox.onload = function() {
            
            ctx.drawImage(talkbox, 320, 630, talkboxWidth, talkboxHeight); 
            talkboxVisable = true;
        };
        talkbox.src = '/static/images/talkbox.png';

            
        $("#talkBox").text("NPC回應中...");
        currentRequest = $.ajax({
            url: '/call_llm',
            type: 'POST',
            success: function(data) {
                console.log(data);
                $("#talkBox").text(data);
                currentRequest = null;
            }
        });
    }
}

function Market() {
    if (nick2Visable && talkboxVisable){
        callLLM();
        ctx.clearRect(50,  490, nick2Width,   nick2Height);
        nick2Visable = false;
            
        ctx.clearRect(320, 630, talkboxWidth, talkboxHeight);
        talkboxVisable = false;

        page1.onload = function() {
            const page1Width  = page1.width/1.2;
            const page1Height = page1.height/1.2;
            ctx.drawImage(page1, 0, 0, page1Width, page1Height);
        };
        page1.src = '/static/images/food_market/page1.png';

        right.onload = function() {
            const rightWidth  = right.width/6;
            const rightHeight = right.height/6;
            ctx.drawImage(right, 1430, 400, rightWidth, rightHeight);
            
        };
        right.src = '/static/images/food_market/right.png';

        left.onload = function() {
            const leftWidth  = left.width/6;
            const leftHeight = left.height/6;
            ctx.drawImage(left, 60, 400, leftWidth, leftHeight);
            
        };
        left.src = '/static/images/food_market/left.png';

        marketVisable = true;
        page = 0;
    }
}

function Right() {
    if(marketVisable) {
        if(page>0)
            page--;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        switch(page) {
            case 0:
                page = 0;
                right.onload();
                left.onload();
                page1.onload();
                break;
            case 1:
                page = 1;
                right.onload();
                left.onload();
                page2.onload = function() {
                    const page2Width  = page2.width/1.2;
                    const page2Height = page2.height/1.2;
                    ctx.drawImage(page2, 0, 0, page2Width, page2Height);
                };
                page2.src = '/static/images/food_market/page2.png';
                break;
            case 2:
                page = 2;
                right.onload();
                left.onload();
                page3.onload = function() {
                    const page3Width  = page3.width/1.2;
                    const page3Height = page3.height/1.2;
                    
                    ctx.drawImage(page3, 0, 0, page3Width, page3Height);
                };
                page3.src = '/static/images/food_market/page3.png';
                // change_page();
                break;
            case 3:
                page = 3;
                right.onload();
                left.onload();
                page4.onload = function() {
                    const page4Width  = page4.width/1.2;
                    const page4Height = page4.height/1.2;
                    
                    ctx.drawImage(page4, 0, 0, page4Width, page4Height);
                };
                page4.src = '/static/images/food_market/page4.png';
                break;
        }
    }
    
}

function Left() {
    if(marketVisable) {
        if(page<3)
            page++;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        switch(page) {
            case 0:
                page = 0;
                right.onload();
                left.onload();
                page1.onload();
                break;
            case 1:
                page = 1;
                right.onload();
                left.onload();
                page2.onload = function() {
                    const page2Width  = page2.width/1.2;
                    const page2Height = page2.height/1.2;
                    ctx.drawImage(page2, 0, 0, page2Width, page2Height);
                };
                page2.src = '/static/images/food_market/page2.png';
                break;
            case 2:
                page = 2;
                right.onload();
                left.onload();
                page3.onload = function() {
                    const page3Width  = page3.width/1.2;
                    const page3Height = page3.height/1.2;
                    
                    ctx.drawImage(page3, 0, 0, page3Width, page3Height);
                };
                page3.src = '/static/images/food_market/page3.png';
                break;
            case 3:
                page = 3;
                right.onload();
                left.onload();
                page4.onload = function() {
                    const page4Width  = page4.width/1.2;
                    const page4Height = page4.height/1.2;
                    
                    ctx.drawImage(page4, 0, 0, page4Width, page4Height);
                };
                page4.src = '/static/images/food_market/page4.png';
                break;
        }
    }
    
}


function Cook() {
    if (nick2Visable && talkboxVisable){
        callLLM();
        ctx.clearRect(50,  490, nick2Width,   nick2Height);
        nick2Visable = false;
            
        ctx.clearRect(320, 630, talkboxWidth, talkboxHeight);
        talkboxVisable = false;

        cooked.onload = function() {
            const cookedWidth  = cooked.width/1.2;
            const cookedHeight = cooked.height/1.2;
            
            ctx.drawImage(cooked, 0, 10, cookedWidth, cookedHeight);
        };
        cooked.src = '/static/images/recipe/cooked.png';
        foodVisable  = true;

    }

}

function Ingredients() {
    if (nick2Visable && talkboxVisable){
        callLLM();
        ctx.clearRect(50,  490, nick2Width,   nick2Height);
        nick2Visable = false;
            
        ctx.clearRect(320, 630, talkboxWidth, talkboxHeight);
        talkboxVisable = false;

        ingredients.onload = function() {
            const ingredientsWidth  = ingredients.width/1.5;
            const ingredientsHeight = ingredients.height/1.5;
            
            ctx.drawImage(ingredients, 150, 100, ingredientsWidth, ingredientsHeight);
        };
        ingredients.src = '/static/images/recipe/ingredients.png';
        ingredientsVisable = true;
    }
}

function callLLM() {
    if (currentRequest) {
        currentRequest.abort();
    }
    $("#talkBox").text("");

    // currentRequest = $.ajax({
    //     url: '/call_llm',
    //     type: 'POST',
    //     success: function(data) {
    //         console.log(data);
    //         $("#talkBox").text("");
    //         currentRequest = null;
    //     }
    // });
}

function Back() {
    if (nick2Visable && talkboxVisable){
        callLLM();
        ctx.clearRect(50,  490, nick2Width,   nick2Height);
        nick2Visable = false;
            
        ctx.clearRect(320, 630, talkboxWidth, talkboxHeight);
        talkboxVisable = false;

        nick.onload();

    }
    else if (marketVisable) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        marketVisable = false;
        nick.onload();
    }
    else if(foodVisable) {
        ctx.clearRect(0, 0, cookedWidth, cookedHeight);
        foodVisable = false;
        nick.onload();
    }
    else if(ingredientsVisable) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ingredientsVisable = false;
        nick.onload();
    }
}

function buyProduct(idNum){
    if(marketVisable) {
        var needMoney = price_values[idNum] * exchange;
        if(wallet < needMoney){
            alert("錢錢不夠耶！");
            alert("還差"+(needMoney-wallet)+"元喔！");
        }
        else{
            wallet = wallet - needMoney;
            wallet_text.innerHTML = wallet;

            productQuantity_values[idNum] = productQuantity_values[idNum] + 1;
            productQuantity_text[idNum].innerHTML = productQuantity_values[idNum];
        }
    }
}

function make(cuisine){
    //0肉 1牛奶 2蛋 3小麥 4棕色蘑菇 5紅色蘑菇 6糖 7蜂蜜
    if(foodVisable) {
        switch(cuisine){
            case 'makeBread':
                if(productQuantity_values[3] < 3)
                    alert('小麥不夠喔');
                else{
                    //確認檯面是否還能放鍋子
                    if(clickCount<3){
                        clickCount++;

                        productQuantity_values[3] = productQuantity_values[3] - 3;
                        productQuantity_text[3].innerHTML = productQuantity_values[3];
                    
                        addPotImage(clickCount);
                        Pot();
                        gaincuisine_values[0] = gaincuisine_values[0] + 1;
                        gaincuisine_text[0].innerHTML = gaincuisine_values[0];
                    }
                    else
                        alert('超過製作上限，請稍後再試');
                }
                break;
    
            case 'makeBeef':
                if(productQuantity_values[0] < 1)
                    alert('肉不夠喔');
                else{
                    //確認檯面是否還能放鍋子
                    if(clickCount<3){
                        clickCount++;

                        productQuantity_values[0] = productQuantity_values[0] - 1;
                        productQuantity_text[0].innerHTML = productQuantity_values[0];
                    
                        addPotImage(clickCount);
                        Pot();
                        gaincuisine_values[1] = gaincuisine_values[1] + 1;
                        gaincuisine_text[1].innerHTML = gaincuisine_values[1];
                    }
                    else
                        alert('超過製作上限，請稍後再試');
                }
                break;
    
            case 'makeMashroom':
                if(productQuantity_values[4] < 1 || productQuantity_values[5] < 1)
                    alert('蘑菇不夠喔');
                else{
                    if(clickCount<3){
                        clickCount++;

                        productQuantity_values[4] = productQuantity_values[4] - 1;
                        productQuantity_text[4].innerHTML = productQuantity_values[4];
                        productQuantity_values[5] = productQuantity_values[5] - 1;
                        productQuantity_text[5].innerHTML = productQuantity_values[5];
                    
                        addPotImage(clickCount);
                        Pot();
                        gaincuisine_values[2] = gaincuisine_values[2] + 1;
                        gaincuisine_text[2].innerHTML = gaincuisine_values[2];
                    }
                    else
                        alert('超過製作上限，請稍後再試');
                }
                break;
    
            case 'makeCake':
                if(productQuantity_values[3] < 3 || productQuantity_values[2] < 2 || productQuantity_values[6] < 3 || productQuantity_values[1] < 1)
                    alert('材料不夠喔');
                else{
                    if(clickCount<3){
                        clickCount++;

                        productQuantity_values[3] = productQuantity_values[3] - 3;
                        productQuantity_text[3].innerHTML = productQuantity_values[3];
                        productQuantity_values[2] = productQuantity_values[2] - 2;
                        productQuantity_text[2].innerHTML = productQuantity_values[2];
                        productQuantity_values[6] = productQuantity_values[6] - 3;
                        productQuantity_text[6].innerHTML = productQuantity_values[6];
                        productQuantity_values[1] = productQuantity_values[1] - 1;
                        productQuantity_text[1].innerHTML = productQuantity_values[1];
                    
                        addPotImage(clickCount);
                        Pot();
                        gaincuisine_values[3] = gaincuisine_values[3] + 1;
                        gaincuisine_text[3].innerHTML = gaincuisine_values[3];
                    }
                    else
                        alert('超過製作上限，請稍後再試');
                }
                break;
    
            case 'makeDrink':
                if(productQuantity_values[7] < 2)
                    alert('蜂蜜不夠喔');
                else{
                    if(clickCount<3){
                        clickCount++;

                        productQuantity_values[7] = productQuantity_values[7] - 2;
                        productQuantity_text[7].innerHTML = productQuantity_values[7];
                    
                        addPotImage(clickCount);
                        Pot();
                        gaincuisine_values[4] = gaincuisine_values[4] + 1;
                        gaincuisine_text[4].innerHTML = gaincuisine_values[4];
                    }
                    else
                        alert('超過製作上限，請稍後再試');
                }
                break;
    
            case 'makePie':
                if(productQuantity_values[3] < 2 || productQuantity_values[2] < 1 || productQuantity_values[6] < 2)
                    alert('材料不夠喔');
                else{
                    if(clickCount<3){
                        clickCount++;

                        productQuantity_values[3] = productQuantity_values[3] - 2;
                        productQuantity_text[3].innerHTML = productQuantity_values[3];
                        productQuantity_values[2] = productQuantity_values[2] - 1;
                        productQuantity_text[2].innerHTML = productQuantity_values[2];
                        productQuantity_values[6] = productQuantity_values[6] - 2;
                        productQuantity_text[6].innerHTML = productQuantity_values[6];
                    
                        addPotImage(clickCount);
                        Pot();
                        gaincuisine_values[5] = gaincuisine_values[5] + 1;
                        gaincuisine_text[5].innerHTML = gaincuisine_values[5];
                    }
                    else
                        alert('超過製作上限，請稍後再試');
                }
                break;
        }
    }
}

function addPotImage(clickCount) {
    var pot_Count = clickCount % 3;
    pots[pot_Count].bool = true;
    potPositions.push(pots[pot_Count]);
    start[pot_Count] = true;
    console.log(potPositions);
    console.log(clickCount);
}


function Pot() {
    Back();
    if(!foodVisable && !marketVisable && !ingredientsVisable){
        console.log("煮飯")
        //如果有點餐
        if(potPositions.length!=0){
            for (let i =0 ; i < potPositions.length ; i++) {
                const potX = potPositions[i].x; // 設定pot圖片的位置
                const potY = potPositions[i].y;
                
                switch(i){
                    case 0:
                        console.log("第一鍋上架")
                        start[0]=true;
                        startCooking(0);
                        
                        console.log(i);
                        break;
                    case 1:

                        break;
                    case 2:

                        break;
                }

            }
        }
    }
}

function drawStoves(s, i) {//設置每一個圖片的裁切大小(已設置好建議不要亂調)
    ctx.clearRect(stoves[i].x, stoves[i].y, 60, 60);

    switch (s) {
        case 0:
            break;
        case 1:
            ctx.drawImage(imgCook, 580, 420, 250, 250, stoves[i].x, stoves[i].y, 60, 60);
            
            break;
        case 2:
            ctx.drawImage(imgCook, 840, 420, 250, 250, stoves[i].x, stoves[i].y, 60, 60);
            break;
        case 3:
            ctx.drawImage(imgCook, 1090, 420, 250, 250, stoves[i].x, stoves[i].y, 60, 60);
            break;
        case 4:
            ctx.drawImage(imgDone, 700, 320, 520, 430, stoves[i].x, stoves[i].y, 60, 60);
            start[0]=false;
            break;
    };
}

function startCooking(index) {
    console.log("有點到")
    stoves[index].state = 1;

    for(var i = 0; i<potPositions.length; i++) {
        if(potPositions[i].bool && start[i]){

            console.log("載入")
            image.pot1.onload = function() {
                ctx.drawImage(image.pot1, 60, 90, image.pot1.width, image.pot1.height, pots[0].x, pots[0].y, potWidth, potHeight);
            };
            image.pot1.src = '/static/images/pot.png';

            
            
            console.log("0 pot");
    
            stoves[0].state = 0;
            drawStoves(stoves[0].state, 0);
            
            stoves[0].timer = setTimeout(() => {
                stoves[0].state = 1;
                drawStoves(stoves[0].state, 0);

                stoves[0].timer = setTimeout(() => {
                    stoves[0].state = 2;
                    drawStoves(stoves[0].state, 0);
        
                    stoves[0].timer = setTimeout(() => {
                        stoves[0].state = 3;
                        drawStoves(stoves[0].state, 0);
        
                        stoves[0].timer = setTimeout(() => {
                            stoves[0].state = 4;
                            drawStoves(stoves[0].state, 0);
                        }, 3000);//3s
                    }, 3000);//3s
                }, 3000);//5s
            }, 3000);
        }
    }
}

//時間改變圖示
function resetStove() {//重置

    ctx.clearRect(0, 0, 750, 715)
    console.log("重置")
    if(!start[0]) {
        clearTimeout(stoves[0].timer);
        stoves[0].state = 0;
        clickCount--;
    
        pots[0].bool=false;
        potPositions.splice(0, 1);
        //console.log(potPositions);
        ctx.clearRect(stoves[0].x, stoves[0].y, 60, 60);
        
    }
}


function gain(gain){
    var gainPrice = [1000, 1100, 1400, 2400, 2500, 950];
    var caseNum = 6;
    switch(gain){
        case 'gainBread':
            caseNum = 0;
            break;

        case 'gainBeef':
            caseNum = 1;
            break;

        case 'gainMashroom':
            caseNum = 2;
            break;

        case 'gainCake':
            caseNum = 3;
            break;

        case 'gainDrink':
            caseNum = 4;
            break;

        case 'gainPie':
            caseNum = 5;
            break;
    }


    if(gaincuisine_values[caseNum] < 1)
        alert('你根本沒有');
    else{
        if(!start[0]) {
            resetStove();
            gaincuisine_values[caseNum] = gaincuisine_values[caseNum] - 1;
            gaincuisine_text[caseNum].innerHTML = gaincuisine_values[caseNum];

            wallet = wallet + gainPrice[caseNum];
            wallet_text.innerHTML = wallet; 
        }
    }
}

function startGame() {
    const dayElement = document.getElementById('day');
    const timeElement = document.getElementById('time');

    let countdownDuration = 1 * 10 * 2000; // 1m/天
    let endTime = Date.now() + countdownDuration; // Set the end time

    function updateCountdown() {  //這裡面有更改！！！！！！
        let now = Date.now();
        let remainingTime = endTime - now;

        if (remainingTime <= 0) {   //我改這裡哦！！！！！！！
            // Move to the next day if time is up
            currentDay++;
            refreshPrices();

            score.push(wallet); //add   初始化錢包
            // wallet = 1000;  //add
            // wallet_text.innerHTML = 1000;   //add

            if (currentDay > 10) {  //modify    十天後進入結算畫面
                //結果存放在本地
                localStorage.setItem('chartData', JSON.stringify(score));

                //跳轉到final.html
                window.location.href = '/final';
            }

            endTime = Date.now() + countdownDuration; // Reset the end time
            remainingTime = countdownDuration; // Reset the remaining time
        }

        let minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
        let seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);

        // Display the current day and remaining time
        dayElement.textContent = `距離第 ${currentDay} 天結束還剩 `;
        timeElement.textContent = `${minutes}m ${seconds}s`;

        setTimeout(updateCountdown, 1000); // Update every second
    }

    updateCountdown(); // Start the countdown
}
//時間部分到這裡結束

window.onload = startGame;



