"""
Password hashing utilities using Argon2
"""
from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError, InvalidHash

hasher = PasswordHasher()

def hash_password(password: str) -> str:
    """
    Hash a password using Argon2
    
    Args:
        password: Plain text password
        
    Returns:
        Hashed password string
    """
    return hasher.hash(password)

def verify_password(password: str, hash_value: str) -> bool:
    """
    Verify a password against a hash
    
    Args:
        password: Plain text password
        hash_value: Hashed password
        
    Returns:
        True if password matches, False otherwise
    """
    try:
        hasher.verify(hash_value, password)
        return True
    except (VerifyMismatchError, InvalidHash):
        return False
