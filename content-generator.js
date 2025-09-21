// Content Generator - AI-powered educational content creation
class ContentGenerator {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        const form = document.getElementById('contentForm');
        const regenerateBtn = document.getElementById('regenerateContent');
        const downloadBtn = document.getElementById('downloadContent');

        form.addEventListener('submit', (e) => this.handleFormSubmit(e));
        regenerateBtn?.addEventListener('click', () => this.regenerateContent());
        downloadBtn?.addEventListener('click', () => this.downloadContent());
    }

    async handleFormSubmit(e) {
        e.preventDefault();
        
        if (!this.validateForm()) {
            return;
        }

        const formData = this.getFormData();
        this.showLoading();
        
        try {
            console.log('🚀 Generating content with GitHub AI API...');
            const content = await this.generateContentWithAI(formData);
            this.displayResults(content);
        } catch (error) {
            console.error('❌ Content generation failed:', error);
            this.showContentError(error.message);
        }
    }

    validateForm() {
        const requiredFields = ['contentTopic', 'contentSubject', 'contentGrade', 'contentType'];
        let isValid = true;

        requiredFields.forEach(fieldName => {
            const field = document.getElementById(fieldName);
            if (!field.value.trim()) {
                field.style.borderColor = '#dc3545';
                isValid = false;
            } else {
                field.style.borderColor = '#28a745';
            }
        });

        return isValid;
    }

    getFormData() {
        return {
            topic: document.getElementById('contentTopic').value,
            subject: document.getElementById('contentSubject').value,
            grade: document.getElementById('contentGrade').value,
            type: document.getElementById('contentType').value,
            description: document.getElementById('contentDescription').value
        };
    }

    showLoading() {
        document.getElementById('contentLoading').classList.remove('hidden');
        document.getElementById('contentResults').classList.add('hidden');
    }

    displayResults(content) {
        document.getElementById('contentLoading').classList.add('hidden');
        document.getElementById('contentResults').classList.remove('hidden');
        
        const contentDisplay = document.getElementById('contentDisplay');
        contentDisplay.innerHTML = this.formatContent(content);
    }

    async generateContentWithAI(data) {
        const prompt = this.createContentPrompt(data);
        const token = this.getGitHubToken();
        
        if (!token) {
            throw new Error('No GitHub token available');
        }
        
        console.log('🌐 Making API call to GitHub AI for content generation...');
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
            
            return this.parseContentResponse(result, data);
            
        } catch (error) {
            console.error('❌ GitHub AI API Error:', error);
            throw error;
        }
    }

    createContentPrompt(data) {
        return `Create educational content for "${data.topic}" - ${data.type} for ${data.grade} students studying ${data.subject}.

Requirements:
- Content type: ${data.type}
- Grade level: ${data.grade}
- Subject: ${data.subject}
- Topic: ${data.topic}
- Additional requirements: ${data.description || 'None specified'}

Please create comprehensive educational content that includes:
1. Clear title and instructions
2. Main content appropriate for the grade level
3. Activities and exercises
4. Assessment strategies
5. Materials needed
6. Learning objectives

Format the response as a structured educational resource that teachers can use immediately.`;
    }

    parseContentResponse(result, data) {
        const content = result.choices?.[0]?.message?.content || '';
        
        if (!content) {
            throw new Error('No content generated');
        }
        
        return {
            topic: data.topic,
            subject: data.subject,
            grade: data.grade,
            type: data.type,
            description: data.description,
            title: this.extractTitle(content, data),
            instructions: this.extractInstructions(content),
            content: content,
            activities: this.extractActivities(content),
            assessment: this.extractAssessment(content),
            materials: this.extractMaterials(content),
            aiGenerated: true,
            timestamp: new Date().toISOString()
        };
    }

    extractTitle(content, data) {
        const lines = content.split('\n');
        for (const line of lines) {
            if (line.includes('#') || line.includes('Title:')) {
                return line.replace(/^#+\s*/, '').replace(/^Title:\s*/, '').trim();
            }
        }
        return `${data.type} - ${data.topic} (Grade ${data.grade})`;
    }

    extractInstructions(content) {
        const lines = content.split('\n');
        for (const line of lines) {
            if (line.toLowerCase().includes('instruction') || line.toLowerCase().includes('directions')) {
                return line.replace(/^.*instruction[s]?:\s*/i, '').replace(/^.*direction[s]?:\s*/i, '').trim();
            }
        }
        return 'Follow the instructions provided in the content.';
    }

    extractActivities(content) {
        const activities = [];
        const lines = content.split('\n');
        
        for (const line of lines) {
            if (line.toLowerCase().includes('activity') || line.toLowerCase().includes('exercise')) {
                if (line.trim() && !line.toLowerCase().includes('activities')) {
                    activities.push(line.trim());
                }
            }
        }
        
        return activities.length > 0 ? activities : ['Complete the provided exercises'];
    }

    extractAssessment(content) {
        const assessments = [];
        const lines = content.split('\n');
        
        for (const line of lines) {
            if (line.toLowerCase().includes('assessment') || line.toLowerCase().includes('evaluation')) {
                if (line.trim() && !line.toLowerCase().includes('assessments')) {
                    assessments.push(line.trim());
                }
            }
        }
        
        return assessments.length > 0 ? assessments : ['Review student work and provide feedback'];
    }

    extractMaterials(content) {
        const materials = [];
        const lines = content.split('\n');
        
        for (const line of lines) {
            if (line.toLowerCase().includes('material') || line.toLowerCase().includes('supplies')) {
                if (line.trim() && !line.toLowerCase().includes('materials')) {
                    materials.push(line.trim());
                }
            }
        }
        
        return materials.length > 0 ? materials : ['Basic writing materials'];
    }

    getGitHubToken() {
        // Check for token in localStorage first
        let token = localStorage.getItem('github_token');
        
        if (!token) {
            // Check for Codespaces secret
            if (typeof process !== 'undefined' && process.env && process.env.token) {
                token = process.env.token;
                console.log('✅ Using Codespaces secret token for content generation');
            } else {
                console.log('⚠️ No GitHub token available for content generation');
                return null;
            }
        }
        
        return token;
    }

    showContentError(message) {
        const loadingSection = document.getElementById('contentLoading');
        const resultsSection = document.getElementById('contentResults');
        
        if (loadingSection) {
            loadingSection.classList.add('hidden');
        }
        
        if (resultsSection) {
            resultsSection.classList.remove('hidden');
            resultsSection.innerHTML = `
                <div class="error-message">
                    <h3>❌ Content Generation Failed</h3>
                    <p>${message}</p>
                    <button onclick="location.reload()" class="btn-primary">Try Again</button>
                </div>
            `;
        }
    }

    generateTitle(data) {
        const typeMap = {
            'worksheet': 'Worksheet',
            'handout': 'Handout',
            'reading': 'Reading Comprehension',
            'activity': 'Activity Sheet',
            'assessment': 'Assessment'
        };
        
        return `${typeMap[data.type]} - ${data.topic} (Grade ${data.grade})`;
    }

    generateInstructions(data) {
        const gradeLevel = this.getGradeLevel(data.grade);
        const subjectName = this.getSubjectName(data.subject);
        
        return `This ${data.type} is designed for ${gradeLevel} students studying ${subjectName}. The content focuses on ${data.topic} and includes age-appropriate activities and assessments.`;
    }

    generateContentBody(data) {
        const topic = data.topic;
        const subject = data.subject;
        const grade = data.grade;
        const type = data.type;
        
        let content = `# ${topic} - ${this.getSubjectName(subject)}\n\n`;
        
        if (type === 'worksheet') {
            content += this.generateWorksheetContent(topic, subject, grade);
        } else if (type === 'handout') {
            content += this.generateHandoutContent(topic, subject, grade);
        } else if (type === 'reading') {
            content += this.generateReadingContent(topic, subject, grade);
        } else if (type === 'activity') {
            content += this.generateActivityContent(topic, subject, grade);
        } else if (type === 'assessment') {
            content += this.generateAssessmentContent(topic, subject, grade);
        }
        
        return content;
    }

    generateWorksheetContent(topic, subject, grade) {
        return `## Worksheet: ${topic}

### Instructions
Complete the following activities related to ${topic}.

### Part 1: Knowledge Check
1. Define ${topic} in your own words.
2. List three key characteristics of ${topic}.
3. Explain why ${topic} is important in ${this.getSubjectName(subject)}.

### Part 2: Application
1. Create a diagram showing the main components of ${topic}.
2. Write a short paragraph explaining how ${topic} relates to your daily life.
3. Identify three examples of ${topic} in the real world.

### Part 3: Critical Thinking
1. Compare and contrast ${topic} with a related concept.
2. What questions do you still have about ${topic}?
3. How might ${topic} change in the future?`;
    }

    generateHandoutContent(topic, subject, grade) {
        return `## Handout: ${topic}

### Key Concepts
- **Definition**: ${topic} is...
- **Importance**: ${topic} plays a crucial role in...
- **Applications**: ${topic} is used in...

### Important Facts
1. ${topic} was first discovered/developed in...
2. The main components of ${topic} include...
3. ${topic} is essential for...

### Key Terms
- **Term 1**: Definition
- **Term 2**: Definition
- **Term 3**: Definition

### Study Tips
- Review the key concepts regularly
- Practice with examples
- Ask questions when you need clarification`;
    }

    generateReadingContent(topic, subject, grade) {
        return `## Reading Comprehension: ${topic}

### Reading Passage
${topic} is a fascinating subject that has captured the attention of students and researchers for many years. This topic is particularly important in ${this.getSubjectName(subject)} because it helps us understand...

[The passage would continue with detailed information about ${topic}, written at an appropriate reading level for grade ${grade} students.]

### Comprehension Questions
1. What is the main idea of this passage?
2. According to the passage, why is ${topic} important?
3. What are three key points mentioned about ${topic}?
4. How does the author support their claims about ${topic}?
5. What can you infer about ${topic} from this passage?

### Vocabulary
- **Word 1**: Definition and context
- **Word 2**: Definition and context
- **Word 3**: Definition and context`;
    }

    generateActivityContent(topic, subject, grade) {
        return `## Activity: ${topic}

### Objective
Students will explore ${topic} through hands-on activities and develop a deeper understanding of the concept.

### Materials Needed
- Paper and pencils
- Colored markers or crayons
- Reference materials
- Internet access (if available)

### Activity Instructions
1. **Introduction** (10 minutes)
   - Discuss what students already know about ${topic}
   - Introduce key vocabulary related to ${topic}

2. **Main Activity** (30 minutes)
   - Students work in pairs or small groups
   - Complete the ${topic} exploration worksheet
   - Create a visual representation of ${topic}

3. **Wrap-up** (10 minutes)
   - Share findings with the class
   - Discuss what was learned about ${topic}

### Assessment
- Participation in group discussions
- Quality of visual representation
- Understanding demonstrated in wrap-up discussion`;
    }

    generateAssessmentContent(topic, subject, grade) {
        return `## Assessment: ${topic}

### Instructions
Complete all questions. Show your work for calculation problems.

### Multiple Choice (Choose the best answer)
1. What is the primary characteristic of ${topic}?
   a) Option A
   b) Option B
   c) Option C
   d) Option D

2. Which of the following best describes ${topic}?
   a) Option A
   b) Option B
   c) Option C
   d) Option D

### Short Answer
1. Explain the importance of ${topic} in ${this.getSubjectName(subject)}.

2. Describe how ${topic} relates to other concepts you've learned.

### Essay Question
Write a paragraph explaining what you learned about ${topic} and how it applies to real-world situations.`;
    }

    generateActivities(data) {
        return [
            `Introduction to ${data.topic}`,
            `Hands-on exploration of ${data.topic}`,
            `Group discussion about ${data.topic}`,
            `Individual reflection on ${data.topic}`
        ];
    }

    generateAssessment(data) {
        return [
            `Formative assessment through observation`,
            `Summative assessment with written responses`,
            `Peer assessment of group work`,
            `Self-reflection on learning progress`
        ];
    }

    generateMaterials(data) {
        return [
            `Paper and writing materials`,
            `Reference materials about ${data.topic}`,
            `Visual aids and diagrams`,
            `Technology tools (if available)`
        ];
    }

    getGradeLevel(grade) {
        const gradeMap = {
            'k-2': 'Kindergarten to 2nd grade',
            '3-5': '3rd to 5th grade',
            '6-8': '6th to 8th grade',
            '9-12': '9th to 12th grade'
        };
        return gradeMap[grade] || grade;
    }

    getSubjectName(subject) {
        const subjectMap = {
            'science': 'Science',
            'history': 'History',
            'math': 'Mathematics',
            'english': 'English Language Arts',
            'geography': 'Geography',
            'art': 'Art'
        };
        return subjectMap[subject] || subject;
    }

    formatContent(content) {
        return `
            <div class="content-item">
                <h3>${content.title}</h3>
                <p class="content-meta">
                    <strong>Subject:</strong> ${this.getSubjectName(content.subject)} | 
                    <strong>Grade:</strong> ${this.getGradeLevel(content.grade)} | 
                    <strong>Type:</strong> ${content.type}
                </p>
                <div class="content-body">
                    <h4>Instructions</h4>
                    <p>${content.instructions}</p>
                    
                    <h4>Content</h4>
                    <div class="content-text">${content.content.replace(/\n/g, '<br>')}</div>
                    
                    <h4>Activities</h4>
                    <ul>
                        ${content.activities.map(activity => `<li>${activity}</li>`).join('')}
                    </ul>
                    
                    <h4>Assessment</h4>
                    <ul>
                        ${content.assessment.map(assess => `<li>${assess}</li>`).join('')}
                    </ul>
                    
                    <h4>Materials Needed</h4>
                    <ul>
                        ${content.materials.map(material => `<li>${material}</li>`).join('')}
                    </ul>
                </div>
            </div>
        `;
    }

    regenerateContent() {
        const form = document.getElementById('contentForm');
        form.dispatchEvent(new Event('submit'));
    }

    downloadContent() {
        const content = document.getElementById('contentDisplay').innerHTML;
        const blob = new Blob([content], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'educational-content.html';
        a.click();
        URL.revokeObjectURL(url);
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize content generator when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ContentGenerator();
});
