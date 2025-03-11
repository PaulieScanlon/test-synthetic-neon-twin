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

    const totalRows = 200;
    console.log(`Creating ${totalRows} rows of data`);

    console.log('Calling Inference Endpoint...');
    const response = await hf.textGeneration({
      parameters: {
        max_new_tokens: 1000,
        temperature: 0.1,
        top_p: 0.9,
      },
      inputs: `
        You are an expert database administrator. Given the following SQL schema, please generate ${totalRows} valid SQL INSERT statements per table, ensuring the following:

        1. Generate sample data for every table defined in the schema
        2. Do NOT include any explanations, comments, or extra text—only output the INSERT statements.

        Below is the SQL schema provided. Please analyze the schema and generate the appropriate INSERT statements:

        ${schemaDump}

        Output only the SQL INSERT statements, with no explanations or comments.
      `,
    });

    const generatedText = response.generated_text.trim();
    const insertStatements = generatedText.match(/INSERT INTO .*?;/gs);

    if (insertStatements && insertStatements.length > 0) {
      const sqlContent = insertStatements.join('\n');
      console.log('Valid SQL INSERT statements generated:\n');
      console.log(sqlContent);

      // Write the SQL INSERT statements to the data.sql file
      await fs.writeFile('./data.sql', sqlContent);
      console.log('SQL INSERT statements have been written to data.sql');
    } else {
      console.log('❌ No valid SQL INSERT statements found.');
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
})();
