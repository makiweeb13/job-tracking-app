"use server"

import { getSession } from "@/lib/auth/auth";
import { connectToDatabase } from "@/lib/db";
import { Board, Column, JobApplication } from "../models";
import { revalidatePath } from "next/dist/server/web/spec-extension/revalidate";

interface JobApplicationData {
    position: string;
    company: string;
    description?: string;
    jobUrl?: string;
    location?: string;
    applicationDate: string; // ISO date string
    salary?: string;
    tags?: string[]; // Array of tags
    notes?: string;
    columnId: string;
    boardId: string;
    order?: number; // Optional order for sorting within the column
}

export async function createJobApplication(data: JobApplicationData) {
    const session = await getSession()

    if (!session?.user) {
        throw new Error("Unauthorized");
    }

    await connectToDatabase();

    // Validate required fields
    if (!data.position || !data.company || !data.applicationDate || !data.columnId || !data.boardId) {
        throw new Error("Missing required fields");
    }

    const board = await Board.findOne({ _id: data.boardId, userId: session.user.id });
    if (!board) {
        throw new Error("Board not found");
    }

    const column = await Column.findOne({ _id: data.columnId, boardId: data.boardId });

    if (!column) {
        throw new Error("Column not found in the specified board");
    }

    const maxOrder = (await JobApplication.find({ columnId: data.columnId }).sort({ order: -1 }).select("order").lean()) as unknown as { order: number } | null;
    
    const newJobApplication = {
        position: data.position,
        company: data.company,
        description: data.description,
        jobUrl: data.jobUrl,
        location: data.location,
        applicationDate: data.applicationDate,
        salary: data.salary,
        tags: data.tags || [],
        notes: data.notes,
        columnId: data.columnId,
        boardId: data.boardId,
        status: "Applied",
        order: (maxOrder?.order || 0) + 1 // Add to the end of the column
    };

    const createdJobApplication = await JobApplication.create(newJobApplication);

    // Update the column to include the new job application
    column.jobApplications.push(createdJobApplication._id);
    await column.save();

    revalidatePath("/dashboard"); // Revalidate the dashboard page to show the new job application

    return { data: JSON.parse(JSON.stringify(createdJobApplication)) };
}

export async function updateJobApplication(jobId: string, updates: Partial<JobApplicationData>) {
    const session = await getSession()

    if (!session?.user) {
        throw new Error("Unauthorized");
    }

    const jobApplication = await JobApplication.findOne({ _id: jobId });

    if (!jobApplication) {
        throw new Error("Job application not found");
    }

    // Verify user owns this job application by checking board ownership
    const board = await Board.findOne({ _id: jobApplication.boardId, userId: session.user.id });
    if (!board) {
        throw new Error("Unauthorized");
    }

    const oldColumnId = jobApplication.columnId.toString();
    const newColumnId = updates.columnId?.toString();
    const isMovingToNewColumn = newColumnId && newColumnId !== oldColumnId;
    const newOrder = updates.order;

    // Handle column change
    if (isMovingToNewColumn) {
        const oldColumn = await Column.findOne({ _id: oldColumnId, boardId: jobApplication.boardId });
        const newColumn = await Column.findOne({ _id: newColumnId, boardId: jobApplication.boardId });

        if (!oldColumn) {
            throw new Error("Original column not found");
        }
        if (!newColumn) {
            throw new Error("Destination column not found");
        }

        // Remove from old column
        oldColumn.jobApplications = oldColumn.jobApplications.filter((id: any) => id.toString() !== jobId);
        await oldColumn.save();

        // Reorder items in old column
        const oldColumnItems = await JobApplication.find({ columnId: oldColumnId }).sort({ order: 1 });
        for (let i = 0; i < oldColumnItems.length; i++) {
            oldColumnItems[i].order = i + 1;
            await oldColumnItems[i].save();
        }

        // Add to new column if not already present
        if (!newColumn.jobApplications.some((id: any) => id.toString() === jobId)) {
            newColumn.jobApplications.push(jobApplication._id);
        }
        await newColumn.save();

        // Handle order in new column
        if (newOrder !== undefined) {
            // Get all items in new column except the one being moved
            const newColumnItems = await JobApplication.find({ 
                columnId: newColumnId, 
                _id: { $ne: jobId } 
            }).sort({ order: 1 });

            // Insert at the specified position
            const insertPosition = Math.max(1, Math.min(newOrder, newColumnItems.length + 1));
            for (let i = 0; i < newColumnItems.length; i++) {
                const targetOrder = i + 1 >= insertPosition ? i + 2 : i + 1;
                newColumnItems[i].order = targetOrder;
                await newColumnItems[i].save();
            }
            jobApplication.order = insertPosition;
        } else {
            // Add to the end if no order specified
            const maxOrder = (await JobApplication.find({ columnId: newColumnId }).sort({ order: -1 }).select("order").lean()) as unknown as { order: number } | null;
            jobApplication.order = (maxOrder?.order || 0) + 1;
        }
    } else if (newOrder !== undefined && newOrder !== jobApplication.order) {
        // Same column, different order
        const columnItems = await JobApplication.find({ columnId: oldColumnId }).sort({ order: 1 });
        
        const oldOrder = jobApplication.order;
        const minOrder = Math.min(oldOrder, newOrder);
        const maxOrder = Math.max(oldOrder, newOrder);

        for (const item of columnItems) {
            if (item._id.toString() === jobId) continue;

            if (oldOrder < newOrder) {
                // Moving down
                if (item.order > oldOrder && item.order <= newOrder) {
                    item.order -= 1;
                }
            } else {
                // Moving up
                if (item.order >= newOrder && item.order < oldOrder) {
                    item.order += 1;
                }
            }
            await item.save();
        }
        jobApplication.order = newOrder;
    }

    // Apply other updates
    Object.assign(jobApplication, updates);
    await jobApplication.save();

    revalidatePath("/dashboard");

    return { data: JSON.parse(JSON.stringify(jobApplication)) };
}

export async function deleteJobApplication(jobId: string) {
    const session = await getSession()

    if (!session?.user) {
        throw new Error("Unauthorized");
    }

    const jobApplication = await JobApplication.findOne({ _id: jobId });

    if (!jobApplication) {
        throw new Error("Job application not found");
    }

    // Verify user owns this job application by checking board ownership
    const board = await Board.findOne({ _id: jobApplication.boardId, userId: session.user.id });
    if (!board) {
        throw new Error("Unauthorized");
    }

    await JobApplication.deleteOne({ _id: jobId });

    const column = await Column.findOne({ _id: jobApplication.columnId, boardId: jobApplication.boardId });

    if (column) {
        column.jobApplications = column.jobApplications.filter((id: any) => id.toString() !== jobId);
        await column.save();
    }

    revalidatePath("/dashboard");

    return { success: true };
}