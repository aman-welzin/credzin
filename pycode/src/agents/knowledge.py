from agno.knowledge.csv import CSVKnowledgeBase
from agno.knowledge.pdf import PDFKnowledgeBase, PDFReader
from agno.knowledge.combined import CombinedKnowledgeBase
from agno.vectordb.chroma import ChromaDb
from agno.agent import Agent
from agno.models.ollama import Ollama
from agno.embedder.sentence_transformer import SentenceTransformerEmbedder
import pymongo
from agno.tools.thinking import ThinkingTools
from agno.tools.reasoning import ReasoningTools

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


#agent3.print_response("I am a 30 years old software engineer with a monthly salary of INR 1,00,000 working in Bangalore. I already have axis bank rewards credit card and axis bank atlas credit card. Suggest me another credit card.", stream=True, markdown=True)
#agent3.print_response('get all the features and details of Axis Bank Vistara Credit Card', stream=True, markdown=True)


myclient = pymongo.MongoClient("mongodb+srv://Welzin:yYsuyoXrWcxPKmPV@welzin.1ln7rs4.mongodb.net/credzin?retryWrites=true&w=majority&appName=Welzin")
db = myclient["credzin"]       
users_collection = db["users"]           
all_users = list(users_collection.find({}))  

cards_collection = db["credit_cards"]
users = users_collection.find()

def populate_cards(user):
    populated_cards = []
    for card_id in user.get("CardAdded", []):
        card = cards_collection.find_one({"_id": card_id})
        if card:
            card['_id'] = str(card['_id'])
            populated_cards.append(card)
            print(populated_cards)
    return populated_cards

for user in users:
    user['_id'] = str(user['_id'])  
    user['CardAdded'] = populate_cards(user)
    id = user["_id"]
    name =  user["firstName"]
    age =  user["ageRange"]
    profession =  user["profession"]
    income =  user["salaryRange"]
    location =  user["location"]
    list_of_cards =  user["CardAdded"]
    print('user details:: ', name, age, profession, income, location, list_of_cards)

    # age = 23
    # profession = 'software developer'
    # income = 15000
    # location = 'Mohali'
    # list_of_cards = ['Axis Bank Vistara Credit Card', 'Axis Bank Atlas Credit Card', 'Axis Bank Rewards Credit Card']

    #response = agent3.print_response("{name} is a {age} years old {profession} with a monthly salary of INR {income} working in {location}. He already have these credit cards {list_of_cards}. Recommend him another credit card.", stream=True, markdown=True)
    prompt = f''' You are a seasoned credit-card product specialist for the Indian market.
                **Customer profile**
                • Name: {name}
                • Age: {age} years
                • Profession: {profession}
                • Monthly income: ₹ {income}
                • Location: {location}
                **Existing cards:** {list_of_cards}
                **Task**
                1. Analyse the customer's profile, spending potential and current card portfolio.
                2. Identify gaps in rewards, benefits or categories not covered by the existing cards (e.g., travel, dining, fuel, subscriptions).
                3. Recommend ONE suitable credit card issued in India that best complements the current set.
                4. Justify your choice in ≤ 120 words, covering:
                • Key benefits that fill the identified gaps
                • Annual/joining fee and effective waiver options
                • Why it outperforms alternatives for this customer
                **Important rules**
                1. Output **exactly one** card name—no lists, alternates, or "also consider" suggestions.
                2. Do *not* mention or compare any card other than your single recommendation. 
                3. Follow the output template verbatim.
                **Output template** (Markdown)
                **Best Card:** *<Card Name>*
                **Why it suits {name}:** <justification>
                **Suggest only 1 card and no extra text**
            '''
    # response = agent3.print_response(
    #                                 prompt,
    #                                 stream=True,
    #                                 markdown=True,
    #                                 )

    agent3 = Agent(
        description="You are a credit card expert and analyser",
        #instructions=["Give customer suggestions based on the credit card features using the knowledge base. Only show 1 card as suggestion and no extra text"],
        instructions=[prompt],
        #knowledge=combined_knowledge_base,
        knowledge=csv_knowledge_base,
        search_knowledge=True,
        model=Ollama(id="llama3.2"),
        #reasoning_model=Ollama(id="deepseek-r1:1.5b"),
        #tools=[ThinkingTools(add_instructions=True)],
        tools=[ReasoningTools(add_instructions=True)],
        #tools=[ThinkingTools(add_instructions=True), ReasoningTools(add_instructions=True)],
        markdown=True,
        debug_mode=True,
    )
    agent3.knowledge.load(recreate=False)

    response = agent3.run('recommend only 1 credit card name', stream=False, markdown=True)
    print('Agent response:: ', response.content)
    print(type(response))


    mycol = db["recommendations1"]
    # user_suggestion = { "_id":"682c46b8f4a86be58de43b95", "suggestion": response.to_string() }
    # print(user_suggestion)
    #result = mycol.insert_one({ "_id" : user_collection["_id"], 'suggestion':user_suggestion["suggestion"]})

    result = mycol.insert_one({ "_id" : id, 'card_id':'12345', 'card_name':'Axis card test', 'suggestion':response.content})
    print(result.acknowledged)

    # query_filter = { "_id" : user_suggestion["_id"] }
    # update_operation = { "$set" : 
    #     { "suggestion" : user_suggestion["suggestion"] }
    # }
    # result = mycol.update_many(query_filter, update_operation)
    # print(result.modified_count)
