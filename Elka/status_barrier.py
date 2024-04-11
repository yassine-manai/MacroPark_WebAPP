from fastapi import APIRouter, HTTPException
from Database.Requests.req_control import status_rq
from Models.items import response

Status = APIRouter()

@Status.get("/status/{id}", tags=["Barriers Controller"])
async def get_status(id: int):

    hex_code = "55 02 02 02 65 FE"
    
    barrier_info = status_rq(id)

    if not barrier_info:
        raise HTTPException(status_code=404, detail={"errordata": 404,"message":"Barrier Not found"})
    
    ip_address, port = barrier_info

    status_response = response(ip_address, port, hex_code, "Status")

    status_codes = {
        "550a070000071000000000007d4f": "Opened",
        "550a0700000720000000000052c3": "Closed",
        "550a070000071000020000009027": "Locked",
    }

    response_code = status_response["response"]
    status_description = status_codes.get(response_code, "unlocked")

    print(status_description)
    
    return status_description
