import logging
import os

# Setup logging
logger = logging.getLogger()

# Basic Superset DB connection
DATABASE_DIALECT = os.getenv("DATABASE_DIALECT")
DATABASE_USER = os.getenv("DATABASE_USER")
DATABASE_PASSWORD = os.getenv("DATABASE_PASSWORD")
DATABASE_HOST = os.getenv("DATABASE_HOST")
DATABASE_PORT = os.getenv("DATABASE_PORT")
DATABASE_DB = os.getenv("DATABASE_DB")

SQLALCHEMY_DATABASE_URI = (
    f"{DATABASE_DIALECT}://"
    f"{DATABASE_USER}:{DATABASE_PASSWORD}@"
    f"{DATABASE_HOST}:{DATABASE_PORT}/{DATABASE_DB}"
)

# Redis settings
REDIS_HOST = os.getenv("REDIS_HOST", "redis")
REDIS_PORT = os.getenv("REDIS_PORT", "6379")
REDIS_CELERY_DB = os.getenv("REDIS_CELERY_DB", "0")
REDIS_RESULTS_DB = os.getenv("REDIS_RESULTS_DB", "1")

RESULTS_BACKEND = "redis"
CACHE_CONFIG = {
    "CACHE_TYPE": "RedisCache",
    "CACHE_REDIS_HOST": REDIS_HOST,
    "CACHE_REDIS_PORT": REDIS_PORT,
    "CACHE_REDIS_DB": REDIS_RESULTS_DB,
}

# Celery config
class CeleryConfig:
    broker_url = f"redis://{REDIS_HOST}:{REDIS_PORT}/{REDIS_CELERY_DB}"
    result_backend = f"redis://{REDIS_HOST}:{REDIS_PORT}/{REDIS_RESULTS_DB}"

CELERY_CONFIG = CeleryConfig

# Enabling CORS for React app
ENABLE_CORS = True
CORS_OPTIONS = {
    'origins': ['http://localhost:3000'],  # React app origin
}

# Allow embedding Superset into iframe
X_FRAME_OPTIONS = 'ALLOWALL'  # Allow all to embed Superset in iframe

# Example feature flag
FEATURE_FLAGS = {"ALERT_REPORTS": True}

# WebDriver URL (for Superset UI)
WEBDRIVER_BASEURL = "http://superset:8088/"  # Superset Docker URL

# Import the docker-specific config file
try:
    import superset_config_docker
    from superset_config_docker import *  # noqa

    logger.info(f"Loaded your Docker configuration at [{superset_config_docker.__file__}]")
except ImportError:
    logger.info("Using default Docker config...")
