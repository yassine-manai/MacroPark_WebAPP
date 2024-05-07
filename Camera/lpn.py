""" import base64
import datetime
from Database.DB.data_info import create_event
import httpx
from fastapi import APIRouter, FastAPI, HTTPException, Request, Response
from Config.mqtt_acces import publish_to_mqtt_broker
from datetime import date
from Config.config import *
from Models.Json import OnCarHandledBase

app = FastAPI()


PostOnCarHandled = APIRouter()
PostOnCarArrival = APIRouter()
PostOnCarDeparture = APIRouter()



# On Car Handled ------------------------------------------------------------- <-- POST-->
@PostOnCarHandled.post("/OnCarHandled")
async def OnCarHandled(request: OnCarHandledBase):
    try:
        print(" \n ")
        print("On Car Handled ------------------------------------------------------------- <-- POST-->")

        print(f"- - - - - - LPN = {request.license}")
        print(f"- - - - - - Min Quality = {request.minQuality}")
        print(f"- - - - - - Avg Quality = {request.avgQuality}")
        print(f"- - - - - - Trigger ID = {request.triggerId}")
        print(f"- - - - - - Country = {request.country}")

        print(" \n ")

        if request.minQuality < 0.5:
            endpoint_url = f"http://{APP_IP}:{APP_PORT}/WS/Trigger?triggerId={request.triggerId}"
            username = "admin"
            password = "quercus2"

            credentials = f"{username}:{password}"
            credentials = base64.b64encode(credentials.encode()).decode()
            headers = {
                "Authorization": f"Basic {credentials}",
                "Content-Type": "application/json"
           }

                # Make request to the specified endpoint with authentication headers
            async with httpx.AsyncClient() as client:
                response = await client.post(endpoint_url, headers=headers)

        if request.minQuality > 0.5:

            user_info = await get_user_info(request.license)

            if user_info:
                
                #mqtt_info = publish_to_mqtt_broker()

                current_time = datetime.datetime.now()
                dateNow = current_time.strftime("%d/%m/%Y")
                timeNow = current_time.strftime("%H:%M:%S")

                event_data = {
                    "id_user": user_info["user_id"],
                    "user_name": user_info["user_name"],
                    "user_email": user_info["user_email"],
                    "MQTT Server": "192.168.25.73",
                    "MQTT Topic": "Test",

                    #"MQTT Server": mqtt_info["mqtt_server"],
                    #"MQTT Topic": mqtt_info["mqtt_topic"],
                    "license": request.license,
                    "minQuality": request.minQuality,
                    "avgQuality": request.avgQuality,
                    "triggerId": request.triggerId,
                    "country": request.country,
                    "date": dateNow,
                    "time": timeNow
                }

                await create_event(event_data)

                return Response(content="User Found", status_code=200)
        else:
            raise HTTPException(status_code=404, detail="User not found")
    except Exception as Ex:
        print(Ex)
        return Response(content="OK", status_code=200)
    


# On Car Departure ------------------------------------------------------------- <-- POST-->
@PostOnCarDeparture.post("/OnCarDeparture")
async def OnCarDeparture(request: OnCarHandledBase):
    try:
        print(" \n ")
        print("On Car Handled ------------------------------------------------------------- <-- POST-->")

        print(f"- - - - - - LPN = {request.license}")
        print(f"- - - - - - Min Quality = {request.minQuality}")
        print(f"- - - - - - Avg Quality = {request.avgQuality}")
        print(f"- - - - - - Trigger ID = {request.triggerId}")
        print(f"- - - - - - Country = {request.country}")

        print(" \n ")


        return Response(content="OK", status_code=200)
    except Exception as Ex:
        print(Ex)
        return Response(content="Not Captured", status_code=404)
    





# On Car Arrival ------------------------------------------------------------- <-- POST-->
@PostOnCarArrival.post("/OnCarArrival")
async def OnCarArrival(request: OnArrivalBase):
    try:
        print(" \n ")
        print("On Car Handled ------------------------------------------------------------- <-- POST-->")

        print(f"- - - - - - LPN = {request.license}")
        print(f"- - - - - - Min Quality = {request.minQuality}")
        print(f"- - - - - - Avg Quality = {request.avgQuality}")
        print(f"- - - - - - Trigger ID = {request.triggerId}")
        print(f"- - - - - - Country = {request.country}")

        print(" \n ")

        
        
        return Response(content=OnArrivalBase, status_code=200)
    except Exception as Ex:
        print(Ex)
        return Response(content="Not Captured", status_code=404)

 """