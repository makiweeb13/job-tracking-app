"use client"

import { signOut } from "@/lib/auth/auth-client";
import { DropdownMenuItem } from "../ui/dropdown-menu";
import { useRouter } from "next/navigation";

export default function SignOutBtn() {
    const router = useRouter();

    return (
        <DropdownMenuItem onSelect={async () => {
            const result = await signOut();
            if (result.data) {
                router.push("/login");
            } else {
                alert("Failed to sign out. Please try again.");
            }
        }}>Sign Out</DropdownMenuItem>
    );
}
