import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const options = {
    connectTimeoutMS: 10000,
    socketTimeoutMS: 45000,
};

let client;
let clientPromise;

if (!uri) {
    clientPromise = Promise.resolve(null);
} else {
    // In development mode, use a global variable so that the value
    // is preserved across module reloads caused by HMR (Hot Module Replacement).
    if (process.env.NODE_ENV === 'development') {
        if (!global._mongoClientPromise) {
            client = new MongoClient(uri, options);
            global._mongoClientPromise = client.connect().catch(err => {
                console.error("MongoDB Connection Error (Dev):", err);
                return null;
            });
        }
        clientPromise = global._mongoClientPromise;
    } else {
        // In production mode, it's best to not use a global variable.
        client = new MongoClient(uri, options);
        clientPromise = client.connect().catch(err => {
            console.error("MongoDB Connection Error (Prod):", err);
            return null;
        });
    }
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise;
