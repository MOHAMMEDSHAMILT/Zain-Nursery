import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const options = {};

let client;
let clientPromise;

if (!uri) {
    clientPromise = Promise.resolve(null);
} else {
    if (process.env.NODE_ENV === 'development') {
        if (!global._mongoClientPromise) {
            client = new MongoClient(uri, options);
            global._mongoClientPromise = client.connect();
        }
        clientPromise = global._mongoClientPromise;
    } else {
        client = new MongoClient(uri, options);
        // Note: attachDatabasePool is for serverless environments
        try {
            const { attachDatabasePool } = require("@vercel/functions");
            if (typeof attachDatabasePool === 'function') {
                attachDatabasePool(client);
            }
        } catch (e) {
            // Ignore if helper is not available
        }
        clientPromise = client.connect();
    }
}

export default clientPromise;
