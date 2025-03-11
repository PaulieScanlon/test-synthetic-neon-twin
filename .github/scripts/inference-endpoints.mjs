import fs from 'fs/promises';
import dotenv from 'dotenv';
import { HfInference } from '@huggingface/inference';

dotenv.config();

const hf = new HfInference(process.env.HF_ACCESS_TOKEN).endpoint(
  'https://yu2080vv4riz3n34.us-east-1.aws.endpoints.huggingface.cloud' // qwq-32b-ola
);

(async () => {
  try {
    const schemaDump = await fs.readFile('schema.sql', 'utf8');
    console.log('Schema file read successfully');

    const totalRows = 10;
    console.log(`Create ${totalRows} rows of data`);

    console.log('Calling Inferance Endpoint...');
    const response = await hf.textGeneration({
      parameters: {
        max_new_tokens: 1000,
        temperature: 0.1,
        top_p: 0.9,
      },
      inputs: `
        You are an expert database administrator. Given the following SQL schema, please generate ${totalRows} valid SQL INSERT statements per table, ensuring the following:

        1. Maintain referential integrity—values in foreign key columns must match existing primary key values.
        2. Insert parent table records first before inserting child table records.
        3. Use realistic and consistent data across tables (e.g., if a "users" table has user IDs, reference them correctly in related tables).
        4. Ensure that transactions reference valid product IDs and user IDs.
        5. Ensure total_amount in transactions is correctly calculated as quantity * product price.
        6. Ensure the stock_quantity in products is sufficient for the transactions.
        7. Ensure realistic timestamps within the last 30 days for transactions.
        8. Do NOT include any explanations, comments, or extra text—only output the INSERT statements.

        Below is the SQL schema provided. Please analyze the schema and generate the appropriate INSERT statements:

        ${schemaDump}

        Output only the SQL INSERT statements, with no explanations or comments.
      `,
    });

    const insertStatements = response.generated_text.match(/INSERT INTO .*?;/gs);
    console.log(insertStatements ? insertStatements.join('\n') : 'No valid SQL statements found.');
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
})();
