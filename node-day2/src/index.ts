import path from "node:path";

const filePath = path.join(
    "data",
    "products",
    "laptop.json"
);

console.log(filePath);

// import { add, multiply } from "./math.js";

// import { getProducts } from "./product-file.service.js";

// async function main(): Promise<void> {
//     try {
//         const products = await getProducts();

//         console.log("Products loaded successfully!");

//         products.forEach((product) => {
//             console.log(
//                 `${product.id} - ${product.name} - ${product.price}`
//             );
//         });
//     } catch (error: unknown) {
//         console.error("Failed to load products:", error);
//     }
// }

// main();

// import {
//     getProductPrice,
//     applyDiscount,
//     isProductAvailable
// } from "./product.service.js";

// const total = getProductPrice(1000, 3);

// const finalPrice = applyDiscount(total, 10);

// const available = isProductAvailable(5);

// console.log("Total Price:", total);
// console.log("After Discount:", finalPrice);
// console.log("Product Available:", available);

// const result1 = add(10, 20);
// const result2 = multiply(5, 6);

// console.log("Addition:", result1);
// console.log("Multiplication:", result2);

// interface Developer {
//     name: string;
//     role: string;
//     experience: number;
// }

// const developer: Developer = {
//     name: "Afzaal",
//     role: "Backend Developer",
//     experience: 1
// };

// console.log("Welcome to Node.js Day 2!");
// console.log(developer);
// console.log("Node Version:", process.version);