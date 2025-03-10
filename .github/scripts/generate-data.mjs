import fs from 'fs/promises';
import dotenv from 'dotenv';
import { HfInference } from '@huggingface/inference';

dotenv.config();

const hf = new HfInference(process.env.HF_ACCESS_TOKEN);

(async () => {
  try {
    const schemaDump = await fs.readFile('schema.sql', 'utf8');
    console.log('Schema file read successfully');

    const response = await hf.textGeneration({
      model: 'bigcode/starcoder',
      parameters: {
        max_new_tokens: 2000,
        temperature: 0.3,
      },
      inputs: `
        You are a database expert. Given the following SQL schema:
        
        ${schemaDump}
        
        Please **generate exactly 10 SQL INSERT statements** for each table in the schema. Only the INSERT statements should be returned, with no extra text, commentary, or explanations. 
        1. The INSERT statements should follow the schema definitions and data types for each table.
        2. If a table has a **foreign key**, ensure the foreign key relationships are respected by generating the related data first.
        3. For tables with **primary keys** that are **automatically generated**, do not include that column in the INSERT statements.
        4. For tables with **primary keys** that need to be **manually assigned**, include that column with a unique value in each row.
        5. Ensure the **data is realistic** (e.g., names, emails, dates, and numeric values) and **consistent** across tables.
        6. The INSERT statements should be in valid PostgreSQL syntax and include **exactly 100 rows per table**.
        
        Do not include any comments or additional information. Only provide the INSERT statements.
      `,
    });

    console.log('\n✅ Schema Analysis:\n');
    console.log(response);
  } catch (error) {
    console.error('❌ Error reading or analyzing the schema:', error.message);
  }
})();
