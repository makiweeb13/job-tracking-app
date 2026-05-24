import Link from "next/link";
import { Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  return (
    <nav className="bg-black text-white p-4">
        <div className="container mx-auto flex items-center justify-between">
            <div className="flex items-center">
                <Briefcase className="mr-2" />
                <div className="text-lg font-bold">Job Tracker</div>
            </div>
            <div>
                <Link href="/" className="px-3 py-2 rounded-md text-sm font-medium">
                    <Button variant="ghost">Home</Button>
                </Link>
                <Link href="/login" className="px-3 py-2 rounded-md text-sm font-medium">
                    <Button variant="ghost">Login</Button>
                </Link>
                <Link href="/sign-up" className="px-3 py-2 rounded-md text-sm font-medium">
                    <Button variant="ghost">Sign Up</Button>
                </Link>
            </div>
        </div>
    </nav>
  );
}