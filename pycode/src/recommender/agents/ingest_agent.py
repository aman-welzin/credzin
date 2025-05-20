"""
Ingest Agent: Reads a case file, extracts its content, and prepares it for further processing.
"""
import os
from src.utils.config import *

from langchain.text_splitter import RecursiveCharacterTextSplitter
from docx import Document
from PyPDF2 import PdfReader

def ingest_case_data(file_path):
    try:
        # Placeholder for ingestion logic
        pass
    except FileNotFoundError as fnfe:
        logging.error(f"File not found during ingestion: {fnfe}")
    except Exception as e:
        logging.error(f"Unexpected error in case data ingestion: {e}")

def ingest_agent(input: dict) -> dict:
    """
    Reads case files of various types (PDF, DOC, TXT), extracts their content, and splits it into chunks for further processing.

    Args:
        input (dict): A dictionary containing the path to the case file under the key 'case_path'.

    Returns:
        dict: A dictionary containing the extracted case data and its chunks.
    """
    logger.info("Ingesting case file.")
    case_path = input["case_path"]
    file_extension = os.path.splitext(case_path)[1].lower()

    # Initialize case_data
    case_data = ""

    try:
        if file_extension == ".pdf":
            try:
                logger.info("Detected PDF file. Using PyPDF2.")
                reader = PdfReader(case_path)
                case_data = " ".join([page.extract_text() for page in reader.pages])
            except Exception as e:
                logger.error(f"Error reading PDF file: {e}")
                return {"error": str(e)}

        elif file_extension == ".doc" or file_extension == ".docx":
            try:
                logger.info("Detected Word document. Using python-docx.")
                doc = Document(case_path)
                case_data = " ".join([paragraph.text for paragraph in doc.paragraphs])
            except Exception as e:
                logger.error(f"Error reading Word file: {e}")
                return {"error": str(e)}

        elif file_extension == ".txt":
            try:
                logger.info("Detected text file. Reading content.")
                with open(case_path, "r", encoding="utf-8") as file:
                    case_data = file.read()
            except Exception as e:
                logger.error(f"Error reading text file: {e}")
                return {"error": str(e)}

        else:
            logger.error("Unsupported file type.")
            return {"error": "Unsupported file type."}

        # Split the case data into chunks for further processing
        text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
        chunks = text_splitter.split_text(case_data)
        logger.info(f"Split case data into {len(chunks)} chunks.")

        # Save the extracted data as Markdown in resources/converted/
        converted_dir = "resources/Translated"
        os.makedirs(converted_dir, exist_ok=True)
        output_file = os.path.join(converted_dir, os.path.basename(case_path).replace(file_extension, ".md"))
        with open(output_file, "w", encoding="utf-8") as md_file:
            md_file.write(f"# Extracted Case Data\n\n{case_data}")
        logger.info(f"Converted file saved as Markdown at {output_file}.")

        # Limit chunks to the top 2 and log their lengths
        top_chunks = chunks[:2]
        for i, chunk in enumerate(top_chunks):
            logger.info(f"Chunk {i + 1} length: {len(chunk)}")

        return {"case_data": case_data, "chunks": top_chunks}

    except FileNotFoundError as fnfe:
        logger.error(f"File not found during ingestion: {fnfe}")
        return {"error": str(fnfe)}
    except Exception as e:
        logger.error(f"Unexpected error in case data ingestion: {e}")
        return {"error": str(e)}