import pytest
from ..nodes.card_extractor import CardExtractor
from ..nodes.card_fetcher import CardFetcher
from ..nodes.card_summarizer import CardSummarizer
from ..nodes.category_analyzer import CategoryAnalyzer
from ..nodes.card_matcher import CardMatcher
from ..nodes.recommendation_engine import RecommendationEngine

@pytest.fixture
def sample_state():
    """Create a sample state for testing."""
    return {
        "user_query": "I have the SBI Card PRIME, Gold Card, and BYOC Credit Card. Suggest better options.",
        "card_names": ["SBI Card PRIME", "Gold Card", "BYOC Credit Card"],
        "user_cards": ["SBI Card PRIME", "Gold Card", "BYOC Credit Card"],
        "card_details_list": [
            {
                "name": "SBI Card PRIME",
                "issuer": "SBI",
                "annual_fee": "₹2,999",
                "features": ["Travel Insurance", "Lounge Access"],
                "benefits": ["Reward Points", "Cashback"],
                "rewards": ["Travel", "Shopping"]
            },
            {
                "name": "Gold Card",
                "issuer": "HDFC",
                "annual_fee": "₹2,500",
                "features": ["Fuel Surcharge Waiver", "EMI Facility"],
                "benefits": ["Reward Points", "Welcome Benefits"],
                "rewards": ["Fuel", "Dining"]
            }
        ],
        "card_summaries": {
            "SBI Card PRIME": "Premium travel card with lounge access and travel insurance.",
            "Gold Card": "Versatile card with fuel surcharge waiver and dining rewards."
        }
    }

def test_card_extractor(sample_state):
    """Test the card extractor node."""
    extractor = CardExtractor()
    result = extractor.extract_cards(sample_state)
    assert "card_names" in result
    assert len(result["card_names"]) > 0

def test_card_fetcher(sample_state):
    """Test the card fetcher node."""
    fetcher = CardFetcher()
    result = fetcher.fetch_card_details(sample_state)
    assert "card_details_list" in result
    assert len(result["card_details_list"]) > 0

def test_card_summarizer(sample_state):
    """Test the card summarizer node."""
    summarizer = CardSummarizer()
    result = summarizer.summarize_cards(sample_state)
    assert "card_summaries" in result
    assert len(result["card_summaries"]) > 0

def test_category_analyzer(sample_state):
    """Test the category analyzer node."""
    analyzer = CategoryAnalyzer()
    result = analyzer.analyze_cards(sample_state)
    assert "card_categories" in result
    assert "category_reasoning" in result
    assert "missing_categories" in result

def test_card_matcher(sample_state):
    """Test the card matcher node."""
    matcher = CardMatcher()
    result = matcher.match_cards(sample_state)
    assert "matching_card_names" in result
    assert "cards_by_category" in result

def test_recommendation_engine(sample_state):
    """Test the recommendation engine node."""
    engine = RecommendationEngine()
    result = engine.generate_recommendations(sample_state)
    assert "final_recommendations" in result
    assert "recommended_cards_details_by_category" in result

def test_full_workflow(sample_state):
    """Test the full recommendation workflow."""
    # Initialize nodes
    extractor = CardExtractor()
    fetcher = CardFetcher()
    summarizer = CardSummarizer()
    analyzer = CategoryAnalyzer()
    matcher = CardMatcher()
    engine = RecommendationEngine()
    
    # Execute workflow
    state = sample_state.copy()
    
    # Extract cards
    state.update(extractor.extract_cards(state))
    
    # Fetch details
    state.update(fetcher.fetch_card_details(state))
    
    # Summarize cards
    state.update(summarizer.summarize_cards(state))
    
    # Analyze categories
    state.update(analyzer.analyze_cards(state))
    
    # Match cards
    state.update(matcher.match_cards(state))
    
    # Generate recommendations
    state.update(engine.generate_recommendations(state))
    
    # Verify final state
    assert "final_recommendations" in state
    assert "recommended_cards_details_by_category" in state
    assert len(state["final_recommendations"]) > 0 