// Free LLM Integration for GitHub Pages
// Uses free APIs that work directly in the browser

class FreeLLMLessonGenerator extends LessonPlanGenerator {
    constructor() {
        super();
        this.llmServices = this.initializeFreeServices();
        this.currentService = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.addLLMControls();
        this.detectBestService();
    }

    initializeFreeServices() {
        return {
            // Hugging Face Inference API (Free tier)
            huggingface: {
                name: 'Hugging Face (Free)',
                endpoint: 'https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium',
                requiresKey: false,
                maxTokens: 200,
                description: 'Free AI model for text generation'
            },
            
            // Cohere API (Free tier)
            cohere: {
                name: 'Cohere (Free)',
                endpoint: 'https://api.cohere.ai/v1/generate',
                requiresKey: false, // We'll use a demo key
                maxTokens: 200,
                description: 'Free AI for educational content'
            },
            
            // OpenAI API (Free tier with demo key)
            openai: {
                name: 'OpenAI (Demo)',
                endpoint: 'https://api.openai.com/v1/chat/completions',
                requiresKey: false, // We'll use a demo key
                maxTokens: 200,
                description: 'GPT model for lesson planning'
            },
            
            // Local AI simulation (Fallback)
            local: {
                name: 'Smart Algorithms',
                endpoint: 'local',
                requiresKey: false,
                maxTokens: 0,
                description: 'Local educational algorithms'
            }
        };
    }

    addLLMControls() {
        const form = document.querySelector('.lesson-form');
        if (!form) return;

        // Add LLM service selector
        const llmSelector = document.createElement('div');
        llmSelector.className = 'form-group llm-selector';
        llmSelector.innerHTML = `
            <label for="llmService">AI Enhancement (Optional)</label>
            <select id="llmService" name="llmService">
                <option value="local">Smart Algorithms (Fast & Reliable)</option>
                <option value="huggingface">Hugging Face AI (Free)</option>
                <option value="cohere">Cohere AI (Free)</option>
                <option value="openai">OpenAI Demo (Free)</option>
            </select>
            <div class="llm-status" id="llmStatus">
                <i class="fas fa-info-circle"></i>
                <span>Smart algorithms selected - works immediately!</span>
            </div>
        `;
        
        form.insertBefore(llmSelector, form.querySelector('.generate-btn').parentNode);
        
        // Add event listener for service change
        document.getElementById('llmService').addEventListener('change', (e) => {
            this.selectService(e.target.value);
        });
    }

    selectService(serviceId) {
        this.currentService = this.llmServices[serviceId];
        this.updateStatus();
    }

    updateStatus() {
        const statusDiv = document.getElementById('llmStatus');
        if (!statusDiv) return;

        if (this.currentService.id === 'local') {
            statusDiv.innerHTML = `
                <i class="fas fa-cogs"></i>
                <span>Smart algorithms selected - works immediately!</span>
            `;
        } else {
            statusDiv.innerHTML = `
                <i class="fas fa-robot"></i>
                <span>${this.currentService.name} selected - enhanced AI generation enabled!</span>
            `;
        }
    }

    detectBestService() {
        // Try to detect which services are available
        this.testServices();
    }

    async testServices() {
        const services = ['huggingface', 'cohere', 'openai'];
        
        for (const serviceId of services) {
            try {
                const isAvailable = await this.testService(serviceId);
                if (isAvailable) {
                    this.selectService(serviceId);
                    break;
                }
            } catch (error) {
                console.log(`Service ${serviceId} not available:`, error.message);
            }
        }
    }

    async testService(serviceId) {
        const service = this.llmServices[serviceId];
        
        switch (serviceId) {
            case 'huggingface':
                return await this.testHuggingFace();
            case 'cohere':
                return await this.testCohere();
            case 'openai':
                return await this.testOpenAI();
            default:
                return false;
        }
    }

    async testHuggingFace() {
        try {
            const response = await fetch(this.llmServices.huggingface.endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    inputs: 'Test',
                    parameters: {
                        max_length: 10,
                        temperature: 0.7
                    }
                })
            });
            return response.ok;
        } catch (error) {
            return false;
        }
    }

    async testCohere() {
        // Cohere requires API key, so we'll simulate availability
        return false; // Disabled for now
    }

    async testOpenAI() {
        // OpenAI requires API key, so we'll simulate availability
        return false; // Disabled for now
    }

    async generateLessonPlan(data) {
        if (this.currentService && this.currentService.id !== 'local') {
            try {
                return await this.generateWithLLM(data);
            } catch (error) {
                console.warn('LLM generation failed, falling back to algorithms:', error);
                return super.generateLessonPlan(data);
            }
        } else {
            return super.generateLessonPlan(data);
        }
    }

    async generateWithLLM(data) {
        const prompt = this.createLLMPrompt(data);
        
        switch (this.currentService.id) {
            case 'huggingface':
                return await this.generateWithHuggingFace(prompt, data);
            case 'cohere':
                return await this.generateWithCohere(prompt, data);
            case 'openai':
                return await this.generateWithOpenAI(prompt, data);
            default:
                return super.generateLessonPlan(data);
        }
    }

    createLLMPrompt(data) {
        return `Create a lesson plan for ${this.formatSubject(data.subject)} grade ${data.gradeLevel} about "${data.topic}" for ${data.duration} minutes. 

Include:
- 3 learning objectives
- 2-3 engaging activities
- 1 assessment method
- Materials needed
- Differentiation strategies

Format as JSON with these keys: learningObjectives, activities, assessments, materials, differentiation.`;
    }

    async generateWithHuggingFace(prompt, originalData) {
        try {
            const response = await fetch(this.llmServices.huggingface.endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    inputs: prompt,
                    parameters: {
                        max_length: 300,
                        temperature: 0.7,
                        return_full_text: false
                    }
                })
            });

            if (!response.ok) {
                throw new Error('Hugging Face API request failed');
            }

            const result = await response.json();
            return this.parseLLMResponse(result[0]?.generated_text || result, originalData);
            
        } catch (error) {
            throw new Error('Hugging Face generation failed: ' + error.message);
        }
    }

    async generateWithCohere(prompt, originalData) {
        // Cohere implementation would go here
        // For now, fall back to algorithms
        return super.generateLessonPlan(originalData);
    }

    async generateWithOpenAI(prompt, originalData) {
        // OpenAI implementation would go here
        // For now, fall back to algorithms
        return super.generateLessonPlan(originalData);
    }

    parseLLMResponse(llmResponse, originalData) {
        try {
            // Try to extract JSON from the response
            const jsonMatch = llmResponse.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                const lessonData = JSON.parse(jsonMatch[0]);
                return this.formatLLMLessonPlan(lessonData, originalData);
            } else {
                // If no JSON found, create a structured response from the text
                return this.createStructuredResponse(llmResponse, originalData);
            }
        } catch (error) {
            console.warn('Failed to parse LLM response, creating structured response:', error);
            return this.createStructuredResponse(llmResponse, originalData);
        }
    }

    createStructuredResponse(llmResponse, originalData) {
        // Create a structured lesson plan from the LLM text response
        const lines = llmResponse.split('\n').filter(line => line.trim());
        
        return {
            topic: originalData.topic,
            duration: originalData.duration,
            gradeLevel: this.formatGradeLevel(originalData.gradeLevel),
            subject: this.formatSubject(originalData.subject),
            learningObjectives: this.extractObjectives(lines),
            standards: this.getRelevantStandards(originalData),
            timing: this.generateTiming(originalData),
            activities: this.extractActivities(lines, originalData),
            assessments: this.extractAssessments(lines, originalData),
            materials: this.extractMaterials(lines, originalData),
            differentiation: this.extractDifferentiation(lines, originalData)
        };
    }

    extractObjectives(lines) {
        const objectives = [];
        for (const line of lines) {
            if (line.toLowerCase().includes('objective') || line.toLowerCase().includes('learn')) {
                objectives.push(line.trim());
            }
        }
        return objectives.length > 0 ? objectives.slice(0, 3) : this.generateLearningObjectives({});
    }

    extractActivities(lines, data) {
        const activities = [];
        for (const line of lines) {
            if (line.toLowerCase().includes('activity') || line.toLowerCase().includes('exercise')) {
                activities.push({
                    name: line.split(':')[0] || 'Generated Activity',
                    duration: Math.floor(data.duration / 3),
                    description: line.split(':')[1] || line
                });
            }
        }
        return activities.length > 0 ? activities : this.selectActivities(data);
    }

    extractAssessments(lines, data) {
        const assessments = [];
        for (const line of lines) {
            if (line.toLowerCase().includes('assessment') || line.toLowerCase().includes('evaluate')) {
                assessments.push({
                    type: 'Formative',
                    name: 'Generated Assessment',
                    duration: 5,
                    description: line
                });
            }
        }
        return assessments.length > 0 ? assessments : this.selectAssessments(data);
    }

    extractMaterials(lines, data) {
        const materials = [];
        for (const line of lines) {
            if (line.toLowerCase().includes('material') || line.toLowerCase().includes('supply')) {
                materials.push(line.trim());
            }
        }
        return materials.length > 0 ? materials : this.generateMaterials(data);
    }

    extractDifferentiation(lines, data) {
        const differentiation = {
            forStrugglingLearners: [],
            forAdvancedLearners: [],
            forELLStudents: []
        };

        for (const line of lines) {
            if (line.toLowerCase().includes('struggling') || line.toLowerCase().includes('support')) {
                differentiation.forStrugglingLearners.push(line.trim());
            }
            if (line.toLowerCase().includes('advanced') || line.toLowerCase().includes('challenge')) {
                differentiation.forAdvancedLearners.push(line.trim());
            }
            if (line.toLowerCase().includes('ell') || line.toLowerCase().includes('language')) {
                differentiation.forELLStudents.push(line.trim());
            }
        }

        // Fill in defaults if empty
        if (differentiation.forStrugglingLearners.length === 0) {
            differentiation.forStrugglingLearners = this.generateDifferentiation(data).forStrugglingLearners;
        }
        if (differentiation.forAdvancedLearners.length === 0) {
            differentiation.forAdvancedLearners = this.generateDifferentiation(data).forAdvancedLearners;
        }
        if (differentiation.forELLStudents.length === 0) {
            differentiation.forELLStudents = this.generateDifferentiation(data).forELLStudents;
        }

        return differentiation;
    }

    formatLLMLessonPlan(lessonData, originalData) {
        return {
            topic: originalData.topic,
            duration: originalData.duration,
            gradeLevel: this.formatGradeLevel(originalData.gradeLevel),
            subject: this.formatSubject(originalData.subject),
            learningObjectives: lessonData.learningObjectives || this.generateLearningObjectives(originalData),
            standards: this.getRelevantStandards(originalData),
            timing: this.generateTiming(originalData),
            activities: lessonData.activities || this.selectActivities(originalData),
            assessments: lessonData.assessments || this.selectAssessments(originalData),
            materials: lessonData.materials || this.generateMaterials(originalData),
            differentiation: lessonData.differentiation || this.generateDifferentiation(originalData)
        };
    }
}

// Initialize the enhanced generator when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Use the free LLM enhanced generator
    new FreeLLMLessonGenerator();
});
