"use server"

import { getSession } from "@/lib/auth/auth";
import { connectToDatabase } from "@/lib/db";
import { Board, Column, JobApplication } from "../models";
import { revalidatePath } from "next/cache";

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

    const maxOrderDoc = await JobApplication.findOne({ columnId: data.columnId }).sort({ order: -1 }).select("order").lean();
    const maxOrder = (maxOrderDoc as { order: number } | null)?.order ?? 0;
    
    const newJobApplication = {
        position: data.position,
        company: data.company,
        description: data.description,
        jobUrl: data.jobUrl,
        location: data.location,
        applicationDate: data.applicationDate,
        salary: data.salary ? Number(data.salary) : undefined,
        tags: data.tags || [],
        notes: data.notes,
        columnId: data.columnId,
        boardId: data.boardId,
        status: "Applied",
        order: maxOrder + 1
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
            // Convert 0-based index to 1-based order
            const targetPosition = newOrder + 1;
            
            // Get all items in new column except the one being moved
            const newColumnItems = await JobApplication.find({ 
                columnId: newColumnId, 
                _id: { $ne: jobId } 
            }).sort({ order: 1 });

            // Shift items at and after the target position
            for (let i = 0; i < newColumnItems.length; i++) {
                const currentOrder = i + 1;
                if (currentOrder >= targetPosition) {
                    newColumnItems[i].order = currentOrder + 1;
                } else {
                    newColumnItems[i].order = currentOrder;
                }
                await newColumnItems[i].save();
            }
            jobApplication.order = targetPosition;
        } else {
            // Add to the end if no order specified
            const maxOrderDoc = await JobApplication.findOne({ columnId: newColumnId }).sort({ order: -1 }).select("order").lean();
            const maxOrder = (maxOrderDoc as { order: number } | null)?.order ?? 0;
            jobApplication.order = maxOrder + 1;
        }
    } else if (newOrder !== undefined) {
        // Same column, different order
        // Convert 0-based index to 1-based order
        const targetOrder = newOrder + 1;
        
        if (targetOrder !== jobApplication.order) {
            const columnItems = await JobApplication.find({ columnId: oldColumnId }).sort({ order: 1 });
            
            const oldOrder = jobApplication.order;

            for (const item of columnItems) {
                if (item._id.toString() === jobId) continue;

                if (oldOrder < targetOrder) {
                    // Moving down - shift items up
                    if (item.order > oldOrder && item.order <= targetOrder) {
                        item.order -= 1;
                    }
                } else {
                    // Moving up - shift items down
                    if (item.order >= targetOrder && item.order < oldOrder) {
                        item.order += 1;
                    }
                }
                await item.save();
            }
            jobApplication.order = targetOrder;
        }
    }

    // Apply other updates
    if (updates.salary !== undefined) {
        const parsed = Number(updates.salary);
        jobApplication.salary = Number.isNaN(parsed) ? undefined : parsed;
    }
    delete updates.salary;
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