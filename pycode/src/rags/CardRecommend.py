import io, ast, re, os, uuid, urllib, json, operator
from datetime import datetime
import pandas as pd
from tqdm.notebook import tqdm
import pprint
from IPython import embed
import matplotlib.font_manager
import matplotlib as mpl
from yfiles_jupyter_graphs import GraphWidget
import codecs
import base64
import PIL
from PIL import Image, ImageFont, ImageDraw, ImageColor
import textwrap
from IPython.display import Image, display
from neo4j import GraphDatabase
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings
from langchain.chains import RetrievalQA
from langchain_community.llms import Ollama
from langchain_core.prompts import ChatPromptTemplate
from langchain import PromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.messages import AIMessage, HumanMessage
from langchain_community.tools.tavily_search import TavilySearchResults
from langchain.schema import Document
from langchain.docstore import InMemoryDocstore
from langchain.retrievers import ParentDocumentRetriever
from google.colab import userdata
from langgraph.graph.message import add_messages
from langgraph.graph import END, StateGraph, START
from langchain.graphs import Neo4jGraph
from typing import List, Dict
from typing_extensions import TypedDict, Annotated
from langchain_experimental.graph_transformers import LLMGraphTransformer
from pydantic import BaseModel, Field
from langchain_community.vectorstores import Neo4jVector
from langchain_community.chat_models import ChatOllama

import warnings
warnings.filterwarnings('ignore')

os.environ["_URI"] = "neo4j+s://c64a3769.databases.neo4j.io"
os.environ["_USER"] = "neo4j"
os.environ["_PASSWORD"] = "mzP-L3pD-nGTc3hFpli2T7DsNbFA7jbp5bWHno1NSH4"