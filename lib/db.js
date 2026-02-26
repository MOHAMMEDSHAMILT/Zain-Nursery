import { promises as fs } from 'fs';
import path from 'path';
import clientPromise from './mongodb';

const DATA_PATH = path.join(process.cwd(), 'app/data');

// Helper to determine if we should use MongoDB
const useDb = () => !!process.env.MONGODB_URI;

export async function getCollection(name) {
    if (useDb()) {
        const client = await clientPromise;
        const db = client.db('zain-nursery');
        return db.collection(name);
    }
    return null;
}

export async function getData(filename) {
    if (useDb()) {
        const collection = await getCollection(filename.replace('.json', ''));
        const data = await collection.find({}).toArray();
        // MongoDB adds _id, we convert it for compatibility if needed
        return data.map(item => {
            const newItem = { ...item };
            if (newItem._id) newItem._id = newItem._id.toString();
            return newItem;
        });
    } else {
        const filePath = path.join(DATA_PATH, filename);
        try {
            const data = await fs.readFile(filePath, 'utf8');
            return JSON.parse(data);
        } catch (e) {
            return [];
        }
    }
}

export async function saveData(filename, data) {
    if (useDb()) {
        // In MongoDB we usually don't save the whole array at once 
        // but for a smooth migration we can provide specific methods
        throw new Error('Direct array save not supported in DB mode. Use specific add/update methods.');
    } else {
        const filePath = path.join(DATA_PATH, filename);
        await fs.writeFile(filePath, JSON.stringify(data, null, 2));
    }
}
