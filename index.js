const bridge = require('./src/bridge')
const lightBuilder = require('./src/light')

async function main(){
    let hue = await bridge.connectToBridge();

    lights = []
    
    await hue.groups.getGroupByName(process.env.ROOM_NAME)
    .then(matchedGroups => { matchedGroups.forEach(group => {
      lights = group.lights;
    });
  });

  lightBuilder.lightHandler(hue, lights, 'beige');

}
  
main().catch(console.log);