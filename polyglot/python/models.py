from dataclasses import dataclass, field
from datetime import datetime


@dataclass
class User:
    id: int
    name: str
    email: str
    phone: str
    cnic: str
    address: str
    created_at: datetime = field(default_factory=datetime.utcnow)
