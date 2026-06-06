"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signUp } from "@/lib/auth/auth-client";
import Link from "next/link";
import React from "react";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
    const [ user, setUser ] = React.useState({
        name: "",
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
            const result = await signUp.email({
                name: user.name,
                email: user.email,
                password: user.password
            });
            if (result.error) {
                setError(result.error.message ?? "An error occurred during sign up. Please try again.");
            } else {
                router.push("/dashboard");
            }
        } catch (err) {
            setError("Failed to sign up. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-10">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">Sign Up</CardTitle>
                    <CardDescription className="text-sm text-muted-foreground">Create a new account to access exclusive features and content.</CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        <div>
                            <Label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</Label>
                            <Input type="text" id="name" name="name" onChange={e => setUser({ ...user, name: e.target.value })} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                        </div>
                        <div>
                            <Label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</Label>
                            <Input type="email" id="email" name="email" onChange={e => setUser({ ...user, email: e.target.value })} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                        </div>
                        <div>
                            <Label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</Label>
                            <Input type="password" id="password" name="password" onChange={e => setUser({ ...user, password: e.target.value })} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col items-center">
                        <Button type="submit" className="w-full mt-5" disabled={loading}>{loading ? "Signing Up..." : "Sign Up"}</Button>
                        {error && <p className="mt-2 text-red-600">{error}</p>}
                        <p className="mt-2">Already have an account? <Link href="/login" className="text-center text-indigo-600 hover:text-indigo-500">Sign In</Link></p>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}