"use client";

import { Board, Column } from "@/lib/models/models.type";
import { useState, useEffect } from "react";

export function useBoards(initialBoard: Board | null) {
    const [board, setBoard] = useState<Board | null>(initialBoard || null);
    const [columns, setColumns] = useState<Column[] | []>(initialBoard?.columns || []);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setBoard(initialBoard);
        setColumns(initialBoard?.columns || []);
    }, [initialBoard]);

    async function moveJobApplication(applicationId: string, newColumnId: string, newOrder: number) {
        
    }

    return { board, columns, error };
}