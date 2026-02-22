from pydantic import BaseModel
from typing import Dict

class UserContext(BaseModel):
    zip_code: str
    state: str
    housing_status: str  # renter / homeowner
    income_range: str
    employment_status: str
    student: bool

class PersonalizationRequest(BaseModel):
    bill_summary: str
    user_context: UserContext

class PersonalizationResponse(BaseModel):
    personalized_impact: str
    impact_tags: Dict[str, str]