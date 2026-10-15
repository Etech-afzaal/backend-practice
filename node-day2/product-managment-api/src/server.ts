import http from "node:http";
import { config } from "./config.js";
import { getProducts, getAvailableProducts } from "./product.service.js";

const server = http.createServer(async (req, res) => {
    res.setHeader("Content-Type", "application/json");

    console.log(`${req.method} ${req.url}`);

    try {
        if (req.method === "GET" && req.url === "/") {
            res.statusCode = 200;
            res.end(JSON.stringify({
                message: `Welcome to ${config.appName}`
            }));
            return;
        }

        if (req.method === "GET" && req.url === "/health") {
            res.statusCode = 200;
            res.end(JSON.stringify({
                status: "OK",
                environment: config.nodeEnv
            }));
            return;
        }

        if (req.method === "GET" && req.url === "/products") {
            const products = await getProducts();

            res.statusCode = 200;
            res.end(JSON.stringify({
                success: true,
                total: products.length,
                data: products
            }));
            return;
        }

        if (
            req.method === "GET" &&
            req.url === "/products/available"
        ) {
            const products = await getAvailableProducts();

            res.statusCode = 200;
            res.end(JSON.stringify({
                success: true,
                total: products.length,
                data: products
            }));

            return;
        }

        res.statusCode = 404;
        res.end(JSON.stringify({
            success: false,
            message: "Route not found"
        }));

    } catch (error: unknown) {
        console.error("Server error:", error);

        res.statusCode = 500;
        res.end(JSON.stringify({
            success: false,
            message: "Internal Server Error"
        }));
    }
});

server.listen(config.port, () => {
    console.log(`${config.appName} started`);
    console.log(`http://localhost:${config.port}`);
});