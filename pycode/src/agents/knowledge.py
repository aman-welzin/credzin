from agno.knowledge.csv import CSVKnowledgeBase
from agno.knowledge.pdf import PDFKnowledgeBase, PDFReader
from agno.knowledge.combined import CombinedKnowledgeBase
from agno.vectordb.chroma import ChromaDb
from agno.agent import Agent
from agno.models.ollama import Ollama
from agno.embedder.sentence_transformer import SentenceTransformerEmbedder

# Initialize the local embedder
embedder = SentenceTransformerEmbedder(id="all-MiniLM-L6-v2")

# Initialize ChromaDB with the local embedder
vector_db = ChromaDb(
    collection="pdf_docs",
    path="tmp/chromadb",
    persistent_client=True,
    embedder=embedder
)

# Create knowledge base
pdf_knowledge_base = PDFKnowledgeBase(
    path="/Users/aman/Welzin/dev/credzin/KnowledgeBase/banks/AxisBank/",
    vector_db=vector_db,
    reader=PDFReader(),
)

# Create and use the agent
# agent = Agent(knowledge=knowledge_base, 
#               search_knowledge=True,
#               model=Ollama(id="llama3.2"),
#               show_tool_calls=True)

# agent.knowledge.load(recreate=False)
#agent.print_response("List all the features of 'axis bank Indian oil' credit card", markdown=True)

vector_db2 = ChromaDb(
    collection="csv_docs",
    path="tmp/chromadb",
    persistent_client=True,
    embedder=embedder
)

csv_knowledge_base = CSVKnowledgeBase(
    path="/Users/aman/Welzin/dev/credzin/KnowledgeBase/banks/AxisBank/",
    vector_db=vector_db2
)

# agent2 = Agent(
#     knowledge=knowledge_base2,
#     search_knowledge=True,
#     model=Ollama(id="llama3.2"),
# )
# agent2.knowledge.load(recreate=False)
#agent2.print_response("Give me the list of all the available axis bank credit cards")

combined_knowledge_base = CombinedKnowledgeBase(
    sources=[
        pdf_knowledge_base,
        csv_knowledge_base
    ],

    vector_db=ChromaDb(
        collection="combined_docs",
        path="tmp/chromadb",
        persistent_client=True,
        embedder=embedder
    ),
)

agent3 = Agent(
    description="You are a credit card expert and analyser",
    instructions=["Give customer suggestions based on the credit card features using the knowledge base"],
    knowledge=combined_knowledge_base,
    search_knowledge=True,
    model=Ollama(id="llama3.2"),
    markdown=True,
    debug_mode=True,
)
agent3.knowledge.load(recreate=False)
agent3.print_response("I am a 30 years old software engineer with a monthly salary of INR 1,00,000 working in Bangalore. Suggest me one best travel credit card", stream=True, markdown=True)