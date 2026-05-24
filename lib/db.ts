import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongooseCache: MongooseCache | undefined;
}

let mongooseCache: MongooseCache = global.mongooseCache || {
  conn: null,
  promise: null,
};

if (!global.mongooseCache) {
  global.mongooseCache = mongooseCache;
}

export async function connectToDatabase() {
    if (!MONGODB_URI) {
        throw new Error("Please define the MONGODB_URI environment variable");
    }
    if (mongooseCache.conn) {
        return mongooseCache.conn;
    }
    if (!mongooseCache.promise) {
        mongooseCache.promise = mongoose.connect(MONGODB_URI).then((mongoose) => {
        mongooseCache.conn = mongoose;
        return mongoose;
        });
    }
    return mongooseCache.promise;
}
