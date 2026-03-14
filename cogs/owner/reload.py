"""
Reload cog handler
"""
import discord
from discord.ext import commands
from discord import app_commands
import logging

logger = logging.getLogger(__name__)

class Reload(commands.Cog):
    """Reload commands for owner"""
    
    def __init__(self, bot: commands.Bot):
        self.bot = bot
    
    @app_commands.command(name="reload", description="Reload a cog")
    @app_commands.describe(cog_name="Name of the cog to reload")
    async def reload(
        self,
        interaction: discord.Interaction,
        cog_name: str
    ):
        """
        Reload a cog
        
        Args:
            interaction: Discord interaction
            cog_name: Name of cog to reload
        """
        try:
            # Check if user is bot owner
            if interaction.user.id != self.bot.owner_id:
                await interaction.response.send_message(
                    "Only the bot owner can reload cogs.",
                    ephemeral=True
                )
                return
            
            await self.bot.reload_extension(f"cogs.{cog_name}")
            await interaction.response.send_message(
                f"Cog '{cog_name}' reloaded successfully.",
                ephemeral=True
            )
            logger.info(f"Cog '{cog_name}' reloaded by {interaction.user}")
        except Exception as e:
            logger.error(f"Error reloading cog '{cog_name}': {e}")
            await interaction.response.send_message(
                f"Error reloading cog: {str(e)}",
                ephemeral=True
            )

async def setup(bot: commands.Bot):
    """Load the Reload cog"""
    await bot.add_cog(Reload(bot))
