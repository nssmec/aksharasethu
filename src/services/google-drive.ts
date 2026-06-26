import { google } from 'googleapis'
import { Readable } from 'stream'

function getDriveClient() {
    const credentials = JSON.parse(process.env.GOOGLE_DRIVE_SERVICE_ACCOUNT_JSON!)
    const auth = new google.auth.JWT({
        email: credentials.client_email,
        key: credentials.private_key,
        scopes: ['https://www.googleapis.com/auth/drive.file'],
    })
    return google.drive({ version: 'v3', auth })
}

/**
 * Resolves or creates a specific subfolder inside the root parent directory
 */
async function getOrCreateCategoryFolder(categoryName: string): Promise<string> {
    const drive = getDriveClient()
    const rootFolderId = process.env.GOOGLE_DRIVE_PARENT_FOLDER_ID!

    // Check if folder already exists under this specific category name
    const response = await drive.files.list({
        q: `name = '${categoryName}' and '${rootFolderId}' in parents and mimeType = 'application/vnd.google-apps.folder' and trashed = false`,
        fields: 'files(id)',
    })

    if (response.data.files && response.data.files.length > 0) {
        return response.data.files[0].id!
    }

    // Create a brand new target subfolder if not found
    const folderMetadata = {
        name: categoryName,
        mimeType: 'application/vnd.google-apps.folder',
        parents: [rootFolderId],
    }

    const folder = await drive.files.create({
        requestBody: folderMetadata,
        fields: 'id',
    })

    return folder.data.id!
}

export async function uploadToDrive(
    fileBuffer: Buffer,
    fileName: string,
    mimeType: string,
    categoryName: string // Injected category identifier
) {
    const drive = getDriveClient()

    // Resolve category routing location dynamically
    const targetFolderId = await getOrCreateCategoryFolder(categoryName)

    const bufferStream = new Readable()
    bufferStream.push(fileBuffer)
    bufferStream.push(null)

    const response = await drive.files.create({
        requestBody: {
            name: fileName,
            parents: [targetFolderId],
        },
        media: { mimeType, body: bufferStream },
        fields: 'id, webViewLink',
    })

    const fileId = response.data.id!

    // Grant public read visibility instantly for embed access
    await drive.permissions.create({
        fileId,
        requestBody: { role: 'reader', type: 'anyone' },
    })

    return {
        fileId,
        driveLink: response.data.webViewLink!,
        previewLink: `https://drive.google.com/file/d/${fileId}/preview`,
    }
}