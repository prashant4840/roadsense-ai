import logging
import json
from datetime import datetime
import structlog

# Configure structured logging
structlog.configure(
    processors=[
        structlog.stdlib.filter_by_level,
        structlog.stdlib.add_logger_name,
        structlog.stdlib.add_log_level,
        structlog.stdlib.PositionalArgumentsFormatter(),
        structlog.processors.TimeStamper(fmt="iso"),
        structlog.processors.StackInfoRenderer(),
        structlog.processors.format_exc_info,
        structlog.processors.UnicodeDecoder(),
        structlog.processors.JSONRenderer(),
    ],
    context_class=dict,
    logger_factory=structlog.stdlib.LoggerFactory(),
    cache_logger_on_first_use=True,
)

logger = structlog.get_logger()

class RequestLogger:
    """Middleware to log API requests and responses"""

    async def __call__(self, scope, receive, send):
        if scope["type"] != "http":
            await send
            return

        method = scope.get("method")
        path = scope.get("path")
        client = scope.get("client", ("unknown", "unknown"))
        client_ip = client[0] if client else "unknown"

        start_time = datetime.now()

        async def send_with_logging(message):
            if message["type"] == "http.response.start":
                status = message.get("status", 500)
                end_time = datetime.now()
                duration = (end_time - start_time).total_seconds()

                logger.info(
                    "http_request",
                    method=method,
                    path=path,
                    status=status,
                    duration_ms=duration * 1000,
                    client_ip=client_ip,
                )

            await send(message)

        await scope(receive, send_with_logging)


def log_prediction(input_data, output_data, user_agent=None):
    """Log prediction request and result"""
    logger.info(
        "prediction_made",
        input=input_data,
        output=output_data,
        user_agent=user_agent,
        timestamp=datetime.now().isoformat(),
    )


def log_error(error_type, message, extra_data=None):
    """Log errors with context"""
    logger.error(
        "error_occurred",
        error_type=error_type,
        message=str(message),
        extra=extra_data or {},
        timestamp=datetime.now().isoformat(),
    )
