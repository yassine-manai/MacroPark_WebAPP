import uvicorn

from fastapi.staticfiles import StaticFiles
from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import HTMLResponse
from fastapi_standalone_docs import StandaloneDocs
from fastapi.middleware.cors import CORSMiddleware

from jinja2 import Environment, FileSystemLoader, TemplateNotFound

from Elka.open_barrier import Open_barrier
from Elka.close_barrier import Close_barrier
from Elka.status_barrier import Status
from Elka.unlock_barrier import Unlock_barrier
from Elka.lock_barrier import Lock_barrier

from Endpoints.barrier_Endpoint import *
from Events.Get_Events import *
from Events.Delete_Event import *
from auth.Users.users import *
from auth.Guests.guests import *


from Config.config import APP_PORT



tags_metadata = [
    {
        "name": "Users",
        "description": "All Users Company",
    },
    {
        "name": "Guests",
        "description": "All Guests Company",
    },
    {
        "name": "Barriers Data",
        "description": "CRUD Operations for barriers data",
    },
    {
        "name": "Barriers Controller",
        "description": "Action for barrier: OPEN & CLOSE & LOCK & UNLOCK operations",
    },
    {
        "name": "Events",
        "description": "All Events for barrier",
    },
]

# Initialize FastAPI application
app = FastAPI(
    title="Scheidt & Bachmann - Parking Managment System ",
    openapi_tags=tags_metadata,
    redoc_url=None
)

StandaloneDocs(app=app)
    
templates = Environment(loader=FileSystemLoader("static"))

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["Content-Type"],
)


app.mount("/static", StaticFiles(directory="static"), name="static")


# Users Data Endpoints
app.include_router(Add_User)
app.include_router(UserByEmail)
app.include_router(UserById)
app.include_router(User_List)
app.include_router(Login_User)
app.include_router(Modify_User)
app.include_router(Modify_Web)
app.include_router(Delete_User)

# Guests Data Endpoints
app.include_router(Add_Guest)
app.include_router(Get_Guests)
app.include_router(Delete_Guest)
app.include_router(GuestByEmail)
app.include_router(GuestById)
app.include_router(Approuve_Guest)

# Barrier Controller Endpoints
app.include_router(Open_barrier)
app.include_router(Close_barrier)
app.include_router(Lock_barrier)
app.include_router(Unlock_barrier)
app.include_router(Status)


# Barrier Data Endpoints
app.include_router(Add_barrier)
app.include_router(BarrierById)
app.include_router(Barrier_List)
app.include_router(Modify_barrier)
app.include_router(Delete_barrier)

# Events Data Endpoints
app.include_router(Event_List)
app.include_router(EventById)
app.include_router(Delete_event)
app.include_router(Delete_all_event)



# Define route to render Jinja2 templates
@app.get("/")
@app.get("/login.html", tags=["UI"])
async def render_template(request: Request):
    try:
        template = templates.get_template("login.html")
        content = template.render(title="Login")
        
        return HTMLResponse(content=content)
    except TemplateNotFound:
        raise HTTPException(status_code=404, detail="Template not found")
    

@app.get("/")
@app.get("/index.html", tags=["UI"])
async def render_template(request: Request):
    try:
        template = templates.get_template("index.html")
        content = template.render(title="Welcome to Barriers")
        
        return HTMLResponse(content=content)
    except TemplateNotFound:
        raise HTTPException(status_code=404, detail="Template not found")

@app.get("/")
@app.get("/events.html", tags=["UI"])
async def render_template(request: Request):
    try:
        template = templates.get_template("events.html")
        content = template.render(title="Welcome to Barriers")
        
        return HTMLResponse(content=content)
    except TemplateNotFound:
        raise HTTPException(status_code=404, detail="Template not found")

@app.get("/")
@app.get("/test.html", tags=["UI"])
async def render_template(request: Request):
    try:
        template = templates.get_template("test.html")
        content = template.render(title="Welcome to Barriers")
        
        return HTMLResponse(content=content)
    except TemplateNotFound:
        raise HTTPException(status_code=404, detail="Template not found")
    
@app.get("/")
@app.get("/stats.html", tags=["UI"])
async def render_template(request: Request):
    try:
        template = templates.get_template("stats.html")
        content = template.render(title="Welcome to Barriers")
        
        return HTMLResponse(content=content)
    except TemplateNotFound:
        raise HTTPException(status_code=404, detail="Template not found")

# APP Runner
if __name__ == "__main__":  
    uvicorn.run("main:app", host="0.0.0.0", port=APP_PORT, reload=True)