# Crime Watch - MERN Stack Project

## Overview

Crime Watch is a web application built using the MERN (MongoDB, Express.js, React, Node.js) stack. It allows users to report crimes, view crime data on an interactive map, and analyze crime patterns using heatmaps. This project aims to provide a platform for users to actively report crimes and stay informed about criminal activities in their area.

---

## Features

- **User Authentication**: Allows users to register, log in, and manage their profiles.
- **Crime Reporting**: Users can report crimes by providing details like the type, location, and time of the crime.
- **Interactive Map**: The app displays reported crimes on an interactive map, using the Leaflet library.
- **Heatmap**: A heatmap layer visualizes crime data to help identify high-crime areas.
- **Firebase Integration**: Firebase is used for user authentication and storing data.
- **Responsive Design**: The app is fully responsive and works seamlessly across different devices.

---

## Tech Stack

- **Frontend**: React, React-Leaflet, Firebase Authentication
- **Backend**: Node.js, Express.js, Firebase Admin SDK, Mongoose (MongoDB)
- **Mapping**: Leaflet
- **Database**: MongoDB

---

## Installation

### Prerequisites

Before running the project, ensure that you have the following installed:

- **Node.js** (version 14 or higher)
- **npm** (version 6 or higher)

### Setup Instructions

1. **Clone the repository**:

    ```bash
    git clone https://github.com/Aanushka001/Crime_Watch-MERN-tech.git
    cd Crime_Watch-MERN-tech
    ```

2. **Install the required dependencies**:

    Navigate to both the `client` and `server` directories to install the frontend and backend dependencies.

    **For Frontend**:
    ```bash
    cd client
    npm install
    ```

    **For Backend**:
    ```bash
    cd ../server
    npm install
    ```

3. **Environment Variables**:
    Create a `.env` file in the `server` directory and add the necessary Firebase and MongoDB credentials. You can find the Firebase Admin SDK setup in the Firebase Console.

    Example `.env` for the backend:
    ```plaintext
    MONGODB_URI=your_mongo_database_uri
    FIREBASE_API_KEY=your_firebase_api_key
    FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
    FIREBASE_PROJECT_ID=your_firebase_project_id
    FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
    FIREBASE_MESSAGING_SENDER_ID=your_firebase_sender_id
    FIREBASE_APP_ID=your_firebase_app_id
    ```

4. **Run the Application**:

    After setting up the `.env` file, you can run the app locally.

    **For Frontend** (in `client` directory):
    ```bash
    npm start
    ```

    **For Backend** (in `server` directory):
    ```bash
    npm start
    ```

---

## Deployment

### Deploying to Render

1. Create a **Render Account** if you don’t have one: [Render Sign Up](https://render.com/signup)
2. Link your GitHub repository to Render.
3. Create two services: **Frontend** and **Backend**.
    - **Frontend**: Use the `client` folder and the build command `npm run build`.
    - **Backend**: Use the `server` folder with the build command `npm install --prefix server` and start command `npm start --prefix server`.

4. Ensure all necessary environment variables are set up in the Render dashboard for both services.

5. Once the services are deployed, you’ll have a live app hosted on Render!
