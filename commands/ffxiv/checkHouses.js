const {SlashCommandBuilder} = require('discord.js');
const wait = require('node:timers/promises').setTimeout;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('check_houses')
        .setDescription('Returns available houses to buy. Based on PaissaDB.')
        .addStringOption(option =>
            option.setName("world")
                .setDescription("The world to check for houses.")
                .setRequired(true)
                .addChoices(
                    {name: "Alpha", value: "402"},
                    {name: "Lich", value: "36"},
                    {name: "Odin", value: "66"},
                    {name: "Phoenix", value: "56"},
                    {name: "Raiden", value: "403"},
                    {name: "Shiva", value: "67"},
                    {name: "Twintania", value: "33"},
                    {name: "Zodiark", value: "42"},
                )),
    async execute(interaction) {
        const world = interaction.options.getString("world");
        await interaction.reply(`Checking for houses on ${world}...`);
        try {
            const data = await getHouses(world);
            let housesPerDisctrict = {
                "Mist": 0,
                "The Lavender Beds": 0,
                "The Goblet": 0,
                "Shirogane": 0,
                "Empyreum": 0,
            }

            const districts = data.districts;
            for (const district of districts) {
                const openPlots = district.open_plots;
                housesPerDisctrict[district.name] = openPlots.length;
            }

            await interaction.editReply(`There are ${data.num_open_plots} houses available on ${data.name}!\n
                Mist: ${housesPerDisctrict["Mist"]}\n
                The Lavender Beds: ${housesPerDisctrict["The Lavender Beds"]}\n
                The Goblet: ${housesPerDisctrict["The Goblet"]}\n
                Shirogane: ${housesPerDisctrict["Shirogane"]}\n
                Empyreum: ${housesPerDisctrict["Empyreum"]}\n
                `);
        }catch (error) {
            console.error(error);
            await interaction.editReply(error);
        }
    },
}


async function getHouses(worldId){
    try {
        const response = await fetch(`https://paissadb.zhu.codes/worlds/${worldId}`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log(data);
        return data;
    }
    catch (error) {
        console.error(error);
        throw error;
    }
}