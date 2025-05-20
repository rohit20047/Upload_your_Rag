import textract from 'textract';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { storeEmbeddings } from '../utils/vectorHandler.js';

export const processDocxAndEmbed = async (filePath) => {
  const text = await new Promise((resolve, reject) => {
    textract.fromFileWithPath(filePath, (err, txt) => {
      if (err) reject(err);
      else resolve(txt);
    });
  });

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 400,
    chunkOverlap: 0,
  });

  const chunks = await splitter.createDocuments([text]);

  const result = await storeEmbeddings(chunks);
  return result;
};
