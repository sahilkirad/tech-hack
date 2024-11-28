import multiparty from 'multiparty';
import fs from 'fs';
import { google } from 'googleapis';
import { mongooseConnect } from '@/lib/mongoose';
import { isAdminRequest } from '@/pages/api/auth/[...nextauth]';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize the Google OAuth2 client
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

// Set the credentials (access and refresh tokens)
oauth2Client.setCredentials({
  access_token: process.env.GOOGLE_ACCESS_TOKEN,
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
});

// Automatically refresh tokens and optionally update .env
oauth2Client.on('tokens', (tokens) => {
  if (tokens.access_token) {
    process.env.GOOGLE_ACCESS_TOKEN = tokens.access_token; // Update in-memory token
    console.log('Access Token refreshed:', tokens.access_token);
  }

  if (tokens.refresh_token) {
    process.env.GOOGLE_REFRESH_TOKEN = tokens.refresh_token; // Update in-memory refresh token
    console.log('Refresh Token refreshed:', tokens.refresh_token);
  }

  // Optionally write new tokens to .env
  updateEnv(tokens);
});

// Function to update .env file
function updateEnv(newTokens) {
  const envFilePath = '.env';
  const envConfig = dotenv.parse(fs.readFileSync(envFilePath));

  if (newTokens.access_token) {
    envConfig.GOOGLE_ACCESS_TOKEN = newTokens.access_token;
  }
  if (newTokens.refresh_token) {
    envConfig.GOOGLE_REFRESH_TOKEN = newTokens.refresh_token;
  }

  const updatedEnv = Object.entries(envConfig)
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');

  fs.writeFileSync(envFilePath, updatedEnv);
  console.log('.env updated with new tokens');
}

// Initialize the Google Drive API client
const drive = google.drive({ version: 'v3', auth: oauth2Client });

export default async function handle(req, res) {
  // Connect to MongoDB
  await mongooseConnect();

  // Ensure the user is an admin
  await isAdminRequest(req, res);

  const form = new multiparty.Form();

  // Parse the incoming form data
  const { files } = await new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      resolve({ files });
    });
  });

  const links = [];

  // Upload each file to Google Drive
  for (const file of files.file) {
    try {
      // Prepare file metadata and media content
      const fileMetadata = { name: file.originalFilename };
      const media = {
        mimeType: file.headers['content-type'],
        body: fs.createReadStream(file.path),
      };

      // Upload file to Google Drive
      const driveResponse = await drive.files.create({
        requestBody: fileMetadata,
        media: media,
        fields: 'id, webViewLink, webContentLink',
      });

      const fileId = driveResponse.data.id;

      // Change file permissions to "Anyone with the link can view"
      await drive.permissions.create({
        fileId: fileId,
        requestBody: {
          role: 'reader',
          type: 'anyone',
        },
      });

      // Use webViewLink or webContentLink for access
      links.push(driveResponse.data.webViewLink);
    } catch (error) {
      console.error('Error uploading file to Google Drive:', error);
      return res.status(500).json({ error: 'Failed to upload file' });
    }
  }

  // Send the array of uploaded file links
  return res.json({ links });
}

export const config = {
  api: { bodyParser: false },
};
