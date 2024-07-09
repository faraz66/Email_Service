const axios = require('axios');

async function checkInternetConnection() {
    try {
        await axios.get('https://www.google.com' || 'https://amazon.com');
        console.log('Internet is up');
        return true;
    } catch (error) {
        console.log('Internet is down');
        return false;
    }
}

module.exports = { checkInternetConnection };
