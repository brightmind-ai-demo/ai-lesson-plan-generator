import gradio as gr
import os
import json
import requests
from datetime import datetime

# Get Hugging Face token from environment variable
HF_TOKEN = os.getenv("HUGGINGFACE_TOKEN")

def generate_lesson_plan(topic, subject, grade_level, duration, difficulty="intermediate"):
    """Generate a lesson plan using Hugging Face API or fallback algorithms"""
    
    # Try Hugging Face API first if token is available
    if HF_TOKEN:
        try:
            return generate_with_hugging_face(topic, subject, grade_level, duration, difficulty)
        except Exception as e:
            print(f"Hugging Face API failed: {e}")
    
    # Fallback to educational algorithms
    return generate_with_algorithms(topic, subject, grade_level, duration, difficulty)

def generate_with_hugging_face(topic, subject, grade_level, duration, difficulty):
    """Generate lesson plan using Hugging Face API"""
    
    prompt = f"""Create a comprehensive lesson plan for:
Topic: {topic}
Subject: {subject}
Grade Level: {grade_level}
Duration: {duration} minutes
Difficulty: {difficulty}

Include:
1. Learning objectives
2. Activities with time allocations
3. Materials needed
4. Assessment methods
5. Differentiation strategies
6. Educational standards

Format as a structured lesson plan."""

    headers = {
        "Authorization": f"Bearer {HF_TOKEN}",
        "Content-Type": "application/json"
    }
    
    data = {
        "inputs": prompt,
        "parameters": {
            "max_length": 1000,
            "temperature": 0.7,
            "do_sample": True
        }
    }
    
    response = requests.post(
        "https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium",
        headers=headers,
        json=data
    )
    
    if response.status_code == 200:
        result = response.json()
        if isinstance(result, list) and len(result) > 0:
            content = result[0].get("generated_text", "")
        else:
            content = result.get("generated_text", "")
        
        return format_lesson_plan(content, topic, subject, grade_level, duration, True)
    else:
        raise Exception(f"API request failed: {response.status_code}")

def generate_with_algorithms(topic, subject, grade_level, duration, difficulty):
    """Generate lesson plan using educational algorithms"""
    
    grade = int(grade_level.split('-')[0]) if '-' in grade_level else int(grade_level)
    
    # Generate objectives based on Bloom's Taxonomy
    objectives = generate_objectives(topic, grade)
    
    # Generate activities
    activities = generate_activities(topic, int(duration), grade)
    
    # Generate materials
    materials = generate_materials(subject, grade)
    
    # Generate assessment
    assessment = generate_assessment(grade)
    
    # Generate differentiation
    differentiation = generate_differentiation()
    
    lesson_plan = {
        "topic": topic,
        "subject": subject,
        "grade_level": grade_level,
        "duration": duration,
        "difficulty": difficulty,
        "objectives": objectives,
        "activities": activities,
        "materials": materials,
        "assessment": assessment,
        "differentiation": differentiation,
        "ai_generated": False,
        "generated_at": datetime.now().strftime("%Y-%m-%d")
    }
    
    return format_lesson_plan_from_dict(lesson_plan)

def generate_objectives(topic, grade):
    """Generate learning objectives based on grade level"""
    if grade <= 2:
        return [
            f"Students will identify key concepts about {topic}",
            f"Students will demonstrate understanding through hands-on activities"
        ]
    elif grade <= 5:
        return [
            f"Students will explain the main concepts of {topic}",
            f"Students will apply knowledge through practical exercises",
            f"Students will analyze information about {topic}"
        ]
    elif grade <= 8:
        return [
            f"Students will analyze and evaluate information about {topic}",
            f"Students will synthesize knowledge through creative projects",
            f"Students will demonstrate critical thinking skills"
        ]
    else:
        return [
            f"Students will critically analyze complex concepts in {topic}",
            f"Students will synthesize information from multiple sources",
            f"Students will create original work demonstrating mastery"
        ]

def generate_activities(topic, duration, grade):
    """Generate activities with time allocations"""
    activities = []
    
    # Introduction (15% of time)
    intro_time = max(5, int(duration * 0.15))
    activities.append({
        "name": f"Introduction to {topic}",
        "duration": f"{intro_time} minutes",
        "description": f"Engage students with a hook activity related to {topic}"
    })
    
    # Main activities (60% of time)
    main_time = int(duration * 0.6)
    if grade <= 2:
        activities.append({
            "name": "Hands-on Exploration",
            "duration": f"{main_time} minutes",
            "description": f"Interactive exploration of {topic} through manipulatives and visual aids"
        })
    elif grade <= 5:
        activities.append({
            "name": "Guided Discovery",
            "duration": f"{int(main_time * 0.6)} minutes",
            "description": f"Structured exploration of {topic} with teacher guidance"
        })
        activities.append({
            "name": "Collaborative Learning",
            "duration": f"{int(main_time * 0.4)} minutes",
            "description": f"Group work to deepen understanding of {topic}"
        })
    else:
        activities.append({
            "name": "Independent Research",
            "duration": f"{int(main_time * 0.4)} minutes",
            "description": f"Students research aspects of {topic} independently"
        })
        activities.append({
            "name": "Discussion and Analysis",
            "duration": f"{int(main_time * 0.6)} minutes",
            "description": f"Class discussion analyzing different perspectives on {topic}"
        })
    
    # Practice (20% of time)
    practice_time = int(duration * 0.2)
    activities.append({
        "name": "Practice and Application",
        "duration": f"{practice_time} minutes",
        "description": f"Students apply their knowledge through exercises related to {topic}"
    })
    
    return activities

def generate_materials(subject, grade):
    """Generate materials based on subject and grade"""
    materials = ["Whiteboard or chart paper", "Markers or chalk"]
    
    if grade <= 2:
        materials.extend(["Visual aids and pictures", "Manipulatives or hands-on objects", "Colored pencils and paper"])
    elif grade <= 5:
        materials.extend(["Textbooks or reference materials", "Worksheets or activity sheets", "Art supplies for projects"])
    elif grade <= 8:
        materials.extend(["Research materials (books, articles)", "Technology devices (if available)", "Presentation materials"])
    else:
        materials.extend(["Advanced reference materials", "Technology for research and presentation", "Writing materials for essays or reports"])
    
    # Subject-specific materials
    if subject.lower() == "science":
        materials.extend(["Science equipment or models", "Safety materials (if needed)"])
    elif subject.lower() == "math":
        materials.extend(["Calculators (if appropriate)", "Graph paper or rulers"])
    elif subject.lower() == "history":
        materials.extend(["Historical documents or primary sources", "Maps or timelines"])
    
    return materials

def generate_assessment(grade):
    """Generate assessment methods based on grade level"""
    if grade <= 2:
        return ["Observation of student participation", "Simple oral questions and answers", "Drawing or visual representation of learning"]
    elif grade <= 5:
        return ["Quick quiz or exit ticket", "Student presentations or demonstrations", "Portfolio of completed work"]
    elif grade <= 8:
        return ["Written reflection or journal entry", "Group project evaluation", "Peer assessment activities"]
    else:
        return ["Essay or written analysis", "Research project presentation", "Peer review and self-assessment"]

def generate_differentiation():
    """Generate differentiation strategies"""
    return {
        "struggling": [
            "Provide additional visual aids and examples",
            "Break down complex concepts into smaller parts",
            "Offer one-on-one support during activities",
            "Use simplified language and vocabulary"
        ],
        "advanced": [
            "Provide extension activities and challenges",
            "Encourage independent research and exploration",
            "Assign leadership roles in group activities",
            "Offer opportunities for creative expression"
        ],
        "ell": [
            "Use visual supports and gestures",
            "Provide vocabulary lists and definitions",
            "Pair with native speakers for support",
            "Use multimedia resources when available"
        ]
    }

def format_lesson_plan(content, topic, subject, grade_level, duration, ai_generated):
    """Format lesson plan from AI response"""
    return f"""
# Lesson Plan: {topic}

**Subject:** {subject}  
**Grade Level:** {grade_level}  
**Duration:** {duration} minutes  
**Generated:** {datetime.now().strftime("%Y-%m-%d")}  
**AI Generated:** {'Yes' if ai_generated else 'No'}

---

## Content

{content}

---

*Generated by BrightMind AI - Educational Technology Platform*
"""

def format_lesson_plan_from_dict(lesson_plan):
    """Format lesson plan from dictionary"""
    content = f"""
# Lesson Plan: {lesson_plan['topic']}

**Subject:** {lesson_plan['subject']}  
**Grade Level:** {lesson_plan['grade_level']}  
**Duration:** {lesson_plan['duration']} minutes  
**Difficulty:** {lesson_plan['difficulty']}  
**Generated:** {lesson_plan['generated_at']}  
**AI Generated:** {'Yes' if lesson_plan['ai_generated'] else 'No'}

---

## Learning Objectives

"""
    
    for i, objective in enumerate(lesson_plan['objectives'], 1):
        content += f"{i}. {objective}\n"
    
    content += "\n## Activities\n\n"
    for activity in lesson_plan['activities']:
        content += f"**{activity['name']}** ({activity['duration']})\n"
        content += f"{activity['description']}\n\n"
    
    content += "## Materials Needed\n\n"
    for material in lesson_plan['materials']:
        content += f"• {material}\n"
    
    content += "\n## Assessment Methods\n\n"
    for i, assessment in enumerate(lesson_plan['assessment'], 1):
        content += f"{i}. {assessment}\n"
    
    content += "\n## Differentiation Strategies\n\n"
    for category, strategies in lesson_plan['differentiation'].items():
        content += f"**{category.title()} Learners:**\n"
        for strategy in strategies:
            content += f"• {strategy}\n"
        content += "\n"
    
    content += "\n---\n*Generated by BrightMind AI - Educational Technology Platform*"
    
    return content

# Create Gradio interface
with gr.Blocks(title="BrightMind AI - Lesson Plan Generator", theme=gr.themes.Soft()) as demo:
    gr.Markdown("# 🧠 BrightMind AI - Lesson Plan Generator")
    gr.Markdown("Generate comprehensive lesson plans using AI or educational algorithms")
    
    with gr.Row():
        with gr.Column():
            topic = gr.Textbox(label="Topic", placeholder="e.g., Photosynthesis, World War II, Algebra")
            subject = gr.Dropdown(
                choices=["Science", "Mathematics", "History", "English Language Arts", "Geography", "Art"],
                label="Subject",
                value="Science"
            )
            grade_level = gr.Dropdown(
                choices=["K-2", "3-5", "6-8", "9-12"],
                label="Grade Level",
                value="6-8"
            )
            duration = gr.Slider(
                minimum=30,
                maximum=180,
                step=15,
                value=60,
                label="Duration (minutes)"
            )
            difficulty = gr.Dropdown(
                choices=["Beginner", "Intermediate", "Advanced"],
                label="Difficulty",
                value="Intermediate"
            )
            
            generate_btn = gr.Button("Generate Lesson Plan", variant="primary")
        
        with gr.Column():
            output = gr.Markdown(label="Generated Lesson Plan")
    
    # Event handlers
    generate_btn.click(
        fn=generate_lesson_plan,
        inputs=[topic, subject, grade_level, duration, difficulty],
        outputs=output
    )
    
    # Example
    gr.Examples(
        examples=[
            ["Photosynthesis", "Science", "6-8", 60, "Intermediate"],
            ["World War II", "History", "9-12", 90, "Advanced"],
            ["Basic Algebra", "Mathematics", "3-5", 45, "Beginner"]
        ],
        inputs=[topic, subject, grade_level, duration, difficulty]
    )

if __name__ == "__main__":
    demo.launch()
