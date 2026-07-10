import os
from pathlib import Path
from dotenv import load_dotenv
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from services.qdrant_service import search_jobs

load_dotenv(Path(__file__).resolve().parent.parent / ".env")

llm = ChatGroq(
    model="llama-3.3-70b-versatile",
    api_key=os.getenv("GROQ_API_KEY"),
    temperature=0.3,
)

rag_prompt = ChatPromptTemplate.from_messages([
    ("system", """ you are a job search assistant.
    use the following job listing retrieved from the database to answer If no relevent jobs are found , say so clearly.
    
    Retrieved Jobs:
    {context}"""),
    ("human","{question}")

])

rag_chain = rag_prompt | llm


def rag_job_search(question:str) -> str:
    results = search_jobs(question,top_k=5)
    if not results:
        return "No matching jobs found in the database. Please ensure you have added companies and jobs, and then embed them."

    context = "\n".join([
        f" - {r['title']}: {r['description']} (salary:{r['salary']}, Match:{r['score']})"
        for r in results
    ])

    try:
        response = rag_chain.invoke({"context":context, "question":question})
        return response.content
    except Exception as e:
        print(f"[RAG Service Warning] LLM generation failed: {e}. Formatting database search results directly.")
        reply = "### Job Matching Results (Direct Database Search)\n\n"
        reply += f"Based on your query: *\"{question}\"*, here are the top matching job opportunities in our database:\n\n"
        for idx, r in enumerate(results, 1):
            # Calculate a user-friendly match percentage from raw score
            percentage = min(100, max(1, int(r['score'] * 100)))
            reply += f"#### {idx}. {r['title']}\n"
            reply += f"- **Salary**: {r['salary']} LPA\n"
            reply += f"- **Match Confidence**: {percentage}%\n"
            if r['description']:
                reply += f"- **Description**: {r['description']}\n"
            reply += "\n"
        reply += "*(Note: Direct match scores are returned because the external LLM is offline)*"
        return reply


    