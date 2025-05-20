"""
RAG Agent: Ingests case files and performs document-based retrieval using embeddings.
"""
from src.utils.config import *

def rag_agent(input):
    """
    Uses the LangChain Ollama LLaMA 3.2 model for Retrieval-Augmented Generation (RAG).
    """
    logger.info("Executing RAG pipeline")

    if "case_data" not in input:
        logger.error("Missing 'case_data' in input. Cannot proceed with RAG pipeline.")
        return {"error": "Missing 'case_data' in input."}

    try:
        case_data = input["case_data"]
        prompt = (
                    "You are a legal analyst reviewing a case document. Extract **all** relevant information in a structured manner. "
                    "Do **not** skip or summarize — ensure every detail is captured.\n\n"
                    "Document:\n"
                    f"{case_data}\n\n"
                    "Instructions:\n"
                    "- Extract: charges, IPC sections, dates, times, locations, names (accused, victim, officers), FIR details, witness statements, and investigation findings.\n"
                    "- Identify: case background, sequence of events, evidence collected, legal proceedings, and current case status.\n"
                    "- Note: even minor details like item descriptions, vehicle numbers, or procedural actions.\n"
                    "- Format clearly with headings or bullet points.\n\n"
                    "Begin your extraction below:"
                )

        # Invoke the model
        response = LLM.invoke(prompt)
        print_llm_response(response)

        retrieved_data = response.content 
        logger.info(f"RAG pipeline result:\n {retrieved_data}")

        return {"retrieved_data": retrieved_data}
    
    except ConnectionError as ce:
        logger.error(f"ConnectionError during RAG operation: {ce}")
        return {"error": "ConnectionError occurred during RAG operation."}
    except Exception as e:
        logger.error(f"Unexpected error in RAG operation: {e}")
        return {"error": "An unexpected error occurred during RAG operation."}