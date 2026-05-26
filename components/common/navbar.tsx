"use client"

import Link from "next/link";
import { Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSession } from "@/lib/auth/auth-client";
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuTrigger } from "../ui/dropdown-menu";
import SignOutBtn from "./sign-out-btn";
import { Avatar, AvatarFallback } from "../ui/avatar";

export default function Navbar() {
    const { data: session } = useSession();
    return (
        <nav className="bg-black text-white p-4">
            <div className="container mx-auto flex items-center justify-between">
                <div className="flex items-center">
                    <Briefcase className="mr-2" />
                    <div className="text-lg font-bold">Job Tracker</div>
                </div>
                <div>
                    {session ? (
                        <>
                            <Link href="/dashboard" className="px-3 py-2 rounded-md text-sm font-medium">
                                <Button variant="ghost">Dashboard</Button>
                            </Link>
                            <DropdownMenu>
                                <DropdownMenuTrigger className="px-3 py-2 rounded-md text-sm font-medium">
                                    <Avatar className="w-8 h-8">
                                        <AvatarFallback className="bg-muted text-muted-foreground">{session.user.name?.[0].toUpperCase() ?? "U"}</AvatarFallback>
                                    </Avatar>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="bg-white text-black">
                                    <DropdownMenuLabel>
                                        <div>
                                            <div className="font-medium">{session.user.name}</div>
                                            <div className="text-sm text-muted-foreground">{session.user.email}</div>
                                        </div>
                                    </DropdownMenuLabel>
                                    <SignOutBtn />
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </>
                        
                    ) : (
                        <>
                            <Link href="/" className="px-3 py-2 rounded-md text-sm font-medium">
                                <Button variant="ghost">Home</Button>
                            </Link>
                            <Link href="/login" className="px-3 py-2 rounded-md text-sm font-medium">
                                <Button variant="ghost">Login</Button>
                            </Link>
                            <Link href="/sign-up" className="px-3 py-2 rounded-md text-sm font-medium">
                                <Button variant="ghost">Sign Up</Button>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}