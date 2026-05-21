import os
from pathlib import Path
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.engine import URL

# Discover and load the environment configurations matching the workspace path
SCRIPT_DIR = Path(__file__).resolve().parent
ENV_PATH = SCRIPT_DIR / ".env"
load_dotenv(dotenv_path=ENV_PATH)

def get_postgres_engine():
    """Initializes an optimized SQLAlchemy engine instance connected to PostgreSQL."""
    return create_engine(
        URL.create(
            drivername="postgresql+psycopg2",
            username=os.getenv("DB_USER"),
            password=os.getenv("DB_PASSWORD"),
            host="127.0.0.1",
            port=os.getenv("DB_PORT"),
            database=os.getenv("DB_NAME")
        )
    )