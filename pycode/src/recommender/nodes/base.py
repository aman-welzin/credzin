import logging
from functools import lru_cache
from typing import Any, Dict, Optional
from ..utils.config import settings

class BaseNode:
    """Base class for all nodes in the recommendation system."""
    
    def __init__(self):
        """Initialize the base node with logging configuration."""
        self.logger = logging.getLogger(self.__class__.__name__)
        self._setup_logging()
    
    def _setup_logging(self):
        """Configure logging for the node."""
        handler = logging.StreamHandler()
        formatter = logging.Formatter(settings.LOG_FORMAT)
        handler.setFormatter(formatter)
        self.logger.addHandler(handler)
        self.logger.setLevel(settings.LOG_LEVEL)
    
    @lru_cache(maxsize=settings.CACHE_SIZE)
    def cached_method(self, method_name: str, *args, **kwargs) -> Any:
        """Generic caching decorator for methods."""
        method = getattr(self, method_name)
        return method(*args, **kwargs)
    
    def log_error(self, error: Exception, context: Optional[Dict] = None):
        """Log an error with optional context."""
        error_msg = f"Error in {self.__class__.__name__}: {str(error)}"
        if context:
            error_msg += f" Context: {context}"
        self.logger.error(error_msg)
    
    def log_info(self, message: str, context: Optional[Dict] = None):
        """Log an info message with optional context."""
        if context:
            message += f" Context: {context}"
        self.logger.info(message)
    
    def log_debug(self, message: str, context: Optional[Dict] = None):
        """Log a debug message with optional context."""
        if context:
            message += f" Context: {context}"
        self.logger.debug(message) 