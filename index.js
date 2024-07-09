require("dotenv").config();
const { addToQueue, emailQueue } = require("./queue/emailQueue");
const { checkInternetConnection } = require("./utils/internetCheck");

// Function to get the current date and time in the required format
function getCurrentDateTime() {
    const now = new Date();
    return now.toISOString(); // Converts to ISO 8601 format
}

setInterval(async () => {
  const isConnected = await checkInternetConnection();
  if (isConnected) {
    emailQueue.resume();
  } else {
    emailQueue.pause();
  }
}, 10000); // Check every 10 seconds

console.log("im here")
// Sample data
const data = [
  {
    DeviceName: "Device-12",
    DeviceId: "KT5138",
    Action: "Power is Connected",
    MacId: "00:1A:2B:3C:4D:5E",
    TimeofActivity: getCurrentDateTime()
  },
];

// Send emails for each device entry
data.forEach((entry) => {
  addToQueue("farazshaikh66@gmail.com", entry);
});
