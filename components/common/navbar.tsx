"use client"

import Link from "next/link";
import { Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSession } from "@/lib/auth/auth-client";
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import SignOutBtn from "./sign-out-btn";
import { Avatar, AvatarFallback } from "../ui/avatar";

export default function Navbar() {
    const { data: session } = useSession();
    return (
        <nav className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <div className="flex items-center gap-2">
                    <Briefcase className="h-6 w-6 text-blue-600" />
                    <div className="text-xl font-bold tracking-tight text-slate-900">Job Tracker</div>
                </div>

                <div className="flex items-center gap-2">
                    {session ? (
                        <>
                            <Link href="/dashboard">
                                <Button variant="ghost" className="text-slate-600 hover:text-slate-900">Dashboard</Button>
                            </Link>
                            <DropdownMenu>
                                <DropdownMenuTrigger className="ml-2 focus:outline-none">
                                    <Avatar className="h-9 w-9 border border-slate-200 transition-hover hover:opacity-80">
                                        <AvatarFallback className="bg-slate-100 text-slate-600 font-medium">
                                            {session.user.name?.[0].toUpperCase() ?? "U"}
                                        </AvatarFallback>
                                    </Avatar>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56 mt-2">
                                    <DropdownMenuLabel className="font-normal">
                                        <div className="flex flex-col space-y-1">
                                            <p className="text-sm font-medium leading-none text-slate-900">{session.user.name}</p>
                                            <p className="text-xs leading-none text-slate-500">{session.user.email}</p>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <SignOutBtn />
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Link href="/">
                                <Button variant="ghost" className="text-slate-600">Home</Button>
                            </Link>
                            <Link href="/login">
                                <Button variant="ghost" className="text-slate-600">Login</Button>
                            </Link>
                            <Link href="/sign-up">
                                <Button className="bg-slate-900 text-white hover:bg-slate-800">Sign Up</Button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}