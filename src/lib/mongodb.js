import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGO_URI;

if (!MONGODB_URI) throw new Error('MONGO_URI is missing');

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

export async function connectDB() {
    if (cached.conn) return cached.conn;

    if (!cached.promise) {
        cached.promise = mongoose
            .connect(MONGODB_URI, {
                dbName: 'Discord',
            })
            .then((mongoose) => mongoose);
    }

    cached.conn = await cached.promise;
    return cached.conn;
}
