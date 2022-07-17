import Cryptr from "cryptr";
import { findCredentialByUserIdAndTitle, 
        putCredentialInDatabase} from "../repositories/credentialRepository.js";

import { CreateCredentialData, 
        findAllCredentials, 
        findCredentialById,
        deleteCredentialById } from "../repositories/credentialRepository.js"; //from prisma
import { verifyCredential } from "../utils/credentialUtil.js";

export async function createNewCredential( data: CreateCredentialData ) {
    const { userId, title }= data;
    const credential = await findCredentialByUserIdAndTitle( userId, title);
    if( credential.credentials.length !== 0 ) {
        throw {
            response: {
                message: "You aready create a credential with this title",
                status: 409
            }
        }
    };

    const cryptr = new Cryptr( process.env.SECRET );
    const newPassword = cryptr.encrypt(data.password);

    const newCredential = {...data, password: newPassword}

    await putCredentialInDatabase(newCredential);
    
    return newPassword;
};

export async function findCredentials( userId: number ) {
    const credentials = await findAllCredentials( userId );

    const decryptCredentials = credentials.map(element => {
        const cryptr = new Cryptr(process.env.SECRET);
        const decryptPassword = cryptr.decrypt(element.password);

        return {...element, password: decryptPassword};
    } )
    console.log(decryptCredentials)
    return decryptCredentials; 
};

export async function findSpecificCredential( credentialId: string, userId: number ){
    const data = await findCredentialById( credentialId );
    
    verifyCredential(data, userId);

    return data;
};

export async function deleteCredentialFromDatabase( credentialId: string, userId: number ) {
    const data = await findCredentialById( credentialId );
    
    verifyCredential(data, userId);

    await deleteCredentialById(credentialId);
}




