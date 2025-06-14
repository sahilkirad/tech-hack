const { google } = require('googleapis');
const readline = require('readline');

const CLIENT_ID = '179588102558-4ru3n2ekqh3bs7tlm9erbc626jbp1jh7.apps.googleusercontent.com';
const CLIENT_SECRET = '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';
const REDIRECT_URI = 'http://localhost:3000/api/auth/callback/google';

const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

const authUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: ['https://www.googleapis.com/auth/drive'],
});

console.log('Authorize this app by visiting this URL:', authUrl);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question('Enter the code from that page here: ', async (code) => {
  try {
    const { tokens } = await oauth2Client.getToken(code);
    console.log('Access Token:', tokens.access_token);
    console.log('Refresh Token:', tokens.refresh_token);
    rl.close();
  } catch (error) {
    console.error('Error retrieving tokens:', error);
    rl.close();
  }
});