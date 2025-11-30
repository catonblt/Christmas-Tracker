# 🎄 Christmas Gift Tracker

A beautiful, festive web application for tracking Christmas gifts for your family. Features automatic budget tracking, GitHub-based cloud sync, and a warm, cozy Christmas design.

## Features

- **Gift Tracking**: Track up to 100 numbered gifts with descriptions, prices, and wrapped status
- **Budget Management**: $250 budget per child with automatic totals and remaining amounts
- **Cloud Sync**: Save data to GitHub for access across multiple devices
- **Filtering**: Filter gifts by child or wrapped status
- **Beautiful Design**: Warm, festive Christmas theme with subtle snowfall animation
- **Export**: Export your data as JSON for backup

## Setup Instructions

### 1. Create a GitHub Repository

1. Go to [GitHub](https://github.com) and sign in
2. Click the "+" icon in the top right and select "New repository"
3. Name it `christmas-gift-tracker` (or any name you prefer)
4. Make it **Public** (required for GitHub Pages)
5. Initialize with a README if you'd like
6. Click "Create repository"

### 2. Upload Files to Your Repository

1. Click "Add file" → "Upload files"
2. Upload these files:
   - `index.html`
   - `styles.css`
   - `script.js`
   - `README.md`
3. Commit the changes

### 3. Enable GitHub Pages

1. In your repository, go to **Settings** → **Pages**
2. Under "Source", select **Deploy from a branch**
3. Choose branch: **main** and folder: **/ (root)**
4. Click **Save**
5. Wait a few minutes, then your site will be live at:
   `https://yourusername.github.io/christmas-gift-tracker/`

### 4. Create a Personal Access Token

For cloud sync to work, you need a GitHub Personal Access Token:

1. Go to GitHub **Settings** (your profile settings, not repository)
2. Scroll down to **Developer settings** → **Personal access tokens** → **Tokens (classic)**
3. Click **Generate new token** → **Generate new token (classic)**
4. Give it a name like "Christmas Gift Tracker"
5. Set expiration (recommend 1 year or no expiration)
6. Check the **repo** scope (this gives full control of private repositories)
7. Click **Generate token**
8. **IMPORTANT**: Copy the token immediately - you won't be able to see it again!

### 5. Configure the App

1. Open your Christmas Gift Tracker website
2. Click the "💾 Save to GitHub" button
3. Enter your details:
   - **GitHub Username**: Your GitHub username
   - **Repository Name**: `christmas-gift-tracker` (or whatever you named it)
   - **Personal Access Token**: Paste the token you just created
4. Click OK

Your settings will be saved in your browser, and you can now sync data across devices!

## Usage

### Adding Gifts

1. Find an empty row (or any row 1-100)
2. Select the child from the dropdown
3. Enter the gift description
4. Enter the price
5. Check the "Wrapped" box when wrapped
6. Your changes save automatically to local storage

### Syncing Data

- Click **💾 Save to GitHub** to sync your current data to the cloud
- The app automatically loads from GitHub when you first open it
- Use this to sync between devices (phone, laptop, etc.)

### Filtering

- Use the **Filter by child** dropdown to see gifts for one child
- Use the **Filter by status** dropdown to see wrapped or unwrapped gifts

### Exporting

- Click **📥 Export Data** to download a JSON backup of all your gifts

### Numbering Gifts

Each row is numbered 1-100. Use these numbers to label your wrapped presents for anonymity! Just write the number on the gift tag so you know whose is whose.

## Tips

- **Budget Tracking**: The cards at the top show how much you've spent per child
- **Over Budget**: If you go over budget, the remaining amount turns red
- **Multi-Device**: Set up GitHub sync on each device you use
- **Backup**: Periodically export your data as a backup
- **Year After Year**: Your data stays in GitHub, so you can use this every year!

## Privacy & Security

- Your GitHub token is stored only in your browser's local storage
- Data is saved to your own GitHub repository
- Make your repository private if you want to keep gift details secret
- Never share your Personal Access Token with anyone

## Troubleshooting

**Sync not working?**
- Check that your repository is public (or your token has the right permissions)
- Verify your username and repository name are correct
- Make sure your token hasn't expired

**Data not loading?**
- Data is stored locally in your browser and in GitHub
- Clear your browser cache and reload from GitHub if needed
- Use the Export feature to back up your data regularly

**Can't see GitHub Pages site?**
- GitHub Pages can take 5-10 minutes to deploy the first time
- Make sure the repository is public
- Check Settings → Pages to see the deployment status

## Support

If you run into issues, double-check the setup steps above. Most problems come from incorrect GitHub configuration.

Enjoy tracking your Christmas gifts! 🎁✨
