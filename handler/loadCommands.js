const fs = require('fs');
const path = require('path');
const AsciiTable = require('ascii-table');

function loadCommands(client) {
  const table = new AsciiTable().setHeading('Command', 'Status');
  const commandsPath = path.join(__dirname, '..', 'Commands');

  if (!fs.existsSync(commandsPath)) {
    console.warn('Commands directory not found:', commandsPath);
    return;
  }

  const commandFolders = fs.readdirSync(commandsPath).filter(folder => {
    const folderPath = path.join(commandsPath, folder);
    return fs.lstatSync(folderPath).isDirectory();
  });

  for (const folder of commandFolders) {
    const folderPath = path.join(commandsPath, folder);
    const commandFiles = fs.readdirSync(folderPath).filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
      const filePath = path.join(folderPath, file);
      delete require.cache[require.resolve(filePath)];
      try {
        const command = require(filePath);

        if (command.name && typeof command.run === 'function') {
          client.commands.set(command.name, command);
          table.addRow(command.name, '✅ Loaded');

          if (Array.isArray(command.aliases)) {
            for (const alias of command.aliases) {
              client.aliases.set(alias, command.name);
            }
          }
        } else {
          table.addRow(file, '❌ Missing `name` or `run`');
        }
      } catch (error) {
        console.error(`Failed loading command ${file}:`, error);
        table.addRow(file, '❌ Error');
      }
    }
  }

  console.log(table.toString());
}

module.exports = { loadCommands };
