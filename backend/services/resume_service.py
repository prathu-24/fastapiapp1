import os 
from pathlib import Path
from dotenv import load_dotenv
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate

load_dotenv(Path(__file__).resolve().parent.parent / ".env")
llm = ChatGroq(
    model= "llama-3.3-70b-versatile",
    api_key=os.getenv("GROQ_API_KEY"),
    temperature=0.3,
)

resume_prompt = ChatPromptTemplate.from_messages([
    ("system", """ You are a Professional resume Analyser.
Analyse the given resume text and provide
1.key skills found 
2. Experience level(Junior/Mid/Senior)
3. Strengths
4.Areas to improve
5.Suggested Job Roles
Keep the analysis short and structured."""),
    ("human","{resume_text}")
])

resume_chain = resume_prompt | llm 

def analyse_resume(resume_text : str) -> str:
    try:
        response = resume_chain.invoke({"resume_text":resume_text})
        return response.content
    except Exception as e:
        print(f"[Resume Service Warning] LLM analysis failed: {e}. Falling back to local analyzer.")
        import re
        text_lower = resume_text.lower()
        
        # Skill extraction
        skills = []
        possible_skills = [
            "python", "javascript", "typescript", "react", "node", "java", 
            "c++", "html", "css", "sql", "postgres", "fastapi", "django", 
            "aws", "docker", "git", "c#", "net", "kubernetes", "golang"
        ]
        for skill in possible_skills:
            if re.search(r'\b' + re.escape(skill) + r'\b', text_lower):
                display_name = skill.upper() if skill in ["sql", "aws", "git", "css", "html", "net"] else skill.capitalize()
                skills.append(display_name)
        
        if not skills:
            skills = ["General Technical Skills"]
            
        # Seniority estimation
        years_match = re.search(r'(\d+)\+?\s*(years?|yrs?)', text_lower)
        years = int(years_match.group(1)) if years_match else 1
        
        if "senior" in text_lower or years >= 5:
            level = "Senior Specialist / Developer"
            strengths = "Solid industry track record, project leadership, and architectural understanding."
            improvements = "Keep updated with microservices scaling paradigms, focus on team guidance."
            roles = "Senior Software Engineer, Tech Lead, Solutions Architect"
        elif "lead" in text_lower or "manager" in text_lower:
            level = "Team Lead / Technical Manager"
            strengths = "Cross-functional team coordination, timeline management, and system delivery."
            improvements = "Balance day-to-day coordination with deep technical hands-on tasks."
            roles = "Development Lead, Engineering Manager"
        else:
            level = "Junior to Mid-Level Developer"
            strengths = "Adaptable engineering mindset, solid understanding of code foundations, quick learner."
            improvements = "Enhance knowledge of system design, performance profiling, and test automation."
            roles = "Software Developer, Full Stack Developer, Frontend/Backend Engineer"
            
        skills_str = ", ".join(skills)
        reply = f"""### Resume Analysis Result (Local Engine)

1. **Key Skills Found**: {skills_str}
2. **Experience Level**: {level} ({years} year(s) of experience detected)
3. **Strengths**: {strengths}
4. **Areas to Improve**: {improvements}
5. **Suggested Job Roles**: {roles}

*(Note: Analyzed using local parser as external LLM is offline)*"""
        return reply

