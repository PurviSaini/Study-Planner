# Study Planner Setup Guide

## Project Overview
The Study Planner project provides a user-friendly application to organize and manage your learning schedule. It utilizes MongoDB to store user data and Express.js for server-side functionality.

### Prerequisites
- Node.js and npm (or yarn) installed on your system.
- A MongoDB Atlas account (free tier available).

### Setup

#### Create a MongoDB Cluster
1. Sign up for a free MongoDB Atlas account at [MongoDB Atlas](https://www.mongodb.com/products/platform/atlas-database).
2. Create a new cluster.
3. Choose a cloud provider region for optimal performance.
4. Select a free cluster tier (e.g., M0 Sandbox).
5. Once the cluster is running, click on "Connect" to access connection details.

#### Create Database and Collection
1. In the "Collections" tab, create a new database named "study-planner".
2. Within the "study-planner" database, create a collection named "User".

#### Connect to MongoDB
1. In the "Connect" tab, select the appropriate driver version (e.g., Node.js driver version 3.x or later) and connection method (e.g., URI connection string).
2. The URI string will look something like:
   ```
   mongodb+srv://<username>:<password>@<cluster-name>.mongodb.net/<database-name>?retryWrites=true&w=majority
   ```
3. Replace placeholders with your actual values (username, password, cluster-name, database-name).

#### Create .env File
1. Create a file named `.env` in the same directory as your project's root directory.
2. Paste the following lines into the `.env` file, replacing `<URI>` with your actual MongoDB connection URI string:
   ```
   URI=<URI>
   SESSION_SECRET=your_secret_string
   ```
3. Important: Never commit the `.env` file to version control systems (e.g., Git) as it contains sensitive information.

#### Install Dependencies
1. Open your terminal/command prompt and navigate to the project directory.
2. Run the following command to install required dependencies:
   ```bash
   npm install
   ```
   Alternatively, if you prefer using yarn, run:
   ```bash
   yarn install
   ```

#### Start the Project
1. Run the following command to start the server:
   ```bash
   npm start
   ```
   Alternatively, using yarn:
   ```bash
   yarn start
   ```
2. This will typically start the server on port 3000 (default). You can access the application by visiting [http://localhost:3000](http://localhost:3000) in your web browser (the exact port may vary depending on your configuration).

