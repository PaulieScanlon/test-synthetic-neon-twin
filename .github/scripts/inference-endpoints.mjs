import fs from 'fs/promises';
import dotenv from 'dotenv';
import { HfInference } from '@huggingface/inference';

dotenv.config();

const hf = new HfInference(process.env.HF_ACCESS_TOKEN).endpoint(
  'https://s9r49ra75wb06hk4.us-east-1.aws.endpoints.huggingface.cloud' // sqlcoder-7b-2-mxr: https://huggingface.co/defog/sqlcoder-7b-2
  // 'https://yt9khig45jjnc6dr.us-east-1.aws.endpoints.huggingface.cloud' // llama-2-7b-instruct-text2sql-chb: https://huggingface.co/support-pvelocity/Llama-2-7B-instruct-text2sql

  // 'https://yu2080vv4riz3n34.us-east-1.aws.endpoints.huggingface.cloud' // qwq-32b-ola: https://huggingface.co/Qwen/QwQ-32B
);

(async () => {
  try {
    const schemaDump = await fs.readFile('schema.sql', 'utf8');
    console.log('Schema file read successfully');

    const totalRows = 10;
    console.log(`Creating ${totalRows} rows of data`);

    console.log('Calling Inference Endpoint...');
    const response = await hf.textGeneration({
      parameters: {
        max_new_tokens: 1000,
        temperature: 0.1,
        top_p: 0.9,
      },
      inputs: `

        ### Task
        Generate a ${totalRows} SQL INSERT statements based on the following Database Schema

        ### Database Schema
        The query will run on a database with the following schema:
        ${schemaDump}

        ### Answer
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
