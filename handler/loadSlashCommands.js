const fs = require('fs');
const path = require('path');
const { REST } = require('@discordjs/rest');
const { Routes, SlashCommandBuilder, ApplicationCommandOptionType } = require('discord.js');
const ascii = require("ascii-table");

async function loadSlashCommands(client) {
  const commands = [];
  const slashPath = path.join(__dirname, '..', 'SlashCommands');
  const table = new ascii().setHeading('Slash Command', 'Load Status');

  // Read each category folder
  const categories = fs.readdirSync(slashPath).filter(folder =>
    fs.lstatSync(path.join(slashPath, folder)).isDirectory()
  );

  for (const category of categories) {
    const categoryPath = path.join(slashPath, category);
    const files = fs.readdirSync(categoryPath).filter(file => file.endsWith('.js'));

    for (const file of files) {
      const filePath = path.join(categoryPath, file);
      delete require.cache[require.resolve(filePath)];
      const cmdModule = require(filePath);

      try {
        if (cmdModule.data instanceof SlashCommandBuilder && (typeof cmdModule.execute === 'function' || typeof cmdModule.run === 'function')) {
          const json = cmdModule.data.toJSON();
          commands.push(json);
          client.slash.set(json.name, { data: cmdModule.data, run: cmdModule.run || cmdModule.execute });
          table.addRow(json.name, '✔️');

        } else if (cmdModule.name && typeof cmdModule.run === 'function' && Array.isArray(cmdModule.options)) {
          const builder = new SlashCommandBuilder()
            .setName(cmdModule.name)
            .setDescription(cmdModule.description || '');

          for (const opt of cmdModule.options) {
            switch (opt.type) {
              case ApplicationCommandOptionType.String:
                builder.addStringOption(o =>
                  o.setName(opt.name)
                    .setDescription(opt.description || '')
                    .setRequired(Boolean(opt.required))
                );
                break;
              case ApplicationCommandOptionType.Integer:
                builder.addIntegerOption(o =>
                  o.setName(opt.name)
                    .setDescription(opt.description || '')
                    .setRequired(Boolean(opt.required))
                );
                break;
            }
          }

          const json = builder.toJSON();
          commands.push(json);
          client.slash.set(json.name, { data: builder, run: cmdModule.run });
          table.addRow(json.name, '✔️');

        } else {
          table.addRow(file, '❌ => Missing data+run/execute or name+run+options');
        }
      } catch (err) {
        console.error(`Error loading ${file}:`, err);
        table.addRow(file, '❌ => Error thrown');
      }
    }
  }

  console.log(table.toString());

  const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);
  const clientId = client.user.id;

  try {
    await Promise.all(
      client.guilds.cache.map(guild =>
        rest.put(
          Routes.applicationGuildCommands(clientId, guild.id),
          { body: commands }
        )
      )
    );
    console.log(`Registered ${commands.length} slash commands.`);
  } catch (error) {
    console.error('Error registering slash commands:', error);
  }
}

module.exports = { loadSlashCommands };
