"""
General helper utilities
"""
import discord
from database.db import SessionLocal
from models import UserCache
import logging

logger = logging.getLogger(__name__)

async def format_records(records, interaction: discord.Interaction):
    """
    Format appeal records for display in table
    
    Args:
        records: List of appeal records
        interaction: Discord interaction
        
    Returns:
        List of formatted records or False if error
    """
    formatted = []
    
    for record in records:
        record_id = record.id
        user_id = record.userID
        reason = record.reason
        disclaimer = "Yes" if record.disclaimer == 1 else "No"
        
        # Try to get member from guild
        user_id_row_string = None
        try:
            member = await interaction.guild.fetch_member(int(user_id))
            nickname = member.nick if member.nick else member.name
            user_id_row_string = f"{nickname}\n({user_id})"
        except discord.NotFound:
            # User not in guild, try fetching from Discord
            try:
                user = await interaction.client.fetch_user(int(user_id))
                user_id_row_string = f"@{user.name}"
            except discord.NotFound:
                # User not found on Discord
                user_id_row_string = f"{user_id}\n(USER_NOT_RESOLVABLE)"
            except ValueError:
                user_id_row_string = user_id
        except Exception as e:
            logger.error(f"Error fetching member {user_id}: {e}")
            user_id_row_string = user_id
        
        formatted_record = {
            'id': record_id,
            'userID': user_id_row_string,
            'reason': reason,
            'disclaimer': disclaimer
        }
        formatted.append(formatted_record)
    
    return formatted if formatted else False

async def fetch_user_info(user_id, interaction: discord.Interaction = None):
    """
    Fetch user info from Discord or cache model
    
    Args:
        user_id: Discord user ID
        interaction: Optional discord interaction
        
    Returns:
        Dictionary with user info
    """
    db = SessionLocal()
    try:
        # Try getting from cache model first
        cached_user = db.query(UserCache).filter(
            UserCache.id == str(user_id)
        ).first()
        
        if cached_user:
            return {
                'username': cached_user.username,
                'avatar_url': cached_user.avatarURL,
                'id': cached_user.id,
            }
        
        # Try fetching from Discord if we have an interaction client
        if interaction:
            try:
                user = await interaction.client.fetch_user(int(user_id))
                return {
                    'username': user.name,
                    'avatar_url': str(user.avatar.url) if user.avatar else None,
                    'id': str(user.id),
                }
            except discord.NotFound:
                pass
            except Exception as e:
                logger.error(f"Error fetching user {user_id}: {e}")
        
        # Return minimal info if user not found
        return {'user_id': str(user_id)}
    
    finally:
        db.close()

def check_for_duration(duration: str):
    """
    Validate duration input
    
    Args:
        duration: Duration string (e.g., '30s', '2h', 'lifetime')
        
    Returns:
        Tuple of (is_valid, is_permanent, duration_ms)
    """
    if not duration:
        return False, False, None
    
    normalized = duration.strip().lower()
    is_permanent = normalized in ['lifetime', 'forever', 'perm', 'permanent']
    
    if is_permanent:
        return True, True, None
    
    # Check for format like "30s", "15m", "2h", etc.
    import re
    match = re.match(r'^(\d+)\s*([smhdwy])$', normalized)
    
    if not match:
        return False, False, None
    
    amount = int(match.group(1))
    unit = match.group(2).lower()
    
    unit_map = {
        's': 1000,
        'm': 60 * 1000,
        'h': 3600 * 1000,
        'd': 86400 * 1000,
        'w': 604800 * 1000,
        'y': 31536000 * 1000
    }
    
    duration_ms = amount * unit_map[unit]
    
    if duration_ms <= 0:
        return False, False, None
    
    return True, False, duration_ms
