const chalk = require("chalk");
const mongoose = require("mongoose");

const mongoPass = process.env.MONGO_URI;
module.exports = (client) => {
  let allMembers = new Set();
  client.guilds.cache.forEach((guild) => {
    guild.members.cache.forEach((member) => {
      allMembers.add(member.user.id);
    });
  });

  let allChannels = new Set();
  client.guilds.cache.forEach((guild) => {
    guild.channels.cache.forEach((channel) => {
      allChannels.add(channel.id);
    });
  });

  console.log(
    chalk.bgMagentaBright.black(` ${client.guilds.cache.size} servers `),
    chalk.bgMagentaBright.black(` ${client.channels.cache.size} channels `),
    chalk.bgMagentaBright.black(` ${allMembers.size} members `)
  );

  setTimeout(() => {
    const serverCount = client.guilds.cache.size;
    const activityText = `over ${serverCount} servers`;
    client.user.setActivity(activityText, { type: 3 });
  }, 3000);


  mongoose
    .connect(mongoPass, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    .then(() =>
      console.log(
        chalk.bgGreenBright.black(` ${client.user.username} is alive`)
      )
    )
    .catch(() =>
      console.log(
        chalk.bgRedBright.black(
          ` ${client.user.username} could not connect to mongo DB `
        )
      )
    );
};
