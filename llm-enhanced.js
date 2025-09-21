// LLM-Enhanced Lesson Plan Generator
// Uses Ollama for local LLM integration

class LLMEnhancedLessonGenerator extends LessonPlanGenerator {
    constructor() {
        super();
        this.llmAvailable = false;
        this.ollamaEndpoint = 'http://localhost:11434/api/generate';
        this.checkLLMAvailability();
    }

    async checkLLMAvailability() {
        try {
            const response = await fetch('http://localhost:11434/api/tags');
            if (response.ok) {
                this.llmAvailable = true;
                this.showLLMStatus('✅ Local LLM (Ollama) detected and ready!');
            }
        } catch (error) {
            this.llmAvailable = false;
            this.showLLMStatus('⚠️ No local LLM detected. Using smart algorithms instead.');
        }
    }

    showLLMStatus(message) {
        const statusDiv = document.createElement('div');
        statusDiv.className = 'llm-status';
        statusDiv.innerHTML = `
            <div style="background: #e3f2fd; padding: 10px; margin: 10px 0; border-radius: 5px; border-left: 4px solid #2196f3;">
                <strong>🤖 LLM Status:</strong> ${message}
            </div>
        `;
        document.querySelector('.form-container').appendChild(statusDiv);
    }

    async generateLessonPlan(data) {
        if (this.llmAvailable) {
            return await this.generateWithLLM(data);
        } else {
            return super.generateLessonPlan(data);
        }
    }

    async generateWithLLM(data) {
        const prompt = this.createLLMPrompt(data);
        
        try {
            const response = await fetch(this.ollamaEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model: 'llama2', // or 'mistral', 'codellama', etc.
                    prompt: prompt,
                    stream: false
                })
            });

            if (!response.ok) {
                throw new Error('LLM request failed');
            }

            const result = await response.json();
            return this.parseLLMResponse(result.response, data);
            
        } catch (error) {
            console.warn('LLM generation failed, falling back to algorithms:', error);
            return super.generateLessonPlan(data);
        }
    }

    createLLMPrompt(data) {
        return `You are an expert educational consultant. Create a detailed lesson plan for:

Subject: ${this.formatSubject(data.subject)}
Grade Level: ${this.formatGradeLevel(data.gradeLevel)}
Topic: ${data.topic}
Duration: ${data.duration} minutes
Difficulty: ${data.difficulty}
Learning Objectives: ${data.learningObjectives || 'Generate appropriate objectives'}

Please provide a comprehensive lesson plan in this JSON format:
{
  "learningObjectives": ["objective1", "objective2", "objective3"],
  "standards": ["standard1", "standard2"],
  "timing": [
    {"phase": "Opening", "duration": 10, "description": "..."},
    {"phase": "Main Activity", "duration": 30, "description": "..."},
    {"phase": "Closing", "duration": 5, "description": "..."}
  ],
  "activities": [
    {"name": "Activity Name", "duration": 15, "description": "Detailed description"}
  ],
  "assessments": [
    {"type": "Formative", "name": "Exit Ticket", "duration": 5, "description": "..."}
  ],
  "materials": ["material1", "material2"],
  "differentiation": {
    "struggling": ["strategy1", "strategy2"],
    "advanced": ["strategy1", "strategy2"],
    "ell": ["strategy1", "strategy2"]
  }
}

Make it engaging, age-appropriate, and pedagogically sound.`;
    }

    parseLLMResponse(llmResponse, originalData) {
        try {
            // Extract JSON from LLM response
            const jsonMatch = llmResponse.match(/\{[\s\S]*\}/);
            if (!jsonMatch) {
                throw new Error('No JSON found in LLM response');
            }

            const lessonData = JSON.parse(jsonMatch[0]);
            
            return {
                topic: originalData.topic,
                duration: originalData.duration,
                gradeLevel: this.formatGradeLevel(originalData.gradeLevel),
                subject: this.formatSubject(originalData.subject),
                learningObjectives: lessonData.learningObjectives || [],
                standards: lessonData.standards || [],
                timing: lessonData.timing || [],
                activities: lessonData.activities || [],
                assessments: lessonData.assessments || [],
                materials: lessonData.materials || [],
                differentiation: lessonData.differentiation || {
                    forStrugglingLearners: [],
                    forAdvancedLearners: [],
                    forELLStudents: []
                }
            };
        } catch (error) {
            console.warn('Failed to parse LLM response:', error);
            return super.generateLessonPlan(originalData);
        }
    }
}

// Alternative: Hugging Face API Integration
class HuggingFaceLessonGenerator extends LessonPlanGenerator {
    constructor() {
        super();
        this.hfEndpoint = 'https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium';
        this.apiKey = null; // Set your Hugging Face API key here
    }

    async generateLessonPlan(data) {
        if (this.apiKey) {
            return await this.generateWithHuggingFace(data);
        } else {
            return super.generateLessonPlan(data);
        }
    }

    async generateWithHuggingFace(data) {
        const prompt = `Create a lesson plan for ${this.formatSubject(data.subject)} grade ${data.gradeLevel} about ${data.topic} for ${data.duration} minutes. Include learning objectives, activities, and assessments.`;

        try {
            const response = await fetch(this.hfEndpoint, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    inputs: prompt,
                    parameters: {
                        max_length: 500,
                        temperature: 0.7
                    }
                })
            });

            if (!response.ok) {
                throw new Error('Hugging Face API request failed');
            }

            const result = await response.json();
            return this.parseHuggingFaceResponse(result, data);
            
        } catch (error) {
            console.warn('Hugging Face generation failed, falling back to algorithms:', error);
            return super.generateLessonPlan(data);
        }
    }

    parseHuggingFaceResponse(hfResponse, originalData) {
        // Parse Hugging Face response and convert to lesson plan format
        // This would need to be customized based on the specific model response
        return super.generateLessonPlan(originalData);
    }
}

// WebLLM Integration (Browser-based)
class WebLLMLessonGenerator extends LessonPlanGenerator {
    constructor() {
        super();
        this.webllmAvailable = false;
        this.initWebLLM();
    }

    async initWebLLM() {
        try {
            // Check if WebLLM is available
            if (typeof window !== 'undefined' && window.webllm) {
                this.webllmAvailable = true;
                this.showLLMStatus('✅ WebLLM detected and ready!');
            }
        } catch (error) {
            this.webllmAvailable = false;
            this.showLLMStatus('⚠️ WebLLM not available. Using smart algorithms instead.');
        }
    }

    async generateLessonPlan(data) {
        if (this.webllmAvailable) {
            return await this.generateWithWebLLM(data);
        } else {
            return super.generateLessonPlan(data);
        }
    }

    async generateWithWebLLM(data) {
        // WebLLM implementation would go here
        // This requires loading WebLLM library and models
        return super.generateLessonPlan(data);
    }
}

// Export the enhanced generator
window.LLMEnhancedLessonGenerator = LLMEnhancedLessonGenerator;
window.HuggingFaceLessonGenerator = HuggingFaceLessonGenerator;
window.WebLLMLessonGenerator = WebLLMLessonGenerator;
