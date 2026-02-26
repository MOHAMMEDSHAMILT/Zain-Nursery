const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

async function migrate() {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
        console.error('Error: MONGODB_URI not found in .env.local');
        return;
    }

    const client = new MongoClient(uri);
    try {
        await client.connect();
        console.log('Connected to MongoDB Atlas...');
        const db = client.db('zain-nursery');

        const files = ['products.json', 'messages.json', 'settings.json'];

        for (const file of files) {
            const collectionName = file.replace('.json', '');
            const filePath = path.join(__dirname, 'app/data', file);

            if (fs.existsSync(filePath)) {
                const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
                const collection = db.collection(collectionName);

                console.log(`Migrating ${file}...`);

                if (Array.isArray(data)) {
                    if (data.length > 0) {
                        await collection.deleteMany({});
                        await collection.insertMany(data);
                        console.log(`Successfully migrated ${data.length} items to ${collectionName}`);
                    }
                } else {
                    // It's an object (like settings)
                    await collection.deleteMany({});
                    await collection.insertOne(data);
                    console.log(`Successfully migrated ${collectionName} settings`);
                }
            }
        }
        console.log('Migration complete!');
    } catch (e) {
        console.error('Migration failed:', e);
    } finally {
        await client.close();
    }
}

migrate();
