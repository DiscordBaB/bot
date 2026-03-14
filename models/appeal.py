"""
Appeal model using SQLAlchemy
"""
from sqlalchemy import Column, Integer, String, DateTime, Text
from datetime import datetime
from database.db import Base


class Appeal(Base):
    """Appeal model for ban appeals"""
    __tablename__ = "appeals"

    id = Column(Integer, primary_key=True, index=True)
    userID = Column("userID", String(50), index=True, nullable=False)
    serverID = Column("serverID", String(50), index=True, nullable=False)
    reason = Column(Text, nullable=False)
    disclaimer = Column(Integer, default=0, nullable=False)  # 0 or 1
    createdAt = Column("createdAt", DateTime, default=datetime.utcnow, index=True)
    updatedAt = Column("updatedAt", DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __repr__(self):
        return f"<Appeal(id={self.id}, userID={self.userID}, serverID={self.serverID})>"
