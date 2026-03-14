"""
Server information utility cog
"""
import discord
from discord.ext import commands
from discord import app_commands
import logging

logger = logging.getLogger(__name__)

class Server(commands.Cog):
    """Server utility commands"""
    
    def __init__(self, bot: commands.Bot):
        self.bot = bot
    
    @app_commands.command(name="serverinfo", description="Get server information")
    async def serverinfo(self, interaction: discord.Interaction):
        """
        Get server information
        
        Args:
            interaction: Discord interaction
        """
        try:
            guild = interaction.guild
            embed = discord.Embed(
                title=f"Server: {guild.name}",
                description=f"ID: {guild.id}",
                color=discord.Color.blue()
            )
            embed.add_field(name="Owner", value=guild.owner.mention)
            embed.add_field(name="Members", value=guild.member_count)
            embed.add_field(name="Created", value=guild.created_at.date())
            
            await interaction.response.send_message(embed=embed)
        except Exception as e:
            logger.error(f"Error in serverinfo command: {e}")
            await interaction.response.send_message(
                "An error occurred while retrieving server information.",
                ephemeral=True
            )

async def setup(bot: commands.Bot):
    """Load the Server cog"""
    await bot.add_cog(Server(bot))
