from fastapi import FastAPI, HTTPException, Response

from Database.DB.Connection import *

app = FastAPI()

async def setup_db_users():
    client, db, collection = await connect_users()
    return client, db, collection

async def setup_db_events():
    client, db, collection = await connect_events()
    return client, db, collection



@app.post("/events")
async def create_event(event_data: dict):
    _, _, collection = await setup_db_events()
    result = collection.insert_one(event_data)
    if result.inserted_id:
        print("Event created successfully")
        return {"message": "Event inserted successfully"}
    else:
        raise HTTPException(status_code=500, detail="Failed to insert event")



@app.get("/lpn/{lpn}")
async def get_user_info(lpn: str):
    _, _, collection = await setup_db_users()
    user_data = collection.find_one(
        {
            "$or": [
                {"lpn1": lpn},
                {"lpn2": lpn},
                {"lpn3": lpn},
                {"lpn4": lpn}
            ]
        }
    )
    if user_data:
        user_id = user_data.get("_id")
        user_name = user_data.get("name")
        user_email = user_data.get("email")

        response_content = {"user_email": user_email, "user_id": user_id, "user_name": user_name}
        print(response_content)

        return response_content
    else:
        raise HTTPException(status_code=500, detail="Failed to find userData")


