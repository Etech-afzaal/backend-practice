const productName: string = "Laptop";
const price: number = 80000;
const inStock: boolean = true;

const prices: number[] = [
    500, 1200, 2500, 800, 4000
];

// TODO 1: Create calculateDiscount()
function calculateDiscount(
    price: number,
    discountPercentage: number
): number {
    return price - discountPercentage;
}


// TODO 2: Filter prices greater than 1000

const greaterThan1000 = prices.filter(
    (num: number) => num > 20
);


// TODO 3: Apply 10% discount using map()
const doubled = prices.map(
    (num: number) => num * 10
);

console.log(productName, price, inStock);



