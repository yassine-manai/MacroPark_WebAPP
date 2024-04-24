import random
from fastapi import APIRouter, Body, HTTPException
from bson import ObjectId
from datetime import datetime

from fastapi.responses import JSONResponse

from auth.DB.Connection import *
from auth.Users import *
from auth.Users.users import addUser


async def setup_db():
    client, db, collection = await connect_guests()
    return client, db, collection


async def setup_db_users():
    client, db, collection = await connect_users()
    return client, db, collection

def generate_unique_id():
    random_number = random.randint(200, 299)
    
    return random_number



Add_Guest = APIRouter()
Get_Guests = APIRouter()
GuestByEmail = APIRouter()
GuestById = APIRouter()
Add_User = APIRouter()


Approuve_Guest = APIRouter()
update_userGuest = APIRouter()
Delete_Guest = APIRouter()



@Add_Guest.post('/addGuest', tags=["Guests"])
async def addGuest(data: dict = Body(...)):
    _, _, collection = await setup_db()
    existing_user = await collection.find_one({'email': data['email']})
    if existing_user:
        raise HTTPException(status_code=400, detail='Guest with the same email already exists')
    else:
        data['_id'] = generate_unique_id()
        await collection.insert_one(data)
        return {'message': 'Guest created successfully', 'user_id': data['_id']}


    
@Get_Guests.get('/allguests', tags=["Guests"])
async def get_all_guests():
    _, _, collection = await setup_db()
    
    guests = await collection.find().to_list(length=None)
    
    formatted_guests = []
    for guest in guests:
        guest['_id'] = str(guest['_id'])  
        formatted_guests.append(guest)
    
    return {"guest": formatted_guests}



@GuestByEmail.get('/guest/{email}', tags=["Guests"])
async def find_guest_by_email(email: str):
    _, _, collection = await setup_db()
    
    guest = await collection.find_one({'email': email})
    
    if guest:
        guest['_id'] = str(guest['_id'])  # Convert ObjectId to string if needed
        return guest  # Return guest data as a dictionary
    else:
        return None  # Return None if guest is not found

    

@GuestById.get('/guestid/{id}', tags=["Guests"])
async def find_guest_by_id(id: int):
    _, _, collection = await setup_db()
    
    user = await collection.find_one({'_id': id})
    
    if user:
        user['_id'] = str(user['_id'])
        return {"user": user}  
    else:
        raise HTTPException(status_code=404, detail='User not found')
    

     
    
""" @Approuve_Guest.get("/approuve_guest/{id}", tags=["Guests"])
async def approve_user_in_progress(id: int):
    _, _, collection = await setup_db()
    response = await find_guest_by_id(id)
    if response:
        response = await addUser()
        res = await collection.remove_document(collection,{"_id":id})
        print(response)
        print(res)
        return "user approved successfully"
    else:
        return HTTPException(status_code=404, detail="User not found")
"""


@Add_User.post('/adduser')
async def addUser(data: dict = Body(...)):
    _, _, collection = await setup_db_users()
    
    data['_id'] = generate_unique_id()
    await collection.insert_one(data)
    return {'message': 'User created successfully', 'user_id': data['_id']}


@Approuve_Guest.get("/approve_guest/{email}", tags=["Guests"])
async def approve_user_in_progress(email: str):
    try:
        _, _, collection = await setup_db()

        # Retrieve guest data by email
        guest = await find_guest_by_email(email)

        if guest:
            print("Retrieved guest data:", guest)

            # Extract guest attributes
            user_email = guest.get("email", "")
            user_name = guest.get("name", "")
            user_pass = guest.get("password", "")
            user_number = guest.get("number", "")
            user_lpn1 = guest.get("lpn1", "")
            user_lpn2 = guest.get("lpn2", "")
            user_lpn3 = guest.get("lpn3", "")

            user_lpn4 = guest.get("lpn4", "")
            # Prepare user data to be added
            user_data = {
                "name": user_name,
                "email": user_email,
                "password": user_pass,
                "phoneNumber": user_number,
                "lpn1": user_lpn1,
                "lpn2": user_lpn2,
                "lpn3": user_lpn3,
                "lpn4": user_lpn4
            }

            print("User data to be added:", user_data)

            # Add user with extracted data
            await addUser(user_data)

            # Delete guest from collection
            await collection.delete_one({"email": email})

            return "User approved successfully"
        else:
            # Guest not found, raise HTTPException with 404 status
            raise HTTPException(status_code=404, detail="User not found")
    except HTTPException as he:
        # Re-raise HTTPException to propagate
        raise he
    except Exception as e:
        # Catch any unexpected errors and log them
        print(f"Error during user approval: {e}")
        raise HTTPException(status_code=500, detail="Error approving user")
    
    

@update_userGuest.put("/Parking/{id}", tags=["Guests"])
async def update_userGuest(id:str,data:dict):
    object_id = ObjectId(id)
    _, _, collection = await setup_db()
    response = await collection.update_document(collection,{"_id":object_id},data)
    return response




@Delete_Guest.delete("/delete_guest/{email}", tags=["Guests"])
async def delete_guest(email: str):
    _, _, collection = await setup_db()

    try:
        result = await collection.delete_many({"email": email})

        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Guest not found")

        return {"message": f"Guest with email {email} deleted successfully"}

    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to delete guest") from e





""" @Delete_usr.delete('/deleteUser/{user_id}', tags=["Users"])
async def delete_user(user_id: str):
    try:
        _, _, collection = await setup_db()
        
        # Convert user_id to integer
        user_id_int = int(user_id)
        
        # Assuming 'id' is the custom identifier field stored as an integer
        existing_user = await collection.find_one({'_id': user_id_int})
        if existing_user:
            await collection.delete_one({'_id': user_id_int})
            return {'message': 'User deleted successfully'}
        else:
            raise HTTPException(status_code=404, detail=f'User with ID {user_id} not found')
    except ValueError:
        raise HTTPException(status_code=400, detail='Invalid user ID format')
    except Exception as e:
        raise HTTPException(status_code=500, detail=f'Error deleting user: {str(e)}')
 """