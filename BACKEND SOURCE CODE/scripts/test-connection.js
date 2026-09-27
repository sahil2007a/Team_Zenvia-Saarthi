const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const mongoose = require('mongoose');

async function testConnection() {
  console.log('Testing MongoDB connection with URI:');
  const uri = process.env.MONGODB_URI;
  console.log(uri.replace(/:([^:@]+)@/, ':****@'));

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log('✅ Connection SUCCESSFUL!');
    console.log('Host:', conn.connection.host);
    console.log('DB Name:', conn.connection.name);
    console.log('ReadyState:', conn.connection.readyState);
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Connection FAILED!');
    console.error('Error code:', error.code);
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    process.exit(1);
  }
}

testConnection();
