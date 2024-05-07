import random
from fastapi import APIRouter, Body, HTTPException
from Database.DB.Connection import *
from auth.Users import *



#Connect to the databases 
async def setup_db_guests():
    client, db, collection = await connect_guests()
    return client, db, collection

async def setup_db_users():
    client, db, collection = await connect_users()
    return client, db, collection


#generate unique id to pass it with the guest register
def generate_unique_id():
    random_number = random.randint(200, 299)
    return random_number



#Define API Routers  - Endpoints
Add_Guest = APIRouter()
Get_Guests = APIRouter()
GuestByEmail = APIRouter()
GuestById = APIRouter()
Add_User = APIRouter()
Approuve_Guest = APIRouter()
update_userGuest = APIRouter()
Delete_Guest = APIRouter()


# ADD Guest API - REGISTER (MOBILE APP)
@Add_Guest.post('/addGuest', tags=["Guests"])
async def addGuest(data: dict = Body(...)):

    _, _, collection = await setup_db_guests()
    existing_user = await collection.find_one({'email': data['email']})

    if existing_user:
        raise HTTPException(status_code=400, detail='Guest with the same email already exists')
    
    else:
        data['_id'] = generate_unique_id()
        await collection.insert_one(data)
        return {'message': 'Guest created successfully', 'user_id': data['_id']}



# Get all guests API 
@Get_Guests.get('/allguests', tags=["Guests"])
async def get_all_guests():
    _, _, collection = await setup_db_guests()
    
    guests = await collection.find().to_list(length=None)
    
    formatted_guests = []
    for guest in guests:
        guest['_id'] = str(guest['_id'])  
        formatted_guests.append(guest)
    
    return {"guest": formatted_guests}



# Get Guest by Email - API
@GuestByEmail.get('/guest/{email}', tags=["Guests"])
async def find_guest_by_email(email: str):
    _, _, collection = await setup_db_guests()
    
    guest = await collection.find_one({'email': email})
    
    if guest:
        guest['_id'] = str(guest['_id']) 
        return guest  
    
    else:
        return None  

    

# Get Guest by ID - API
@GuestById.get('/guestid/{id}', tags=["Guests"])
async def find_guest_by_id(id: int):
    _, _, collection = await setup_db_guests()
    
    user = await collection.find_one({'_id': id})
    
    if user:
        user['_id'] = str(user['_id'])
        return {"user": user}  
    
    else:
        raise HTTPException(status_code=404, detail='User not found')
    


# Add user - API
@Add_User.post('/adduser')
async def addUser(data: dict = Body(...)):
    _, _, collection = await setup_db_users()
    
    data['_id'] = generate_unique_id()
    await collection.insert_one(data)
    return {'message': 'User created Successfully', 'user_id': data['_id']}



# Approuve Guest - API
@Approuve_Guest.get("/approve_guest/{email}", tags=["Guests"])
async def approve_user_in_progress(email: str):

    try:
        _, _, collection = await setup_db_guests()

        guest = await find_guest_by_email(email)

        if guest:
            print("Retrieved guest data:", guest)

            user_email = guest.get("email", "")
            user_name = guest.get("name", "")
            user_pass = guest.get("password", "")
            user_number = guest.get("phoneNumber", "")
            user_lpn1 = guest.get("lpn1", "")
            user_lpn2 = guest.get("lpn2", "")
            user_lpn3 = guest.get("lpn3", "")
            user_lpn4 = guest.get("lpn4", "")

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

            await addUser(user_data)
            await collection.delete_one({"email": email})

            return "User approved successfully"
        
        else:
            raise HTTPException(status_code=404, detail="User not found")
        
    except HTTPException as he:
        raise he
    
    except Exception as e:
        print(f"Error during user approval: {e}")
        raise HTTPException(status_code=500, detail="Error approving user")
    
    

#  Delete / Decline Guest - API()
@Delete_Guest.delete("/delete_guest/{email}", tags=["Guests"])
async def delete_guest(email: str):
    _, _, collection = await setup_db_guests()

    try:
        result = await collection.delete_many({"email": email})

        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Guest not found")

        return {"message": f"Guest with email {email} deleted successfully"}

    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to delete guest") from e

