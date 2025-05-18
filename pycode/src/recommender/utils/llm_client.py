from langchain_community.chat_models import ChatOllama
from langchain_core.messages import HumanMessage, SystemMessage
from typing import List, Dict, Any, Optional
import logging
import asyncio
from .config import settings

class LLMClient:
    """Client for interacting with LLM models."""
    
    def __init__(self):
        """Initialize LLM client with configuration."""
        self.logger = logging.getLogger(self.__class__.__name__)
        self.llm = ChatOllama(
            base_url=settings.LLM_BASE_URL,
            temperature=settings.LLM_TEMPERATURE,
            model=settings.LLM_MODEL
        )
        self.logger.info(f"Initialized LLM client with model: {settings.LLM_MODEL}")
    
    def generate_response(self, prompt: str, system_prompt: Optional[str] = None) -> str:
        """
        Generate a response from the LLM.
        
        Args:
            prompt: The input prompt
            system_prompt: Optional system prompt
            
        Returns:
            Generated response text
        """
        try:
            messages = []
            if system_prompt:
                messages.append(SystemMessage(content=system_prompt))
            messages.append(HumanMessage(content=prompt))
            
            response = self.llm.invoke(messages)
            return response.content
        except Exception as e:
            self.log_error(e, {"prompt": prompt})
            raise
    
    async def generate_response_async(self, prompt: str, system_prompt: Optional[str] = None) -> str:
        """
        Generate a response from the LLM asynchronously.
        
        Args:
            prompt: The input prompt
            system_prompt: Optional system prompt
            
        Returns:
            Generated response text
        """
        try:
            messages = []
            if system_prompt:
                messages.append(SystemMessage(content=system_prompt))
            messages.append(HumanMessage(content=prompt))
            
            # Run the LLM call in a thread pool to avoid blocking
            response = await asyncio.get_event_loop().run_in_executor(
                None, lambda: self.llm.invoke(messages)
            )
            return response.content
        except Exception as e:
            self.log_error(e, {"prompt": prompt})
            raise
    
    def log_error(self, error: Exception, context: Optional[Dict] = None):
        """Log an error with context."""
        error_msg = f"LLM error: {str(error)}"
        if context:
            error_msg += f" Context: {context}"
        self.logger.error(error_msg) 