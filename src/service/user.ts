import { MongoError } from 'mongodb';
import { BlobServiceClient } from '@azure/storage-blob';

import { Message_Location_Update } from '@customTypes/message'
import User from 'data/models/user'
import { MESSAGE_TYPE } from 'websocket/utils/constants'
import { ERRORS, RequestError } from '@utils/error';
import { AZURE_STORAGE_CONNECTION_STRING } from '@utils/contants';

// TODO fix this
export async function getCurrentLocation(userID: string): Promise<Message_Location_Update> {
    return {
        type: MESSAGE_TYPE.LOCATION_UPDATE,
        snappedLocation: {
            lat: 30.323375522065525,
            lon: 78.00548970602715
        },
        userID: "63099c21726ec5638d852429",
        rawLocation: {
            lat: 30.323375522065525,
            lon: 78.00548970602715
        },
        isOffRoute: false,
        createdTS: Date.now(),
    }
}

export async function getUserFromPhoneNumber(phoneNumber: string) {
    const user = await User.findOne({
        phoneNumber: phoneNumber
    })
    if(!user) {
        throw ERRORS.CANNOT_FIND_USER
    }
    return user
}

export async function getUserFromID(userID: string) {
    const user =  await User.findById(userID)
    if(!user) {
        throw ERRORS.CANNOT_FIND_USER
    }
    return user
}

export async function createUser(firstName: String, lastName: String, phoneNumber: String, gender: String) {

    try {
        const user = await User.create({
            firstName: firstName,
            lastName: lastName,
            phoneNumber: phoneNumber,
            gender: gender
        })
        return user
    } catch(e) {
        if(e instanceof MongoError) {
            if(e.code == 11000) {
                throw ERRORS.ANOTHER_USER_EXISTS
            }
            throw ERRORS.DATABASE_ERROR
        } 
        throw e
    }
}

export async function checkUserRefreshToken(userID: string, refreshToken: string) {
    const user = await User.findOne({
        _id: userID,
        refreshToken: refreshToken
    })
    if(!user) {
        throw ERRORS.CANNOT_FIND_USER
    }
    return user
}

export async function updateImageURL(userID: String, newURL: String) {
    const user =  await User.findByIdAndUpdate(userID, {
        imageURL: newURL
    }, { new: true })
    if (!user) {
        throw ERRORS.CANNOT_FIND_USER
    }
    return user
}

export async function updateAuthToken(userID: String, newAuthToken: String) {
    const user = await User.findByIdAndUpdate(userID, {
        authToken: newAuthToken
    })
    if (!user) {
        throw ERRORS.CANNOT_FIND_USER
    }
    return user
}

export async function updateTokens(userID: String, newAuthToken: String, newRefreshToken: String) {
    const user = await User.findByIdAndUpdate(userID, {
        authToken: newAuthToken,
        refreshToken: newRefreshToken
    }, { new: true })
    if(!user) {
        throw ERRORS.CANNOT_FIND_USER
    }
    return user
}

export async function updateCompanionPreference(userID: String, companionPreference: String) {
    const user = await User.findByIdAndUpdate(userID, {
        companionPreference: companionPreference
    }, { new: true })
    if(!user) {
        throw ERRORS.CANNOT_FIND_USER
    }
    return user
}



export async function updateRefreshToken(userID: String, newRefreshToken: String) {
    const user =  await User.findByIdAndUpdate(userID, {
        refreshToken: newRefreshToken
    })
    if(!user) {
        throw ERRORS.CANNOT_FIND_USER
    }
    return user
}

export async function removeRefeshToken(userID: String) {
    const user = User.findByIdAndUpdate(userID, {
        $unset: {refreshToken: 1 }
    })
    if(!user) {
        throw ERRORS.CANNOT_FIND_USER
    }
    return user
}

export async function removeTokens(userID: String) {
    const user = User.findByIdAndUpdate(userID, {
        $unset: {refreshToken: 1, authToken: 1 }
    })
    if(!user) {
        throw ERRORS.CANNOT_FIND_USER
    }
    return user
}

export async function uploadProfilePhoto(file: Express.Multer.File, userID: string) {
    const blobName = userID;
    const blobService = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING)
    const containerClient = blobService.getContainerClient("image")
    const randomHash = Math.random().toString(36).substr(2, 5);
    const blockBlobClient = containerClient.getBlockBlobClient(userID + randomHash)
    const res = await blockBlobClient.upload(file.buffer, file.buffer.length);
    return blockBlobClient.url
}