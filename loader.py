import pandas as pd
from sqlalchemy import text

def load_data_via_upsert(df, table_name, constraint_col, value_col, engine):
    """Loads a Pandas DataFrame into PostgreSQL using an idempotent staging upsert technique."""
    staging_table = f"temp_staging_{table_name}"
    
    with engine.begin() as connection:
        # 1. Dump DataFrame directly into an isolated temporary staging table
        df.to_sql(name=staging_table, con=connection, if_exists="replace", index=False)
        
        # 2. Execute cross-table INSERT SELECT with Native Postgres Upsert matching
        upsert_query = f"""
        INSERT INTO {table_name} ({constraint_col}, {value_col})
        SELECT {constraint_col}, {value_col} FROM {staging_table}
        ON CONFLICT ({constraint_col})
        DO UPDATE SET {value_col} = EXCLUDED.{value_col};
        """
        connection.execute(text(upsert_query))
        
        # 3. Destroy temporary staging traces
        connection.execute(text(f"DROP TABLE IF EXISTS {staging_table};"))