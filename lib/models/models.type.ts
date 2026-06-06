export interface Board {
    _id: string;
    userId: string;
    name: string;
    columns: Column[];
}

export interface Column {
    _id: string;
    name: string;
    jobApplications: string[]; // Array of JobApplication IDs
    boardId: string;
    order: number;
}