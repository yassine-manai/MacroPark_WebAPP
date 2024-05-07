from typing import List
from fastapi import APIRouter, FastAPI, HTTPException, Body
from Database.DB.Connection import connect_events
from Models.items import UserEvent


app = FastAPI()

# Database connection
async def setup_db():
    client, db, collection = await connect_events()
    return client, db, collection


# Define routers - APIs()
UserLogsList = APIRouter()
UserByDate = APIRouter()


# Get all Users Logs - API()
@UserLogsList.get('/alluserevents', tags=["Events"])
async def get_all_userEvents():
    _, _, collection = await setup_db()
    
    users = await collection.find().to_list(length=None)
    
    formatted_users = []
    for user in reversed(users):
        user['_id'] = str(user['_id'])
        formatted_users.append(user)
    
    return {"users": formatted_users}



@UserByDate.get('/usersLogs/{date}', tags=["Events"])
async def find_users_by_date(date: str):
    _, _, collection = await setup_db()
    
    cursor = collection.find({'date': date})
    users = await cursor.to_list(length=None)
    
    if users:
        reversed_users = list(reversed(users))
        for user in reversed_users:
            user['_id'] = str(user['_id'])
        return {"users": reversed_users}
    else:
        raise HTTPException(status_code=404, detail='Logs not found')

