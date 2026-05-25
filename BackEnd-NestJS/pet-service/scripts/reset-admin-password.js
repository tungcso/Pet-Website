/*
  Script: reset-admin-password.js
  Usage: node scripts/reset-admin-password.js <email> <newPassword>
  Example: node scripts/reset-admin-password.js admin@gmail.com 123

  This script connects to MongoDB using MONGO_URL from .env.production
  and updates the user's password hashed with bcryptjs.
*/
const { MongoClient, ObjectId } = require('mongodb');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

function loadEnv(envPath) {
  if (!fs.existsSync(envPath)) return {};
  const content = fs.readFileSync(envPath, 'utf8');
  const lines = content.split(/\r?\n/);
  const env = {};
  for (const line of lines) {
    const m = line.match(/^\s*([A-Za-z0-9_]+)=(.*)$/);
    if (m) env[m[1]] = m[2];
  }
  return env;
}

async function main() {
  const args = process.argv.slice(2);
  if (args.length < 2) {
    console.error('Usage: node reset-admin-password.js <email> <newPassword>');
    process.exit(1);
  }
  const [email, newPassword] = args;

  const repoRoot = path.resolve(__dirname, '..');
  const envPath = path.join(repoRoot, '.env.production');
  const env = loadEnv(envPath);
  const MONGO_URL = env.MONGO_URL;
  if (!MONGO_URL) {
    console.error('MONGO_URL not found in .env.production');
    process.exit(1);
  }

  const client = new MongoClient(MONGO_URL);
  try {
    await client.connect();
    const adminDb = client.db();
    const users = adminDb.collection('users');
    const user = await users.findOne({ email: email });
    if (!user) {
      console.error('User not found:', email);
      process.exit(1);
    }
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(newPassword, salt);
    await users.updateOne({ _id: user._id }, { $set: { password: hash } });
    console.log('Password reset successful for', email);
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await client.close();
  }
}

main();
