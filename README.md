# 🧘‍♂️ Smart Yoga E-commerce Admin Panel
A feature-rich admin panel to manage your e-commerce platform seamlessly. Built with Next.js, Tailwind CSS, and MongoDB, this panel provides tools for managing products, blogs, and orders, ensuring an intuitive experience for administrators.
___
## 🚀 Features

1. **Product Management**:
- Add, edit, delete, and sort products.
- Drag-and-drop functionality for image reordering using React SortableJS.
- Dynamic property forms based on categories.

2. **Blog Management**:
- Create and update blog posts with images and tags.
- Integration with Google Drive for secure file uploads.

3. **Order Management**:
- View detailed order summaries with product breakdowns.
- Manage custom orders and payment statuses.

4. **Authentication**:
- Secure login via Google OAuth using NextAuth.js.
- Role-based access control for admin-only functionality.

5. **Visual Feedback**:
- Custom spinner animations for asynchronous operations.
___
## 🛠️ **Technologies Used**
- Next.js: Server-side rendering, API routes, and dynamic routing.
- Tailwind CSS: Responsive and modern UI design.
- NextAuth.js: Seamless authentication with Google OAuth.
- MongoDB & Mongoose: Backend database for storing data.
- Google APIs (Drive): File storage and sharing with programmatic permissions.
- React SortableJS: Drag-and-drop UI interactions.
- Axios: Simplified API communication.
___
## 🛠️ **Installation & Setup**
**Prerequisites**
- Install bun as the package manager for the project.
- Ensure you have a MongoDB Atlas account and a Google Cloud account.
### **Step 1: Clone the Repository**
```bash
git clone https://github.com/your-username/smart-yoga-admin-panel.git
cd smart-yoga-admin-panel
```
### **Step 2: Install Dependencies**
```bash
bun install
```
### **Step 3: Configure Environment Variables**
Create a .env file in the root directory and add the following:
```env
GOOGLE_ID=""
GOOGLE_SECRET=""
GOOGLE_REDIRECT_URI="http://localhost:3000/api/auth/callback/google"
GOOGLE_ACCESS_TOKEN=""
GOOGLE_REFRESH_TOKEN=""
MONGODB_URI=""
NEXTAUTH_URL=http://localhost:3000
SECRET=
```
___
**Notes**:
**Google OAuth Setup**:
- Visit Google Cloud Console.
- Create a project and enable the Google Drive API.
- Generate your Google Client ID and Client Secret.
- Add http://localhost:3000/api/auth/callback/google as the redirect URI in OAuth credentials.

**Google Drive Tokens**:
- Create a file named getTokens.js in the components directory and paste the following code:
```javascript
const { google } = require('googleapis');
const readline = require('readline');

const CLIENT_ID = '';
const CLIENT_SECRET = '';
const REDIRECT_URI = 'http://localhost:3000/oauth2callback';

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
```

To run the script:
```bash
cd components
node getTokens.js
```
Follow the steps and paste the provided link in your browser to authorize. Extract the code from the redirected URL and input it into the terminal to get your access token and refresh token.

**MongoDB Setup**:
- Sign up at MongoDB Atlas.
- Create a cluster and generate your connection string. Paste it into the MONGODB_URI field.
- For SECRET, Generate a random secret string for the SECRET field.
- 
### **Step 4: Run the Development Server**
```bash
bun dev
```
Visit http://localhost:3000 to access the admin panel.
___
## 💡 **Highlights**
- Spinner Component: Custom animations using BounceLoader for smoother user feedback.
- Dynamic Product Properties: Automatically generated forms based on category hierarchy.
- File Uploads: Securely upload and manage images via Google Drive API.
- Authentication: Simplified login with NextAuth.js.
___
#### Special thanks to Coding with Dawid on YouTube for inspiring and teaching Next.js concepts!
___
##⭐ **Star the Repository**
If you find this project helpful, give it a star ⭐ on GitHub and share your thoughts!
