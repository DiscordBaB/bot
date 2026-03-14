"""
Ban model using SQLAlchemy
"""
from sqlalchemy import Column, Integer, String, DateTime, Text, Boolean
from datetime import datetime
from database.db import Base


class Ban(Base):
    __tablename__ = "bans"

    id = Column(Integer, primary_key=True, index=True)
    userID = Column("userID", String(50), index=True, nullable=False)
    serverID = Column("serverID", String(50), index=True, nullable=False)
    reason = Column(Text, nullable=True)
    moderatorID = Column("moderatorID", String(50), nullable=False)
    isActive = Column("isActive", Boolean, default=True, index=True)
    createdAt = Column("createdAt", DateTime, default=datetime.utcnow, index=True)
    updatedAt = Column("updatedAt", DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __repr__(self):
        return f"<Ban(userID={self.userID}, serverID={self.serverID}, isActive={self.isActive})>"
