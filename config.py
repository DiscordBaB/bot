import json
import os
from pathlib import Path

# Load configuration from home directory
config_path = Path.home() / ".dbab-config" / "dbab.json"

try:
    with open(config_path, 'r') as f:
        config = json.load(f)
except FileNotFoundError:
    raise Exception(f"Configuration file not found at {config_path}")

# Bot token
BOT_TOKEN = config.get('bot', {}).get('token')

# Database configuration
DB_CONFIG = config.get('mysql', {})
DATABASE_URL = f"mysql+mysqlconnector://{DB_CONFIG.get('user')}:{DB_CONFIG.get('password')}@{DB_CONFIG.get('host')}:{DB_CONFIG.get('port')}/{DB_CONFIG.get('database')}"

if not BOT_TOKEN:
    raise Exception("Bot token not found in configuration")
