from typing import List, Dict, TypedDict, Annotated
from typing_extensions import TypedDict
import operator

class CardGraphState(TypedDict):
    user_query: str
    card_names: Annotated[List[str], operator.add]
    user_cards: List[str]
    card_details_list: Annotated[List[dict], operator.add]
    card_summaries: Annotated[Dict[str, str], operator.or_]
    card_categories: Annotated[List[str], operator.add]
    category_reasoning: str
    missing_categories: Annotated[List[str], operator.add]
    matching_card_names: Annotated[List[str], operator.add]
    cards_info: Dict[str, List[dict]]
    cards_by_category: Dict[str, List[str]]
    final_recommendations: Dict[str, str]
    recommended_cards_details_by_category: Dict[str, List[dict]] 