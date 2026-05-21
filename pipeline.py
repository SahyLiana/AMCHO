import os
import pandas as pd
from sqlalchemy import text

# Explicit, clean local file imports
from db_config import get_postgres_engine
from schema import create_schema_if_missing
from loader import load_data_via_upsert

def run_etl_pipeline():
    print(" Initializing Python-PostgreSQL ETL Data Integration...")
    engine = get_postgres_engine()
    
    # Establish paths to raw file assets
    cocoa_path = os.path.join("datasources", "PCOCOUSDM.csv")
    ppi_path = os.path.join("datasources", "PCU3113513113517.csv")
    
    try:
        # Verify database structures exist
        create_schema_if_missing(engine)
        
        # --- PROCESS COCOA PRICES ---
        print(" Extracting & Transforming Global Cocoa Prices...")
        df_cocoa = pd.read_csv(cocoa_path)
        df_cocoa['observation_date'] = pd.to_datetime(df_cocoa['observation_date']).dt.date
        df_cocoa['PCOCOUSDM'] = pd.to_numeric(df_cocoa['PCOCOUSDM'], errors='coerce')
        df_cocoa = df_cocoa.dropna()
        df_cocoa = df_cocoa.rename(columns={"PCOCOUSDM": "price_usd_per_ton"})
        
        load_data_via_upsert(df_cocoa, "global_cocoa_prices", "observation_date", "price_usd_per_ton", engine)
        print(" PostgreSQL 'global_cocoa_prices' table updated.")
        
        # --- PROCESS CHOCOLATE PPI ---
        print(" Extracting & Transforming U.S. Chocolate Manufacturing PPI...")
        df_ppi = pd.read_csv(ppi_path)
        df_ppi['observation_date'] = pd.to_datetime(df_ppi['observation_date']).dt.date
        df_ppi['PCU3113513113517'] = pd.to_numeric(df_ppi['PCU3113513113517'], errors='coerce')
        df_ppi = df_ppi.dropna()
        df_ppi = df_ppi.rename(columns={"PCU3113513113517": "ppi_index"})
        
        load_data_via_upsert(df_ppi, "chocolate_ppi", "observation_date", "ppi_index", engine)
        print(" PostgreSQL 'chocolate_ppi' table updated.")
        
        print(" Pipeline executed completely! Live PostgreSQL database is synced and ready.")
        
    except Exception as error:
        print(f" Critical Pipeline Failure Event: {error}")
    finally:
        engine.dispose()

if __name__ == "__main__":
    # 1. Fire execution pipeline
    run_etl_pipeline()
    
    # 2. Verification step
    print("\n--- INGESTION ROW COUNT VERIFICATION ---")
    try:
        engine = get_postgres_engine()
        with engine.connect() as connection:
            cocoa_count = connection.execute(text("SELECT COUNT(*) FROM global_cocoa_prices;")).scalar()
            ppi_count = connection.execute(text("SELECT COUNT(*) FROM chocolate_ppi;")).scalar()
            view_count = connection.execute(text("SELECT COUNT(*) FROM analytical_chocolate_insights;")).scalar()
            
            print(f" Rows in 'global_cocoa_prices':       {cocoa_count}")
            print(f" Rows in 'chocolate_ppi':             {ppi_count}")
            print(f" Rows combined in analytical view:   {view_count}")
            
            if cocoa_count > 0 and ppi_count > 0:
                print("\n SUCCESS! Data is fully live and queryable in your local Postgres database.")
    except Exception as e:
        print(f" Verification failed: {e}")