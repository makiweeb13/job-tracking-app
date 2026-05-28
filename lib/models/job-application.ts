import mongoose, { Schema, Document } from "mongoose";

export interface IJobApplication extends Document {
    position: string;
    company: string;
    location?: string;
    status: string;
    description?: string;
    order: number;
    notes?: string;
    salary?: number;
    jobUrl?: string;
    applicationDate: Date;
    tags?: string[];
    columnId: mongoose.Types.ObjectId;
    boardId: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const JobApplicationSchema: Schema = new Schema<IJobApplication>({
    position: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String },
    status: { type: String, required: true, default: "Applied" },
    description: { type: String },
    order: { type: Number, required: true, default: 0 },
    notes: { type: String },
    salary: { type: Number },
    jobUrl: { type: String },
    applicationDate: { type: Date, required: true },
    tags: [{ type: String }],
    columnId: { type: Schema.Types.ObjectId, ref: "Column", required: true, index: true },
    boardId: { type: Schema.Types.ObjectId, ref: "Board", required: true, index: true },
}, { timestamps: true });

export default mongoose.models.JobApplication || mongoose.model<IJobApplication>("JobApplication", JobApplicationSchema);