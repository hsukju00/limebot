import {
    CacheType,
    ChatInputCommandInteraction,
    Interaction,
    SlashCommandBuilder,
} from "discord.js";

export default interface Command {
    data: SlashCommandBuilder;

    execute(interaction: ChatInputCommandInteraction): void | Promise<void>;
}
