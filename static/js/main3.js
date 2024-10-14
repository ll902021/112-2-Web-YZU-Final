// document.getElementById('refresh').addEventListener('click', refreshPrices);

const basePrices = {
    meat: 35,
    milk: 30,
    egg: 5,
    wheat: 10,
    'brown-mushroom': 20,
    'red-mushroom': 25,
    sugar:3,
    honey:40
}; // 商品基本價格
const finalPrices = basePrices;

function refreshPrices() {
    const products = Object.keys(basePrices); 
    const events = ['buy one get one free', 'half price', 'free','expensive','sold out','25% off','normal']; //價格變動種類
    
    products.forEach(product => {
        const priceElement = document.getElementById(`price-${product}`);
        let basePrice = basePrices[product]; 
        let finalPrice = basePrice;

        const randomEvent = events[Math.floor(Math.random() * events.length)]; //隨機價格變動選項設定區
        switch (randomEvent) {
            case 'buy one get one free':
                priceElement.textContent = `${basePrice}  (買一送一)`;
                break;
            case 'half price':
                finalPrice = basePrice / 2;
                priceElement.textContent = `${finalPrice}  (半價)`;
                break;
            case 'free':
                finalPrice = 0;
                priceElement.textContent = '0  (免費)';
                break;
            case 'expensive':
                finalPrice = basePrice * 2;
                priceElement.textContent = `${finalPrice}  (漲價)`;
                break;
            case 'sold out':
                priceElement.textContent = `缺貨`;
                break;
            case '20% off':
                finalPrice = basePrice * 0.75;
                priceElement.textContent = `${finalPrice}  (25% off)`;
                break;
            case 'normal':
                finalPrice = basePrice;
                priceElement.textContent = `${finalPrice}  (原價)`;
                break;
        }
    });
}


