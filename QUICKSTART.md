# Quick Start Guide: Self-Hosting 5etools for Foundry VTT

Welcome! This guide will walk you through setting up your own local, self-hosted version of the 5etools website and integrating it with Foundry Virtual Tabletop. By the end of this guide, you'll have a powerful, offline-capable setup for preparing and running your Dungeons & Dragons 5th Edition games.

### What is 5etools?

**5etools** is a comprehensive digital toolkit and compendium for D&D 5th Edition. It serves as a massive, searchable database for nearly all official 5e content, including spells, magic items, monsters, classes, races, and much more. It's an invaluable resource for both players and Game Masters.

### Why Self-Host?

While 5etools is available as a public website, this guide focuses on **self-hosting**—running a personal copy of the site on your own computer. The primary advantages of this approach are:

*   **Offline Access**: Your D&D resources are always available, even without an internet connection.
*   **Performance**: A locally-hosted site is typically much faster and more responsive.
*   **Privacy & Control**: You have full control over your data and the application.

### The Ultimate D&D Workflow: 5etools + Foundry VTT

The true power of this setup comes from integrating your self-hosted 5etools instance with **Foundry Virtual Tabletop**. Using two key tools, **Plutonium** (a Foundry VTT module) and **Rivet** (a browser extension), you can:

*   Browse the vast resources on your local 5etools site.
*   Import monsters, spells, items, and more directly into your Foundry VTT game with a single click.
*   Drastically reduce your game prep time and have all the information you need right at your fingertips.

This guide will show you how to set up this entire workflow from start to finish. Let's get started!

## 2. Setup & Installation (Windows 11)

This section will guide you through setting up a local, self-hosted 5etools website on a Windows 11 machine.

**Note:** The following instructions involve using the command line and installing software. Please review the steps carefully. The commands are intended for Windows PowerShell.

### Part 1: Prerequisites

Before you begin, you'll need to install a few tools.

1.  **Node.js**: This is a JavaScript runtime that will run the 5etools web server.
    *   Go to the [official Node.js website](https://nodejs.org/).
    *   Download the installer for the **LTS (Long-Term Support)** version.
    *   Run the installer, accepting the default options. Ensure that "Add to PATH" is enabled during installation.

2.  **Git**: This is a version control system that we'll use to download the 5etools source code.
    *   Go to the [official Git website](https://git-scm.com/downloads).
    *   Download and run the installer for Windows.
    *   You can accept the default options during installation.

3.  **Docker Desktop (for Docker setup)**: If you prefer to use Docker, you'll need Docker Desktop.
    *   Go to the [official Docker website](https://www.docker.com/products/docker-desktop/).
    *   Download and run the installer for Windows.
    *   Docker Desktop may prompt you to install the Windows Subsystem for Linux (WSL 2), which is required. Allow it to do so.

### Part 2: Downloading the 5etools Source Code

Now, we'll download the necessary files for the website.

1.  Create a folder on your computer where you want to store the 5etools project. For example, `C:\Projects\5etools`.
2.  Open this folder in Windows Explorer.
3.  In the address bar at the top of the Explorer window, type `powershell` and press Enter. This will open a PowerShell terminal in the correct directory.
4.  In the PowerShell window, run the following command to download the website's source code:
    ```powershell
    git clone https://github.com/5etools-mirror-3/5etools-src.git
    ```
5.  This will create a new folder named `5etools-src`. Now, we need to download the images. Run the following command to download the images and place them in the correct subfolder:
    ```powershell
    git clone https://github.com/5etools-mirror-3/5etools-img.git 5etools-src/img
    ```
    **Note:** This download is very large (several gigabytes) and may take a long time.

Once both downloads are complete, you'll have all the necessary files to run your local 5etools website.

### Part 3: Running the Site with Node.js

This is the recommended method for running your local 5etools server.

1.  **Navigate to the Source Directory**: In the PowerShell terminal you opened in the previous part, navigate into the `5etools-src` directory:
    ```powershell
    cd 5etools-src
    ```

2.  **Install Dependencies**: Run the following command to download and install the necessary libraries for the website. This may take a few minutes.
    ```powershell
    npm install
    ```

3.  **Build the Service Worker (Recommended)**: The service worker improves the performance of the site by caching files. It's an optional step, but highly recommended for a smoother experience.
    ```powershell
    npm run build:sw:prod
    ```

4.  **Start the Server**: Now, you can start the local web server.
    ```powershell
    npm run serve:dev
    ```

5.  **Access Your Site**: Your local 5etools website is now running! You can access it by opening your web browser and navigating to:
    **[http://localhost:5050/index.html](http://localhost:5050/index.html)**

You will need to keep the PowerShell window open while you are using the website. To stop the server, you can go back to the PowerShell window and press `Ctrl + C`.

### Part 4: Automating the Server with PM2 (Optional)

If you don't want to leave a terminal window open, you can use **PM2**, a process manager for Node.js, to run the server in the background.

1.  **Install PM2**: Open a new PowerShell terminal **as an Administrator** and run the following command to install PM2 globally on your system.
    ```powershell
    npm install pm2 -g
    ```

2.  **Start the Server with PM2**: In a regular PowerShell terminal (you don't need to be an administrator for this), navigate to your `5etools-src` directory and run:
    ```powershell
    pm2 start npm --name "5etools" -- run serve:dev
    ```
    Your 5etools server is now running in the background.

3.  **Managing the Server**: You can use the following commands to manage the server:
    *   `pm2 list`: See the status of your server.
    *   `pm2 stop 5etools`: Stop the server.
    *   `pm2 start 5etools`: Restart the server.
    *   `pm2 logs 5etools`: View the server logs.

4.  **Run on Startup (Optional)**: To make the server start automatically when you boot your computer, run `pm2 startup` in an administrator terminal and follow the instructions it provides.

### Part 5: Alternative Setup with Docker

If you prefer using Docker, you can run the 5etools site in a container. This method does not require installing Node.js on your system (only Docker Desktop).

1.  **Create a `docker-compose.yml` file**: In the folder where you created your `5etools-src` directory (e.g., `C:\Projects\5etools`), create a new text file named `docker-compose.yml`.

2.  **Add the following content** to the `docker-compose.yml` file:
    ```yaml
    version: "3"
    services:
      5etools:
        image: ghcr.io/5etools-mirror-3/5etools-src:latest
        restart: unless-stopped
        ports:
          - "8080:80"
    ```
    **Note**: This configuration will make your local 5etools site available at `http://localhost:8080`. You can change the first port number (e.g., `"80:80"`) if you want to use a different port.

3.  **Start the Docker Container**: Open a PowerShell terminal in the folder containing your `docker-compose.yml` file and run:
    ```powershell
    docker-compose up -d
    ```
    Docker will now download the 5etools image and start the container.

4.  **Access Your Site**: You can now access your site at **[http://localhost:8080](http://localhost:8080)**.

To stop the server, you can run `docker-compose down` from the same directory.

### Part 6: Connecting Foundry VTT with Plutonium and Rivet

Now that your local 5etools server is running, the final step is to connect it to Foundry VTT.

1.  **Install the Plutonium Module**:
    *   In Foundry VTT, go to the **Add-on Modules** tab.
    *   Click **Install Module**.
    *   In the "Manifest URL" field at the bottom, paste the following URL:
        `https://raw.githubusercontent.com/TheGiddyLimit/plutonium-next/master/module.json`
    *   Click **Install**.
    *   After installation, go to your game world's **Game Settings** -> **Manage Modules** and make sure the **Plutonium** module is enabled.

2.  **Install the Rivet Browser Extension**:
    *   Rivet is available for both Chrome and Firefox. Install the extension for your preferred browser:
        *   [Rivet for Chrome](https://chrome.google.com/webstore/detail/rivet/igmilfmbmkmpkjjgoabaagaoohhhbjde)
        *   [Rivet for Firefox](https://addons.mozilla.org/en-GB/firefox/addon/rivet/)

3.  **Configure Rivet for Your Local Server**: This is the most important step. You need to tell Rivet to talk to your local 5etools server instead of the public one.
    *   In your browser, go to the extensions management page (e.g., `chrome://extensions` in Chrome or `about:addons` in Firefox).
    *   Find the **Rivet** extension and click on **Details** or **Options**.
    *   Look for a setting named "5etools URL", "API URL", or something similar.
    *   Change the value of this setting to the address of your local server. For example, if you used the npm method, this would be: `http://localhost:5050`
    *   Save the settings.

Your setup is now complete! You should be able to browse your local 5etools site and see the Rivet buttons to import content directly into your Foundry VTT game.

## 3. Player's Guide: Character Creation & Management

Now that your self-hosted environment is set up, you can start building your character. The workflow involves creating a blank character sheet in Foundry VTT and then populating it with content imported from your local 5etools site.

### Part 1: Initial Character Creation

1.  In Foundry VTT, go to the **Actors Directory** tab.
2.  Click **Create Actor**.
3.  Enter your character's name and ensure the type is set to **Character**.
4.  Click **Create New Actor**.

You now have a blank character sheet, ready to be customized.

### Part 2: Importing Your Class, Race, and Background

This is where the power of the integration shines.

1.  Open your local 5etools site in your browser (e.g., `http://localhost:5050`).
2.  Navigate to the "Classes" page and find the class you want to play.
3.  On the class page, you'll see a **Rivet** button (it may look like a red plus sign or the Foundry VTT logo). Click it.
4.  Rivet will import the class into your Foundry world's Items directory.
5.  From the Items directory in Foundry, drag the class you just imported onto your character sheet. This will automatically add all of your 1st-level class features.
6.  **Repeat this process** for your character's **Race** and **Background**.

### Part 3: Adding New Feats, Spells, and Items

As your character grows or discovers new things, you can easily add them to your sheet.

*   **To add a new Feat**: Find the feat on your 5etools site, click the Rivet button to import it, and then drag it from the Foundry Items directory onto the "Features" tab of your character sheet.
*   **To add a new Spell**: Find the spell on your 5etools site, click the Rivet button, and then drag it from the Foundry Items directory onto the "Spells" tab of your character sheet.
*   **To add a new Item**: Find the weapon, armor, or magic item on your 5etools site, click the Rivet button, and then drag it from the Foundry Items directory onto the "Inventory" tab of your character sheet.

This workflow makes it incredibly fast to build and update your character with accurate information.

## 4. Player's Guide: Character Advancement

Leveling up is an exciting time, and the integrated setup makes it a smooth process.

1.  **Consult 5etools**: First, open your local 5etools site and look up your class. Review the class table to see what new features, spells, or other benefits you gain at your new level.

2.  **Update Your Class Level**:
    *   In Foundry VTT, go to the **Features** tab on your character sheet.
    *   Find your character's class in the list and click on it to open the class item sheet.
    *   Change the **Levels** field to your new level.

3.  **Use the Advancement Manager**:
    *   After you change your class level, the **Advancement Manager** window will likely open.
    *   This tool will walk you through any choices you need to make for your new level, such as Ability Score Improvements (ASIs), new skill proficiencies, or other class-specific choices.

4.  **Import Your New Abilities**:
    *   If you chose a new feat or gained access to new spells as part of leveling up, you can now go back to your 5etools site.
    *   Find the relevant feat, spell, or feature, and use the **Rivet** button to import it into Foundry.
    *   Drag the newly imported item from the Items directory onto your character sheet.

5.  **Increase Your Hit Points**: Don't forget to manually increase your maximum HP! Roll your class's hit die, add your Constitution modifier, and add the total to your HP maximum on the character sheet.

## 5. Game Master's Guide: Core Tools

This setup is a massive time-saver for Game Masters. Here's how to use the core features to prepare your games.

### Importing NPCs and Monsters

Gone are the days of manually creating every monster stat block.

1.  On your local 5etools site, navigate to the **Bestiary**.
2.  Find any monster you need for your encounter.
3.  Click the **Rivet** button to import it into Foundry VTT.
4.  The monster will be created as a new NPC in your **Actors Directory** in Foundry, complete with its stat block, features, and actions. You can then drag it directly onto the battle map.

### Using the 5etools DM Tools

Your local 5etools site comes with several powerful tools to help you design encounters and treasure. You can use these during your prep and then import the results into Foundry.

*   **CR Calculator**: If you're creating or modifying a monster, this tool helps you accurately calculate its Challenge Rating (CR) based on its stats and abilities.

*   **Encounter Builder**: This tool helps you build balanced encounters. You can specify the number of players and their level, and then add monsters to see the calculated difficulty of the encounter. Once you've designed your encounter, you can import the necessary monsters into Foundry.

*   **Loot Generator**: Quickly generate treasure parcels for your party. You can generate random loot based on treasure tables, or create custom loot parcels. You can then import the generated magic items into Foundry for your players to find.

## 6. Game Master's Guide: Advanced Features

Beyond the core tools, your self-hosted 5etools site provides a wealth of content for planning and running your campaigns.

### Using Reference Books

The "Books" section of the 5etools site contains the full text of many D&D 5th Edition sourcebooks. This is an incredibly powerful feature for quick rule lookups. Instead of searching through PDFs or physical books, you can use the site's search function to instantly find any rule, table, or piece of lore you need during your game.

### Running Published Adventures

The "Adventures" section contains full adventure modules. You can use this to run a published campaign from start to finish. The workflow is seamless:

1.  Have the adventure open in a tab on your browser.
2.  As you read through the adventure and come across a monster, NPC, or magic item, simply click the **Rivet** button to import it into Foundry VTT.
3.  You can pre-populate your Actors and Items directories with all the content for an adventure before you even start playing.

This allows you to focus on running the game, not on data entry.

### Planning Your Campaign

By combining all these features, you have a complete suite of tools for campaign preparation:
*   Use the **Adventures** and **Books** for inspiration and content.
*   Use the **Encounter Builder** and **CR Calculator** to design custom challenges.
*   Use the **Loot Generator** to create exciting treasure.
*   Use **Rivet** to import everything into your Foundry VTT world.

This integrated environment provides a powerful and efficient way to manage every aspect of your D&D campaign.
