import { connectToDatabase } from "@/lib/db";
import { Board } from "@/lib/models";
import { getSession } from "@/lib/auth/auth";
import KanbanBoard from "@/components/ui/kanbanboard";

export default async function DashboardPage() {
    await connectToDatabase();
    const session = await getSession();
    const board = await Board.findOne({
        userId: session?.user?.id,
        name: "Job Hunt" 
    }).populate({
        path: "columns",
        populate: {
            path: "jobApplications"
        }
    });

    return (
        <div className="border-b border-gray-200 bg-white px-6 py-8">
            <div className="flex items-center justify-between">
                <div>
                <h1 className="text-2xl font-bold tracking-tight text-gray-900">Dashboard</h1>
                <p className="mt-1 text-sm text-gray-500">
                    Welcome back, <span className="font-medium text-gray-900">{session?.user?.name}</span>. Here's the status of your jobs today.
                </p>
                </div>
                {/* Optional: Add a button or "Last updated" text here */}
                <div className="text-xs text-gray-400">Updated 2m ago</div>
            </div>
            <KanbanBoard key={board?._id} board={JSON.stringify(board)} userId={session?.user?.id} />
        </div>
    );
}