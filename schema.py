from sqlalchemy import text

def create_schema_if_missing(engine):
    """Executes SQL to safely prepare target database tables and analytical views."""
    schema_sql = """
    CREATE TABLE IF NOT EXISTS global_cocoa_prices (
        observation_date DATE PRIMARY KEY,
        price_usd_per_ton NUMERIC(12, 4) NOT NULL
    );

    CREATE TABLE IF NOT EXISTS chocolate_ppi (
        observation_date DATE PRIMARY KEY,
        ppi_index NUMERIC(8, 3) NOT NULL
    );

    -- An outer-joined view combining both datasets automatically for analysis
    CREATE OR REPLACE VIEW analytical_chocolate_insights AS
    SELECT 
        COALESCE(c.observation_date, p.observation_date) AS observation_date,
        c.price_usd_per_ton AS global_cocoa_price,
        p.ppi_index AS chocolate_manufacturing_ppi
    FROM global_cocoa_prices c
    FULL OUTER JOIN chocolate_ppi p ON c.observation_date = p.observation_date;
    """
    
    with engine.begin() as connection:
        connection.execute(text(schema_sql))
    print("✅ PostgreSQL target tables and analytical view verified.")