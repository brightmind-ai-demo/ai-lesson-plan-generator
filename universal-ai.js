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
            // Primary: Local AI Generation (Always works)
            local: {
                name: 'Local AI Generation',
                endpoint: 'local',
                requiresKey: false,
                description: 'AI-powered content generation (no external APIs)',
                priority: 1
            },
            
            // Secondary: GitHub AI (If token available)
            github: {
                name: 'GitHub AI (GPT-4o)',
                endpoint: 'https://models.github.ai/inference/chat/completions',
                requiresKey: true,
                description: 'GitHub AI with GPT-4o (Best Quality)',
                priority: 2,
                apiKey: this.getGitHubToken()
            },
            
            // Tertiary: Free AI APIs (No token required)
            freeAI: {
                name: 'Free AI (Hugging Face)',
                endpoint: 'https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium',
                requiresKey: false,
                description: 'Free AI generation (may be limited)',
                priority: 3
            }
        };
    }

    getGitHubToken() {
        // Check for token in localStorage first
        let token = localStorage.getItem('github_token');
        
        if (!token) {
            // Check for Codespaces secret
            if (typeof process !== 'undefined' && process.env && process.env.token) {
                token = process.env.token;
                console.log('✅ Using Codespaces secret token');
            } else {
                console.log('⚠️ No GitHub token available');
                return null;
            }
        }
        
        return token;
    }

    addAIControls() {
        // No need to add AI controls - we'll use GitHub AI directly
        // The token is automatically detected from Codespaces secret
        console.log('Using GitHub AI with automatic token detection');
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
        // Always use GitHub AI API - no static data fallback
        console.log('🚀 Calling GitHub AI API...');
        console.log('📝 Topic:', data.topic);
        console.log('📚 Subject:', data.subject);
        console.log('🎓 Grade:', data.gradeLevel);
        console.log('⏱️ Duration:', data.duration);
        
        try {
            const aiResult = await this.generateWithGitHubAI(data);
            console.log('✅ Successfully generated with GitHub AI API');
            return aiResult;
        } catch (error) {
            console.error('❌ GitHub AI API failed:', error.message);
            throw new Error(`AI generation failed: ${error.message}. Please check your token and try again.`);
        }
    }

    async generateWithGitHubAI(data) {
        const prompt = this.createAIPrompt(data);
        const token = this.getGitHubToken();
        
        if (!token) {
            throw new Error('No GitHub token available');
        }
        
        console.log('🌐 Making API call to GitHub AI...');
        console.log('🔗 Endpoint: https://models.github.ai/inference/chat/completions');
        console.log('🤖 Model: gpt-4o');
        console.log('📝 Prompt length:', prompt.length);
        
        try {
            const response = await fetch('https://models.github.ai/inference/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: 'gpt-4o',
                    messages: [{ role: 'user', content: prompt }],
                    max_tokens: 2000,
                    temperature: 0.7
                })
            });

            console.log('📡 API Response Status:', response.status);
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error('❌ API Error Response:', errorText);
                throw new Error(`API request failed: ${response.status} - ${errorText}`);
            }

            const result = await response.json();
            console.log('✅ API Response received:', result);
            console.log('📄 Generated content length:', result.choices?.[0]?.message?.content?.length || 0);
            
            return this.parseGitHubAIResponse(result, data);
            
        } catch (error) {
            console.error('❌ GitHub AI API Error:', error);
            throw error;
        }
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

    // Removed generateWithLocalAI - we only use GitHub AI API now

    createAIPrompt(data) {
        return `Create a comprehensive lesson plan for ${this.formatSubject(data.subject)} grade ${data.gradeLevel} about "${data.topic}" for ${data.duration} minutes. 

Please include:
1. Learning Objectives (3-5 specific, measurable objectives)
2. Materials Needed (specific items required)
3. Activities (detailed step-by-step activities with timing)
4. Assessment Strategies (formative and summative)
5. Differentiation (for struggling learners, advanced learners, ELL students)
6. Standards Alignment (relevant educational standards)
7. Extension Activities (for advanced students)

Make the content specific to the topic "${data.topic}" and appropriate for grade ${data.gradeLevel} students.`;
    }

    parseGitHubAIResponse(result, data) {
        let content = result.choices?.[0]?.message?.content || '';
        
        if (!content) {
            throw new Error('No content generated');
        }
        
        // Parse the AI response into lesson plan format
        return this.parseLessonPlanFromAI(content, data);
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

    // Removed all static data generation methods - we only use GitHub AI API

    // Removed all static data extraction methods - we only use GitHub AI API responses

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
