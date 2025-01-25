from pydantic import BaseModel, ValidationError
from typing import List

class CreateChaptersSchema(BaseModel):
    title: str
    units: List[str]

def create_chapters_schema(title, units):
    try:
        schema = CreateChaptersSchema(title=title, units=units)
        return schema.dict()
    except ValidationError as e:
        print(e.json())
        raise e