// Working LLM Integration for GitHub Pages
// Actually makes API calls and provides real output

class WorkingLLMLessonGenerator extends LessonPlanGenerator {
    constructor() {
        super();
        this.llmServices = this.initializeWorkingServices();
        this.currentService = 'local'; // Default to local
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.addLLMControls();
        this.testServices();
    }

    initializeWorkingServices() {
        return {
            // Hugging Face Inference API (Free tier)
            huggingface: {
                name: 'Hugging Face AI (Free)',
                endpoint: 'https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium',
                requiresKey: false,
                maxTokens: 200,
                description: 'Free AI model for text generation'
            },
            
            // Alternative Hugging Face model
            huggingface2: {
                name: 'Hugging Face GPT-2 (Free)',
                endpoint: 'https://api-inference.huggingface.co/models/gpt2',
                requiresKey: false,
                maxTokens: 150,
                description: 'GPT-2 model for text generation'
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
                <option value="huggingface2">Hugging Face GPT-2 (Free)</option>
            </select>
            <div class="llm-status" id="llmStatus">
                <i class="fas fa-cogs"></i>
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
        this.currentService = serviceId;
        this.updateStatus();
    }

    updateStatus() {
        const statusDiv = document.getElementById('llmStatus');
        if (!statusDiv) return;

        const service = this.llmServices[this.currentService];
        
        if (this.currentService === 'local') {
            statusDiv.innerHTML = `
                <i class="fas fa-cogs"></i>
                <span>Smart algorithms selected - works immediately!</span>
            `;
        } else {
            statusDiv.innerHTML = `
                <i class="fas fa-robot"></i>
                <span>${service.name} selected - enhanced AI generation enabled!</span>
            `;
        }
    }

    async testServices() {
        // Test Hugging Face services
        const hfAvailable = await this.testHuggingFace();
        if (hfAvailable) {
            this.selectService('huggingface');
        }
    }

    async testHuggingFace() {
        try {
            const response = await fetch('https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    inputs: 'Test lesson plan for',
                    parameters: {
                        max_length: 20,
                        temperature: 0.7
                    }
                })
            });
            
            if (response.ok) {
                const result = await response.json();
                console.log('Hugging Face API working:', result);
                return true;
            }
            return false;
        } catch (error) {
            console.log('Hugging Face API not available:', error.message);
            return false;
        }
    }

    async generateLessonPlan(data) {
        if (this.currentService !== 'local') {
            try {
                console.log('Generating with LLM service:', this.currentService);
                return await this.generateWithLLM(data);
            } catch (error) {
                console.warn('LLM generation failed, falling back to algorithms:', error);
                this.updateStatusWithError('LLM failed, using smart algorithms');
                return super.generateLessonPlan(data);
            }
        } else {
            return super.generateLessonPlan(data);
        }
    }

    async generateWithLLM(data) {
        const prompt = this.createLLMPrompt(data);
        console.log('LLM Prompt:', prompt);
        
        try {
            const response = await fetch(this.llmServices[this.currentService].endpoint, {
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
                throw new Error(`API request failed: ${response.status}`);
            }

            const result = await response.json();
            console.log('LLM Response:', result);
            
            return this.parseLLMResponse(result, data);
            
        } catch (error) {
            console.error('LLM generation error:', error);
            throw error;
        }
    }

    createLLMPrompt(data) {
        return `Create a lesson plan for ${this.formatSubject(data.subject)} grade ${data.gradeLevel} about "${data.topic}" for ${data.duration} minutes.

Learning objectives:
- Students will understand the concept of ${data.topic}
- Students will be able to apply their knowledge
- Students will demonstrate learning through activities

Activities:
1. Introduction activity (10 minutes)
2. Main learning activity (20 minutes)  
3. Practice activity (15 minutes)
4. Assessment (5 minutes)

Materials needed:
- Whiteboard
- Student materials
- Assessment tools

Differentiation:
- For struggling learners: provide extra support
- For advanced learners: add challenges
- For ELL students: use visual aids

Format this as a structured lesson plan.`;
    }

    parseLLMResponse(llmResponse, originalData) {
        console.log('Parsing LLM response:', llmResponse);
        
        // Handle different response formats
        let responseText = '';
        if (Array.isArray(llmResponse) && llmResponse.length > 0) {
            responseText = llmResponse[0].generated_text || llmResponse[0].text || '';
        } else if (typeof llmResponse === 'string') {
            responseText = llmResponse;
        } else if (llmResponse.generated_text) {
            responseText = llmResponse.generated_text;
        } else {
            responseText = JSON.stringify(llmResponse);
        }

        console.log('Extracted text:', responseText);

        // Create a structured lesson plan from the LLM response
        return {
            topic: originalData.topic,
            duration: originalData.duration,
            gradeLevel: this.formatGradeLevel(originalData.gradeLevel),
            subject: this.formatSubject(originalData.subject),
            learningObjectives: this.extractObjectives(responseText, originalData),
            standards: this.getRelevantStandards(originalData),
            timing: this.generateTiming(originalData),
            activities: this.extractActivities(responseText, originalData),
            assessments: this.extractAssessments(responseText, originalData),
            materials: this.extractMaterials(responseText, originalData),
            differentiation: this.extractDifferentiation(responseText, originalData),
            llmGenerated: true,
            llmResponse: responseText.substring(0, 200) + '...' // Show first 200 chars
        };
    }

    extractObjectives(text, originalData) {
        const objectives = [];
        const lines = text.split('\n');
        
        for (const line of lines) {
            if (line.toLowerCase().includes('objective') || line.toLowerCase().includes('learn') || line.toLowerCase().includes('understand')) {
                const cleanLine = line.replace(/^\d+\.?\s*/, '').replace(/^[-*]\s*/, '').trim();
                if (cleanLine.length > 10) {
                    objectives.push(cleanLine);
                }
            }
        }
        
        // If no objectives found, generate some
        if (objectives.length === 0) {
            objectives.push(`Students will understand the concept of ${originalData.topic}`);
            objectives.push(`Students will be able to apply their knowledge of ${originalData.topic}`);
            objectives.push(`Students will demonstrate learning through activities`);
        }
        
        return objectives.slice(0, 3);
    }

    extractActivities(text, originalData) {
        const activities = [];
        const lines = text.split('\n');
        let activityCount = 0;
        
        for (const line of lines) {
            if (line.toLowerCase().includes('activity') || line.toLowerCase().includes('exercise') || line.toLowerCase().includes('practice')) {
                const cleanLine = line.replace(/^\d+\.?\s*/, '').replace(/^[-*]\s*/, '').trim();
                if (cleanLine.length > 10) {
                    activities.push({
                        name: `Activity ${activityCount + 1}`,
                        duration: Math.floor(originalData.duration / 3),
                        description: cleanLine
                    });
                    activityCount++;
                }
            }
        }
        
        // If no activities found, generate some
        if (activities.length === 0) {
            activities.push({
                name: 'Introduction Activity',
                duration: Math.floor(originalData.duration * 0.2),
                description: `Introduce students to ${originalData.topic} through discussion and examples`
            });
            activities.push({
                name: 'Main Learning Activity',
                duration: Math.floor(originalData.duration * 0.5),
                description: `Engage students in hands-on learning about ${originalData.topic}`
            });
            activities.push({
                name: 'Practice Activity',
                duration: Math.floor(originalData.duration * 0.3),
                description: `Students practice and apply their knowledge of ${originalData.topic}`
            });
        }
        
        return activities;
    }

    extractAssessments(text, originalData) {
        const assessments = [];
        const lines = text.split('\n');
        
        for (const line of lines) {
            if (line.toLowerCase().includes('assessment') || line.toLowerCase().includes('evaluate') || line.toLowerCase().includes('test')) {
                const cleanLine = line.replace(/^\d+\.?\s*/, '').replace(/^[-*]\s*/, '').trim();
                if (cleanLine.length > 10) {
                    assessments.push({
                        type: 'Formative',
                        name: 'Generated Assessment',
                        duration: 5,
                        description: cleanLine
                    });
                }
            }
        }
        
        // If no assessments found, generate some
        if (assessments.length === 0) {
            assessments.push({
                type: 'Formative',
                name: 'Exit Ticket',
                duration: 5,
                description: `Students write one thing they learned about ${originalData.topic}`
            });
        }
        
        return assessments;
    }

    extractMaterials(text, originalData) {
        const materials = [];
        const lines = text.split('\n');
        
        for (const line of lines) {
            if (line.toLowerCase().includes('material') || line.toLowerCase().includes('supply') || line.toLowerCase().includes('need')) {
                const cleanLine = line.replace(/^\d+\.?\s*/, '').replace(/^[-*]\s*/, '').trim();
                if (cleanLine.length > 5) {
                    materials.push(cleanLine);
                }
            }
        }
        
        // If no materials found, generate some
        if (materials.length === 0) {
            materials.push('Whiteboard and markers');
            materials.push('Student notebooks');
            materials.push('Pencils and erasers');
            materials.push('Relevant handouts or worksheets');
        }
        
        return materials;
    }

    extractDifferentiation(text, originalData) {
        const differentiation = {
            forStrugglingLearners: [],
            forAdvancedLearners: [],
            forELLStudents: []
        };

        const lines = text.split('\n');
        
        for (const line of lines) {
            if (line.toLowerCase().includes('struggling') || line.toLowerCase().includes('support') || line.toLowerCase().includes('help')) {
                const cleanLine = line.replace(/^\d+\.?\s*/, '').replace(/^[-*]\s*/, '').trim();
                if (cleanLine.length > 10) {
                    differentiation.forStrugglingLearners.push(cleanLine);
                }
            }
            if (line.toLowerCase().includes('advanced') || line.toLowerCase().includes('challenge') || line.toLowerCase().includes('extend')) {
                const cleanLine = line.replace(/^\d+\.?\s*/, '').replace(/^[-*]\s*/, '').trim();
                if (cleanLine.length > 10) {
                    differentiation.forAdvancedLearners.push(cleanLine);
                }
            }
            if (line.toLowerCase().includes('ell') || line.toLowerCase().includes('language') || line.toLowerCase().includes('visual')) {
                const cleanLine = line.replace(/^\d+\.?\s*/, '').replace(/^[-*]\s*/, '').trim();
                if (cleanLine.length > 10) {
                    differentiation.forELLStudents.push(cleanLine);
                }
            }
        }

        // Fill in defaults if empty
        if (differentiation.forStrugglingLearners.length === 0) {
            differentiation.forStrugglingLearners = [
                'Provide additional support and scaffolding',
                'Break tasks into smaller steps',
                'Offer extra practice opportunities'
            ];
        }
        if (differentiation.forAdvancedLearners.length === 0) {
            differentiation.forAdvancedLearners = [
                'Provide extension activities and challenges',
                'Encourage independent research',
                'Offer leadership opportunities'
            ];
        }
        if (differentiation.forELLStudents.length === 0) {
            differentiation.forELLStudents = [
                'Use visual supports and gestures',
                'Provide vocabulary support',
                'Allow extra processing time'
            ];
        }

        return differentiation;
    }

    updateStatusWithError(message) {
        const statusDiv = document.getElementById('llmStatus');
        if (statusDiv) {
            statusDiv.innerHTML = `
                <i class="fas fa-exclamation-triangle"></i>
                <span>${message}</span>
            `;
            statusDiv.className = 'llm-status error';
        }
    }

    formatLessonPlan(lesson) {
        let basePlan = super.formatLessonPlan(lesson);
        
        // Add LLM-specific information
        if (lesson.llmGenerated) {
            basePlan += `
                <div class="lesson-plan-section">
                    <h3>🤖 AI Enhancement</h3>
                    <p><strong>Generated by:</strong> ${this.llmServices[this.currentService].name}</p>
                    <p><strong>AI Response Preview:</strong> ${lesson.llmResponse}</p>
                </div>
            `;
        }
        
        return basePlan;
    }
}

// Initialize the working LLM generator when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Use the working LLM enhanced generator
    new WorkingLLMLessonGenerator();
});
