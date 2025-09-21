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
        
        // Simulate AI processing time
        await this.delay(2000);
        
        const content = this.generateContent(formData);
        this.displayResults(content);
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

    generateContent(data) {
        // Generate AI-powered educational content based on the form data
        const content = {
            topic: data.topic,
            subject: data.subject,
            grade: data.grade,
            type: data.type,
            description: data.description,
            title: this.generateTitle(data),
            instructions: this.generateInstructions(data),
            content: this.generateContentBody(data),
            activities: this.generateActivities(data),
            assessment: this.generateAssessment(data),
            materials: this.generateMaterials(data),
            aiGenerated: true,
            timestamp: new Date().toISOString()
        };
        
        return content;
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
