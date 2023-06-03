// builds the light state by passing a string and converting it if needed
const convert = require('color-convert');
const hue = require('node-hue-api').v3, hueApi = hue.api;

function createLightState(colour) {
    // accept hex if starting with # or keyword
    if (colour[0] == '#'){
        return {on: true, rgb: convert.hex.rgb(colour.substring(1))}
    }
    else
        return {on: true, rgb: convert.keyword.rgb(colour)}
}

async function lightHandler(hue, lights, input) {
    for (light of lights) {
        hue.lights.setLightState(light, createLightState(input))
        .then(result => {
            console.log(`Light state change to ${input} was successful? ${result}`);
        })
    }
  }

module.exports = {createLightState, lightHandler}