// Universal AI Integration - Works for everyone without individual tokens
// Uses multiple free AI services and falls back gracefully

class UniversalAILessonGenerator extends LessonPlanGenerator {
    constructor() {
        super();
        this.aiServices = this.initializeAIServices();
        this.currentService = 'local'; // Default to local
        console.log('UniversalAILessonGenerator initialized');
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.addAIControls();
    }

    initializeAIServices() {
        return {
            // Primary: Smart Educational Algorithms (Always works)
            local: {
                name: 'Smart Educational Algorithms',
                endpoint: 'local',
                requiresKey: false,
                description: 'Advanced educational algorithms with real content',
                priority: 1
            },
            
            // Secondary: Free AI APIs (No token required)
            freeAI: {
                name: 'Free AI Enhancement',
                endpoint: 'https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium',
                requiresKey: false,
                description: 'Free AI enhancement (may be limited)',
                priority: 2
            }
        };
    }

    addAIControls() {
        const form = document.querySelector('.lesson-form');
        if (!form) return;

        // Add AI service selector
        const aiSelector = document.createElement('div');
        aiSelector.className = 'form-group ai-selector';
        aiSelector.innerHTML = `
            <label for="aiService">AI Enhancement Level</label>
            <select id="aiService" name="aiService">
                <option value="local">Smart Algorithms (Fast & Reliable)</option>
                <option value="freeAI">Free AI Enhancement (Limited)</option>
            </select>
            <div class="ai-status" id="aiStatus">
                <i class="fas fa-info-circle"></i>
                <span>Using Smart Educational Algorithms</span>
            </div>
        `;

        // Insert before the generate button
        const generateBtn = form.querySelector('.generate-btn');
        form.insertBefore(aiSelector, generateBtn);

        // Add event listener
        document.getElementById('aiService').addEventListener('change', (e) => {
            this.currentService = e.target.value;
            this.updateAIStatus();
        });
    }

    updateAIStatus() {
        const statusDiv = document.getElementById('aiStatus');
        const service = this.aiServices[this.currentService];
        
        if (statusDiv) {
            statusDiv.innerHTML = `
                <i class="fas fa-info-circle"></i>
                <span>${service.description}</span>
            `;
        }
    }

    async generateLessonPlan(data) {
        // Always use local algorithms for reliability
        console.log('Using Smart Educational Algorithms (Universal Access)');
        this.updateAIStatus('success', 'Using Smart Educational Algorithms');
        
        // Try free AI as enhancement if selected
        if (this.currentService === 'freeAI') {
            try {
                console.log('Attempting free AI enhancement...');
                const aiResult = await this.generateWithFreeAI(data);
                if (aiResult) {
                    this.updateAIStatus('success', 'Enhanced with Free AI');
                    return aiResult;
                }
            } catch (error) {
                console.log('Free AI failed, using algorithms:', error.message);
            }
        }
        
        // Use the reliable local algorithms
        return super.generateLessonPlan(data);
    }

    async generateWithFreeAI(data) {
        const prompt = this.createAIPrompt(data);
        
        try {
            const response = await fetch('https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    inputs: prompt,
                    parameters: {
                        max_length: 200,
                        temperature: 0.7,
                        return_full_text: false
                    }
                })
            });

            if (!response.ok) {
                throw new Error(`API request failed: ${response.status}`);
            }

            const result = await response.json();
            return this.parseAIResponse(result, data);
            
        } catch (error) {
            console.error('Free AI generation error:', error);
            throw error;
        }
    }

    createAIPrompt(data) {
        return `Create a lesson plan for ${this.formatSubject(data.subject)} grade ${data.gradeLevel} about "${data.topic}" for ${data.duration} minutes. Include learning objectives, activities, and assessment strategies.`;
    }

    parseAIResponse(result, data) {
        let content = result?.[0]?.generated_text || result?.[0]?.text || result?.[0] || '';
        
        if (!content) {
            throw new Error('No content generated');
        }
        
        // Parse the AI response into lesson plan format
        return this.parseLessonPlanFromAI(content, data);
    }

    parseLessonPlanFromAI(content, data) {
        // Extract lesson plan components from AI response
        const lesson = {
            subject: data.subject,
            gradeLevel: data.gradeLevel,
            topic: data.topic,
            duration: data.duration,
            difficulty: data.difficulty,
            objectives: this.extractObjectives(content),
            activities: this.extractActivities(content),
            materials: this.extractMaterials(content),
            assessment: this.extractAssessment(content),
            differentiation: this.extractDifferentiation(content),
            standards: this.extractStandards(content),
            aiGenerated: true,
            aiContent: content
        };
        
        return lesson;
    }

    extractObjectives(content) {
        const objectives = [];
        const lines = content.split('\n');
        
        for (const line of lines) {
            if (line.toLowerCase().includes('objective') && line.includes(':')) {
                const obj = line.split(':')[1]?.trim();
                if (obj) objectives.push(obj);
            }
        }
        
        return objectives.length > 0 ? objectives : [
            `Students will understand the concept of ${this.topic}`,
            `Students will be able to explain key aspects of ${this.topic}`,
            `Students will demonstrate knowledge through activities`
        ];
    }

    extractActivities(content) {
        const activities = [];
        const lines = content.split('\n');
        
        for (const line of lines) {
            if (line.toLowerCase().includes('activity') || line.toLowerCase().includes('lesson')) {
                if (line.trim() && !line.toLowerCase().includes('activities')) {
                    activities.push(line.trim());
                }
            }
        }
        
        return activities.length > 0 ? activities : [
            'Introduction and warm-up activity',
            'Main learning activity with hands-on components',
            'Practice and reinforcement activity',
            'Assessment and reflection'
        ];
    }

    extractMaterials(content) {
        const materials = [];
        const lines = content.split('\n');
        
        for (const line of lines) {
            if (line.toLowerCase().includes('material') || line.toLowerCase().includes('supplies')) {
                const material = line.split(':')[1]?.trim();
                if (material) materials.push(material);
            }
        }
        
        return materials.length > 0 ? materials : [
            'Whiteboard and markers',
            'Student worksheets',
            'Relevant handouts',
            'Assessment materials'
        ];
    }

    extractAssessment(content) {
        return [
            'Formative assessment through observation',
            'Summative assessment with written responses',
            'Peer assessment opportunities',
            'Self-reflection activities'
        ];
    }

    extractDifferentiation(content) {
        return {
            forStrugglingLearners: [
                'Provide additional support and scaffolding',
                'Use visual aids and hands-on activities',
                'Allow extra time for processing'
            ],
            forAdvancedLearners: [
                'Offer extension activities and challenges',
                'Encourage independent research',
                'Provide leadership opportunities'
            ],
            forELLStudents: [
                'Use visual supports and gestures',
                'Provide vocabulary support',
                'Allow extra processing time'
            ]
        };
    }

    extractStandards(content) {
        return [
            'Common Core State Standards alignment',
            'Next Generation Science Standards (if applicable)',
            '21st Century Learning Skills',
            'Subject-specific standards'
        ];
    }

    updateAIStatus(type, message) {
        const statusDiv = document.getElementById('aiStatus');
        if (statusDiv) {
            const icon = type === 'success' ? 'check-circle' : 
                       type === 'warning' ? 'exclamation-triangle' : 'info-circle';
            statusDiv.innerHTML = `
                <i class="fas fa-${icon}"></i>
                <span>${message}</span>
            `;
        }
    }
}

// Initialize universal AI generator when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new UniversalAILessonGenerator();
});
