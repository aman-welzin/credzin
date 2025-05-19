# credzin
An app to optimize credit card spends
Credit Card Recommendation System
A modular and extensible system for recommending credit cards based on user preferences and existing cards.


# MVP Features


# ToDo's
## Web App
create a new log file with date_time for every run and write logs to /output/logs dir
separate log file for each process/module: scraper, data loader, rag & llm  
use relative path everywhere and make sure it runs in all the systems by auto-detection

## Knowledge base
Scrape all the banks
Scrape similar sites
File reader for pdf, md
create a qdrant loader for embeddings
build metadata for all the banks
Scheduler for weekly, monthly data pull
Pull offers data and card eligibilty data 

## Recommendor/RAG/Agent AI
Complete the RAG pipeline for card recommendation
build a chatbot on the KB for user-card random queries
Post generator using KB




 










## Features

- Extracts credit card names from natural language queries
- Fetches detailed card information from Neo4j database
- Generates human-readable summaries of card features and benefits
- Analyzes card categories and identifies missing categories
- Matches cards to specific categories
- Provides personalized recommendations based on user's existing cards

## Architecture

The system is built using a modular architecture with the following components:

### Nodes

- `CardExtractor`: Extracts credit card names from user queries
- `CardFetcher`: Fetches card details from Neo4j database
- `CardSummarizer`: Generates human-readable summaries of cards
- `CategoryAnalyzer`: Analyzes card categories and benefits
- `CardMatcher`: Matches cards to specific categories
- `RecommendationEngine`: Generates personalized recommendations

### Utilities

- `Neo4jClient`: Manages Neo4j database connections and queries
- `LLMClient`: Handles interactions with language models
- `Config`: Centralizes configuration settings



# Steps to run the scrapers
# Steps to run the RAG and Agents
## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Set up environment variables:
```bash
# Neo4j settings
_URI=bolt://localhost:7687
_USER=neo4j
_PASSWORD=your_password

# LLM settings
LLM_BASE_URL=http://localhost:11434
LLM_MODEL=llama3.2
```

3. Run tests:
```bash
pytest tests/
```

## Usage

```python
from recommender.nodes.card_extractor import CardExtractor
from recommender.nodes.card_fetcher import CardFetcher
from recommender.nodes.card_summarizer import CardSummarizer
from recommender.nodes.category_analyzer import CategoryAnalyzer
from recommender.nodes.card_matcher import CardMatcher
from recommender.nodes.recommendation_engine import RecommendationEngine

# Initialize nodes
extractor = CardExtractor()
fetcher = CardFetcher()
summarizer = CardSummarizer()
analyzer = CategoryAnalyzer()
matcher = CardMatcher()
engine = RecommendationEngine()

# Process user query
state = {
    "user_query": "I have the SBI Card PRIME, Gold Card, and BYOC Credit Card. Suggest better options.",
    "user_cards": ["SBI Card PRIME", "Gold Card", "BYOC Credit Card"]
}

# Execute workflow
state.update(extractor.extract_cards(state))
state.update(fetcher.fetch_card_details(state))
state.update(summarizer.summarize_cards(state))
state.update(analyzer.analyze_cards(state))
state.update(matcher.match_cards(state))
state.update(engine.generate_recommendations(state))

# Get recommendations
recommendations = state["final_recommendations"]
```

## Testing

The system includes comprehensive tests for each component:

```bash
# Run all tests
pytest tests/

# Run specific test
pytest tests/test_recommender.py::test_card_extractor
```


# Steps to run the web app



## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License 

