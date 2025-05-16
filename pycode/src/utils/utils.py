import logging
from langchain_ollama import ChatOllama
from langchain_core.messages import AIMessage
import os
from fpdf import FPDF
from datetime import datetime

# # ANSI escape codes for colored logging
# class CustomFormatter(logging.Formatter):
#     """
#     Custom logging formatter to highlight INFO logs in orange.
#     """
#     ORANGE = "\033[33m"  # ANSI escape code for orange
#     RESET = "\033[0m"    # Reset color

#     def format(self, record):
#         log_message = super().format(record)
#         if record.levelname == "INFO":
#             log_message = log_message.replace("INFO", f"{self.ORANGE}INFO{self.RESET}")
#         return log_message


# def format_step(step_number, message):
#     """
#     Formats a step message with a step number and highlights it in green.

#     Args:
#         step_number (int): The step number.
#         message (str): The message to format.

#     Returns:
#         str: The formatted step message.
#     """
#     GREEN = "\033[92m"  # ANSI escape code for green
#     RESET = "\033[0m"   # Reset color
#     return f"{GREEN}\n\n[Step {step_number}]{RESET} {message}"


def configure_logging():
    """
    Configures the logging settings for the application.

    Returns:
        logging.Logger: Configured logger instance.
    """
    
    logger = logging.getLogger("credzin")
    logger.setLevel(logging.INFO)
    return logger


def get_llm(logger):
    """
    Returns the LLM instance configured for the application.

    Args:
        logger (logging.Logger): Logger instance for logging.

    Returns:
        ChatOllama: The LLM instance.
    """
    logger.info("Initializing LLM instance - Llama3.2 model.")
    return ChatOllama(model="llama3.2", base_url="http://localhost:11434")


def print_llm_response(logger, response):
    """
    Pretty prints an LLM response, handling different possible types.

    Args:
        logger (logging.Logger): Logger instance for logging.
        response: The LLM response object, usually AIMessage or str.
    """
    logger.info("\n" + "=" * 40 + "\nLLM Response:\n" + "=" * 40)

    if isinstance(response, AIMessage):
        logger.info(response.content.strip())
    elif isinstance(response, str):
        logger.info(response.strip())
    elif hasattr(response, 'content'):
        logger.info(response.content.strip())
    else:
        logger.warning("⚠️ Unrecognized response type. Dumping raw content:")
        logger.info(vars(response))




# Initialize logger and LLM
logger = configure_logging()
LLM = get_llm(logger)

