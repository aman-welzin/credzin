#from pathlib import Path

from agno.agent import Agent
from agno.models.ollama import Ollama
from agno.team.team import Team
from agno.tools.duckduckgo import DuckDuckGoTools
from agno.tools.newspaper4k import Newspaper4kTools

#urls_file = Path(__file__).parent.joinpath("tmp", "urls__{session_id}.md")
#urls_file.parent.mkdir(parents=True, exist_ok=True)


searcher = Agent(
    name="Searcher",
    role="Searches the top URLs for a topic",
    model=Ollama(id="llama3.2"),
    instructions=[
        "Given a topic, first generate a list of 3 search terms related to that topic.",
        "For each search term, search the web and analyze the results.Return the 10 most relevant URLs to the topic.",
        "You are writing for the Fintech firm Credzin, so the quality of the sources is important.",
    ],
    tools=[DuckDuckGoTools()],
    add_datetime_to_instructions=True,
)
writer = Agent(
    name="Writer",
    role="Writes a high-quality article",
    model=Ollama(id="llama3.2"),
    description=(
        "You are a senior finance writer for the Credzin fintech firm. Given a topic and a list of URLs, "
        "your goal is to write a high-quality professional article on the topic."
    ),
    instructions=[
        "First read all urls using `read_article`."
        "Then write a high-quality professional article on the topic."
        "The article should be well-structured, informative, engaging and catchy.",
        "Ensure the length is at least as long as a cover story -- at a minimum, 10 paragraphs.",
        "Ensure you provide a nuanced and balanced opinion, quoting facts where possible.",
        "Focus on clarity, coherence, and overall quality.",
        "Never make up facts or plagiarize. Always provide proper attribution.",
        "Remember: you are writing for the fintech firm, so the quality of the article is important.",
    ],
    tools=[Newspaper4kTools()],
    add_datetime_to_instructions=True,
)

editor = Team(
    name="Editor",
    mode="coordinate",
    model=Ollama(id="llama3.2"),
    members=[searcher, writer],
    show_tool_calls=True,
    description="You are a senior finctech news editor. Given a topic, your goal is to write a professional article.",
    instructions=[
        "First ask the search journalist to search for the most relevant URLs for that topic.",
        "Then ask the writer to get an engaging draft of the article.",
        "Edit, proofread, and refine the article to ensure it meets the high standards of the fintech industry.",
        "The article should be extremely articulate and well written. "
        "Focus on clarity, coherence, and overall quality.",
        "Remember: you are the final gatekeeper before the article is published, so make sure the article is perfect.",
    ],
    add_datetime_to_instructions=True,
    #send_team_context_to_members=True,
    markdown=True,
    debug_mode=True,
    show_members_responses=True,
)
editor.print_response("Write an article with full explaination and details about the Axis Bank Vistara Credit Card.", stream=True)