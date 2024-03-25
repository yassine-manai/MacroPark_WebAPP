import uvicorn

from fastapi import FastAPI
from fastapi_standalone_docs import StandaloneDocs
from Elka.close_barrier import Close_barrier
from Elka.open_barrier import Open_barrier
from Endpoints.barrier_Endpoint import Add_barrier
from Endpoints.barrier_Endpoint import Delete_barrier
from Endpoints.barrier_Endpoint import Barrier_List, BarrierById
from Endpoints.barrier_Endpoint import Modify_barrier
from Config.config import APP_PORT
from Events.Get_Events import Event_List, EventById
from fastapi.middleware.cors import CORSMiddleware



tags_metadata = [
    {
        "name": "Barriers Data",
        "description": "CRUD Operations for barriers data",
    },
    {
        "name": "Barriers Controller",
        "description": "Action for barrier : OPEN & CLOSE",
    },
    {
        "name": "Events",
        "description": "All Events for barrier",
    },
]


app = FastAPI(title="Barriers",openapi_tags=tags_metadata,docs_url="/swagger", redoc_url=None)
StandaloneDocs(app=app)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS", "PUT", "DELETE"], 
    allow_headers=["Content-Type"], 
)

#Barrier Controller Endpoints
app.include_router(Open_barrier)
app.include_router(Close_barrier)

#Barrier Data Endpoints
app.include_router(Add_barrier)
app.include_router(BarrierById)
app.include_router(Barrier_List)
app.include_router(Modify_barrier)
app.include_router(Delete_barrier)

#Events Data Endpoints
app.include_router(Event_List)
app.include_router(EventById)


#APP Runner
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=APP_PORT, reload=True)