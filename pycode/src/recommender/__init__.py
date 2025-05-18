from langgraph.graph import StateGraph, END
from models.state import CardGraphState
from nodes.card_extractor import CardExtractor
from nodes.card_fetcher import CardFetcher
from nodes.card_summarizer import CardSummarizer
from nodes.category_analyzer import CategoryAnalyzer
from nodes.card_matcher import CardMatcher
from nodes.recommendation_engine import RecommendationEngine

def create_workflow():
    # Initialize nodes
    extractor = CardExtractor()
    fetcher = CardFetcher()
    summarizer = CardSummarizer()
    analyzer = CategoryAnalyzer()
    matcher = CardMatcher()
    recommender = RecommendationEngine()

    # Create workflow
    workflow = StateGraph(CardGraphState)

    # Add nodes
    workflow.add_node("ExtractCardNames", extractor.extract_card_names)
    workflow.add_node("FetchCardDetails", fetcher.fetch_card_details)
    workflow.add_node("SummarizeCards", summarizer.summarize_card)
    workflow.add_node("AnalyzeCardSummaries", analyzer.analyze_single_card_summary)
    workflow.add_node("QueryMissingCategoryCards", matcher.query_cards_by_category)
    workflow.add_node("RecommendCards", recommender.recommend_cards_by_category)

    # Define edges
    workflow.add_edge("ExtractCardNames", "FetchCardDetails")
    workflow.add_edge("FetchCardDetails", "SummarizeCards")
    workflow.add_edge("SummarizeCards", "AnalyzeCardSummaries")
    workflow.add_edge("AnalyzeCardSummaries", "QueryMissingCategoryCards")
    workflow.add_edge("QueryMissingCategoryCards", "RecommendCards")
    workflow.add_edge("RecommendCards", END)

    return workflow.compile()

def run_recommendation(user_query: str):
    """
    Run the credit card recommendation pipeline
    """
    app = create_workflow()
    
    inputs = {
        "user_query": user_query
    }

    for output in app.stream(inputs):
        for node_name, value in output.items():
            print(f"\n🔹 Node '{node_name}':")
            print(value) 