const {Configuration, OpenAIApi} = require('openai');
const commandData = require('config.json').commandsData.chatGpt;

const configuration = new Configuration({
    apiKey: process.env.OPENAI_TOKEN,
});

const openai = new OpenAIApi(configuration);

const messages = {};

module.exports = {
    data: commandData,
    async execute(message, args) {
        const gptMessage = args.join(' ');
        if (!message[message.author.id]) {
            messages[message.author.id] = [];
        }
        messages[message.author.id] = [];
        messages[message.author.id].push({ role: "user", content: gptMessage });

        let completion = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: messages[message.author.id],
        });

        const answer = completion.data.choices[0].message.content;
        messages[message.author.id].push({ role: "assistant", content: answer });

        if (answer.length > 1800) {
            let start = 0;
            for (let end = 1800; end <= answer.length; end += 1800) {
                message.reply(answer.slice(start, end));
                if ((end + 1800) > answer.length) {
                    message.reply(answer.slice(end));
                }
                start = end;
            }
        }
         else {
            message.reply(answer);
        }
    },
}