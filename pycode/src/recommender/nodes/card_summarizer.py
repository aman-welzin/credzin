from typing import List, Dict, Any
from .base import BaseNode
from ..utils.llm_client import LLMClient

class CardSummarizer(BaseNode):
    """Node for summarizing credit card details using LLM."""
    
    def __init__(self):
        """Initialize the card summarizer with LLM client."""
        super().__init__()
        self.llm_client = LLMClient()
        self.log_info("Initialized CardSummarizer")
    
    def summarize_cards(self, state: Dict[str, Any]) -> Dict[str, Any]:
        """
        Summarize card details using LLM.
        
        Args:
            state: Current workflow state
            
        Returns:
            Updated state with card summaries
        """
        try:
            card_details_list = state["card_details_list"]
            self.log_info("Summarizing cards", {"count": len(card_details_list)})
            
            card_summaries = {}
            for card_details in card_details_list:
                summary = self._summarize_single_card(card_details)
                if summary:
                    card_summaries[card_details["name"]] = summary
            
            self.log_info("Successfully summarized cards", 
                         {"count": len(card_summaries)})
            return {"card_summaries": card_summaries}
            
        except Exception as e:
            self.log_error(e, {"state": state})
            return {"card_summaries": {}, "error": str(e)}
    
    def _summarize_single_card(self, card_details: Dict[str, Any]) -> str:
        """
        Generate a summary for a single card.
        
        Args:
            card_details: Dictionary containing card details
            
        Returns:
            Generated summary text
        """
        try:
            prompt = f"""Summarize the following credit card details in a concise and informative way:

            Card Name: {card_details['name']}
            Issuer: {card_details['issuer']}
            Annual Fee: {card_details['annual_fee']}
            Features: {', '.join(card_details['features'])}
            Benefits: {', '.join(card_details['benefits'])}
            Rewards: {', '.join(card_details['rewards'])}

            Focus on the key benefits and unique selling points of the card.
            """
            
            system_prompt = """You are a credit card expert. Your task is to provide clear, 
            concise summaries of credit cards, highlighting their most valuable features and benefits."""
            
            summary = self.llm_client.generate_response(prompt, system_prompt)
            return summary.strip()
            
        except Exception as e:
            self.log_error(e, {"card_details": card_details})
            return None 