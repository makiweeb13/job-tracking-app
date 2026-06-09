"use client"

import { Board, Column, JobApplication } from "@/lib/models/models.type";
import { Award, Calendar, CheckCircle, MoreVertical, Trash, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./dropdown-menu";
import { Button } from "./button";
import CreateJob from "./create-job";
import JobApplicationCard from "./job-application-card";
import { useBoards } from "@/lib/hooks/useBoards";
import { closestCorners, DndContext, DragEndEvent, DragOverlay, DragStartEvent, PointerSensor, useDroppable, useSensor, useSensors } from "@dnd-kit/core"
import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useState } from "react";
import board from "@/lib/models/board";

interface KanbanBoardProps {
    board: Board | null;
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
    },
    {
        color: "bg-purple-500",
        icon: <CheckCircle className="h-5 w-5 text-white" />
    }
];

function DroppableColumn({ column, config, board, sortedColumns }: { column: Column; config: columnConfig; board: string | undefined | null; sortedColumns?: Column[] }) {
    const { setNodeRef, isOver } = useDroppable({
        id: column._id,
        data: {
            type: "COLUMN",
            columnId: column._id
        }
    });
    const sortedJobs = column.jobApplications?.sort((a: JobApplication, b: JobApplication) => a.order - b.order) || [];
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
            </CardHeader>
            <CardContent className={`flex-1 px-3 pb-4 ${isOver ? 'bg-slate-200' : 'bg-slate-100/50'}`} ref={setNodeRef} suppressHydrationWarning>
                <SortableContext items={sortedJobs.map((job: any) => job._id)} strategy={verticalListSortingStrategy}>
                    <div className="min-h-50 min-w-50 rounded-xl border-2 border-dashed border-slate-200 bg-slate-100/50 transition-colors hover:bg-slate-100/80" suppressHydrationWarning>
                        {/* Render job applications here */}
                        {sortedJobs.map((job: any) => (
                            <JobCard key={job._id} job={{...job, columnId: column._id}} columns={sortedColumns} />
                        ))}
                        <CreateJob columnId={column._id} boardId={board || ""} />
                    </div>
                </SortableContext>
            </CardContent>
        </Card>
    )
}

function JobCard({ job, columns }: { job: JobApplication, columns?: Column[] }) {
    const { attributes, listeners, transform, transition, isDragging, setNodeRef } = useSortable({
        id: job._id,
        data: {
            type: "JOB",
            job
        }
    })
    const style = {
        transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
        transition,
        zIndex: isDragging ? 999 : undefined,
        opacity: isDragging ? 0.8 : 1,
        cursor: isDragging ? "grabbing" : "grab"
    }
    return (
        <div ref={setNodeRef} style={style}>
            <JobApplicationCard job={job} columns={columns} dragHandleProps={{...attributes, ...listeners}}/>
        </div>
    );
}

export default function KanbanBoard({ board, userId }: KanbanBoardProps) {
    const [activeId, setActiveId] = useState<string | null>(null); // Track currently dragged item
    const { columns, moveJobApplication } = useBoards(board);
    const sortedColumns = columns.sort((a, b) => a.order - b.order);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8
            }
        })
    );

    async function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;
        
        setActiveId(null);

        if (!over || !board?._id) return;

        const activeId = active.id as string;
        const overId = over?.id as string;

        let draggedJob: JobApplication | null = null;
        let sourceColumnId: string | null = null;

        // Find the dragged job
        for (const column of columns) {
            const jobIndex = column.jobApplications.findIndex((job: any) => job._id === activeId);
            if (jobIndex !== -1) {
                draggedJob = column.jobApplications[jobIndex];
                sourceColumnId = column._id;
                break;
            }
        }

        if (!draggedJob || !sourceColumnId) return;

        // Determine target column and position
        const targetColumn = columns.find(col => col._id === overId);
        let targetColumnId: string | null = null;
        let newOrder: number = 0;

        if (targetColumn) {
            // Dropped on a column header/empty space
            targetColumnId = targetColumn._id;
            newOrder = targetColumn.jobApplications.length;
        } else {
            // Dropped on a job - find which column it's in and its index
            for (const column of columns) {
                const jobIndex = column.jobApplications.findIndex((job: any) => job._id === overId);
                if (jobIndex !== -1) {
                    targetColumnId = column._id;
                    newOrder = jobIndex; // Insert before this job
                    break;
                }
            }
        }

        if (!targetColumnId) return;

        await moveJobApplication(activeId, targetColumnId, newOrder);
    }

    async function handleDragStart(event: DragStartEvent) {
        setActiveId(event.active.id as string);
    }

    return (
        <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <div className="mt-6 flex space-x-4 overflow-x-auto" suppressHydrationWarning>
                {sortedColumns.map((column, index) => {
                    const config = COLUMN_CONFIG[index] || { color: "bg-gray-500", icon: <Calendar className="h-5 w-5 text-white" /> };
                    return (
                        <DroppableColumn key={column._id} column={column} config={config} board={board?._id} sortedColumns={sortedColumns} />
                    );
                })}
            </div>
            <DragOverlay>
                {activeId ? (
                    <div className="opacity-90">
                        <JobCard job={columns.flatMap(col => col.jobApplications).find(job => job._id === activeId) as JobApplication} columns={columns} />
                    </div>
                ) : null}
            </DragOverlay>
        </DndContext>
    );
}