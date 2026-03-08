# TrigMaster: Memorization Trainer

A specialized tool to master trigonometric ratios from 0° to 90° with speed tracking and error analysis.

## Local Setup Instructions

To run this application on your own computer, follow these steps:

### 1. Prerequisites
- Install **Node.js** (v18 or higher recommended) from [nodejs.org](https://nodejs.org/).

### 2. Installation
1. Download or copy all the project files into a new folder on your computer.
2. Open a terminal (Command Prompt, PowerShell, or Terminal) in that folder.
3. Run the following command to install the necessary libraries:
   ```bash
   npm install
   ```

### 3. Running the App
Start the local development server:
```bash
npm run dev
```
The terminal will provide a URL (usually `http://localhost:3000`). Open this in your web browser to use the app.

### 4. Building for Production
If you want to create a highly optimized version of the app to host on a static server:
```bash
npm run build
```
This will create a `dist` folder containing the final files.

### 5. Deploying to GitHub Pages
This app is a static site and works great on GitHub Pages.

1. **Update Vite Config**: If your site is at `https://<USERNAME>.github.io/<REPO>/`, open `vite.config.ts` and add `base: '/<REPO>/',` to the configuration object.
2. **Build**: Run `npm run build`.
3. **Deploy**: Upload the contents of the `dist` folder to your `gh-pages` branch or use a GitHub Action to automate it.

## Offline Note
The app currently imports fonts from Google Fonts. For 100% offline usage (no internet required at all), you should download the font files and update the `@import` in `src/index.css` to use local `@font-face` declarations.
