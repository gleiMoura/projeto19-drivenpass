import prisma from "../config/database.js";
import { credentials } from "@prisma/client";

export type CreateCredentialData = Omit<credentials,"id">

export async function findCredentialByUserIdAndTitle( userId: number, title: string ) {
    const credential = prisma.users.findUnique({
        where: {
            id: userId
        },
        select: {
            credentials: {
                where: {
                    title
                }
            }
        }
    });
    return credential;
};

export async function putCredentialInDatabase( credential : CreateCredentialData) {
    const {userId, userName, password, title, url} = credential;
    
    await prisma.credentials.create({
        data: { userId, userName, password, title, url }
    });
}