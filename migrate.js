const { MongoClient } = require('mongodb');
const { createClient } = require('@vercel/kv');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

async function migrate() {
    const mongoUri = process.env.MONGODB_URI;
    const kvUrl = process.env.KV_URL;

    if (!mongoUri && !kvUrl) {
        console.error('Error: Neither MONGODB_URI nor KV_URL found in .env.local');
        return;
    }

    const files = ['products.json', 'messages.json', 'settings.json'];

    // Migrate to MongoDB if URI exists
    if (mongoUri) {
        console.log('Detected MongoDB URI. Starting MongoDB migration...');
        const client = new MongoClient(mongoUri);
        try {
            await client.connect();
            const db = client.db('zain-nursery');
            for (const file of files) {
                const filePath = path.join(__dirname, 'app/data', file);
                if (fs.existsSync(filePath)) {
                    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
                    const collection = db.collection(file.replace('.json', ''));
                    await collection.deleteMany({});
                    if (Array.isArray(data)) {
                        if (data.length > 0) await collection.insertMany(data);
                    } else {
                        await collection.insertOne(data);
                    }
                    console.log(`Migrated ${file} to MongoDB`);
                }
            }
        } finally { await client.close(); }
    }

    // Migrate to Vercel KV if URL exists
    if (kvUrl) {
        console.log('Detected KV URL. Starting Vercel KV migration...');
        const kv = createClient({
            url: process.env.KV_REST_API_URL,
            token: process.env.KV_REST_API_TOKEN,
        });
        for (const file of files) {
            const filePath = path.join(__dirname, 'app/data', file);
            if (fs.existsSync(filePath)) {
                const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
                await kv.set(file.replace('.json', ''), data);
                console.log(`Migrated ${file} to Vercel KV`);
            }
        }
    }

    console.log('Migration complete!');
}

migrate();
