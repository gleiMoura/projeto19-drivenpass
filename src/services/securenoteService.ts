import { notes } from "@prisma/client";
import sharedRepository from "../router/sharedRepository.js";

export type CreateNoteData = Omit<notes, "id">;

export async function createNewNote( securenote: CreateNoteData ) {
    const { userId, title }= securenote;
    const note = await sharedRepository.findByUserIdAndTitle(userId, title, "notes");
    if( note.notes.length !== 0 ) {
        throw {
            response: {
                message: "You aready create a note with this title",
                status: 409
            }
        }
    };

    await sharedRepository.createElement( securenote, "notes" );
}