from langchain_groq import ChatGroq
from dotenv import load_dotenv
from pathlib import Path
import os

# Load environment variables from the backend/.env file
load_dotenv(Path(__file__).resolve().parent.parent / ".env")

# ---- Configuration ----
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
LLAMA_MODEL = "llama-3.3-70b-versatile"

# ---- LLM Instance ----
llm = ChatGroq(
    model=LLAMA_MODEL,
    groq_api_key=GROQ_API_KEY,
)


def get_llm() -> ChatGroq:
    """Return the shared LLM instance."""
    return llm


def get_local_fallback_chat_response(query: str) -> str:
    """
    A smart local fallback engine that responds intelligently about TalentSpark
    using key phrase matching when the external LLM is offline or has an invalid API key.
    """
    q = query.lower()
    
    if any(k in q for k in ["hello", "hi", "hey", "greetings", "good morning", "good afternoon"]):
        return (
            "Hello! Welcome to TalentSpark! 🌱 I am your AI Career Assistant. "
            "How can I help you find companies, check open roles, or analyze your resume today?"
        )
        
    if any(k in q for k in ["job", "jobs", "role", "roles", "opportunity", "opportunities", "opening", "openings"]):
        return (
            "We have several exciting opportunities open at TalentSpark right now!\n\n"
            "• **Software Engineer** (Full-time, Remote, 12 LPA)\n"
            "• **Product Manager** (Full-time, Bangalore, 18 LPA)\n"
            "• **Data Analyst** (Full-time, Remote, 8 LPA)\n\n"
            "You can view and manage these in the **Featured Opportunities** section. "
            "If you are logged in as an Admin or HR, you can also post new job opportunities there!"
        )
        
    if any(k in q for k in ["company", "companies", "partner", "employer", "employers"]):
        return (
            "TalentSpark partners with leading technology and business organizations, including:\n\n"
            "• **TechCorp** (Bangalore, India)\n"
            "• **BioSphere** (Mumbai, India)\n"
            "• **EcoSystems** (Remote)\n\n"
            "Check out our **Partner Companies** section below. "
            "Logged-in Administrators can add new companies or edit details!"
        )
        
    if any(k in q for k in ["contact", "phone", "email", "support", "help", "address"]):
        return (
            "Need assistance? You can reach the TalentSpark support team through the following channels:\n\n"
            "• 📧 Email: **support@talentspark.com**\n"
            "• 📱 Phone: **+1 (555) 019-9283**\n"
            "• 📍 Address: **100 Innovation Way, Suite 400, Tech City**\n\n"
            "Or drop a message using our Contact form at the bottom of the page!"
        )
        
    if any(k in q for k in ["resume", "cv", "analyse", "analysis", "feedback"]):
        return (
            "We offer a professional resume analysis service! You can submit your resume "
            "text to get instant structured feedback on your key skills, experience level, "
            "strengths, and areas to improve. Click on 'Analyze Resume' or ask me about it!"
        )
        
    if any(k in q for k in ["about", "what is", "talentspark", "project"]):
        return (
            "**TalentSpark** is a premium, full-stack recruitment and talent matching platform. "
            "We connect skilled candidates with top employers using smart data-driven tools, "
            "such as vector database search (Qdrant), automated resume analysis, and interactive AI chatbot guidance. "
            "All designed inside our brand new, beautiful monochrome nature aesthetic!"
        )

    # General default response
    return (
        "I am here to help you navigate TalentSpark! 🌱 You can ask me about open jobs, "
        "partner companies, resume feedback, contact channels, or general platform features. "
        "How can I assist you further?"
    )


def chat_without_memory(query: str) -> str:
    """
    Simple one-shot chat with no conversation history.
    Equivalent to the Colab `chat_without_memory` function.
    """
    try:
        response = llm.invoke(query)
        return response.content
    except Exception as e:
        print(f"[LLM Service Warning] Failed invoking Groq: {e}. Falling back to local rules.")
        return get_local_fallback_chat_response(query)

