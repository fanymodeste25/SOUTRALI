"""
Custom exception handlers for API.
"""
from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status
import logging

logger = logging.getLogger(__name__)


def custom_exception_handler(exc, context):
    """
    Custom exception handler for DRF.

    Returns consistent error responses across the API.
    """
    # Call REST framework's default exception handler first
    response = exception_handler(exc, context)

    if response is not None:
        # Customize the response format
        custom_response_data = {
            'success': False,
            'error': {
                'message': str(exc),
                'details': response.data if isinstance(response.data, dict) else {'detail': response.data}
            }
        }
        response.data = custom_response_data

    else:
        # Handle unexpected exceptions
        logger.exception("Unhandled exception", exc_info=exc)
        custom_response_data = {
            'success': False,
            'error': {
                'message': 'An unexpected error occurred. Please try again later.',
                'details': {}
            }
        }
        response = Response(custom_response_data, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    return response
