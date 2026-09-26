from dataclasses import dataclass


@dataclass
class User:
    id: int
    name: str
    email: str
    phone: str
    cnic: str
    address: str
