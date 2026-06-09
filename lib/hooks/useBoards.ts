"use client";

import { Board, Column, JobApplication } from "@/lib/models/models.type";
import { useState, useEffect } from "react";
import { updateJobApplication } from "../actions/job-applications";

export function useBoards(initialBoard: Board | null) {
    const [board, setBoard] = useState<Board | null>(initialBoard || null);
    const [columns, setColumns] = useState<Column[] | []>(initialBoard?.columns || []);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setBoard(initialBoard);
        setColumns(initialBoard?.columns || []);
    }, [initialBoard]);

    async function moveJobApplication(applicationId: string, newColumnId: string, newOrder: number) {
        setColumns(prevColumns => {
            let jobToMove: JobApplication | null = null;

            // First pass: find and remove the job from its current column
            const newColumns = prevColumns.map(column => {
                const jobIndex = column.jobApplications.findIndex(job => job._id === applicationId);
                if (jobIndex !== -1) {
                    jobToMove = column.jobApplications[jobIndex];
                    return {
                        ...column,
                        jobApplications: column.jobApplications.filter(job => job._id !== applicationId)
                    };
                }
                return column;
            });

            // If job wasn't found, return unchanged
            if (!jobToMove) {
                return prevColumns;
            }

            // Add job to the target column
            const targetColumnIndex = newColumns.findIndex(column => column._id === newColumnId);
            if (targetColumnIndex !== -1) {
                const targetColumn = newColumns[targetColumnIndex];
                const currentJobs = targetColumn.jobApplications;

                const updatedJobs = [...currentJobs.slice(0, newOrder), jobToMove, ...currentJobs.slice(newOrder)];
                
                const jobsWithUpdatedOrder = updatedJobs.map((job, index) => ({
                    ...job,
                    order: index + 1
                }));
                
                newColumns[targetColumnIndex] = {
                    ...targetColumn,
                    jobApplications: jobsWithUpdatedOrder
                };
            }
            return newColumns;  
        });

        try {
            const result = await updateJobApplication(applicationId, { columnId: newColumnId, order: newOrder });
            if (!result || !result.data) {
                throw new Error("Failed to update job application");
            }
        } catch (err) {
            console.error("Failed to move job application:", err);
            setError("Failed to move job application. Please try again.");
        }
    }

    return { board, columns, error, moveJobApplication };
}