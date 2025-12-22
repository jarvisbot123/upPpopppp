module.exports = {
  config: {
    name: "bio",
    aliases: ["test", "idk"],
    version: "2.0",
    author: "Raul",//𝐍𝐚𝐛𝐢𝐧 𝐬𝐢𝐧𝐠𝐣𝐚𝐥𝐢
    role: 0,
    shortDescription: {
      en: " set bot bio"
    },
    longDescription: {
      en: "This command sets bot bio automatically."
    },
    category: "utility",
    guide: {
      en: "To use this command just say bio"
    }
  },
  onStart: async ({ api, event, args }) => {
    const prefix = "/"; // Replace with your desired prefix 
    const ownerName = "𝐍𝐚𝐛𝐢𝐧"; // Replace with your name or bot owner's name
    const createdBy = "𝐍𝐚𝐛𝐢𝐧 𝐬𝐢𝐧𝐠𝐣𝐚𝐥𝐢"; // don't replace with Developer Name

    const bioText = `
❒  PREFIX: ${prefix} 
❒  Owner: ${ownerName}
❒  Developed By: ${createdBy}
    `;

    api.changeBio(bioText, (e) => {
      if (e) {
        api.sendMessage("An error occurred: " + e, event.threadID);
      } else {
        api.sendMessage(`The bot's bio has been updated to:\n${bioText} automatically`, event.threadID);
      }
    });
  }
};
