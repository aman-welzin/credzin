from typing import List, Dict, Any
import re
from .base import BaseNode
from ..utils.llm_client import LLMClient

class CategoryAnalyzer(BaseNode):
    """Node for analyzing credit card categories and benefits."""
    
    def __init__(self):
        """Initialize the category analyzer with LLM client."""
        super().__init__()
        self.llm_client = LLMClient()
        self.log_info("Initialized CategoryAnalyzer")
    
    def analyze_cards(self, state: Dict[str, Any]) -> Dict[str, Any]:
        """
        Analyze card summaries to extract categories and benefits.
        
        Args:
            state: Current workflow state
            
        Returns:
            Updated state with categories and reasoning
        """
        try:
            card_summaries = state["card_summaries"]
            self.log_info("Analyzing cards", {"count": len(card_summaries)})
            
            all_categories = []
            category_reasoning = {}
            missing_categories = []
            
            for card_name, summary in card_summaries.items():
                categories, reasoning = self._analyze_single_card(card_name, summary)
                all_categories.extend(categories)
                category_reasoning[card_name] = reasoning
                
                # Get missing categories
                missing = self._identify_missing_categories(categories, summary)
                missing_categories.extend(missing)
            
            # Remove duplicates
            all_categories = list(set(all_categories))
            missing_categories = list(set(missing_categories))
            
            self.log_info("Successfully analyzed cards", 
                         {"categories": all_categories, 
                          "missing": missing_categories})
            
            return {
                "card_categories": all_categories,
                "category_reasoning": category_reasoning,
                "missing_categories": missing_categories
            }
            
        except Exception as e:
            self.log_error(e, {"state": state})
            return {
                "card_categories": [],
                "category_reasoning": {},
                "missing_categories": [],
                "error": str(e)
            }
    
    def _analyze_single_card(self, card_name: str, summary: str) -> tuple[List[str], str]:
        """
        Analyze a single card's summary.
        
        Args:
            card_name: Name of the card
            summary: Card summary text
            
        Returns:
            Tuple of (categories, reasoning)
        """
        try:
            prompt = f"""Analyze the following credit card summary and identify the main categories 
            this card belongs to (e.g., Travel, Dining, Shopping, etc.) and explain why:

            Card: {card_name}
            Summary: {summary}

            Format your response as:
            Categories: [category1, category2, ...]
            Reasoning: [explanation for each category]
            """
            
            system_prompt = """You are a credit card expert. Your task is to analyze credit card 
            summaries and identify the main categories they belong to, along with clear reasoning."""
            
            response = self.llm_client.generate_response(prompt, system_prompt)
            
            # Extract categories and reasoning
            categories_match = re.search(r'Categories:\s*\[(.*?)\]', response)
            reasoning_match = re.search(r'Reasoning:\s*(.*?)(?=\n|$)', response, re.DOTALL)
            
            categories = []
            if categories_match:
                categories = [cat.strip() for cat in categories_match.group(1).split(',')]
            
            reasoning = reasoning_match.group(1).strip() if reasoning_match else ""
            
            return categories, reasoning
            
        except Exception as e:
            self.log_error(e, {"card_name": card_name})
            return [], ""
    
    def _identify_missing_categories(self, current_categories: List[str], summary: str) -> List[str]:
        """
        Identify potential missing categories based on the summary.
        
        Args:
            current_categories: Currently identified categories
            summary: Card summary text
            
        Returns:
            List of missing categories
        """
        try:
            prompt = f"""Based on the following credit card summary, suggest 2 categories that are 
            not currently identified but could be relevant:

            Current Categories: {', '.join(current_categories)}
            Summary: {summary}

            Return only the category names in a comma-separated list.
            """
            
            response = self.llm_client.generate_response(prompt)
            missing = [cat.strip() for cat in response.split(',')]
            return missing[:2]  # Return at most 2 suggestions
            
        except Exception as e:
            self.log_error(e, {"current_categories": current_categories})
            return [] 