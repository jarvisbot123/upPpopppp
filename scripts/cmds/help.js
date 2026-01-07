const fs = require("fs");
const path = require("path");
const { getPrefix } = global.utils;
const { commands, aliases } = global.GoatBot;

module.exports = {
  config: {
    name: "help",
    version: "3.2",
    author: "Sifat // panda",
    countDown: 5,
    role: 0,
    description: "View command information with enhanced interface",
    category: "info",
    guide: {
      en: "{pn} [command]\n{pn} all\n{pn} c [category]"
    }
  },

  langs: {
    en: {
      helpHeader:
        "╔══════════◇◆◇══════════╗\n" +
        "      𝐁𝐎𝐓 𝐂𝐎𝐌𝐌𝐀𝐍𝐃𝐒\n" +
        "╠══════════◇◆◇══════════╣",

      categoryHeader: "\n   ┌────── {category} ──────┐\n",
      commandItem: "║ │  ⚡ {name}",
      helpFooter:
        "║ └─────────────────┘\n" +
        "╚══════════◇◆◇══════════╝",

      totalCommands: "📊 Total Commands: {total}",

      commandInfo:
        "╔══════════◇◆◇══════════╗\n" +
        "║       COMMAND INFORMATION\n" +
        "╠══════════◇◆◇══════════╣\n" +
        "║ 🏷️ Name: {name}\n" +
        "║ 📝 Description: {description}\n" +
        "║ 📂 Category: {category}\n" +
        "║ 🔤 Aliases: {aliases}\n" +
        "║ 🏷️ Version: {version}\n" +
        "║ 🔒 Permissions: {role}\n" +
        "║ ⏱️ Cooldown: {countDown}s\n" +
        "║ 🔧 Use Prefix: {usePrefix}\n" +
        "║ 👤 Author: {author}\n" +
        "╠══════════◇◆◇══════════╣",

      usageHeader: "║ 🛠️ USAGE GUIDE",
      usageBody: " ║ {usage}",
      usageFooter: "╚══════════◇◆◇══════════╝",

      commandNotFound: "⚠️ Command '{command}' not found!",
      doNotHave: "None",

      roleText0: "👥 All Users",
      roleText1: "👑 Group Admins",
      roleText2: "☠️ Bot Admins"
    }
  },

  onStart: async function ({ message, args, event, role }) {
    const prefix = getPrefix(event.threadID);
    const commandName = args[0]?.toLowerCase();
    const bannerPath = path.join(__dirname, "assets", "20250319_111041.png");

    /* ===== CATEGORY COMMAND ===== */
    if (commandName === "c" && args[1]) {
      const categoryArg = args[1].toUpperCase();
      const list = [];

      for (const [name, cmd] of commands) {
        if (cmd.config.role > role) continue;
        const cat = cmd.config.category?.toUpperCase() || "GENERAL";
        if (cat === categoryArg) list.push(name);
      }

      if (!list.length)
        return message.reply(`❌ No commands found in category: ${categoryArg}`);

      let msg = this.langs.en.helpHeader;
      msg += this.langs.en.categoryHeader.replace("{category}", categoryArg);

      list.sort().forEach(name => {
        msg += this.langs.en.commandItem.replace("{name}", name) + "\n";
      });

      msg += this.langs.en.helpFooter;
      msg += "\n" + this.langs.en.totalCommands.replace("{total}", list.length);
      return message.reply(msg);
    }

    /* ===== ALL COMMANDS ===== */
    if (!commandName || commandName === "all") {
      const cats = new Map();

      for (const [name, cmd] of commands) {
        if (cmd.config.role > role) continue;
        const cat = cmd.config.category?.toUpperCase() || "GENERAL";
        if (!cats.has(cat)) cats.set(cat, []);
        cats.get(cat).push(name);
      }

      let msg = this.langs.en.helpHeader;
      let total = 0;

      [...cats.keys()].sort().forEach(cat => {
        const arr = cats.get(cat).sort();
        total += arr.length;

        msg += this.langs.en.categoryHeader.replace("{category}", cat);
        arr.forEach(n => {
          msg += this.langs.en.commandItem.replace("{name}", n) + "\n";
        });
        msg += this.langs.en.helpFooter;
      });

      msg += "\n" + this.langs.en.totalCommands.replace("{total}", total);

      if (fs.existsSync(bannerPath)) {
        return message.reply({
          body: msg,
          attachment: fs.createReadStream(bannerPath)
        });
      }
      return message.reply(msg);
    }

    /* ===== SINGLE COMMAND INFO ===== */
    const cmd =
      commands.get(commandName) ||
      commands.get(aliases.get(commandName));

    if (!cmd)
      return message.reply(
        this.langs.en.commandNotFound.replace("{command}", commandName)
      );

    const c = cmd.config;

    const roleText =
      c.role === 1
        ? this.langs.en.roleText1
        : c.role === 2
        ? this.langs.en.roleText2
        : this.langs.en.roleText0;

    let guide =
      c.guide?.en || c.guide || "No usage guide available";

    guide = guide
      .replace(/\{pn\}/g, prefix + c.name)
      .replace(/\{prefix\}/g, prefix);

    let msg = this.langs.en.commandInfo
      .replace("{name}", c.name)
      .replace("{description}", c.description?.en || c.description || "No description")
      .replace("{category}", c.category?.toUpperCase() || "GENERAL")
      .replace("{aliases}", c.aliases?.join(", ") || this.langs.en.doNotHave)
      .replace("{version}", c.version || "1.0")
      .replace("{role}", roleText)
      .replace("{countDown}", c.countDown || 1)
      .replace(
        "{usePrefix}",
        typeof c.usePrefix === "boolean"
          ? c.usePrefix ? "✅ Yes" : "❌ No"
          : "❓ Unknown"
      )
      .replace("{author}", c.author || "Unknown");

    msg +=
      "\n" +
      this.langs.en.usageHeader +
      "\n" +
      this.langs.en.usageBody.replace("{usage}", guide) +
      "\n" +
      this.langs.en.usageFooter;

    return message.reply(msg);
  }
};
