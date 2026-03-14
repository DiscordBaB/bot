"""
Ban count model using SQLAlchemy
"""
from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime
from database.db import Base


class BanCount(Base):
    """Ban count tracking per user per server"""
    __tablename__ = "bancounts"

    id = Column(Integer, primary_key=True, index=True)
    userID = Column("userID", String(50), nullable=False)
    serverID = Column("serverID", String(50), nullable=False, unique=True, index=True)
    count = Column(Integer, default=0, nullable=False)
    createdAt = Column("createdAt", DateTime, default=datetime.utcnow)
    updatedAt = Column("updatedAt", DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __repr__(self):
        return f"<BanCount(userID={self.userID}, serverID={self.serverID}, count={self.count})>"
