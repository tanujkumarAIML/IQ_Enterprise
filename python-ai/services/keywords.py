import re

SKILLS = {
    "Programming": ["python","java","c","c++","c#","javascript","typescript","php","go","rust","kotlin","swift","scala","ruby"],
    "Frontend":    ["react","angular","vue","html","css","sass","tailwind","bootstrap","next.js","nuxt.js","svelte","jquery"],
    "Backend":     ["node.js","express","django","flask","fastapi","spring","laravel","rails","asp.net","nestjs"],
    "Database":    ["mongodb","mysql","postgresql","sqlite","oracle","redis","cassandra","elasticsearch","firebase","dynamodb"],
    "Cloud":       ["aws","azure","gcp","docker","kubernetes","terraform","jenkins","github actions","ansible","ci/cd"],
    "AI/ML":       ["machine learning","deep learning","nlp","tensorflow","pytorch","scikit-learn","opencv","spacy","transformers","keras","pandas","numpy"],
    "Tools":       ["git","github","jira","postman","linux","figma","vs code","vim","nginx","apache"],
    "Mobile":      ["react native","flutter","android","ios","swift","kotlin","xamarin"],
    "Testing":     ["jest","pytest","mocha","cypress","selenium","junit","testng"],
}

class KeywordExtractor:
    @staticmethod
    def extract(text: str):
        text_lower = text.lower()
        detected = []
        seen = set()
        for category, keywords in SKILLS.items():
            for keyword in keywords:
                pattern = r"\b" + re.escape(keyword) + r"\b"
                if re.search(pattern, text_lower) and keyword not in seen:
                    detected.append({"category": category, "skill": keyword})
                    seen.add(keyword)
        return detected

    @staticmethod
    def extract_flat(text: str):
        result = KeywordExtractor.extract(text)
        return [item["skill"] for item in result]

    @staticmethod
    def get_missing(found_skills: list, job_role: str = "") -> list:
        role_lower = job_role.lower()
        required = []
        if any(k in role_lower for k in ["frontend","react","ui"]):
            required = ["react","html","css","javascript","tailwind"]
        elif any(k in role_lower for k in ["backend","node","python","django"]):
            required = ["node.js","express","mongodb","postgresql","redis"]
        elif any(k in role_lower for k in ["fullstack","full stack","full-stack"]):
            required = ["react","node.js","mongodb","postgresql","docker","git"]
        elif any(k in role_lower for k in ["data","ml","ai","machine"]):
            required = ["python","machine learning","pandas","numpy","tensorflow","pytorch"]
        elif any(k in role_lower for k in ["devops","cloud","infra"]):
            required = ["docker","kubernetes","aws","terraform","ci/cd","linux"]
        else:
            required = ["git","docker","linux","rest","api"]

        found_flat = [s.lower() for s in found_skills]
        return [r for r in required if r not in found_flat]
