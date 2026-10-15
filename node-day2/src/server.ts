import http from "node:http";

import { config } from "./config.js";

interface Product {
    id: number;
    name: string;
    price: number;
}

const products: Product[] = [
    { id: 1, name: "Laptop", price: 120000 },
    { id: 2, name: "Mouse", price: 2500 },
    { id: 3, name: "Keyboard", price: 5000 }
];

const PORT = 4000;

const server = http.createServer((req, res) => {
    console.log(`${req.method} ${req.url}`);

    res.setHeader("Content-Type", "application/json");

    if (req.method === "GET" && req.url === "/") {
        res.statusCode = 200;
        res.end(JSON.stringify({
            message: "Welcome to Product API"
        }));
        return;
    }

    if (req.method === "GET" && req.url === "/products") {
        res.statusCode = 200;
        res.end(JSON.stringify(products));
        return;
    }

    if (req.method === "GET" && req.url === "/health") {
        res.statusCode = 200;
        res.end(JSON.stringify({ status: "OK" }));
        return;
    }

    res.statusCode = 404;
    res.end(JSON.stringify({
        message: "Route not found"
    }));
});

server.listen(config.port, () => {
    console.log(`${config.appName} is running`);
    console.log(`Environment: ${config.nodeEnv}`);
    console.log(`URL: http://localhost:${config.port}`);
});