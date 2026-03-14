"""
Unban command cog
"""
import discord
from discord.ext import commands
from discord import app_commands
import logging

logger = logging.getLogger(__name__)

class Unban(commands.Cog):
    """Unban management commands"""
    
    def __init__(self, bot: commands.Bot):
        self.bot = bot
    
    @app_commands.command(name="unban", description="Unban a user from the server")
    @app_commands.describe(user_id="User ID to unban", reason="Reason for unban")
    async def unban(
        self,
        interaction: discord.Interaction,
        user_id: str,
        reason: str = None
    ):
        """
        Unban a user
        
        Args:
            interaction: Discord interaction
            user_id: ID of user to unban
            reason: Reason for unban
        """
        try:
            if not interaction.user.guild_permissions.ban_members:
                await interaction.response.send_message(
                    "You don't have permission to unban members.",
                    ephemeral=True
                )
                return
            
            user = await self.bot.fetch_user(int(user_id))
            await interaction.guild.unban(user, reason=reason)
            await interaction.response.send_message(
                f"User {user.mention} has been unbanned. Reason: {reason or 'No reason provided'}",
                ephemeral=True
            )
            logger.info(f"User {user} unbanned by {interaction.user} for: {reason}")
        except ValueError:
            await interaction.response.send_message(
                "Invalid user ID provided.",
                ephemeral=True
            )
        except Exception as e:
            logger.error(f"Error in unban command: {e}")
            await interaction.response.send_message(
                "An error occurred while unbanning the user.",
                ephemeral=True
            )

async def setup(bot: commands.Bot):
    """Load the Unban cog"""
    await bot.add_cog(Unban(bot))
