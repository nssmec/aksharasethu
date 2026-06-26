import { google } from "googleapis";
import { Readable } from "stream";

const SCOPES = ["https://www.googleapis.com/auth/drive.file"];

const serviceAccountJson = process.env.GOOGLE_DRIVE_SERVICE_ACCOUNT_JSON;
const parentFolderId = process.env.GOOGLE_DRIVE_PARENT_FOLDER_ID;

if (!serviceAccountJson) {
    throw new Error("Missing GOOGLE_DRIVE_SERVICE_ACCOUNT_JSON environment variable.");
}

const credentials = JSON.parse(serviceAccountJson);

const auth = new google.auth.JWT({
    email: credentials.client_email,
    key: credentials.private_key.replace(/\\n/g, "\n"),
    scopes: SCOPES,
});

const drive = google.drive({
    version: "v3",
    auth,
});

export interface UploadResponse {
    fileId: string;
    driveLink: string;
    previewLink: string;
    mimeType: string;
}

export async function uploadToDrive(
    fileBuffer: Buffer,
    fileName: string,
    mimeType: string
): Promise<UploadResponse> {
    const bufferStream = Readable.from(fileBuffer);

    const response = await drive.files.create({
        requestBody: {
            name: fileName,
            ...(parentFolderId ? { parents: [parentFolderId] } : {}),
        },
        media: {
            mimeType,
            body: bufferStream,
        },
        fields: "id",
        supportsAllDrives: true,
    });

    const fileId = response.data.id;

    if (!fileId) {
        throw new Error("Google Drive upload failed. No file ID was returned.");
    }

    await drive.permissions.create({
        fileId,
        requestBody: {
            type: "anyone",
            role: "reader",
            allowFileDiscovery: false,
        },
        supportsAllDrives: true,
    });

    return {
        fileId,
        driveLink: `https://drive.google.com/file/d/${fileId}/view`,
        previewLink: `https://drive.google.com/file/d/${fileId}/preview`,
        mimeType,
    };
}