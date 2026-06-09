import { connectToDatabase } from "@/lib/db";
import { Board } from "@/lib/models";
import { getSession } from "@/lib/auth/auth";
import KanbanBoard from "@/components/ui/kanbanboard";
import { Suspense } from "react";

async function fetchBoard(userId: string | undefined) {
    'use cache';
    if (!userId) return null;
    const boardDoc = await Board.findOne({
        userId: userId,
        name: "Job Hunt"
    }).populate({
        path: "columns",
        populate: {
            path: "jobApplications"
        }
    });

    if (!boardDoc) return null;

    const board = JSON.parse(JSON.stringify(boardDoc));
    return board;
}

async function DashboardPage() {
    await connectToDatabase();
    const session = await getSession();
    const board = await fetchBoard(session?.user?.id ?? "");

    return (
        <div className="border-b border-gray-200 bg-white px-6 py-8">
            <div className="flex items-center justify-between">
                <div>
                <h1 className="text-2xl font-bold tracking-tight text-gray-900">Dashboard</h1>
                <p className="mt-1 text-sm text-gray-500">
                    Welcome back, <span className="font-medium text-gray-900">{session?.user?.name}</span>. Here's the status of your jobs today.
                </p>
                </div>
            </div>
            <KanbanBoard key={board?._id} board={board} userId={session?.user?.id} />
        </div>
    );
}

export default async function Dashboard() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center h-64"><span className="text-gray-500">Loading your dashboard...</span></div>}>
            <DashboardPage />
        </Suspense>
    )
}
        