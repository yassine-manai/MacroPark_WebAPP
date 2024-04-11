from motor.motor_asyncio import AsyncIOMotorClient

async def connect_users():
    # Connect to MongoDB
    client = AsyncIOMotorClient("mongodb+srv://sbm2024:sbm2024_projet@cluster0.pud7wkc.mongodb.net/")
    db = client.Parking
    collection = db.Users
    return client, db, collection


async def connect_guests():
    # Connect to MongoDB
    client = AsyncIOMotorClient("mongodb+srv://sbm2024:sbm2024_projet@cluster0.pud7wkc.mongodb.net/")
    db = client.Parking
    collection = db.Guests
    return client, db, collection