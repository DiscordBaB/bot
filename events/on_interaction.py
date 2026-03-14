"""
Interaction event handler
"""
import discord
from discord.ext import commands
import logging

logger = logging.getLogger(__name__)

class InteractionHandler(commands.Cog):
    """Handles interaction events"""
    
    def __init__(self, bot: commands.Bot):
        self.bot = bot
    
    @commands.Cog.listener()
    async def on_interaction(self, interaction: discord.Interaction):
        """Handle interaction"""
        pass

async def setup(bot: commands.Bot):
    """Load the InteractionHandler cog"""
    await bot.add_cog(InteractionHandler(bot))
