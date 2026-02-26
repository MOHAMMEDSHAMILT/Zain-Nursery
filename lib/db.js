import { promises as fs } from 'fs';
import path from 'path';
import clientPromise from './mongodb';
import { kv } from '@vercel/kv';

const DATA_PATH = path.join(process.cwd(), 'app/data');

// Helper to determine which database to use
const isMongo = () => !!process.env.MONGODB_URI;
const isKv = () => !!process.env.KV_URL;
const isProd = () => !!process.env.VERCEL;

export async function getCollection(name) {
    if (isMongo()) {
        const client = await clientPromise;
        if (!client) return null;
        const db = client.db('zain-nursery');
        return db.collection(name);
    }
    return null;
}

export function isDbActive() {
    return isMongo() || isKv();
}

export async function getData(filename) {
    // 1. Try MongoDB
    if (isMongo()) {
        try {
            const collection = await getCollection(filename.replace('.json', ''));
            if (collection) {
                const data = await collection.find({}).toArray();
                if (data.length > 0) {
                    return data.map(item => {
                        const newItem = { ...item };
                        if (newItem._id) newItem._id = newItem._id.toString();
                        return newItem;
                    });
                }
            }
        } catch (e) {
            console.error('MongoDB read error, falling back:', e);
        }
    }

    // 2. Try Vercel KV (Redis)
    if (isKv()) {
        try {
            const key = filename.replace('.json', '');
            const data = await kv.get(key);
            if (data) return data;
        } catch (e) {
            console.error('Vercel KV read error, falling back:', e);
        }
    }

    // 3. Fallback to Local Files (Works for reading on Vercel)
    const filePath = path.join(DATA_PATH, filename);
    try {
        const data = await fs.readFile(filePath, 'utf8');
        return JSON.parse(data);
    } catch (e) {
        return [];
    }
}

export async function saveData(filename, data) {
    // 1. Try MongoDB
    if (isMongo()) {
        throw new Error('Direct array save not supported in MongoDB mode. Use collection methods.');
    }

    // 2. Try Vercel KV
    if (isKv()) {
        const key = filename.replace('.json', '');
        await kv.set(key, data);
        return;
    }

    // 3. Fallback to Local Files
    if (isProd()) {
        // This is the CRITICAL block: File system is read-only on Vercel production
        throw new Error('READ_ONLY_FILESYSTEM');
    }

    const filePath = path.join(DATA_PATH, filename);
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
}
