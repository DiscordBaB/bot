"""
ACL (Access Control List) management cog
"""
import discord
from discord.ext import commands
from discord import app_commands
import logging

logger = logging.getLogger(__name__)

class ACL(commands.Cog):
    """ACL management commands"""
    
    def __init__(self, bot: commands.Bot):
        self.bot = bot
    
    @app_commands.command(name="acl", description="Manage access control lists")
    @app_commands.describe(action="Action to perform (add/remove/list)")
    async def acl(
        self,
        interaction: discord.Interaction,
        action: str
    ):
        """
        Manage ACL
        
        Args:
            interaction: Discord interaction
            action: ACL action
        """
        try:
            if not interaction.user.guild_permissions.administrator:
                await interaction.response.send_message(
                    "You don't have permission to manage ACL.",
                    ephemeral=True
                )
                return
            
            await interaction.response.send_message(
                f"ACL action '{action}' executed.",
                ephemeral=True
            )
        except Exception as e:
            logger.error(f"Error in acl command: {e}")
            await interaction.response.send_message(
                "An error occurred while managing ACL.",
                ephemeral=True
            )

async def setup(bot: commands.Bot):
    """Load the ACL cog"""
    await bot.add_cog(ACL(bot))
