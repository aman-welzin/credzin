from typing import List, Dict, Any
import re
from .base import BaseNode
from ..utils.llm_client import LLMClient

class CardExtractor(BaseNode):
    """Node for extracting credit card names from user queries."""
    
    def __init__(self):
        """Initialize the card extractor with LLM client."""
        super().__init__()
        self.llm_client = LLMClient()
        self.log_info("Initialized CardExtractor")
    
    def extract_cards(self, state: Dict[str, Any]) -> Dict[str, Any]:
        """
        Extract credit card names from user query.
        
        Args:
            state: Current workflow state
            
        Returns:
            Updated state with extracted card names
        """
        try:
            user_query = state["user_query"]
            self.log_info("Extracting cards from query", {"query": user_query})
            
            # Extract cards using LLM
            prompt = f"""Extract credit card names from the following text. Return only the card names in a comma-separated list:
            Text: {user_query}
            Card names:"""
            
            response = self.llm_client.generate_response(prompt)
            card_names = self._parse_llm_response(response)
            
            self.log_info("Successfully extracted cards", {"cards": card_names})
            return {"card_names": card_names}
            
        except Exception as e:
            self.log_error(e, {"state": state})
            return {"card_names": [], "error": str(e)}
    
    def _parse_llm_response(self, response: str) -> List[str]:
        """
        Parse LLM response to extract card names.
        
        Args:
            response: LLM response text
            
        Returns:
            List of extracted card names
        """
        try:
            # Split by commas and clean up
            cards = [card.strip() for card in response.split(",")]
            # Remove any empty strings
            cards = [card for card in cards if card]
            # Remove any "and" or "&" from the last card
            if cards:
                cards[-1] = re.sub(r'\s+(and|&)\s+', '', cards[-1])
            return cards
        except Exception as e:
            self.log_error(e, {"response": response})
            return [] 