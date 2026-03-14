"""
User cache model using SQLAlchemy
"""
from sqlalchemy import Column, String, DateTime, Text, Boolean
from datetime import datetime
from database.db import Base

class UserCache(Base):
    __tablename__ = "user_cache"

    id = Column(String(50), primary_key=True, index=True)
    username = Column(String(255), nullable=True)
    avatarURL = Column("avatarURL", Text, nullable=True)
    bannerURL = Column("bannerURL", Text, nullable=True)
    avatarDecorationURL = Column("avatarDecorationURL", Text, nullable=True)
    nicknames = Column(Text, nullable=True)
    createdAt = Column("createdAt", DateTime, default=datetime.utcnow)
    updatedAt = Column("updatedAt", DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __repr__(self):
        return f"<UserCache(id={self.id}, username={self.username})>"
