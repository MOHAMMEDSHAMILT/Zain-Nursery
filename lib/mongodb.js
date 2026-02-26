import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const options = {};

let client;
let clientPromise;

if (!uri) {
    clientPromise = Promise.resolve(null);
} else {
    client = new MongoClient(uri, options);

    // Check if we are in a Vercel environment to potentially use the connection pool
    // Note: attachDatabasePool is currently in technical preview/experimental for some environments
    try {
        const { attachDatabasePool } = require("@vercel/functions");
        if (typeof attachDatabasePool === 'function') {
            attachDatabasePool(client);
        }
    } catch (e) {
        // Fallback or ignore if the function is not available
    }

    if (process.env.NODE_ENV === 'development') {
        if (!global._mongoClientPromise) {
            global._mongoClientPromise = client.connect();
        }
        clientPromise = global._mongoClientPromise;
    } else {
        clientPromise = client.connect();
    }
}

export default clientPromise;
