from typing import List, Dict, Any
from .base import BaseNode
from ..utils.neo4j_client import Neo4jClient

class CardMatcher(BaseNode):
    """Node for matching credit cards to categories."""
    
    def __init__(self):
        """Initialize the card matcher with Neo4j client."""
        super().__init__()
        self.neo4j_client = Neo4jClient()
        self.log_info("Initialized CardMatcher")
    
    def match_cards(self, state: Dict[str, Any]) -> Dict[str, Any]:
        """
        Match cards to categories using Neo4j database.
        
        Args:
            state: Current workflow state
            
        Returns:
            Updated state with matching cards
        """
        try:
            categories = state["card_categories"]
            self.log_info("Matching cards to categories", {"categories": categories})
            
            matching_cards = {}
            for category in categories:
                cards = self._match_category(category)
                if cards:
                    matching_cards[category] = cards
            
            self.log_info("Successfully matched cards", 
                         {"categories": list(matching_cards.keys())})
            
            return {
                "matching_card_names": list(set(
                    card for cards in matching_cards.values() 
                    for card in cards
                )),
                "cards_by_category": matching_cards
            }
            
        except Exception as e:
            self.log_error(e, {"state": state})
            return {
                "matching_card_names": [],
                "cards_by_category": {},
                "error": str(e)
            }
    
    def _match_category(self, category: str) -> List[str]:
        """
        Find cards matching a specific category.
        
        Args:
            category: Category to match
            
        Returns:
            List of matching card names
        """
        try:
            query = """
            MATCH (c:Card)
            WHERE c.category = $category
            OR EXISTS((c)-[:HAS_FEATURE]->(:Feature {name: $category}))
            OR EXISTS((c)-[:HAS_BENEFIT]->(:Benefit {name: $category}))
            OR EXISTS((c)-[:HAS_REWARD]->(:Reward {name: $category}))
            RETURN DISTINCT c.name as name
            """
            
            results = self.neo4j_client.execute_query(query, {"category": category})
            return [result["name"] for result in results]
            
        except Exception as e:
            self.log_error(e, {"category": category})
            return [] 