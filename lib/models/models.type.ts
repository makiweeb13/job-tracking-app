export interface Board {
    _id: string;
    userId: string;
    name: string;
    columns: Column[];
}

export interface Column {
    _id: string;
    name: string;
    jobApplications: JobApplication[]; // Array of JobApplication objects
    boardId: string;
    order: number;
}

export interface JobApplication {
    _id: string;
    position: string;
    company: string;
    location?: string;
    status: string;
    description?: string;
    order: number;
    notes?: string;
    salary?: number;
    jobUrl?: string;
    applicationDate: string; // ISO date string
    tags?: string[];
    columnId: string;
    boardId: string;
}