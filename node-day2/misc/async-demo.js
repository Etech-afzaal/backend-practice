const fs = require("node:fs");

console.log("Start");

fs.readFile("sample.txt", "utf8", (error, data) => {
    if (error) {
        console.error(error.message);
        return;
    }

    console.log(data);
});

console.log("End");