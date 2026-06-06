"use client"

import { Board, Column, JobApplication } from "@/lib/models/models.type";
import { Award, Calendar, CheckCircle, MoreVertical, Trash, XCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./dropdown-menu";
import { Button } from "./button";
import CreateJob from "./create-job";
import JobApplicationCard from "./job-application-card";

interface KanbanBoardProps {
    board: string | null;
    userId: string | undefined;
}

interface columnConfig {
    color: string;
    icon: React.ReactNode;
}

const COLUMN_CONFIG: Array<columnConfig> = [
    {
        color: "bg-gray-500",
        icon: <Calendar className="h-5 w-5 text-white" />
    },
    {
        color: "bg-blue-500",
        icon: <CheckCircle className="h-5 w-5 text-white" />
    },
    {
        color: "bg-green-500",
        icon: <Award className="h-5 w-5 text-white" />
    },
    {
        color: "bg-yellow-500",
        icon: <XCircle className="h-5 w-5 text-white" />
    }
];

function DroppableColumn({ column, config, board, sortedColumns }: { column: Column; config: columnConfig; board: string | undefined | null; sortedColumns?: Column[] }) {
    const sortedJobs = JSON.parse(JSON.stringify(column.jobApplications)).sort((a: any, b: any) => a.order - b.order) || [];
    // Implement drag-and-drop logic here
    return (
        <Card className="flex flex-col h-full min-w-90 border-slate-200 shadow-sm bg-slate-50/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4">
                <div className="flex items-center gap-3">
                {/* Icon Wrapper with subtle background */}
                <div className={`p-2 rounded-lg ${config.color}`}>
                    {config.icon}
                </div>
                <div>
                    <CardTitle className="text-sm font-semibold text-slate-700 tracking-tight">
                    {column.name}
                    </CardTitle>
                </div>
                </div>
                <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-slate-900">
                    <MoreVertical className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                    <DropdownMenuItem className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer">
                    <Trash className="mr-2 h-4 w-4" />
                    Delete Column
                    </DropdownMenuItem>
                </DropdownMenuContent>
                </DropdownMenu>
            </CardHeader>
            <CardContent className="flex-1 px-3 pb-4">
                <div className="min-h-50 min-w-50 rounded-xl border-2 border-dashed border-slate-200 bg-slate-100/50 transition-colors hover:bg-slate-100/80">
                    {/* Render job applications here */}
                    {sortedJobs.map((job: any) => (
                        <JobCard key={job._id} job={{...job, columnId: column._id}} columns={sortedColumns} />
                    ))}
                    <CreateJob columnId={column._id} boardId={board || ""} />
                </div>
            </CardContent>
        </Card>
    )
}

function JobCard({ job, columns }: { job: JobApplication, columns?: Column[] }) {
    return (
        <>
            <JobApplicationCard job={job} columns={columns} />
        </>
    );
}

export default function KanbanBoard({ board, userId }: KanbanBoardProps) {
    const parsedBoard: Board | null = board ? JSON.parse(board) : null;
    const columns = parsedBoard?.columns || [];
    const sortedColumns = columns.sort((a, b) => a.order - b.order);
    return (
        <>
            <div className="mt-6 flex space-x-4 overflow-x-auto">
                {columns.map((column, index) => {
                    const config = COLUMN_CONFIG[index] || { color: "bg-gray-500", icon: <Calendar className="h-5 w-5 text-white" /> };
                    return (
                        <DroppableColumn key={column._id} column={column} config={config} board={parsedBoard?._id} sortedColumns={sortedColumns} />
                    );
                })}
            </div>
        </>
    );
}