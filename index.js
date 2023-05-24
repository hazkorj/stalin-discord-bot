require('dotenv').config();

const app = require('express')();
const request = require('request');


setInterval(() => {
    request('https://stalinbot-hazkorj.b4a.run/');
},30000)

app.get('/', function (req, res) {
    console.log('request');
    res.send('Hello World');
});

app.listen(8080);

const {Client, Events, GatewayIntentBits} = require('discord.js');
const {prefix} = require('./config.json');
const commands = require('./load-commands');

const token = process.env.BOT_TOKEN;

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.DirectMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildVoiceStates] });

client.once(Events.ClientReady, c => {
    console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.on(Events.MessageCreate, async message => {
    if (message.author.id === client.id) return;
    if (!message.content.startsWith(prefix)) return;

    const argv = message.content.slice(prefix.length);
    const command = argv.split(' ')[0];
    const args = argv.split(' ').slice(1);

    if (!Object.keys(commands).includes(command)) {
        console.error(`No command matching ${command} was found.`);
        await message.reply(`Команда ${command} не найдена`);
        return;
    }

    try {
        await commands[command].execute(message, args);
    } catch (error) {
        console.error(error);
        await message.reply(`Ошибка: ${error.name}. ${error.message}`)
    }
});

client.login(token);