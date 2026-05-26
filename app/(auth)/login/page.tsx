"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn } from "@/lib/auth/auth-client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import React from "react";

export default function LoginPage() {
    const [ user, setUser ] = React.useState({
            email: "",
            password: ""
        });
        const [ error, setError ] = React.useState<string | null>(null);
        const [ loading, setLoading ] = React.useState(false);
    
        const router = useRouter();
    
        const handleSubmit = async (e: React.FormEvent) => {
            e.preventDefault();
            setLoading(true);
            setError(null);
            try {
                const result = await signIn.email({
                    email: user.email,
                    password: user.password
                });
                if (result.error) {
                    setError(result.error.message ?? "An error occurred during sign in. Please try again.");
                } else {
                    router.push("/dashboard");
                }
            } catch (err) {
                setError("Failed to sign in. Please try again.");
            } finally {
                setLoading(false);
            }
        };
    return (
        <div className="min-h-screen flex items-center justify-center p-10">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">Login</CardTitle>
                    <CardDescription className="text-sm text-muted-foreground">Sign in to access your account and manage your preferences.</CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        <div>
                            <Label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</Label>
                            <Input type="email" id="email" name="email" value={user.email} onChange={(e) => setUser({ ...user, email: e.target.value })} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                        </div>
                        <div>
                            <Label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</Label>
                            <Input type="password" id="password" name="password" value={user.password} onChange={(e) => setUser({ ...user, password: e.target.value })} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col items-center">
                    <Button type="submit" disabled={loading} className="w-full">{loading ? "Logging in..." : "Login"}</Button>
                    {error && <p className="mt-2 text-red-600">{error}</p>}
                    <p className="mt-2">Don't have an account? <Link href="/sign-up" className="text-center text-indigo-600 hover:text-indigo-500">Sign Up</Link></p>
                </CardFooter>
                </form>
            </Card>
        </div>
    );
}