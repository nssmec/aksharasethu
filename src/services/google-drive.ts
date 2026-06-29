import { google } from "googleapis";
import { Readable } from "stream";

const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
);

oauth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
});

const drive = google.drive({
    version: "v3",
    auth: oauth2Client,
});

const ROOT_FOLDER_ID = process.env.GOOGLE_DRIVE_PARENT_FOLDER_ID!;

async function getOrCreateCategoryFolder(
    categoryName: string
): Promise<string> {
    const escapedCategory = categoryName.replace(/'/g, "\\'");

    const existing = await drive.files.list({
        q: [
            `name='${escapedCategory}'`,
            `'${ROOT_FOLDER_ID}' in parents`,
            `mimeType='application/vnd.google-apps.folder'`,
            `trashed=false`,
        ].join(" and "),
        fields: "files(id,name)",
        supportsAllDrives: true,
        includeItemsFromAllDrives: true,
    });

    if (existing.data.files?.length) {
        return existing.data.files[0].id!;
    }

    const folder = await drive.files.create({
        requestBody: {
            name: categoryName,
            mimeType: "application/vnd.google-apps.folder",
            parents: [ROOT_FOLDER_ID],
        },
        fields: "id",
        supportsAllDrives: true,
    });

    if (!folder.data.id) {
        throw new Error("Failed to create category folder.");
    }

    return folder.data.id;
}

export interface UploadResponse {
    fileId: string;
    driveLink: string;
    previewLink: string;
}

export async function uploadToDrive(
    fileBuffer: Buffer,
    fileName: string,
    mimeType: string,
    categoryName: string
): Promise<UploadResponse> {
    const folderId = await getOrCreateCategoryFolder(categoryName);

    const stream = Readable.from(fileBuffer);

    const upload = await drive.files.create({
        requestBody: {
            name: fileName,
            parents: [folderId],
        },
        media: {
            mimeType,
            body: stream,
        },
        fields: "id",
        supportsAllDrives: true,
    });

    const fileId = upload.data.id;

    if (!fileId) {
        throw new Error("Google Drive upload failed.");
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
    };
}