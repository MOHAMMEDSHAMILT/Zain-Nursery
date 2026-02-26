import { promises as fs } from 'fs';
import path from 'path';
import clientPromise from './mongodb';
import { kv } from '@vercel/kv';

const DATA_PATH = path.join(process.cwd(), 'app/data');

// Helper to determine which database to use
const isMongo = () => !!process.env.MONGODB_URI;
const isKv = () => !!process.env.KV_URL;

export async function getCollection(name) {
    if (isMongo()) {
        const client = await clientPromise;
        const db = client.db('zain-nursery');
        return db.collection(name);
    }
    return null;
}

export async function getData(filename) {
    // 1. Try MongoDB
    if (isMongo()) {
        const collection = await getCollection(filename.replace('.json', ''));
        const data = await collection.find({}).toArray();
        return data.map(item => {
            const newItem = { ...item };
            if (newItem._id) newItem._id = newItem._id.toString();
            return newItem;
        });
    }

    // 2. Try Vercel KV (Redis)
    if (isKv()) {
        const key = filename.replace('.json', '');
        const data = await kv.get(key);
        return data || [];
    }

    // 3. Fallback to Local Files (Development only)
    const filePath = path.join(DATA_PATH, filename);
    try {
        const data = await fs.readFile(filePath, 'utf8');
        return JSON.parse(data);
    } catch (e) {
        return [];
    }
}

export async function saveData(filename, data) {
    if (isMongo()) {
        throw new Error('Direct array save not supported in MongoDB mode.');
    }

    if (isKv()) {
        const key = filename.replace('.json', '');
        await kv.set(key, data);
        return;
    }

    const filePath = path.join(DATA_PATH, filename);
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
}
