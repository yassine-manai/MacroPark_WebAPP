from fastapi import APIRouter, HTTPException, Request
from Database.Requests.req_control import Close_rq
from Events.Add_Events import add_close_event
from Models.items import send_action_with_timeout
from Config.log_config import logger
import asyncio

# Routing for the API endpoint
Close_barrier = APIRouter()

TIMEOUT = 10

@Close_barrier.post("/close/{id}", tags=["Barriers Controller"])
async def close_barrier_by_id(request: Request, id: int, extradata: str = ""):

    barrier_info = Close_rq(id)
    status_code = 500

    if not barrier_info:
        raise HTTPException(status_code=404, detail={"errordata": 404})
    
    ip_address, port, hex_code = barrier_info
    logger.info(f"Closing Barrier - IP: {ip_address}, Port: {port}, Hex Code: {hex_code}")
    ip_user = request.client.host
    
    try:
        response_data = await send_action_with_timeout(ip_address, port, hex_code, 'Closed', timeout=TIMEOUT)
        status_code = 200  

    except HTTPException as e:
        status_code = e.status_code 
        logger.error(f"HTTPException occurred: {e}")
        raise 
        
    except Exception as e:
        logger.error(f"An error occurred: {e}")
        raise HTTPException(status_code=500, detail={"errordata": 500})


    add_close_event(id, ip_user, status_code, extradata)  # Adding event regardless of response status code

    if response_data is not None:
        return response_data
        
    else:
        raise HTTPException(status_code=500, detail={"errordata": 500, "message": "Internal server error - No response"})
