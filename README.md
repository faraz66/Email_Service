# Email Service with Redis Queue

This project provides an email notification service using Node.js, Nodemailer, Bull for queueing jobs, and Redis for job persistence. The service sends device alerts via email and ensures that emails are retried in case of failures.

## Features

- Sends email notifications with device activity details.
- Checks if Internet COnnectivity is Present to push Email Out.
- Uses Bull for job queueing and retry mechanisms.
- Connects to a Redis server for job persistence.
- Gracefully handles application shutdown.

## Prerequisites

Before running this project, ensure you have the following installed:

- Node.js (v14.x or later)
- Redis server (v5.x or later)
- Git

## Setup Instructions

1. **Clone the Repository**:

    ```sh
    git clone https://github.com/faraz66/Email_Service.git
    cd Email_Service
    ```

2. **Install Dependencies**:

    ```sh
    npm install
    ```

3. **Configure Environment Variables**:

    Create a `.env` file in the root directory of the project and add your SMTP configuration and Redis configuration. For example:

    ```env
    SMTP_HOST=
    SMTP_PORT=
    SMTP_USER=
    SMTP_PASS=
    REDIS_HOST=127.0.0.1
    REDIS_PORT=6379
    ```

4. **Run Redis Server**:

    Ensure your Redis server is running. You can start it using the following command:

    ```sh
    redis-server
    ```

5. **Run the Application**:

    ```sh
    node testscript.js
    ```

## Usage

### Adding Emails to the Queue

You can add emails to the queue by calling the `addToQueue` function with the recipient email and device information. This will add a job to the Bull queue and handle retries if the email sending fails.

Example:

```javascript
const { addToQueue } = require('./queues/emailQueue');

addToQueue('recipient@example.com', {
    DeviceName: "Device-112",
    DeviceId: "KT5138",
    Action: "Power is Connected",
    MacId: "00:1A:2B:3C:4D:5E",
    TimeofActivity: new Date().toISOString()
});
