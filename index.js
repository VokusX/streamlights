const bridge = require('./src/bridge')
const lightBuilder = require('./src/light')
const stream = require('./src/stream')

async function main(){
    let hue = await bridge.connectToBridge();

    if (await stream.validateToken() == false) {
      return;
    }

    lights = []
    
    await hue.groups.getGroupByName(process.env.ROOM_NAME)
    .then(matchedGroups => { matchedGroups.forEach(group => {
      lights = group.lights;
    });
  });
  // lightBuilder.lightHandler(hue, lights, 'white');

}
  
main().catch(console.log);