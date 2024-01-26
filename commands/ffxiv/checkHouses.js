const {SlashCommandBuilder, EmbedBuilder} = require('discord.js');

const choices = [
    // Light Data Center
    {name: "Alpha", value: "402"},
    {name: "Lich", value: "36"},
    {name: "Odin", value: "66"},
    {name: "Phoenix", value: "56"},
    {name: "Raiden", value: "403"},
    {name: "Shiva", value: "67"},
    {name: "Twintania", value: "33"},
    {name: "Zodiark", value: "42"},
]

let command = new SlashCommandBuilder()
    .setName('check_houses')
    .setDescription('Returns available houses to buy. Based on PaissaDB.')
    .addStringOption(option =>
        option.setName("world")
            .setDescription("The world to check for houses.")
            .setRequired(true)
    )

choices.forEach(choice => {
    command.options[0].addChoices(choice);
})


async function getHouses(worldId) {
    try {
        const response = await fetch(`https://paissadb.zhu.codes/worlds/${worldId}`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

function embedMessage(data) {
    return new EmbedBuilder()
        .setTitle(`There are ${data.num_open_plots} houses available on ${data.name}!`)
        .setColor("#ee00ff")
        .setURL(`https://zhu.codes/paissa?world=${data.id}`)
        .addFields([
            {name: "Mist", value: `${data.districts[0].open_plots.length}`},
            {name: "The Lavender Beds", value: `${data.districts[1].open_plots.length}`},
            {name: "The Goblet", value: `${data.districts[2].open_plots.length}`},
            {name: "Shirogane", value: `${data.districts[3].open_plots.length}`},
            {name: "Empyreum", value: `${data.districts[4].open_plots.length}`},
        ])
}


module.exports = {
    data: command,
    async execute(interaction) {
        const world = interaction.options.getString("world");
        await interaction.deferReply(`Checking for houses...`);
        try {
            const data = await getHouses(world);
            await interaction.followUp({embeds: [embedMessage(data)]});
        } catch (error) {
            console.error(error);
            await interaction.followUp(error);
        }
    },
}