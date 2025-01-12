const { default: terminalImage } = require('terminal-image');
const print = require('pretty-print');
const { got } = require('got');
const { checkbox } = require('@inquirer/prompts');
const {
  eightiesTrackIds,
  jazzTrackIds
} = require('./config');
const prettyOpts = {
  leftPadding: 3,
  rightPadding: 3
};

/*
 * @description Builds a queue of tracks to play by just returning the current moodlist exluding the current track
 */
function buildPlayQueue ({ tracks, currentTrack }) {
  const remainingTracks = tracks.filter((t) => t.uri !== currentTrack.uri);

  if (remainingTracks.length === 0) {
    return tracks;
  }

  return remainingTracks;
}

/*
 * @description Prompt the user to choose which device to setup the playback
 */
async function chooseSystemNode (system) {
  const choices = system.getKnownNodes()
    .map((node) => ({
      name: node.name,
      value: node,
      checked: false
    }));
  const choice = await checkbox({
    message: 'Where do you want to set the mood?',
    choices
  });

  return choice[0];
}

/*
 * @description Prompt the user to choose a "vibe". It's basically just one of the track lists configured in config.json.
 * To find the spotify URI:
 *  1. Go to spotify
 *  2. Find the track you wish to add
 *  3. Right click on the track
 *  4. Choose 'Share > Copy Song Link' and the track ID will be embedded in the link. Be sure to format it correctly when you paste it in the config
 */
async function chooseVibe () {
  const choice = await checkbox({
    message: 'Aw yea! What type of mood would you like to set?',
    choices: [
      { name: 'Jazzy', value: jazzTrackIds, checked: false },
      { name: '80s', value: eightiesTrackIds, checked: false }
    ]
  });

  return choice[0];
}

async function printNowPlaying ({ title, artist, album, albumArtURL }) {
  const body = await got(albumArtURL).buffer();
  console.log(await terminalImage.buffer(body, { width: 100 }));
  console.log('\n\n');
  print({
    Title: title,
    Artist: artist,
    Album: album
  }, prettyOpts);
  console.log('\n\n');
}

function randomTrack (items) {
  return items[Math.floor(Math.random() * items.length)];
}

module.exports = {
  buildPlayQueue,
  chooseSystemNode,
  chooseVibe,
  printNowPlaying,
  randomTrack
};
