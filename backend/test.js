import textract from 'textract';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';

/**
 * Extracts text from a .doc file and splits it into chunks.
 * @param {string} filePath - Path to the .doc file.
 * @returns {Promise<Array>} - Array of text chunks.
 */
export async function docToChunks(filePath) {
  try {
    // Extract text from .doc
    const text = await new Promise((resolve, reject) => {
      textract.fromFileWithPath(filePath, (error, data) => {
        if (error) reject(error);
        else resolve(data);
      });
    });

    // Split into chunks
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 400,
      chunkOverlap: 0,
    });

    const documents = await splitter.createDocuments([text]);
    return documents;
  } catch (err) {
    console.error("Failed to process DOC file:", err);
    throw err;
  }
}

const documents = await docToChunks('C:/Users/Rohit Reddy/Desktop/client_ai_project/backend/src/uploads/memo.docx');
console.log(documents);
