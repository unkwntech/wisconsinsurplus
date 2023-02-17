import { Client, REST, Routes } from "discord.js";
//load variables from .env
require("dotenv").config();

const client = new Client({
    intents: ["Guilds"],
});

//Log to console when bot is ready to recieve commands.
client.once("ready", async () => {
    console.log("Ready");
});

const commands = [].map((command) => command.toJSON());

//Setup the REST API to push our commands list to it
const rest = new REST({ version: "10" }).setToken(
    process.env.DISCORD_BOT_TOKEN
);

//PUT the commands list on the API, application wide
rest.put(Routes.applicationCommands(process.env.DISCORD_OAUTH_CLIENT_ID), {
    body: commands,
})
    .then(() => console.log("Registered Commands"))
    .catch(console.error);

//Connect the bot
client.login(process.env.DISCORD_BOT_TOKEN);

function exitHandler(options: any, code: number) {}

//do something when app is closing
process.on("exit", exitHandler.bind(null, { cleanup: true }));

//catches ctrl+c event
process.on("SIGINT", exitHandler.bind(null, { exit: true }));

// catches "kill pid" (for example: nodemon restart)
process.on("SIGUSR1", exitHandler.bind(null, { exit: true }));
process.on("SIGUSR2", exitHandler.bind(null, { exit: true }));

//catches uncaught exceptions
process.on("uncaughtException", exitHandler.bind(null, { exit: true }));
