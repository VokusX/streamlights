const bridge = require('./src/bridge')

async function main(){
    let hue = await bridge.connectToBridge();

    lights = []
    
    await hue.groups.getGroupByName('My Room')
    .then(matchedGroups => { matchedGroups.forEach(group => {
      lights = group.lights;
    });
  });

  hue.lights.setLightState(lights[0], {on: false})
  .then(result => {
    console.log(`Light state change was successful? ${result}`);
  })

}
  
main().catch(console.log);