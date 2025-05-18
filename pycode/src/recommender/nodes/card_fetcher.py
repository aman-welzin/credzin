from typing import List, Dict, Any
from .base import BaseNode
from ..utils.neo4j_client import Neo4jClient

class CardFetcher(BaseNode):
    """Node for fetching credit card details from Neo4j database."""
    
    def __init__(self):
        """Initialize the card fetcher with Neo4j client."""
        super().__init__()
        self.neo4j_client = Neo4jClient()
        self.log_info("Initialized CardFetcher")
    
    def fetch_card_details(self, state: Dict[str, Any]) -> Dict[str, Any]:
        """
        Fetch details for cards from Neo4j database.
        
        Args:
            state: Current workflow state
            
        Returns:
            Updated state with card details
        """
        try:
            card_names = state["card_names"]
            self.log_info("Fetching details for cards", {"cards": card_names})
            
            card_details_list = []
            for card_name in card_names:
                details = self._fetch_single_card(card_name)
                if details:
                    card_details_list.append(details)
            
            self.log_info("Successfully fetched card details", 
                         {"count": len(card_details_list)})
            return {"card_details_list": card_details_list}
            
        except Exception as e:
            self.log_error(e, {"state": state})
            return {"card_details_list": [], "error": str(e)}
    
    def _fetch_single_card(self, card_name: str) -> Dict[str, Any]:
        """
        Fetch details for a single card.
        
        Args:
            card_name: Name of the card to fetch
            
        Returns:
            Dictionary containing card details
        """
        try:
            query = """
            MATCH (c:Card {name: $card_name})
            OPTIONAL MATCH (c)-[:HAS_FEATURE]->(f:Feature)
            OPTIONAL MATCH (c)-[:HAS_BENEFIT]->(b:Benefit)
            OPTIONAL MATCH (c)-[:HAS_REWARD]->(r:Reward)
            RETURN c.name as name,
                   c.issuer as issuer,
                   c.annual_fee as annual_fee,
                   collect(distinct f.name) as features,
                   collect(distinct b.name) as benefits,
                   collect(distinct r.name) as rewards
            """
            
            results = self.neo4j_client.execute_query(query, {"card_name": card_name})
            
            if results:
                return results[0]
            else:
                self.log_info(f"No details found for card", {"card": card_name})
                return None
                
        except Exception as e:
            self.log_error(e, {"card_name": card_name})
            return None 