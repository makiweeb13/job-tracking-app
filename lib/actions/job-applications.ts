"use server"

import { getSession } from "@/lib/auth/auth";
import { connectToDatabase } from "@/lib/db";
import { Board, Column, JobApplication } from "../models";

interface JobApplicationData {
    position: string;
    company: string;
    description?: string;
    jobLink?: string;
    location?: string;
    applicationDate: string; // ISO date string
    salary?: string;
    tags?: string[]; // Array of tags
    notes?: string;
    columnId: string;
    boardId: string;
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
        jobLink: data.jobLink,
        location: data.location,
        applicationDate: data.applicationDate,
        salary: data.salary,
        tags: data.tags || [],
        notes: data.notes,
        columnId: data.columnId,
        boardId: data.boardId,
        userId: session.user.id,
        status: "Applied",
        order: (maxOrder?.order || 0) + 1 // Add to the end of the column
    };

    const createdJobApplication = await JobApplication.create(newJobApplication);

    // Update the column to include the new job application
    column.jobApplications.push(createdJobApplication._id);
    await column.save();

    return { data: JSON.parse(JSON.stringify(createdJobApplication)) };
}