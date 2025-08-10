// =============================================================================
// 5etools Self-Hosted Setup Script (Node.js Version)
//
// This script automates the setup of a local 5etools web server.
// It is designed to be cross-platform (Windows, macOS, Linux).
//
// It checks for prerequisites, clones the required repositories,
// installs dependencies, and sets up PM2 to run the server.
// =============================================================================

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

// --- ANSI Color Codes for logging ---
const colors = {
    reset: "\x1b[0m",
    red: "\x1b[31m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    cyan: "\x1b[36m",
};

const log = (message, color = colors.reset) => console.log(color + message + colors.reset);

// --- Helper function to run commands ---
function runCommand(command, cwd = null) {
    try {
        execSync(command, { stdio: 'inherit', cwd });
        return true;
    } catch (error) {
        log(`❌ Error executing command: ${command}`, colors.red);
        log(error.message, colors.red);
        return false;
    }
}

// --- Prerequisite Check ---
function checkPrerequisites() {
    log("--- Checking Prerequisites ---", colors.yellow);
    try {
        execSync('git --version', { stdio: 'ignore' });
        log("✅ Git is installed.", colors.green);
    } catch (error) {
        log("❌ Git not found.", colors.red);
        log("Please install Git from https://git-scm.com/downloads and ensure it's in your system's PATH.", colors.cyan);
        process.exit(1);
    }
    // Node.js is implicitly installed because this script is running on it.
    log("✅ Node.js is installed.", colors.green);
}

// --- User Input ---
function getInstallPath() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    return new Promise(resolve => {
        rl.question(`Enter the directory where you want to install 5etools (e.g., ./5etools-server): `, (answer) => {
            const installPath = path.resolve(answer || './5etools-server');
            rl.close();
            resolve(installPath);
        });
    });
}

// --- Main Setup Logic ---
async function main() {
    log("Starting 5etools setup script...", colors.yellow);

    // 1. Check Prerequisites
    checkPrerequisites();

    // 2. Get Installation Path
    const installPath = await getInstallPath();
    log(`--- Installation directory set to: ${installPath} ---`, colors.yellow);

    if (!fs.existsSync(installPath)) {
        log(`Directory not found. Creating it now...`);
        fs.mkdirSync(installPath, { recursive: true });
    }

    // 3. Clone Repositories
    log("\n--- Cloning Repositories ---", colors.yellow);
    log("Cloning 5etools source repository... (This may take a moment)");
    if (!runCommand(`git clone https://github.com/5etools-mirror-3/5etools-src.git`, installPath)) {
        process.exit(1);
    }

    const srcPath = path.join(installPath, '5etools-src');
    log("Cloning 5etools image repository... (This is very large and will take a long time)");
    if (!runCommand(`git clone https://github.com/5etools-mirror-3/5etools-img.git img`, srcPath)) {
        process.exit(1);
    }
    log("✅ Repositories cloned successfully.", colors.green);

    // 4. Install Dependencies and Build
    log("\n--- Setting up Node.js dependencies ---", colors.yellow);
    log("Running 'npm install'... (This may take several minutes)");
    if (!runCommand('npm install', srcPath)) {
        process.exit(1);
    }

    log("Building service worker for performance...");
    runCommand('npm run build:sw:prod', srcPath);
    log("✅ Node.js setup complete.", colors.green);

    // 5. Setup and Start with PM2
    log("\n--- Setting up PM2 to manage the server ---", colors.yellow);
    let pm2_installed = false;
    try {
        execSync('pm2 --version', { stdio: 'ignore' });
        pm2_installed = true;
        log("✅ PM2 is already installed.", colors.green);
    } catch (error) {
        log("PM2 not found. Attempting to install globally...");
        const installCmd = 'npm install pm2 -g';
        try {
            runCommand(installCmd);
            log("✅ PM2 installed successfully.", colors.green);
        } catch (e) {
            log(`❌ Failed to install PM2 globally.`, colors.red);
            log("Please try running the script with administrator/sudo privileges, or install PM2 manually by running:", colors.cyan);
            log(`sudo ${installCmd}`, colors.cyan);
            process.exit(1);
        }
    }

    log("Starting 5etools server with PM2...");
    if (!runCommand('pm2 start npm --name "5etools" -- run serve:dev', srcPath)) {
        log("❌ Failed to start server with PM2.", colors.red);
        process.exit(1);
    }

    runCommand('pm2 save', srcPath);

    // 6. Conclusion
    log("\n--- 🎉 Setup Complete! 🎉 ---", colors.green);
    log("Your self-hosted 5etools server is now running in the background.", colors.green);
    log("You can access it at: http://localhost:5050/index.html", colors.cyan);
    log("\nYou can manage the server with these commands:", colors.yellow);
    log(" 'pm2 list' - View server status", colors.cyan);
    log(" 'pm2 stop 5etools' - Stop the server", colors.cyan);
    log(" 'pm2 logs 5etools' - View server logs", colors.cyan);
}

main().catch(error => {
    log("An unexpected error occurred:", colors.red);
    log(error, colors.red);
    process.exit(1);
});
