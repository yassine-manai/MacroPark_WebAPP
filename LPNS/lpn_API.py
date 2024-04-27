from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

from Database.DB.Connection import *

# Initialize FastAPI
app = FastAPI()

async def setup_db_users():
    client, db, collection = await connect_users()
    return client, db, collection


async def setup_db_Lpns():
    client, db, collection = await connect_Lpns()
    return client, db, collection


@app.post("/add_lpn_data")
async def add_data():

    source_db =     _, _, collection = await setup_db_users()
    destination_db =  _, _, collection = await setup_db_Lpns()
    

    for document in source_db.collection.find({}):
        id = document.get("id")
        lpns = document.get("lpns", [])

        if not destination_db.collection.find_one({"id": id}):
            destination_db.collection.insert_one({"id": id, "lpns": lpns})
    
    return {"message": "Data added successfully"}


