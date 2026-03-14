"""
Ban event handler
"""
import discord
from discord.ext import commands
import logging

logger = logging.getLogger(__name__)

class BanHandler(commands.Cog):
    """Handles ban-related events"""
    
    def __init__(self, bot: commands.Bot):
        self.bot = bot
    
    @commands.Cog.listener()
    async def on_member_ban(self, guild: discord.Guild, user: discord.User):
        """
        Called when a user is banned from a guild
        
        Args:
            guild: Guild where ban occurred
            user: User that was banned
        """
        logger.info(f"User {user} was banned from {guild.name}")

async def setup(bot: commands.Bot):
    """Load the BanHandler cog"""
    await bot.add_cog(BanHandler(bot))
