const fs = require("node:fs");

console.log("Start");

const data = fs.readFileSync("sample.txt", "utf8");

console.log(data);
console.log("End");