const { MongoClient } = require('mongodb');
const { createClient } = require('@vercel/kv');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

async function migrate() {
    const mongoUri = process.env.MONGODB_URI;
    const kvUrl = process.env.KV_REST_API_URL || process.env.KV_URL;

    if (!mongoUri && !kvUrl) {
        console.log('----------------------------------------------------');
        console.error('Error: No Database configured in .env.local');
        console.log('To migrate your data to the live site:');
        console.log('1. Run: npx vercel env pull .env.local');
        console.log('2. Then run: npm run migrate');
        console.log('----------------------------------------------------');
        return;
    }

    const files = ['products.json', 'messages.json', 'settings.json'];

    // 1. Migrate to MongoDB
    if (mongoUri) {
        console.log('Starting migration to MongoDB Atlas...');
        const client = new MongoClient(mongoUri);
        try {
            await client.connect();
            const db = client.db('zain-nursery');
            for (const file of files) {
                const filePath = path.join(__dirname, 'app/data', file);
                if (fs.existsSync(filePath)) {
                    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
                    const collectionName = file.replace('.json', '');
                    const collection = db.collection(collectionName);
                    await collection.deleteMany({});
                    if (Array.isArray(data)) {
                        if (data.length > 0) await collection.insertMany(data);
                    } else {
                        await collection.insertOne(data);
                    }
                    console.log(`✅ Migrated ${file} to MongoDB [${collectionName}]`);
                }
            }
        } catch (e) {
            console.error('❌ MongoDB Migration Error:', e.message);
        } finally {
            await client.close();
        }
    }

    // 2. Migrate to Vercel KV
    if (kvUrl) {
        console.log('Starting migration to Vercel KV...');
        try {
            const kv = createClient({
                url: process.env.KV_REST_API_URL,
                token: process.env.KV_REST_API_TOKEN,
            });
            for (const file of files) {
                const filePath = path.join(__dirname, 'app/data', file);
                if (fs.existsSync(filePath)) {
                    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
                    const key = file.replace('.json', '');
                    await kv.set(key, data);
                    console.log(`✅ Migrated ${file} to Vercel KV [${key}]`);
                }
            }
        } catch (e) {
            console.error('❌ Vercel KV Migration Error:', e.message);
        }
    }

    console.log('----------------------------------------------------');
    console.log('Migration process finished!');
    console.log('Please REDEPLOY your project on Vercel to see changes.');
    console.log('----------------------------------------------------');
}

migrate();
