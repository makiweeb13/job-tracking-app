"use client"

import { Board, Column } from "@/lib/models/models.type";
import { Award, Calendar, CheckCircle, XCircle } from "lucide-react";
import { Card, CardHeader, CardTitle } from "./card";

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

function DroppableColumn({ column, config, board }: { column: Column; config: columnConfig; board: string | undefined }) {
    // Implement drag-and-drop logic here
    return (
        <Card>
            <CardHeader>
                <div>
                    <div className={`inline-flex h-6 w-6 items-center justify-center rounded-full ${config.color}`}>
                        {config.icon}
                        <CardTitle className="ml-2 text-sm font-medium text-gray-900">{column.name}</CardTitle>
                    </div>
                    <CardTitle className="ml-2 text-sm font-medium text-gray-900">{column.name}</CardTitle>
                </div>
            </CardHeader>
        </Card>
    )
}

export default function KanbanBoard({ board, userId }: KanbanBoardProps) {
    const parsedBoard: Board | null = board ? JSON.parse(board) : null;
    const columns = parsedBoard?.columns || [];
    console.log("Rendering KanbanBoard with columns:", columns);
    return (
        <>
            <div className="mt-6 flex space-x-4 overflow-x-auto">
                {columns.map((column, index) => {
                    const config = COLUMN_CONFIG[index] || { color: "bg-gray-500", icon: <Calendar className="h-5 w-5 text-white" /> };
                    return (
                        <DroppableColumn key={column._id} column={column} config={config} board={parsedBoard?._id} />
                    );
                })}
            </div>
        </>
    );
}