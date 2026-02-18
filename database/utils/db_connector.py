from config import supabase

def execute_query(table, query_type="select", data=None):
    if query_type == "select":
        return supabase.table(table).select("*").execute().data
    elif query_type == "insert":
        return supabase.table(table).insert(data).execute().data
