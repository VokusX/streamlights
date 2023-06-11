// builds the light state by passing a string and converting it if needed
const convert = require('color-convert');
const hue = require('node-hue-api').v3, hueApi = hue.api;

function createLightState(colour) {
    // accept hex if starting with # or keyword
    if (colour == 'off') {
        return {on: false}
    }
    else if (colour[0] == '#'){
        let c = convert.hex.rgb(colour.substring(1));
        if (!c)
            throw new Error('Not a valid colour input')
        return {on: true, rgb: c}
    }
    else {
        let c = convert.keyword.rgb(colour);
        if (!c)
            throw new Error('Not a valid colour input')
        return {on: true, rgb: c}
    }
}

async function lightHandler(hue, lights, input) {
    for (light of lights) {
        hue.lights.setLightState(light, createLightState(input))
        .then(result => {
            console.log(`Light state change to ${input} was successful? ${result}`);
        }).catch(error => {
            throw new Error(`Error on setting lights: ${error}`);
        })
    }
  }

module.exports = {createLightState, lightHandler}