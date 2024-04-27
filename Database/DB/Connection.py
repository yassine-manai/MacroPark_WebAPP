from motor.motor_asyncio import AsyncIOMotorClient


client = AsyncIOMotorClient("mongodb+srv://sbm2024:sbm2024_projet@cluster0.pud7wkc.mongodb.net/")
db = client.Parking

async def connect_users():
    collection = db.Users
    return client, db, collection

async def connect_guests():
    collection = db.Guests
    return client, db, collection


async def connect_events():
    collection = db.Events
    return client, db, collection


async def connect_config():
    collection = db.Config
    return client, db, collection


async def connect_Lpns():
    collection = db.Lpns
    return client, db, collection