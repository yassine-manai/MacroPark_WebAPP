from fastapi import APIRouter, FastAPI, HTTPException, Body
from Database.DB.Connection import connect_events


app = FastAPI()

# Database connection
async def setup_db():
    client, db, collection = await connect_events()
    return client, db, collection




# Define routers - APIs()
UserLogsList = APIRouter()
UserByEmail = APIRouter()
UserById = APIRouter()
User_List = APIRouter()




# Get all Users Logs - API()
@UserLogsList.get('/alluserevents', tags=["Events"])
async def get_all_userEvents():
    _, _, collection = await setup_db()
    
    users = await collection.find().to_list(length=None)
    
    formatted_users = []
    for user in users:
        user['_id'] = str(user['_id'])
        formatted_users.append(user)
    
    return {"users": formatted_users}





#Get User by Email
@UserByEmail.get('/user/{email}', tags=["Users"])
async def find_user_by_email(email: str):
    _, _, collection = await setup_db()
    
    user = await collection.find_one({'email': email})
    
    if user:
        user['_id'] = str(user['_id'])
        return {"user": user}  
    else:
        raise HTTPException(status_code=404, detail='User not found')
    


#Get user by ID - API()
@UserById.get('/userid/{id}', tags=["Users"])
async def find_user_by_id(id: int):
    _, _, collection = await setup_db()
    
    user = await collection.find_one({'_id': id})
    
    if user:
        user['_id'] = str(user['_id'])
        return {"user": user}  
    
    else:
        raise HTTPException(status_code=404, detail='User not found')
    







