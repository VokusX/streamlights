const bridge = require('./src/bridge')
const stream = require('./src/stream')

async function main(){
    let hue = await bridge.connectToBridge();

    if (await stream.validateToken() == false) {
      return;
    }

    lights = []
    
    await hue.groups.getGroupByName(process.env.ROOM_NAME).then(matchedGroups => 
    { matchedGroups.forEach(group => {
        lights = group.lights;
      });
    });

    stream.initHueForStream(hue, lights);
}
  
main().catch(console.log);