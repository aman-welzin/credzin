from typing import List, Dict, Any
from .base import BaseNode
from ..utils.llm_client import LLMClient

class RecommendationEngine(BaseNode):
    """Node for generating credit card recommendations."""
    
    def __init__(self):
        """Initialize the recommendation engine with LLM client."""
        super().__init__()
        self.llm_client = LLMClient()
        self.log_info("Initialized RecommendationEngine")
    
    def generate_recommendations(self, state: Dict[str, Any]) -> Dict[str, Any]:
        """
        Generate credit card recommendations based on user cards and categories.
        
        Args:
            state: Current workflow state
            
        Returns:
            Updated state with recommendations
        """
        try:
            user_cards = state.get("user_cards", [])
            cards_by_category = state.get("cards_by_category", {})
            card_summaries = state.get("card_summaries", {})
            
            self.log_info("Generating recommendations", 
                         {"user_cards": user_cards, 
                          "categories": list(cards_by_category.keys())})
            
            recommendations = {}
            recommended_cards_details = {}
            
            for category, cards in cards_by_category.items():
                # Filter out user's existing cards
                new_cards = [card for card in cards if card not in user_cards]
                if not new_cards:
                    continue
                
                # Get summaries for new cards
                card_info = self._get_card_summaries(new_cards, card_summaries)
                if not card_info:
                    continue
                
                # Choose best card for category
                best_card = self._choose_best_card(
                    user_cards, 
                    card_info, 
                    category
                )
                
                if best_card:
                    recommendations[category] = best_card
                    recommended_cards_details[category] = card_info
            
            self.log_info("Successfully generated recommendations", 
                         {"categories": list(recommendations.keys())})
            
            return {
                "final_recommendations": recommendations,
                "recommended_cards_details_by_category": recommended_cards_details
            }
            
        except Exception as e:
            self.log_error(e, {"state": state})
            return {
                "final_recommendations": {},
                "recommended_cards_details_by_category": {},
                "error": str(e)
            }
    
    def _get_card_summaries(self, cards: List[str], 
                          card_summaries: Dict[str, str]) -> List[Dict[str, Any]]:
        """
        Get summaries for a list of cards.
        
        Args:
            cards: List of card names
            card_summaries: Dictionary of card summaries
            
        Returns:
            List of card info dictionaries
        """
        return [
            {"name": card, "summary": card_summaries.get(card, "")}
            for card in cards
            if card in card_summaries
        ]
    
    def _choose_best_card(self, user_cards: List[str], 
                         card_info: List[Dict[str, Any]], 
                         category: str) -> str:
        """
        Choose the best card for a category.
        
        Args:
            user_cards: User's existing cards
            card_info: List of card info dictionaries
            category: Category to recommend for
            
        Returns:
            Name of the best card
        """
        try:
            prompt = f"""Given the following credit cards and user's existing cards, 
            choose the best card for {category} category:

            User's Existing Cards: {', '.join(user_cards)}

            Available Cards:
            {self._format_card_info(card_info)}

            Choose the single best card that would complement the user's existing cards 
            and provide the best value for {category}. Return only the card name.
            """
            
            system_prompt = """You are a credit card expert. Your task is to recommend 
            the best credit card based on the user's existing cards and specific category needs."""
            
            response = self.llm_client.generate_response(prompt, system_prompt)
            return response.strip()
            
        except Exception as e:
            self.log_error(e, {
                "user_cards": user_cards,
                "category": category
            })
            return None
    
    def _format_card_info(self, card_info: List[Dict[str, Any]]) -> str:
        """Format card information for the prompt."""
        return "\n".join(
            f"- {info['name']}: {info['summary']}"
            for info in card_info
        ) 