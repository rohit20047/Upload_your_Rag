import { Ollama } from "@langchain/ollama";
import { OllamaEmbeddings } from "@langchain/ollama";
import { AstraDBVectorStore } from "@langchain/community/vectorstores/astradb";
import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { StringOutputParser } from "@langchain/core/output_parsers";
async function generateRAGResponse(userQuery) {
    console.log("Generating RAG response for query:", userQuery);
    try {
      const llm = new Ollama({
        model: "gemma3:1b",
        temperature: 0.7,
        maxRetries: 2,
        baseUrl: "http://localhost:11434", // ← change this
      });
      
      const embeddings = new OllamaEmbeddings({
        model: "znbang/bge:large-en-v1.5-f16",
        baseUrl: "http://localhost:11434", // ← change this too
      });
  
      const vectorStore = await AstraDBVectorStore.fromExistingIndex(
        embeddings,
        {
          token: process.env.ASTRA_DB_APPLICATION_TOKEN,
          endpoint: process.env.ASTRA_DB_ENDPOINT,
          collection: process.env.ASTRA_DB_COLLECTION,
          collectionOptions: {
            vector: {
              dimension: 1024,
              metric: "cosine",
            },
          },
        }
      );
  
      const retriever = vectorStore.asRetriever({
        searchKwargs: { k: 5 },
      });
  
      const promptTemplate =  PromptTemplate.fromTemplate(`
        you are a expert pdf assistant specializing in interpreting the employment book for "Infinite Mode"(Organisation name ). your goal is to understand the brokent context from the context and will all this understanding must provide answer
        
        Context Guidelines:
        - Only use information directly found in the provided context
        - Maintain a professional and informative tone
        - Prioritize clarity and accuracy in your responses
        
        Context: {context}
        
        Question: {question}
        
        Answer: `);
  
      // Formatter to join document page contents
      const formatDocs = (docs) =>
        docs.map((doc) => doc.pageContent).join("\n\n");
      console.log("formatDocs", formatDocs)
      const chain = RunnableSequence.from([
        {
          context: async (input) => {
            const docs = await retriever.invoke(input.question);
            const formattedContext = formatDocs(docs);
            console.log("Retrieved Documents:", docs);
            console.log("Formatted Context:", formattedContext);
            return formattedContext;
          },
          question: (input) => input.question,
        },
        promptTemplate,
        llm,
        new StringOutputParser(),
      ]);
  
      return await chain.invoke({ question: userQuery });
    } catch (error) {
      console.error("Error generating RAG response:", error);
      return `Error processing your query: ${error.message}`;
    }
  }
  export  {generateRAGResponse};