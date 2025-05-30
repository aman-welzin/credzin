
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
import re
from agno.run.response import RunResponse
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
# users = users_collection.find()
pipeline = [
    {
        "$lookup": {
            "from": "credit_cards",
            "localField": "CardAdded",      # array of ObjectIds on each user
            "foreignField": "_id",
            "as": "cards",
        }
    },
    { "$unwind": "$cards" },                # one document per card
    {
        "$group": {                         # back to one row per user
            "_id": "$_id",
            "firstName":   { "$first": "$firstName"   },
            "AgeRange":    { "$first": "$ageRange"    },
            "profession":  { "$first": "$profession"  },
            "salaryRange": { "$first": "$salaryRange" },
            "location":    { "$first": "$location"    },
            "card_names":  { "$addToSet": "$cards.card_name" },
        }
    },
    {
        "$project": {
            "_id": 0,               # drop Mongo's _id
            "user_id":    "$_id",   # rename for the front-end
            "firstName":  1,
            "AgeRange":   1,
            "profession": 1,
            "salaryRange":1,
            "location":   1,
            "card_names": 1,
        }
    },
]
# -------------------------------------------------------------------
# 3.  Execute and grab the results
# -------------------------------------------------------------------
users_with_cards = list(db.users.aggregate(pipeline, allowDiskUse=True))
for user in users_with_cards:
    print(user)
    user_id = str(user['user_id'])  
    card_names = user["card_names"]
    # id = user["_id"]
    name =  user["firstName"]
    age =  user["AgeRange"]
    profession =  user["profession"]
    income =  user["salaryRange"]
    location =  user["location"]
    # list_of_cards =  user["CardAdded"]
    print('user details:: ', user_id, name, age, profession, income, location, card_names)
    # age = 23
    # profession = 'software developer'
    # income = 15000
    # location = 'Mohali'
    # list_of_cards = ['Axis Bank Vistara Credit Card', 'Axis Bank Atlas Credit Card', 'Axis Bank Rewards Credit Card']
    #response = agent3.print_response("{name} is a {age} years old {profession} with a monthly salary of INR {income} working in {location}. He already have these credit cards {list_of_cards}. Recommend him another credit card.", stream=True, markdown=True)
    prompt = f'''You are a seasoned credit-card product specialist for the Indian market.

    **CRITICAL CONSTRAINT: You MUST only recommend cards that exist in your knowledge base. Do NOT suggest any cards not present in the provided data.**

    **Customer profile**
    • Name: {name}
    • Age: {age} years
    • Profession: {profession}
    • Monthly income: ₹ {income}
    • Location: {location}

    **Existing cards:** {card_names}

    **Task**
    1. FIRST, search your knowledge base to identify ALL available credit cards.
    2. EXCLUDE any cards the customer already owns from your consideration.
    3. Analyse the customer's profile, spending potential and current card portfolio.
    4. Identify gaps in rewards, benefits or categories not covered by the existing cards (e.g., travel, dining, fuel, subscriptions).
    5. From the REMAINING cards in your knowledge base ONLY, recommend ONE suitable credit card that best complements the current set.
    6. Justify your choice in ≤ 120 words, covering:
    • Key benefits that fill the identified gaps
    • Annual/joining fee and effective waiver options
    • Why it outperforms alternatives for this customer

    **MANDATORY RULES**
    1. Output **exactly one** card name—no lists, alternates, or "also consider" suggestions.
    2. The recommended card MUST exist in your knowledge base - verify this before responding.
    3. Do NOT recommend cards the customer already owns.
    4. Do NOT mention or compare any card other than your single recommendation.
    5. If no suitable card exists in your knowledge base, respond with "No suitable card found in available options."
    6. Follow the output template verbatim.

    **Output template** (Markdown)
    **Best Card:** *<Card Name>*
    **Why it suits {name}:** <justification>

    **Suggest only 1 card from your knowledge base and no extra text**
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

    def extract_best_card(resp_obj) -> str:
        """Return the card name or raise ValueError."""

        # 1️⃣  Get raw text out
        raw = (
            resp_obj.to_string()            # many agno objects expose this
            if hasattr(resp_obj, "to_string")
            else str(resp_obj)
        ).strip()

        # 2️⃣  Strip the Markdown noise so we can run a very plain regex
        clean = re.sub(r"[*_`]", "", raw)   # "**Best Card:**" → "Best Card:"

        # 3️⃣  Find 'Best Card:' and capture the rest of that line
        m = re.search(r"best\s*card\s*[:\-–]\s*([^\n\r]+)", clean, flags=re.I)
        if not m:
            raise ValueError("No 'Best Card' line found. Sample text:\n" + raw[:200])

        return m.group(1).strip() 
    

    best_card_name = extract_best_card(response.content)
    print("Extracted →", best_card_name)

    def get_card_id(card_name: str) -> str:
        """
        Return the card's internal ID stored in the credit_cards collection.
        Falls back to raising if no exact (case-insensitive) match is found.
        """
        card_doc = cards_collection.find_one(
            {"card_name": {"$regex": f"^{re.escape(card_name)}$", "$options": "i"}},
            projection={"_id": 1, "card_id": 1}        # only the fields we need
        )

        if not card_doc:
            raise LookupError(f"Card name '{card_name}' not found in credit_cards")

        # Decide which field you want to store.
        # • If you made your own numeric/string ID field, keep it.
        # • Otherwise just use Mongo’s own _id.
        return str(card_doc.get("card_id") or card_doc["_id"])

    card_id = get_card_id(best_card_name)
    print("Resolved card_id →", card_id)

    mycol = db["recommendations2"]
    # user_suggestion = { "_id":"682c46b8f4a86be58de43b95", "suggestion": response.to_string() }
    # print(user_suggestion)
    #result = mycol.insert_one({ "_id" : user_collection["_id"], 'suggestion':user_suggestion["suggestion"]})

    query   = {"user_id": user_id}   # “primary key”
    update  = {
        "$set": {
            "card_id": card_id,
            "card_name":  best_card_name,
            "suggestion": response.content
        }
    }

    result = mycol.update_one(query, update, upsert=True)
    print(result.acknowledged)
    # query_filter = { "_id" : user_suggestion["_id"] }
    # update_operation = { "$set" : 
    #     { "suggestion" : user_suggestion["suggestion"] }
    # }
    # result = mycol.update_many(query_filter, update_operation)
    # print(result.modified_count)