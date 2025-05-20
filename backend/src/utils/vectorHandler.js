import { AstraDBVectorStore } from "@langchain/community/vectorstores/astradb";
import { OllamaEmbeddings } from "@langchain/ollama";
import dotenv from "dotenv";
import { deleteCollection } from "./deleteCollection.js"; // Make sure this path is correct

dotenv.config();



// Function to load and split PDF documents
export async function storeEmbeddings(documents) {
  
    // Step 1: Load and split documents
    try {
      console.log("✅ Documents loaded and split:", documents.length);
    } catch (error) {
      return {
        success: false,
        message: "Failed to load/split PDF. Embeddings not modified.",
      };
    }
  
    // Step 2: Try generating embeddings BEFORE deleting old collection
    const embeddings = new OllamaEmbeddings({
      model: "znbang/bge:large-en-v1.5-f16",
      baseUrl: "http://localhost:11434",
    });
  
    
    
  
    // ✅ Step 3: Now safely delete old collection
    try {
      const deleted = await deleteCollection();
      if (!deleted) {
        return {
          success: false,
          message: "Could not delete old embeddings. Aborting update.",
        };
      }
      console.log("🗑️ Old embeddings deleted.");
    } catch (error) {
      return {
        success: false,
        message: "Error deleting old collection.",
      };
    }
  
    // ✅ Step 4: Write new embeddings
    try {
      await AstraDBVectorStore.fromDocuments(documents, embeddings, {
        token: process.env.ASTRA_DB_APPLICATION_TOKEN,
        endpoint: process.env.ASTRA_DB_ENDPOINT,
        collection: process.env.ASTRA_DB_COLLECTION,
        collectionOptions: {
          vector: {
            dimension: 1024,
            metric: "cosine",
          },
        },
      });
  
      console.log("✅ New embeddings stored successfully.");
      return { success: true, message: "Embeddings updated." };
    } catch (error) {
      return {
        success: false,
        message: "Failed to store new embeddings. Collection now empty.",
      };
    }
  }
  