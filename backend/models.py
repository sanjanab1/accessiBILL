from pydantic import BaseModel

class PersonalizationRequest(BaseModel):
    input_data: str  # Raw input containing both bill summary and user context

class PersonalizationResponse(BaseModel):
    personalized_impact: str
    impact_tags: dict