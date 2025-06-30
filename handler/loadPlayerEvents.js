const fs = require('fs');
const path = require('path');

/**
 * Dynamically load all player event handlers from the /events/player directory.
 * @param {import('discord.js').Client} client
 */
function loadPlayerEvents(client) {
  const playerEventsPath = path.join(__dirname, '..', 'events', 'player');
  fs.readdirSync(playerEventsPath)
    .filter(file => file.endsWith('.js'))
    .forEach(file => {
      const eventName = file.replace(/\.js$/, '');
      const handler = require(path.join(playerEventsPath, file));
      client.player.on(eventName, (...args) => {
        try {
          handler(...args, client);
        } catch (err) {
          console.error(`Error in player event ${eventName}:`, err);
        }
      });
    });
}

module.exports = { loadPlayerEvents };
