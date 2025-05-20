import { DataAPIClient } from "@datastax/astra-db-ts";
import dotenv from "dotenv";

dotenv.config();

const db = new DataAPIClient(process.env.ASTRA_DB_APPLICATION_TOKEN).db(
  process.env.ASTRA_DB_ENDPOINT
);

export async function deleteCollection() {
  const collectionName = process.env.ASTRA_DB_COLLECTION;
  console.log("🔍 Starting deleteCollection()");
  console.log("📂 Target collection name:", collectionName);

  try {
    console.log("📥 Fetching list of existing collections...");
    const collections = await db.listCollections();

    console.log("📃 Collections found:");
    collections.forEach((col, index) =>
      console.log(`   ${index + 1}. ${col.name}`)
    );

    const collectionExists = collections.some(
      (col) => col.name === collectionName
    );

    console.log("✅ Collection exists?", collectionExists);

    if (!collectionExists) {
      console.log(`⚠️ Collection "${collectionName}" does not exist. Skipping deletion.`);
      return true; // Treat as success since there's nothing to delete
    }

    console.log(`🧨 Deleting collection "${collectionName}"...`);
    const success = await db.dropCollection(collectionName);
    console.log("🗑️ Collection deleted:", success);
    return success;
  } catch (error) {
    console.error("❌ Error during deleteCollection():", error);
    return false;
  }
}
