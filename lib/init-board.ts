import { connectToDatabase } from "./db";
import { Board, Column } from "./models";

const COLUMN_NAMES = [{
    name: "Applied", order: 0
}, {
    name: "Interview", order: 1
}, {
    name: "Offer", order: 2
}, {
    name: "Rejected", order: 3
}];

export async function initBoard( userId: string ) {
    try {
        await connectToDatabase();
        // Check if the user already has a board
        const existingBoard = await Board.findOne({ userId });

        if ( existingBoard ) {
            console.log( `Board already exists for user ${userId}` );
            return existingBoard;
        }

        const newBoard = await Board.create({
            name: "Job Hunt",
            userId,
            columns: []
        });

        const columns = await Promise.all( COLUMN_NAMES.map( async ( column ) => {
            const newColumn = await Column.create({
                name: column.name,
                order: column.order,
                boardId: newBoard._id,
                jobApplications: []
            });
            return newColumn;
        }));

        newBoard.columns = columns.map( column => column._id );
        await newBoard.save();

        return newBoard;
    } catch (error) {
        console.error( `Error initializing board for user ${userId}:`, error );
        throw error;
    }
}