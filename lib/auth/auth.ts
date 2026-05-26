import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI!);
const db = client.db();

export const auth = betterAuth({
    secret: process.env.BETTER_AUTH_SECRET || "default_secret",
    database: mongodbAdapter(db, {
        client
    }),
    token: {
        maxAge: 60 * 60 * 24, // 1 day
    },
    cookie: {
        secure: process.env.NODE_ENV === "production",  
        httpOnly: true,
        sameSite: "lax",
    },
    emailAndPassword: {
        enabled: true,
    }
});