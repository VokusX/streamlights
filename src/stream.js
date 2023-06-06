// Logic for the twitch pubsub connection
const Auth = require('@twurple/auth');
const Api = require('@twurple/api');
const EventSub = require('@twurple/eventsub-ws');
const axios = require('axios')
const lightBuilder = require('./light')
const bridge = require('./bridge')

require('dotenv').config();

let hue;
let lights;

const clientId = process.env.TWITCH_CLIENTID;
const userId = process.env.TWITCH_CHANNELID;
const rewardId = process.env.REWARD_ID;

const authProvider = new Auth.StaticAuthProvider(clientId, process.env.TWITCH_USERTOKEN);

const apiClient = new Api.ApiClient({ authProvider });

function initHueForStream(h, l) {
  hue = h;
  lights = l;
}

async function validateToken() {
  let r;
  try {
    await axios.get('https://id.twitch.tv/oauth2/validate', {
      headers: {
          "Authorization": `Bearer ${process.env.TWITCH_USERTOKEN}`
      }}).then(function (response) {
        r = response;
      })
  }
  catch (error) {
      console.log('Invalid token. Please get a new token using twitch token -u -s "channel:manage:redemptions channel:read:redemptions"')
      return false
  };

  if(r.data.scopes.indexOf("channel:manage:redemptions") == -1 || !r.data.hasOwnProperty('user_id')){
      console.log('Invalid scopes. Please get a new token using twitch token -u -s "channel:manage:redemptions channel:read:redemptions"')
      return false
  }
  console.log('Valid token.')
  return true
}

const listener = new EventSub.EventSubWsListener({ apiClient });
listener.start();

const lightReward = listener.onChannelRedemptionAddForReward(userId, rewardId, async redemption => {
  // call lights to parse user input
  try {
    // change lights
    await lightBuilder.lightHandler(hue, lights, redemption.input);

    // mark redemption complete
    await apiClient.channelPoints.updateRedemptionStatusByIds(userId, rewardId, [redemption.id], 'FULFILLED');
    console.log(`Fulfilled redemption for id: ${redemption.id}`)
  } catch (error) {
    // on error reject redemption
    await apiClient.channelPoints.updateRedemptionStatusByIds(userId, rewardId, [redemption.id], 'CANCELED');
    console.log(`Cancelled redemption for id: ${redemption.id} on error ${error}`)
  }
});


module.exports = {validateToken, initHueForStream}