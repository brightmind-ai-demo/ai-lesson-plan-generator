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
                // Try to get token from prompt if not available
                console.log('⚠️ No GitHub token found. Please enter your token:');
                token = prompt(`Please enter your GitHub token:
                
1. Go to https://github.com/settings/tokens
2. Create a new token with appropriate permissions
3. Copy and paste it here

Token:`);
                if (token && token.startsWith('ghp_')) {
                    localStorage.setItem('github_token', token);
                    console.log('✅ GitHub token saved!');
                } else {
                    console.log('❌ Invalid token format. Should start with "ghp_"');
                    return null;
                }
            }
        }
        
        return token;
    }

    getHuggingFaceToken() {
        // Check for token in localStorage first
        let token = localStorage.getItem('huggingface_token');
        
        if (!token) {
            // Check for Codespaces secret
            if (typeof process !== 'undefined' && process.env && process.env.HUGGINGFACE_TOKEN) {
                token = process.env.HUGGINGFACE_TOKEN;
                console.log('✅ Using Codespaces secret Hugging Face token');
            } else {
                console.log('⚠️ No Hugging Face token available');
                return null;
            }
        }
        
        return token;
    }

    async generateWithHuggingFace(data, token) {
        const prompt = this.createAIPrompt(data);
        
        console.log('🌐 Making API call to Hugging Face...');
        console.log('🔗 Endpoint: https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium');
        console.log('📝 Prompt length:', prompt.length);
        
        try {
            const response = await fetch('https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    inputs: prompt,
                    parameters: {
                        max_length: 1000,
                        temperature: 0.7,
                        do_sample: true
                    }
                })
            });

            console.log('📡 API Response Status:', response.status);
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error('❌ API Error Response:', errorText);
                throw new Error(`Hugging Face API request failed: ${response.status} - ${errorText}`);
            }

            const result = await response.json();
            console.log('✅ API Response received:', result);
            
            return this.parseHuggingFaceResponse(result, data);
            
        } catch (error) {
            console.error('❌ Hugging Face API Error:', error);
            throw error;
        }
    }

    parseHuggingFaceResponse(result, data) {
        let content = '';
        
        if (Array.isArray(result) && result.length > 0) {
            content = result[0].generated_text || '';
        } else if (result.generated_text) {
            content = result.generated_text;
        } else if (typeof result === 'string') {
            content = result;
        }
        
        if (!content) {
            throw new Error('No content generated from Hugging Face API');
        }
        
        // Parse the generated content into lesson plan structure
        return {
            topic: data.topic,
            subject: data.subject,
            gradeLevel: data.gradeLevel,
            duration: data.duration,
            difficulty: data.difficulty || 'intermediate',
            objectives: this.extractObjectives(content),
            activities: this.extractActivities(content),
            materials: this.extractMaterials(content),
            assessment: this.extractAssessment(content),
            differentiation: this.extractDifferentiation(content),
            standards: this.extractStandards(content),
            aiGenerated: true,
            generatedAt: new Date().toLocaleDateString()
        };
    }

    generateWithEducationalAlgorithms(data) {
        console.log('🎯 Generating lesson plan with educational algorithms...');
        
        const lesson = {
            topic: data.topic,
            subject: data.subject,
            gradeLevel: data.gradeLevel,
            duration: data.duration,
            difficulty: data.difficulty || 'intermediate',
            objectives: this.generateObjectives(data),
            activities: this.generateActivities(data),
            materials: this.generateMaterials(data),
            assessment: this.generateAssessment(data),
            differentiation: this.generateDifferentiation(data),
            standards: this.generateStandards(data),
            aiGenerated: false,
            generatedAt: new Date().toLocaleDateString()
        };
        
        console.log('✅ Educational algorithm generation complete');
        return lesson;
    }

    generateObjectives(data) {
        const objectives = [];
        const grade = parseInt(data.gradeLevel.split('-')[0]);
        
        // Bloom's Taxonomy objectives based on grade level
        if (grade <= 2) {
            objectives.push(`Students will identify key concepts about ${data.topic}`);
            objectives.push(`Students will demonstrate understanding through hands-on activities`);
        } else if (grade <= 5) {
            objectives.push(`Students will explain the main concepts of ${data.topic}`);
            objectives.push(`Students will apply knowledge through practical exercises`);
            objectives.push(`Students will analyze information about ${data.topic}`);
        } else if (grade <= 8) {
            objectives.push(`Students will analyze and evaluate information about ${data.topic}`);
            objectives.push(`Students will synthesize knowledge through creative projects`);
            objectives.push(`Students will demonstrate critical thinking skills`);
        } else {
            objectives.push(`Students will critically analyze complex concepts in ${data.topic}`);
            objectives.push(`Students will synthesize information from multiple sources`);
            objectives.push(`Students will create original work demonstrating mastery`);
        }
        
        return objectives;
    }

    generateActivities(data) {
        const activities = [];
        const duration = parseInt(data.duration);
        const grade = parseInt(data.gradeLevel.split('-')[0]);
        
        // Introduction activity (10-15% of time)
        const introTime = Math.max(5, Math.round(duration * 0.15));
        activities.push({
            name: `Introduction to ${data.topic}`,
            duration: `${introTime} minutes`,
            description: `Engage students with a hook activity related to ${data.topic}`,
            type: 'introduction'
        });
        
        // Main learning activities (60-70% of time)
        const mainTime = Math.round(duration * 0.6);
        if (grade <= 2) {
            activities.push({
                name: `Hands-on Exploration`,
                duration: `${mainTime} minutes`,
                description: `Interactive exploration of ${data.topic} through manipulatives and visual aids`,
                type: 'main'
            });
        } else if (grade <= 5) {
            activities.push({
                name: `Guided Discovery`,
                duration: `${Math.round(mainTime * 0.6)} minutes`,
                description: `Structured exploration of ${data.topic} with teacher guidance`,
                type: 'main'
            });
            activities.push({
                name: `Collaborative Learning`,
                duration: `${Math.round(mainTime * 0.4)} minutes`,
                description: `Group work to deepen understanding of ${data.topic}`,
                type: 'main'
            });
        } else {
            activities.push({
                name: `Independent Research`,
                duration: `${Math.round(mainTime * 0.4)} minutes`,
                description: `Students research aspects of ${data.topic} independently`,
                type: 'main'
            });
            activities.push({
                name: `Discussion and Analysis`,
                duration: `${Math.round(mainTime * 0.6)} minutes`,
                description: `Class discussion analyzing different perspectives on ${data.topic}`,
                type: 'main'
            });
        }
        
        // Practice/Application activity (15-20% of time)
        const practiceTime = Math.round(duration * 0.2);
        activities.push({
            name: `Practice and Application`,
            duration: `${practiceTime} minutes`,
            description: `Students apply their knowledge through exercises related to ${data.topic}`,
            type: 'practice'
        });
        
        return activities;
    }

    generateMaterials(data) {
        const materials = [];
        const grade = parseInt(data.gradeLevel.split('-')[0]);
        
        // Basic materials for all grades
        materials.push('Whiteboard or chart paper');
        materials.push('Markers or chalk');
        
        if (grade <= 2) {
            materials.push('Visual aids and pictures');
            materials.push('Manipulatives or hands-on objects');
            materials.push('Colored pencils and paper');
        } else if (grade <= 5) {
            materials.push('Textbooks or reference materials');
            materials.push('Worksheets or activity sheets');
            materials.push('Art supplies for projects');
        } else if (grade <= 8) {
            materials.push('Research materials (books, articles)');
            materials.push('Technology devices (if available)');
            materials.push('Presentation materials');
        } else {
            materials.push('Advanced reference materials');
            materials.push('Technology for research and presentation');
            materials.push('Writing materials for essays or reports');
        }
        
        // Subject-specific materials
        if (data.subject === 'science') {
            materials.push('Science equipment or models');
            materials.push('Safety materials (if needed)');
        } else if (data.subject === 'math') {
            materials.push('Calculators (if appropriate)');
            materials.push('Graph paper or rulers');
        } else if (data.subject === 'history') {
            materials.push('Historical documents or primary sources');
            materials.push('Maps or timelines');
        }
        
        return materials;
    }

    generateAssessment(data) {
        const grade = parseInt(data.gradeLevel.split('-')[0]);
        const assessments = [];
        
        if (grade <= 2) {
            assessments.push('Observation of student participation');
            assessments.push('Simple oral questions and answers');
            assessments.push('Drawing or visual representation of learning');
        } else if (grade <= 5) {
            assessments.push('Quick quiz or exit ticket');
            assessments.push('Student presentations or demonstrations');
            assessments.push('Portfolio of completed work');
        } else if (grade <= 8) {
            assessments.push('Written reflection or journal entry');
            assessments.push('Group project evaluation');
            assessments.push('Peer assessment activities');
        } else {
            assessments.push('Essay or written analysis');
            assessments.push('Research project presentation');
            assessments.push('Peer review and self-assessment');
        }
        
        return assessments;
    }

    generateDifferentiation(data) {
        return {
            struggling: [
                'Provide additional visual aids and examples',
                'Break down complex concepts into smaller parts',
                'Offer one-on-one support during activities',
                'Use simplified language and vocabulary'
            ],
            advanced: [
                'Provide extension activities and challenges',
                'Encourage independent research and exploration',
                'Assign leadership roles in group activities',
                'Offer opportunities for creative expression'
            ],
            ell: [
                'Use visual supports and gestures',
                'Provide vocabulary lists and definitions',
                'Pair with native speakers for support',
                'Use multimedia resources when available'
            ]
        };
    }

    generateStandards(data) {
        // This would typically align with specific educational standards
        // For now, providing general framework
        return [
            `Students will demonstrate understanding of ${data.topic}`,
            `Students will apply critical thinking skills`,
            `Students will communicate effectively about ${data.topic}`,
            `Students will collaborate with peers during learning activities`
        ];
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
        console.log('🚀 Starting lesson plan generation...');
        console.log('📝 Topic:', data.topic);
        console.log('📚 Subject:', data.subject);
        console.log('🎓 Grade:', data.gradeLevel);
        console.log('⏱️ Duration:', data.duration);
        
        // Try Hugging Face first if token is available
        const hfToken = this.getHuggingFaceToken();
        if (hfToken) {
            try {
                console.log('🤖 Using Hugging Face API...');
                const aiResult = await this.generateWithHuggingFace(data, hfToken);
                console.log('✅ Successfully generated with Hugging Face API');
                return aiResult;
            } catch (error) {
                console.warn('⚠️ Hugging Face failed, falling back to educational algorithms:', error.message);
            }
        } else {
            console.log('📚 No Hugging Face token available, using educational algorithms...');
        }
        
        // Fallback to educational algorithms
        console.log('🎯 Generating with educational algorithms...');
        return this.generateWithEducationalAlgorithms(data);
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
