import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { initBoard } from "../init-board";
import { connectToDatabase } from "../db";

const mongooseInstance = await connectToDatabase();
const client = mongooseInstance.connection.getClient();
const db = client.db();

export const auth = betterAuth({
    secret: process.env.BETTER_AUTH_SECRET || "default_secret",
    database: mongodbAdapter(db, {
        client
    }),
    session: {
        cookieCache: {
            enabled: true,
            maxAge: 60 * 60 * 24, // 1 day
        }
    },
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
    },
    databaseHooks: {
        user : {
            create: {
                after: async ( user ) => {
                    try {
                        await initBoard( user.id );
                    } catch ( error ) {
                        console.error( `Error initializing board for user ${user.id}:`, error );
                    }
                }
            }
        }
    }
});

export async function getSession() {
    const result= await auth.api.getSession({
        headers: await headers()
    });
    return result;
}

export async function signOut() {
    const result = await auth.api.signOut({
        headers: await headers()
    });
    if (result.success) {
       redirect("/login");
    }
}