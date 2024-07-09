const { addToQueue } = require('./queue/emailQueue');
const { checkInternetConnection } = require('./utils/internetCheck');

// Function to get the current date and time in the required format
function getCurrentDateTime() {
    const now = new Date();
    return now.toISOString(); // Converts to ISO 8601 format
}

async function runTest() {
    console.log('Starting test...');

    // Step 1: Ensure the internet is connected initially
    if (!(await checkInternetConnection())) {
        console.log('Please connect to the internet and restart the test.');
        return;
    }

    console.log('Disconnect the internet now within 20secs...');
    await new Promise(resolve => setTimeout(resolve, 20000)); // Wait for 20 seconds to manually disconnect the internet

    // Step 2: Add email to the queue while internet is down
    console.log('Adding email to queue...');
    addToQueue('farazshaikh66@gmail.com', {
        DeviceName: "Device-112",
        DeviceId: "KT5138",
        Action: "Power is Connected",
        MacId: "00:1A:2B:3C:4D:5E",
        TimeofActivity: getCurrentDateTime()
    });
    console.log('Email Added to queue');

    // Step 3: Wait for a while and then reconnect the internet
    console.log('Reconnect the internet now within 20secs...');
    await new Promise(resolve => setTimeout(resolve, 20000)); // Wait for 20 seconds to manually reconnect the internet

    // Step 4: The internet connection should be restored and email sent
    console.log('Checking if email is sent...');
}

runTest();
