const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up Live Chat Application...\n');

// Create client .env file
const clientEnvPath = path.join(__dirname, 'client', '.env');
const clientEnvContent = `REACT_APP_API_URL=http://localhost:5000`;

if (!fs.existsSync(clientEnvPath)) {
  fs.writeFileSync(clientEnvPath, clientEnvContent);
  console.log('✅ Created client/.env file');
} else {
  console.log('ℹ️  client/.env file already exists');
}

// Create server .env file
const serverEnvPath = path.join(__dirname, 'server', '.env');
const serverEnvContent = `PORT=5000
MONGO_URI=mongodb://localhost:27017/livechat
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
NODE_ENV=development`;

if (!fs.existsSync(serverEnvPath)) {
  fs.writeFileSync(serverEnvPath, serverEnvContent);
  console.log('✅ Created server/.env file');
} else {
  console.log('ℹ️  server/.env file already exists');
}

console.log('\n📋 Next steps:');
console.log('1. Install server dependencies: cd server && npm install');
console.log('2. Install client dependencies: cd client && npm install');
console.log('3. Start MongoDB (if using local MongoDB)');
console.log('4. Start the server: cd server && npm run dev');
console.log('5. Start the client: cd client && npm start');
console.log('\n⚠️  Important: Update the JWT_SECRET in server/.env for production use!');
console.log('⚠️  Important: Set up Cloudinary credentials if you want to use file uploads!'); 