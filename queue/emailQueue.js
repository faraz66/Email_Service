const { Queue } = require('bull');
const Redis = require('ioredis');
const { sendEmail } = require('../services/emailService');

// Initialize Redis client
const redisClient = new Redis();

// Initialize Bull queue
const emailQueue = new Queue('email', {
    createClient: () => redisClient, // Use existing Redis connection
});

// Process jobs from the queue
emailQueue.process(async (job) => {
    const { recipient, deviceInfo } = job.data;
    try {
        await sendEmail(recipient, deviceInfo);
        console.log(`Email sent for job ${job.id}`);
        return true; // Job succeeded
    } catch (error) {
        console.error(`Failed to send email for job ${job.id}:`, error);
        throw error; // Job failed, will retry as per configuration
    }
});

// Add a job to the queue
function addToQueue(recipient, deviceInfo) {
    emailQueue.add(
        { recipient, deviceInfo },
        {
            attempts: 3, // Number of retry attempts
            backoff: { type: 'exponential', delay: 5000 } // Exponential backoff starting from 5 seconds
        }
    );
}

// Event listeners for queue events
emailQueue.on('completed', (job, result) => {
    console.log(`Job ${job.id} completed with result: ${result}`);
});

emailQueue.on('failed', (job, err) => {
    console.error(`Job ${job.id} failed with error:`, err.message);
});

// Graceful shutdown on SIGTERM or SIGINT signals
const gracefulShutdown = async () => {
    console.log('Received shutdown signal. Closing queue and Redis client...');

    try {
        await emailQueue.close(); // Close the queue
        await redisClient.quit(); // Quit the Redis client connection
        console.log('Queue and Redis client closed successfully.');
    } catch (error) {
        console.error('Error closing queue or Redis client:', error);
    }

    process.exit(0); // Exit the process
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

module.exports = { addToQueue, emailQueue };
