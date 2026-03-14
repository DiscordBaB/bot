# DBAB Bot - Python Version

Discord Ban A Bot - A comprehensive ban management bot for Discord servers.

## Features

- User ban/unban management
- Ban appeals system
- Access Control Lists (ACL)
- Server information utilities
- MySQL database integration
- Permission-based command access
- Automatic user caching
- Password hashing with Argon2

## Requirements

- Python 3.9+
- MySQL server
- discord.py 2.3.2+

## Installation

1. Clone the repository
2. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Create configuration file at `~/.dbab-config/dbab.json`:
   ```json
   {
     "bot": {
       "token": "YOUR_BOT_TOKEN"
     },
     "mysql": {
       "host": "localhost",
       "user": "root",
       "password": "password",
       "database": "dbab_bot",
       "port": 3306
     }
   }
   ```

## Running the Bot

```bash
python main.py
```

## Project Structure

```
dbab-bot/
├── main.py              # Main entry point
├── config.py            # Configuration loader
├── requirements.txt     # Python dependencies
├── cogs/                # Command cogs
│   ├── appeals/         # Appeal commands
│   ├── moderation/      # Ban/unban commands
│   ├── owner/           # Owner-only commands
│   └── utilities/       # Utility commands
├── events/              # Event handlers
├── database/            # Database configuration
├── models/              # SQLAlchemy models
└── helpers/             # Helper utilities
```

## Commands

### Moderation
- `/ban <user> [reason]` - Ban a user
- `/unban <user_id> [reason]` - Unban a user

### Appeals
- `/appeal <reason>` - Submit a ban appeal

### Owner
- `/reload <cog_name>` - Reload a cog
- `/acl <action>` - Manage access control lists

### Utilities
- `/serverinfo` - Get server information

## Database Models

- **Ban** - Store ban records
- **UserCache** - Cache user information

## License

ISC
