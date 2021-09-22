/**
 * @INFO
 * Code By: [SEVEN]#6218 & 𝐀𝐥𝐨𝐧𝐞#8475
 */

//REQUIRE MODULE
const Discord = require("discord.js");
const config = require("./config.json");
const client = new Discord.Client({
    intents: [
        "GUILDS",
        "GUILD_MEMBERS", 
        "GUILD_BANS", 
        "GUILD_EMOJIS_AND_STICKERS", 
        "GUILD_INTEGRATIONS", 
        "GUILD_WEBHOOKS", 
        "GUILD_INVITES", 
        "GUILD_VOICE_STATES", 
        "GUILD_PRESENCES", 
        "GUILD_MESSAGE_REACTIONS", 
        "GUILD_MESSAGE_TYPING", 
        "DIRECT_MESSAGE_REACTIONS", 
        "DIRECT_MESSAGE_TYPING", 
        "GUILD_MESSAGES", 
        "DIRECT_MESSAGES"], 
        partials: ["CHANNEL"]
});
const { getVoiceConnection, joinVoiceChannel, AudioPlayerStatus, createAudioResource, getNextResource, createAudioPlayer, NoSubscriberBehavior } = require('@discordjs/voice');
const chalk = require('chalk')

//VERSION PACKAGE
const pk  = require('./package.json')

//STAUS ON AND SLASH
client.once("ready", () => {
    const discordJSVersion   = pk.dependencies["discord.js"];
    const ffmpegVersion   = pk.dependencies["ffmpeg-static"];
    const libsodiumVersion   = pk.dependencies["libsodium-wrappers"];
    const discodJSVoiceVersion   = pk.dependencies["@discordjs/voice"];

    console.log(chalk.cyan(`[BOTNAME] ` ) + chalk.greenBright(`${client.user.tag}`));
    console.log(chalk.cyan(`[INFO] ` ) + chalk.greenBright(`discord.js ${discordJSVersion} `));
    console.log(chalk.cyan(`[INFO] ` ) + chalk.greenBright(`libsodium-wrappers ${libsodiumVersion} `));
    console.log(chalk.cyan(`[INFO] ` ) + chalk.greenBright(`ffmpeg-static ${ffmpegVersion} `));
    console.log(chalk.cyan(`[INFO] ` ) + chalk.greenBright(`discordjs/voice ${discodJSVoiceVersion} `));
    console.log(chalk.yellow(`[ABOUT] ` ) + chalk.green(`Solart#6590`))
    client.user.setActivity("UwU | Power By: LYnNteEaM", { type: "LISTENING"})
    client.user.setStatus("dnd");

    //--------------------------------------------------------------------------------------------------\\

    const guildID = 'ID' //IDSERVER
    const guild = client.guilds.cache.get(guildID)
    let commands

    if (guild) {
        commands = guild.commands
        
    } else {
        commands = client.application?.commands
    }

    commands?.create({
        name: 'ping',
        description: 'เช็ค API',
    })
    commands?.create({
        name: 'help',
        description: 'ดูหน้าคำสั่งทั้งหมด',
    })
});

//INTERATION
client.on('interactionCreate', async (interaction, message) => {
    if (!interaction.isCommand()) {
        return
    }

    const { commandName, options } = interaction

    
    if (commandName === 'ping') {
        interaction.reply({
            content: "**API** " + "`" + client.ws.ping + "ms`.",
            ephemeral: true,
        })
    }
    if (commandName === 'help') {
        interaction.reply({
            content: "```fix\n www = เล่นเพลง ไม่สามารถใช้ / ได้เพราะทำไม่เสร็จ \n ping = ดูความหน่วงบอท ใช้ / ได้```",
            ephemeral: true,
        })
    } 
})

//ERROR
client.on("error", error => {
    console.log(error);
    return;
});

//TRY COMMAND
client.on("messageCreate", async (message) => {
    if (message.author.bot) return;
    if (message.content.startsWith(config.prefix + "ping")) {
        message.channel.send({ embeds: [new Discord.MessageEmbed().setColor('#2F3136').setDescription("**API** " + "`" + client.ws.ping + "ms`. " + `**message** ` + "`" + (Date.now() - message.createdTimestamp) + "ms`.")] })
    };
});

//LOAD SONG AND PLAY
client.on("messageCreate", async message => {
    if (message.author.bot) return;
    if (message.member.voice.channel == null) {
        return;
    }
    if (message.content.toLowerCase() !== ("sp")) {
        return;
    };
    const connection = joinVoiceChannel({
        channelId: message.member.voice.channel.id,
        guildId: message.guild.id,
        adapterCreator: message.guild.voiceAdapterCreator,
    });
    const player = createAudioPlayer();
    const subscription = connection.subscribe(player);

    if (message.content.toLowerCase() === "www") {
        player.play(createAudioResource('./music/music.mp3'));
        message.reply("<:emoji_137:881487921255964723>  กำลังเล่น");
    };
    player.on(AudioPlayerStatus.Idle, () => {
        player.stop();
        connection.destroy();
    });
    player.on('error', error => {
        console.error(`Error: ${error.message} with resource ${error.resource.metadata.title}`);
        player.play(getNextResource());
    });
});


client.login(config.token);
