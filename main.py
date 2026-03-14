"""
Discord Ban A Bot - Main Entry Point
"""
import discord
from discord.ext import commands
import os
from pathlib import Path
import logging

from config import BOT_TOKEN

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create bot instance
intents = discord.Intents.default()
intents.message_content = True
intents.members = True

bot = commands.Bot(command_prefix="!", intents=intents)

@bot.event
async def on_ready():
    """Called when the bot is ready"""
    logger.info(f"Ready! Logged in as {bot.user}")
    try:
        synced = await bot.tree.sync()
        logger.info(f"Synced {len(synced)} command(s)")
    except Exception as e:
        logger.error(f"Failed to sync commands: {e}")

async def load_cogs():
    """Load all cogs (commands) from the cogs directory"""
    cogs_path = Path(__file__).parent / "cogs"
    
    for cog_file in cogs_path.glob("**/*.py"):
        if cog_file.name.startswith("_"):
            continue
        
        # Convert file path to module path
        relative_path = cog_file.relative_to(cogs_path.parent)
        module_name = str(relative_path).replace("/", ".").replace(".py", "")
        
        try:
            await bot.load_extension(module_name)
            logger.info(f"Loaded cog: {module_name}")
        except Exception as e:
            logger.error(f"Failed to load cog {module_name}: {e}")

async def load_events():
    """Load all event handlers from the events directory"""
    events_path = Path(__file__).parent / "events"
    
    for event_file in events_path.glob("*.py"):
        if event_file.name.startswith("_"):
            continue
        
        relative_path = event_file.relative_to(events_path.parent)
        module_name = str(relative_path).replace("/", ".").replace(".py", "")
        
        try:
            await bot.load_extension(module_name)
            logger.info(f"Loaded event: {module_name}")
        except Exception as e:
            logger.error(f"Failed to load event {module_name}: {e}")

async def main():
    """Main entry point"""
    async with bot:
        await load_cogs()
        await load_events()
        await bot.start(BOT_TOKEN)

if __name__ == "__main__":
    import asyncio
    asyncio.run(main())
