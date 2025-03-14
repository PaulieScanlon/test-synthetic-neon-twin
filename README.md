# test-synthetic-neon-twin

## prompt instructions

1.  Maintain referential integrity—values in foreign key columns must match existing primary key values.
2.  Insert parent table records first before inserting child table records.
3.  Use realistic and consistent data across tables (e.g., if a "users" table has user IDs, reference them correctly in related tables).
4.  Ensure that transactions reference valid product IDs and user IDs.
5.  Ensure total_amount in transactions is correctly calculated as quantity \* product price.
6.  Ensure the stock_quantity in products is sufficient for the transactions.
7.  Ensure realistic timestamps within the last 30 days for transactions.
8.  Do NOT include any explanations, comments, or extra text—only output the INSERT statements.

You are an expert database administrator. Given the following SQL schema, please generate ${totalRows} valid SQL INSERT statements per table, ensuring the following:

1. Generate sample data for every table defined in the schema
2. Do NOT include any explanations, comments, or extra text—only output the INSERT statements.

Below is the SQL schema provided. Please analyze the schema and generate the appropriate INSERT statements:

${schemaDump}

Output only the SQL INSERT statements, with no explanations or comments.
