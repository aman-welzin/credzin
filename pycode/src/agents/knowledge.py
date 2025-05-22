from agno.knowledge.csv import CSVKnowledgeBase
from agno.knowledge.pdf import PDFKnowledgeBase, PDFReader
from agno.vectordb.chroma import ChromaDb
from agno.agent import Agent
from agno.models.ollama import Ollama
from agno.embedder.sentence_transformer import SentenceTransformerEmbedder
from agno.embedder.huggingface import HuggingfaceCustomEmbedder


# Initialize the local embedder
#hf_token='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'
#embedder = HuggingfaceCustomEmbedder(id="sentence-transformers/all-MiniLM-L6-v2",
#                                     api_key=hf_token)
embedder = SentenceTransformerEmbedder(id="all-MiniLM-L6-v2")


# Initialize ChromaDB with the local embedder
vector_db = ChromaDb(
    collection="recipes",
    path="tmp/chromadb",
    persistent_client=True,
    embedder=embedder
)

# Create knowledge base
knowledge_base = PDFKnowledgeBase(
    path="/Users/aman/Welzin/dev/credzin/KnowledgeBase/banks/AxisBank/pdf",
    vector_db=vector_db,
    reader=PDFReader(),
)

# Create and use the agent
agent = Agent(knowledge=knowledge_base, 
              #search_knowledge=True,
              model=Ollama(id="llama3.2"),
              show_tool_calls=True)

agent.knowledge.load(recreate=False)
agent.print_response("List all the features of 'axis bank Indian oil' credit card", markdown=True)