// init the hue connection
const hue = require('node-hue-api').v3, hueApi = hue.api;
require('dotenv').config();

const appName = 'streamlights';
const deviceName = 'myroomlights';

async function connectToBridge() {
    // local IP addresss for bridge
    const ipAddress = process.env.IP

    // Create a new API instance that is authenticated with the new user we created
    const authenticatedApi = await hueApi.createLocal(ipAddress).connect(process.env.HUE_USER);

    // Do something with the authenticated user/api
    const bridgeConfig = await authenticatedApi.configuration.getConfiguration();
    console.log(`Connected to Hue Bridge: ${bridgeConfig.name} :: ${bridgeConfig.ipaddress}`);

    return authenticatedApi;
}

module.exports = {connectToBridge}