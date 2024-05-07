from pydantic import BaseModel, Extra


class OnCarHandledBase(BaseModel,extra=Extra.allow):
    unitId: int
    carId: int
    triggerId: int
    grammarOk: bool
    country: str
    avgQuality: float
    carState: str
    license: str
    minQuality: float
    numberOfUnknownChars: int


class OnArrivalBase(BaseModel,extra=Extra.allow):
    triggerId: int
    country: str
    avgQuality: float
    license: str
    minQuality: float

