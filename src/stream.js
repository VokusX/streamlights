// Logic for the twitch pubsub connection
const Auth = require('@twurple/auth');
const Api = require('@twurple/api');
const EventSub = require('@twurple/eventsub-ws');
const axios = require('axios')

require('dotenv').config();

clientId = process.env.TWITCH_CLIENTID;
clientSecret = process.env.TWITCH_APPSECRET;

tokenData = {
	"accessToken": `${process.env.TWITCH_USERTOKEN}`,
	"refreshToken": `${process.env.TWITCH_REFRESHTOKEN}`,
	"expiresIn": 0,
	"obtainmentTimestamp": 0
}

const authProvider = new Auth.RefreshingAuthProvider(
	{
		clientId,
		clientSecret,
		onRefresh: async (newTokenData) => tokenData = newTokenData
	}
);

authProvider.addUser(process.env.TWITCH_CHANNELID, tokenData);

console.log(tokenData)

async function validateToken() {
    let r
    await axios.get('https://id.twitch.tv/oauth2/validate', {
        headers: {
            "Authorization": `Bearer ${process.env.TWITCH_USERTOKEN}`
        }
    })
      .then(function (response) {
        r = response;
      })
      .catch(function (error) {
        console.log('Invalid token. Please get a new token using twitch token -u -s "channel:manage:redemptions". Error: ', error)
        return false
      });

    if(r.data.scopes.indexOf("channel:manage:redemptions") == -1 || !r.data.hasOwnProperty('user_id')){
        console.log('Invalid scopes. Please get a new token using twitch token -u -s "channel:manage:redemptions"')
        return false
    }

    return true
}

module.exports = {validateToken}
// const redirectUri = 'http://localhost:3000'; // must match one of the URLs in the dev console exactly
// const tokenData = await Auth.exchangeCode(clientId, clientSecret, code, redirectUri);

// const clientId = process.env.TWITCH_CLIENTID;
// const userId = process.env.TWITCH_CHANNELID;

// const apiClient = new Api.ApiClient({ authProvider });

// const listener = new EventSub.EventSubWsListener({ apiClient });
// listener.start();

// const onlineSubscription = listener.onStreamOnline(userId, e => {
// 	console.log(`${e.broadcasterDisplayName} just went live!`);
// });

// const offlineSubscription = listener.onStreamOffline(userId, e => {
// 	console.log(`${e.broadcasterDisplayName} just went offline`);
// });