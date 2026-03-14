"""
Appeals cog - Manage ban appeals (Moderator commands)
"""
import discord
from discord.ext import commands
from discord import app_commands
import logging
from database.db import SessionLocal
from models import Appeal
from helpers.permission_helper import user_can_use_appeals
from helpers.helpers import format_records, fetch_user_info
from PIL import Image, ImageDraw, ImageFont
import io

logger = logging.getLogger(__name__)

class Appeals(commands.Cog):
    """Appeals management commands (MODs)"""
    
    def __init__(self, bot: commands.Bot):
        self.bot = bot
    
    appeal_group = app_commands.Group(name="appeal", description="Appeals commands [MODs]")
    
    @appeal_group.command(name="list-all", description="List all appeals")
    @app_commands.describe(page="What page to return. (Default: 1)")
    async def list_all(self, interaction: discord.Interaction, page: int = None):
        """
        List all appeals with pagination
        
        Args:
            interaction: Discord interaction
            page: Page number (default: 0)
        """
        await interaction.response.defer()
        
        if not user_can_use_appeals(interaction):
            await interaction.followup.send(
                "You don't have permission to use this command.",
                ephemeral=True
            )
            return
        
        try:
            page = (page or 1) - 1  # Convert to 0-indexed
            if page < 0:
                page = 0
            
            db = SessionLocal()
            # Query appeals for this server with pagination
            appeals = db.query(Appeal).filter(
                Appeal.serverID == interaction.guild_id
            ).limit(10).offset(page * 10).all()
            
            db.close()
            
            if not appeals:
                await interaction.followup.send(
                    "No appeals found for this server.",
                    ephemeral=True
                )
                return
            
            # Format records with user info
            formatted_records = await format_records(appeals, interaction)
            
            if not formatted_records:
                await interaction.followup.send(
                    "Unable to format appeals.",
                    ephemeral=True
                )
                return
            
            # Create table image
            image_file = self._create_appeals_table(formatted_records)
            
            # Send as attachment
            await interaction.followup.send(
                "Use `/appeal get <ID>` to view a specific appeal.",
                file=image_file
            )
        
        except Exception as e:
            logger.error(f"Error in list-all command: {e}")
            await interaction.followup.send(
                "An error occurred while listing appeals.",
                ephemeral=True
            )
    
    @appeal_group.command(name="get", description="Get a single appeal")
    @app_commands.describe(appeal_id="The appeal ID to return")
    async def get_appeal(self, interaction: discord.Interaction, appeal_id: int):
        """
        Get a specific appeal by ID
        
        Args:
            interaction: Discord interaction
            appeal_id: Appeal ID to retrieve
        """
        if not user_can_use_appeals(interaction):
            await interaction.response.send_message(
                "You don't have permission to use this command.",
                ephemeral=True
            )
            return
        
        try:
            db = SessionLocal()
            appeal = db.query(Appeal).filter(Appeal.id == appeal_id).first()
            db.close()
            
            if not appeal:
                await interaction.response.send_message(
                    f"No appeal found with ID {appeal_id}.",
                    ephemeral=True
                )
                return
            
            # Fetch user info
            user_info = await fetch_user_info(appeal.userID, interaction)
            
            # Create embed
            embed = discord.Embed(
                title=f"Ban Appeal ID: {appeal_id}",
                description=appeal.reason,
                color=discord.Color.orange()
            )
            
            user_avatar = user_info.get('avatar_url')
            if user_avatar:
                embed.set_thumbnail(url=user_avatar)
            
            embed.add_field(
                name="User",
                value=f"{user_info.get('username', 'Unknown')} ({appeal.userID})",
                inline=False
            )
            embed.add_field(
                name="Reason",
                value=appeal.reason,
                inline=False
            )
            embed.add_field(
                name="Disclaimer Accepted",
                value="Yes" if appeal.disclaimer == 1 else "No",
                inline=True
            )
            embed.add_field(
                name="Created",
                value=appeal.createdAt.strftime("%Y-%m-%d %H:%M:%S"),
                inline=True
            )
            
            await interaction.response.send_message(embed=embed)
        
        except Exception as e:
            logger.error(f"Error in get command: {e}")
            await interaction.response.send_message(
                "An error occurred while retrieving the appeal.",
                ephemeral=True
            )
    
    @appeal_group.command(name="del", description="Delete a single appeal")
    @app_commands.describe(appeal_id="The appeal ID to delete")
    async def delete_appeal(self, interaction: discord.Interaction, appeal_id: int):
        """
        Delete an appeal
        
        Args:
            interaction: Discord interaction
            appeal_id: Appeal ID to delete
        """
        if not user_can_use_appeals(interaction):
            await interaction.response.send_message(
                "You don't have permission to use this command.",
                ephemeral=True
            )
            return
        
        try:
            db = SessionLocal()
            appeal = db.query(Appeal).filter(
                Appeal.id == appeal_id,
                Appeal.serverID == interaction.guild_id
            ).first()
            
            if not appeal:
                await interaction.response.send_message(
                    f"No appeal found with ID {appeal_id}.",
                    ephemeral=True
                )
                db.close()
                return
            
            db.delete(appeal)
            db.commit()
            db.close()
            
            await interaction.response.send_message(
                f"Appeal with ID {appeal_id} has been deleted.",
                ephemeral=True
            )
        
        except Exception as e:
            logger.error(f"Error in delete command: {e}")
            await interaction.response.send_message(
                "An error occurred while deleting the appeal.",
                ephemeral=True
            )
    
    def _create_appeals_table(self, records: list):
        """
        Create an image of the appeals table
        
        Args:
            records: List of formatted appeal records
            
        Returns:
            discord.File with the table image
        """
        # Image dimensions
        width = 1200
        height = 100 + len(records) * 50
        cell_height = 50
        
        # Colors
        bg_color = (148, 148, 148)  # Gray
        text_color = (0, 0, 0)  # Black
        header_color = (100, 100, 100)  # Dark gray
        
        # Create image
        img = Image.new('RGB', (width, height), bg_color)
        draw = ImageDraw.Draw(img)
        
        # Try to load a font, fall back to default
        try:
            font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 12)
            header_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 14)
        except (IOError, OSError):
            font = ImageFont.load_default()
            header_font = font
        
        # Column widths
        col_widths = [100, 220, 400, 100]
        cols = ['ID', 'User ID\nName', 'Reason', 'Accepted\nDisclaimer']
        
        # Draw header
        x = 10
        draw.rectangle([0, 0, width, cell_height], fill=header_color)
        for i, col in enumerate(cols):
            draw.text((x, 15), col, fill=text_color, font=header_font)
            x += col_widths[i]
        
        # Draw rows
        y = cell_height
        for record in records:
            x = 10
            # ID
            draw.text((x, y + 15), str(record['id']), fill=text_color, font=font)
            x += col_widths[0]
            # UserID
            draw.text((x, y + 5), record['userID'][:20], fill=text_color, font=font)
            x += col_widths[1]
            # Reason
            reason_text = record['reason'][:50] + '...' if len(record['reason']) > 50 else record['reason']
            draw.text((x, y + 15), reason_text, fill=text_color, font=font)
            x += col_widths[2]
            # Disclaimer
            draw.text((x, y + 15), record['disclaimer'], fill=text_color, font=font)
            
            y += cell_height
        
        # Convert to bytes
        img_byte_arr = io.BytesIO()
        img.save(img_byte_arr, format='PNG')
        img_byte_arr.seek(0)
        
        return discord.File(img_byte_arr, filename="appeals_table.png")

async def setup(bot: commands.Bot):
    """Load the Appeals cog"""
    await bot.add_cog(Appeals(bot))
