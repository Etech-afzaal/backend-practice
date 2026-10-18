mkdir node-ts-day3
cd node-ts-day3
npm init -y

npm install express

npm install -D typescript tsx @types/node @types/express

npx tsc --init
mkdir src
New-Item src/index.ts

{
"compilerOptions": {
"target": "ES2022",
"module": "NodeNext",
"moduleResolution": "NodeNext",
"rootDir": "./src",
"outDir": "./dist",
"strict": true,
"esModuleInterop": true,
"skipLibCheck": true
},
"include": ["src"]
}

{
"type": "module",
"scripts": {
"dev": "tsx watch src/index.ts",
"build": "tsc",
"start": "node dist/index.js",
"typecheck": "tsc --noEmit"
}
}
