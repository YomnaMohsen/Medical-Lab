# Medical-Lab API Project

## Description
Medical Lab API built using Node.js, Express, and MongoDB with Mongoose. The API enables creating doctors and patients accounts by administrative-staff, managing lab test results by doctors. Moreover, patinets can reterive different lab test results related them. The project is desgined to be secured by implementing authentication and authorization using JWT token and data validation is implemented using Mongoose validation.

## Table of Contents
- [Project Description](#description)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)


## Features
- **User Authentication & Authorization**: User authentication and authorization are implemented using JWT (JSON Web Tokens).

- **User accounts mangement(CRUD)**: Admin manages Create, Read, Update, Delete operations for both patient and doctor acoounts.

- **Lab test results mangement (CRUD)**: Docotor manages  Create, Read, Update, Delete operations for lab test results related to patients.

- **View lab test results**: Patinets can view certain lab test result or reterive all results related to them.

- **Book Home Visit**: Patients can book home visit by entering their address and visit date, and a confirmation mail will be sent to them.

## Technologies Used

### Backend
- **Node.js**: A Javascript run-time environment for server-side development
- **Express**: A minimal javascript web framework, used for building RESTFUL APIs
- **MongoDB**: A NoSQL database used for storing doctor, patient and test results data.

- **Mongoose**: An Object Data Modeling (ODM) library for MongoDB, which simplifies data modeling.

### Middlewares
- **bcrypt**: Library for hashing passwords securely.
- **nodemailer**: Library for sending emails through certain email service.
- **jsonwebtoken**: Library for generating and verifying JWT tokens.

### Testing & development tools

- **Postman**: Postman used for testing API end-points by simulating client request and check accuracy of responses.

- **Visual Studio Code**: Code editor for development, which contains integrated git support and has friendly user-interface.

- **Jest**: Jest library is used for testing back-end APIs

## Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/YomnaMohsen/Medical-Lab.git
    cd Medical-Lab
    ```

2. **Install dependencies**

    ```bash
    npm install
    ```

3. **Set up environment variables**
  create `.env` file in the root of your project directory and add the following variables:
   ```
   MONGO_URI = mongodb://localhost:27017/your_database_name
   PORT = 8000
   ADMIN_ID = admin_user_id
   ADMIN_EMAIL = admin_user_email
   ADMIN_PASSWORD = admin_user_password
   JWT_SECRET = your_jwt_secret
   EMAIL_USER = your_user_email
   EMAIL_PASS = your_email_password
   EMAIL_SERVICE = your_email_service 
   ```  

3. **Start the server**
    ```bash
    npm run start
    ```
4. **Running Tests** 
    ```bash
    npm run test
    ```   


