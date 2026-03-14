"""
Ban command cog
"""
import discord
from discord.ext import commands
from discord import app_commands
import logging
from datetime import datetime

logger = logging.getLogger(__name__)

class Ban(commands.Cog):
    """Ban management commands"""
    
    def __init__(self, bot: commands.Bot):
        self.bot = bot
    
    @app_commands.command(name="ban", description="Ban a user from the server")
    @app_commands.describe(user="User to ban", reason="Reason for the ban")
    async def ban(
        self,
        interaction: discord.Interaction,
        user: discord.User,
        reason: str = None
    ):
        """
        Ban a user
        
        Args:
            interaction: Discord interaction
            user: User to ban
            reason: Reason for ban
        """
        try:
            if not interaction.user.guild_permissions.ban_members:
                await interaction.response.send_message(
                    "You don't have permission to ban members.",
                    ephemeral=True
                )
                return
            
            await interaction.guild.ban(user, reason=reason)
            await interaction.response.send_message(
                f"User {user.mention} has been banned. Reason: {reason or 'No reason provided'}",
                ephemeral=True
            )
            logger.info(f"User {user} banned by {interaction.user} for: {reason}")
        except Exception as e:
            logger.error(f"Error in ban command: {e}")
            await interaction.response.send_message(
                "An error occurred while banning the user.",
                ephemeral=True
            )

async def setup(bot: commands.Bot):
    """Load the Ban cog"""
    await bot.add_cog(Ban(bot))
