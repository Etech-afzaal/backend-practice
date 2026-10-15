const name = "Afzaal";
const role = "Backend Developer";
const language = "TypeScript";

console.log("Developer:", name);
console.log("Role:", role);
console.log("Language:", language);

console.log("Node Version:", process.version);
console.log("Platform:", process.platform);
console.log("Working Directory:", process.cwd());

function getDeveloperInfo() {
    return {
        name,
        role,
        language
    };
}

console.log(getDeveloperInfo());