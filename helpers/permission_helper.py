"""
Permission validation helper utilities
"""
import json
from typing import Dict, Any
import discord
from config import DB_CONFIG

def validate_permissions(permissions_json: str) -> bool:
    """
    Validate permissions JSON structure
    
    Args:
        permissions_json: JSON string containing permissions
        
    Returns:
        True if valid, False otherwise
    """
    try:
        data = json.loads(permissions_json)
        if not isinstance(data, dict):
            return False
        return True
    except json.JSONDecodeError:
        return False

def check_permission(user_id: str, required_role: str, user_roles: list) -> bool:
    """
    Check if user has required permission role
    
    Args:
        user_id: Discord user ID
        required_role: Required role name
        user_roles: List of user's roles
        
    Returns:
        True if user has required role
    """
    return required_role in user_roles

def user_can_use_appeals(interaction: discord.Interaction) -> bool:
    """
    Check if user can use appeals commands (Mod, Head Mod, Developer, or Owner)
    
    Args:
        interaction: Discord interaction
        
    Returns:
        True if user has required roles
    """
    member = interaction.user
    if not isinstance(member, discord.Member):
        return False
    
    allowed_roles = {"Mod", "Head Mod", "Developer", "Owner"}
    user_roles = {role.name for role in member.roles}
    
    return bool(allowed_roles & user_roles)

def user_can_use_bans(interaction: discord.Interaction) -> bool:
    """
    Check if user can use ban commands (Mod, Head Mod, Developer, or Owner)
    
    Args:
        interaction: Discord interaction
        
    Returns:
        True if user has required roles
    """
    return user_can_use_appeals(interaction)
