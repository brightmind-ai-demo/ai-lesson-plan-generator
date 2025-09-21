// AI Lesson Plan Generator - Offline Version
// No API keys required - uses local data and smart algorithms

class LessonPlanGenerator {
    constructor() {
        this.lessonTemplates = this.initializeTemplates();
        this.standards = this.initializeStandards();
        this.activities = this.initializeActivities();
        this.assessments = this.initializeAssessments();
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupFormValidation();
        this.setupNavigation();
    }

    setupEventListeners() {
        const form = document.getElementById('lessonForm');
        const regenerateBtn = document.getElementById('regenerateBtn');
        const downloadBtn = document.getElementById('downloadBtn');

        form.addEventListener('submit', (e) => this.handleFormSubmit(e));
        regenerateBtn?.addEventListener('click', () => this.regenerateLesson());
        downloadBtn?.addEventListener('click', () => this.downloadPDF());
    }

    setupFormValidation() {
        const inputs = document.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
        });
    }

    setupNavigation() {
        // Add click handlers for service buttons
        const serviceButtons = document.querySelectorAll('.service-btn');
        serviceButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = button.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    // Add visual feedback
                    button.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        button.style.transform = 'scale(1)';
                    }, 150);
                    
                    // Scroll to target with offset for fixed navbar
                    const offset = 80; // Account for navbar height
                    const targetPosition = targetElement.offsetTop - offset;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Highlight the target section briefly
                    targetElement.style.boxShadow = '0 0 20px rgba(102, 126, 234, 0.3)';
                    setTimeout(() => {
                        targetElement.style.boxShadow = '';
                    }, 2000);
                }
            });
        });

        // Add click handlers for navigation menu items
        const navLinks = document.querySelectorAll('.nav-menu a');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const targetId = link.getAttribute('href');
                if (targetId.startsWith('#')) {
                    e.preventDefault();
                    const targetElement = document.querySelector(targetId);
                    
                    if (targetElement) {
                        const offset = 80;
                        const targetPosition = targetElement.offsetTop - offset;
                        
                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });
                    }
                }
            });
        });
    }

    validateField(field) {
        const value = field.value.trim();
        const isValid = field.checkValidity();
        
        if (isValid) {
            field.style.borderColor = '#28a745';
        } else {
            field.style.borderColor = '#dc3545';
        }
        
        return isValid;
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
        
        const lessonPlan = this.generateLessonPlan(formData);
        this.displayResults(lessonPlan);
    }

    validateForm() {
        const requiredFields = ['subject', 'gradeLevel', 'topic', 'duration'];
        let isValid = true;

        requiredFields.forEach(fieldName => {
            const field = document.getElementById(fieldName);
            if (!this.validateField(field)) {
                isValid = false;
            }
        });

        return isValid;
    }

    getFormData() {
        return {
            subject: document.getElementById('subject').value,
            gradeLevel: document.getElementById('gradeLevel').value,
            topic: document.getElementById('topic').value,
            duration: parseInt(document.getElementById('duration').value),
            learningObjectives: document.getElementById('learningObjectives').value,
            difficulty: document.getElementById('difficulty').value
        };
    }

    showLoading() {
        document.getElementById('loadingSection').classList.remove('hidden');
        document.getElementById('resultsSection').classList.add('hidden');
    }

    displayResults(lessonPlan) {
        document.getElementById('loadingSection').classList.add('hidden');
        document.getElementById('resultsSection').classList.remove('hidden');
        
        const content = document.getElementById('lessonPlanContent');
        content.innerHTML = this.formatLessonPlan(lessonPlan);
        content.classList.add('fade-in');
    }

    generateLessonPlan(data) {
        const template = this.selectTemplate(data);
        const activities = this.selectActivities(data);
        const assessments = this.selectAssessments(data);
        const standards = this.getRelevantStandards(data);
        
        return {
            ...template,
            topic: data.topic,
            duration: data.duration,
            gradeLevel: this.formatGradeLevel(data.gradeLevel),
            subject: this.formatSubject(data.subject),
            learningObjectives: data.learningObjectives || this.generateLearningObjectives(data),
            activities: activities,
            assessments: assessments,
            standards: standards,
            materials: this.generateMaterials(data),
            differentiation: this.generateDifferentiation(data),
            timing: this.generateTiming(data)
        };
    }

    selectTemplate(data) {
        const templates = this.lessonTemplates[data.subject] || this.lessonTemplates.general;
        const gradeLevel = parseInt(data.gradeLevel);
        
        if (gradeLevel <= 2) {
            return templates.elementary;
        } else if (gradeLevel <= 5) {
            return templates.upper_elementary;
        } else if (gradeLevel <= 8) {
            return templates.middle_school;
        } else {
            return templates.high_school;
        }
    }

    selectActivities(data) {
        const subjectActivities = this.activities[data.subject] || this.activities.general;
        const duration = data.duration;
        const difficulty = data.difficulty;
        
        let selectedActivities = [];
        let timeUsed = 0;
        
        // Select activities based on duration and difficulty
        const availableActivities = subjectActivities[difficulty] || subjectActivities.intermediate;
        
        for (const activity of availableActivities) {
            if (timeUsed + activity.duration <= duration) {
                selectedActivities.push(activity);
                timeUsed += activity.duration;
            }
        }
        
        return selectedActivities;
    }

    selectAssessments(data) {
        const gradeLevel = parseInt(data.gradeLevel);
        const duration = data.duration;
        
        let assessments = [];
        
        // Formative assessments
        if (duration >= 45) {
            assessments.push({
                type: 'Formative',
                name: 'Think-Pair-Share',
                description: 'Students think individually, discuss with a partner, then share with class',
                duration: 10,
                purpose: 'Check understanding during lesson'
            });
        }
        
        // Summative assessment
        if (duration >= 60) {
            assessments.push({
                type: 'Summative',
                name: gradeLevel <= 5 ? 'Exit Ticket' : 'Quick Quiz',
                description: gradeLevel <= 5 ? 
                    'Students write one thing they learned and one question they have' :
                    'Short quiz covering key concepts from the lesson',
                duration: 5,
                purpose: 'Evaluate learning at end of lesson'
            });
        }
        
        return assessments;
    }

    getRelevantStandards(data) {
        const subject = data.subject;
        const gradeLevel = parseInt(data.gradeLevel);
        
        if (this.standards[subject] && this.standards[subject][gradeLevel]) {
            return this.standards[subject][gradeLevel].slice(0, 3); // Top 3 relevant standards
        }
        
        return ['CCSS.ELA-LITERACY.RL.1.1', 'CCSS.MATH.CONTENT.1.OA.A.1'];
    }

    generateLearningObjectives(data) {
        const objectives = {
            math: [
                'Students will be able to solve problems involving the topic',
                'Students will demonstrate understanding through multiple representations',
                'Students will apply mathematical reasoning to real-world situations'
            ],
            science: [
                'Students will observe and describe phenomena related to the topic',
                'Students will develop hypotheses and test them through investigation',
                'Students will communicate scientific findings clearly'
            ],
            english: [
                'Students will analyze and interpret texts related to the topic',
                'Students will develop critical thinking skills through discussion',
                'Students will express ideas clearly in written and oral form'
            ],
            history: [
                'Students will analyze historical events and their significance',
                'Students will evaluate multiple perspectives on historical topics',
                'Students will develop research and presentation skills'
            ]
        };
        
        const subjectObjectives = objectives[data.subject] || objectives.english;
        return subjectObjectives.slice(0, 2); // Return 2 objectives
    }

    generateMaterials(data) {
        const baseMaterials = [
            'Whiteboard and markers',
            'Student notebooks',
            'Pencils and erasers'
        ];
        
        const subjectMaterials = {
            math: ['Manipulatives', 'Graph paper', 'Calculator'],
            science: ['Safety goggles', 'Lab materials', 'Magnifying glass'],
            english: ['Texts/books', 'Highlighters', 'Dictionary'],
            history: ['Maps', 'Primary source documents', 'Timeline materials'],
            art: ['Art supplies', 'Paper', 'Paint brushes'],
            music: ['Instruments', 'Sheet music', 'Audio equipment']
        };
        
        const additionalMaterials = subjectMaterials[data.subject] || [];
        return [...baseMaterials, ...additionalMaterials];
    }

    generateDifferentiation(data) {
        const gradeLevel = parseInt(data.gradeLevel);
        
        return {
            forStrugglingLearners: [
                'Provide visual aids and graphic organizers',
                'Break tasks into smaller steps',
                'Offer additional practice opportunities',
                'Use peer tutoring and small group work'
            ],
            forAdvancedLearners: [
                'Provide extension activities and challenges',
                'Encourage independent research projects',
                'Offer leadership opportunities in group work',
                'Connect learning to real-world applications'
            ],
            forELLStudents: [
                'Use visual supports and gestures',
                'Provide vocabulary support and word walls',
                'Allow extra processing time',
                'Use cooperative learning strategies'
            ]
        };
    }

    generateTiming(data) {
        const duration = data.duration;
        const activities = this.selectActivities(data);
        
        let timing = [];
        let currentTime = 0;
        
        // Opening (10% of total time)
        const openingTime = Math.max(5, Math.floor(duration * 0.1));
        timing.push({
            phase: 'Opening/Hook',
            duration: openingTime,
            description: 'Engage students and introduce the topic'
        });
        currentTime += openingTime;
        
        // Activities
        activities.forEach(activity => {
            timing.push({
                phase: activity.name,
                duration: activity.duration,
                description: activity.description
            });
            currentTime += activity.duration;
        });
        
        // Closing (remaining time)
        const remainingTime = duration - currentTime;
        if (remainingTime > 0) {
            timing.push({
                phase: 'Closing/Reflection',
                duration: remainingTime,
                description: 'Summarize learning and check for understanding'
            });
        }
        
        return timing;
    }

    formatLessonPlan(lesson) {
        return `
            <div class="lesson-plan-section">
                <h3>📚 Lesson Overview</h3>
                <p><strong>Subject:</strong> ${lesson.subject}</p>
                <p><strong>Grade Level:</strong> ${lesson.gradeLevel}</p>
                <p><strong>Topic:</strong> ${lesson.topic}</p>
                <p><strong>Duration:</strong> ${lesson.duration} minutes</p>
                <p><strong>Difficulty:</strong> ${lesson.difficulty ? lesson.difficulty.charAt(0).toUpperCase() + lesson.difficulty.slice(1) : 'Intermediate'}</p>
            </div>

            <div class="lesson-plan-section">
                <h3>🎯 Learning Objectives</h3>
                <ul>
                    ${lesson.learningObjectives.map(obj => `<li>${obj}</li>`).join('')}
                </ul>
            </div>

            <div class="lesson-plan-section">
                <h3>📋 Standards Alignment</h3>
                <ul>
                    ${lesson.standards.map(standard => `<li>${standard}</li>`).join('')}
                </ul>
            </div>

            <div class="lesson-plan-section">
                <h3>⏰ Lesson Timeline</h3>
                <ul>
                    ${lesson.timing.map(phase => `<li><strong>${phase.phase}</strong> (${phase.duration} min): ${phase.description}</li>`).join('')}
                </ul>
            </div>

            <div class="lesson-plan-section">
                <h3>🎨 Activities</h3>
                <ul>
                    ${lesson.activities.map(activity => `<li><strong>${activity.name}</strong> (${activity.duration} min): ${activity.description}</li>`).join('')}
                </ul>
            </div>

            <div class="lesson-plan-section">
                <h3>📊 Assessments</h3>
                <ul>
                    ${lesson.assessments.map(assessment => `<li><strong>${assessment.type}: ${assessment.name}</strong> (${assessment.duration} min): ${assessment.description}</li>`).join('')}
                </ul>
            </div>

            <div class="lesson-plan-section">
                <h3>📦 Materials Needed</h3>
                <ul>
                    ${lesson.materials.map(material => `<li>${material}</li>`).join('')}
                </ul>
            </div>

            <div class="lesson-plan-section">
                <h3>🎭 Differentiation Strategies</h3>
                <h4>For Struggling Learners:</h4>
                <ul>
                    ${lesson.differentiation.forStrugglingLearners.map(strategy => `<li>${strategy}</li>`).join('')}
                </ul>
                <h4>For Advanced Learners:</h4>
                <ul>
                    ${lesson.differentiation.forAdvancedLearners.map(strategy => `<li>${strategy}</li>`).join('')}
                </ul>
                <h4>For ELL Students:</h4>
                <ul>
                    ${lesson.differentiation.forELLStudents.map(strategy => `<li>${strategy}</li>`).join('')}
                </ul>
            </div>
        `;
    }

    formatGradeLevel(gradeLevel) {
        const gradeMap = {
            'k': 'Kindergarten',
            '1': '1st Grade',
            '2': '2nd Grade',
            '3': '3rd Grade',
            '4': '4th Grade',
            '5': '5th Grade',
            '6': '6th Grade',
            '7': '7th Grade',
            '8': '8th Grade',
            '9': '9th Grade',
            '10': '10th Grade',
            '11': '11th Grade',
            '12': '12th Grade'
        };
        return gradeMap[gradeLevel] || gradeLevel;
    }

    formatSubject(subject) {
        const subjectMap = {
            'math': 'Mathematics',
            'science': 'Science',
            'english': 'English Language Arts',
            'history': 'History/Social Studies',
            'art': 'Art',
            'music': 'Music',
            'pe': 'Physical Education',
            'foreign-language': 'Foreign Language'
        };
        return subjectMap[subject] || subject;
    }

    regenerateLesson() {
        const form = document.getElementById('lessonForm');
        form.scrollIntoView({ behavior: 'smooth' });
    }

    downloadPDF() {
        const content = document.getElementById('lessonPlanContent').innerHTML;
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <html>
                <head>
                    <title>Lesson Plan - ${document.getElementById('topic').value}</title>
                    <style>
                        body { font-family: Arial, sans-serif; margin: 20px; }
                        .lesson-plan-section { margin-bottom: 20px; padding: 15px; border: 1px solid #ddd; }
                        h3 { color: #333; border-bottom: 2px solid #667eea; padding-bottom: 5px; }
                        ul { margin-left: 20px; }
                        li { margin-bottom: 5px; }
                    </style>
                </head>
                <body>
                    <h1>AI-Generated Lesson Plan</h1>
                    ${content}
                </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.print();
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Initialize comprehensive lesson templates
    initializeTemplates() {
        return {
            math: {
                elementary: {
                    structure: 'Direct instruction with hands-on activities',
                    hook: 'Real-world problem or story',
                    closure: 'Reflection and sharing'
                },
                upper_elementary: {
                    structure: 'Guided practice with collaborative learning',
                    hook: 'Mathematical puzzle or challenge',
                    closure: 'Student presentations'
                },
                middle_school: {
                    structure: 'Inquiry-based learning with technology',
                    hook: 'Complex problem or investigation',
                    closure: 'Peer review and discussion'
                },
                high_school: {
                    structure: 'Project-based learning with real applications',
                    hook: 'Case study or research question',
                    closure: 'Formal presentation or paper'
                }
            },
            science: {
                elementary: {
                    structure: 'Observation and exploration',
                    hook: 'Mystery or wonder question',
                    closure: 'Share discoveries'
                },
                upper_elementary: {
                    structure: 'Scientific method with experiments',
                    hook: 'Phenomenon or demonstration',
                    closure: 'Data analysis and conclusions'
                },
                middle_school: {
                    structure: 'Lab investigations with hypothesis testing',
                    hook: 'Scientific controversy or debate',
                    closure: 'Peer review of findings'
                },
                high_school: {
                    structure: 'Research-based inquiry with technology',
                    hook: 'Current scientific issue',
                    closure: 'Publication or presentation'
                }
            },
            english: {
                elementary: {
                    structure: 'Shared reading with discussion',
                    hook: 'Picture walk or prediction',
                    closure: 'Creative response'
                },
                upper_elementary: {
                    structure: 'Literature circles with analysis',
                    hook: 'Author study or theme introduction',
                    closure: 'Writing workshop'
                },
                middle_school: {
                    structure: 'Critical analysis with evidence',
                    hook: 'Controversial topic or debate',
                    closure: 'Argumentative writing'
                },
                high_school: {
                    structure: 'Literary criticism with research',
                    hook: 'Complex text or theory',
                    closure: 'Academic essay or presentation'
                }
            },
            general: {
                elementary: {
                    structure: 'Interactive and hands-on learning',
                    hook: 'Engaging story or demonstration',
                    closure: 'Sharing and reflection'
                },
                upper_elementary: {
                    structure: 'Collaborative learning with projects',
                    hook: 'Challenge or problem to solve',
                    closure: 'Presentation of findings'
                },
                middle_school: {
                    structure: 'Inquiry-based with technology integration',
                    hook: 'Real-world connection or issue',
                    closure: 'Peer evaluation and discussion'
                },
                high_school: {
                    structure: 'Independent research with application',
                    hook: 'Complex question or case study',
                    closure: 'Formal assessment or presentation'
                }
            }
        };
    }

    // Initialize educational standards
    initializeStandards() {
        return {
            math: {
                1: ['CCSS.MATH.CONTENT.1.OA.A.1', 'CCSS.MATH.CONTENT.1.OA.A.2'],
                2: ['CCSS.MATH.CONTENT.2.OA.A.1', 'CCSS.MATH.CONTENT.2.NBT.A.1'],
                3: ['CCSS.MATH.CONTENT.3.OA.A.1', 'CCSS.MATH.CONTENT.3.NF.A.1'],
                4: ['CCSS.MATH.CONTENT.4.OA.A.1', 'CCSS.MATH.CONTENT.4.NF.A.1'],
                5: ['CCSS.MATH.CONTENT.5.OA.A.1', 'CCSS.MATH.CONTENT.5.NF.A.1'],
                6: ['CCSS.MATH.CONTENT.6.RP.A.1', 'CCSS.MATH.CONTENT.6.NS.A.1'],
                7: ['CCSS.MATH.CONTENT.7.RP.A.1', 'CCSS.MATH.CONTENT.7.NS.A.1'],
                8: ['CCSS.MATH.CONTENT.8.EE.A.1', 'CCSS.MATH.CONTENT.8.F.A.1'],
                9: ['CCSS.MATH.CONTENT.HSA.SSE.A.1', 'CCSS.MATH.CONTENT.HSA.CED.A.1'],
                10: ['CCSS.MATH.CONTENT.HSA.SSE.A.2', 'CCSS.MATH.CONTENT.HSA.CED.A.2'],
                11: ['CCSS.MATH.CONTENT.HSA.SSE.B.3', 'CCSS.MATH.CONTENT.HSA.CED.A.3'],
                12: ['CCSS.MATH.CONTENT.HSA.SSE.B.4', 'CCSS.MATH.CONTENT.HSA.CED.A.4']
            },
            science: {
                1: ['NGSS.1-PS4-1', 'NGSS.1-LS1-1'],
                2: ['NGSS.2-PS1-1', 'NGSS.2-LS2-1'],
                3: ['NGSS.3-PS2-1', 'NGSS.3-LS1-1'],
                4: ['NGSS.4-PS3-1', 'NGSS.4-LS1-1'],
                5: ['NGSS.5-PS1-1', 'NGSS.5-LS1-1'],
                6: ['NGSS.MS-PS1-1', 'NGSS.MS-LS1-1'],
                7: ['NGSS.MS-PS2-1', 'NGSS.MS-LS2-1'],
                8: ['NGSS.MS-PS3-1', 'NGSS.MS-LS3-1'],
                9: ['NGSS.HS-PS1-1', 'NGSS.HS-LS1-1'],
                10: ['NGSS.HS-PS2-1', 'NGSS.HS-LS2-1'],
                11: ['NGSS.HS-PS3-1', 'NGSS.HS-LS3-1'],
                12: ['NGSS.HS-PS4-1', 'NGSS.HS-LS4-1']
            },
            english: {
                1: ['CCSS.ELA-LITERACY.RL.1.1', 'CCSS.ELA-LITERACY.RF.1.1'],
                2: ['CCSS.ELA-LITERACY.RL.2.1', 'CCSS.ELA-LITERACY.RF.2.1'],
                3: ['CCSS.ELA-LITERACY.RL.3.1', 'CCSS.ELA-LITERACY.RF.3.1'],
                4: ['CCSS.ELA-LITERACY.RL.4.1', 'CCSS.ELA-LITERACY.RF.4.1'],
                5: ['CCSS.ELA-LITERACY.RL.5.1', 'CCSS.ELA-LITERACY.RF.5.1'],
                6: ['CCSS.ELA-LITERACY.RL.6.1', 'CCSS.ELA-LITERACY.RI.6.1'],
                7: ['CCSS.ELA-LITERACY.RL.7.1', 'CCSS.ELA-LITERACY.RI.7.1'],
                8: ['CCSS.ELA-LITERACY.RL.8.1', 'CCSS.ELA-LITERACY.RI.8.1'],
                9: ['CCSS.ELA-LITERACY.RL.9-10.1', 'CCSS.ELA-LITERACY.RI.9-10.1'],
                10: ['CCSS.ELA-LITERACY.RL.9-10.2', 'CCSS.ELA-LITERACY.RI.9-10.2'],
                11: ['CCSS.ELA-LITERACY.RL.11-12.1', 'CCSS.ELA-LITERACY.RI.11-12.1'],
                12: ['CCSS.ELA-LITERACY.RL.11-12.2', 'CCSS.ELA-LITERACY.RI.11-12.2']
            }
        };
    }

    // Initialize activity database
    initializeActivities() {
        return {
            math: {
                beginner: [
                    { name: 'Number Line Hop', duration: 15, description: 'Students physically move along a number line to solve problems' },
                    { name: 'Math Manipulatives', duration: 20, description: 'Use blocks, counters, or other objects to visualize concepts' },
                    { name: 'Math Games', duration: 15, description: 'Play educational games that reinforce mathematical concepts' }
                ],
                intermediate: [
                    { name: 'Problem-Solving Stations', duration: 25, description: 'Students rotate through different problem-solving activities' },
                    { name: 'Math Journaling', duration: 20, description: 'Students write about their mathematical thinking process' },
                    { name: 'Peer Tutoring', duration: 15, description: 'Students work in pairs to solve problems together' }
                ],
                advanced: [
                    { name: 'Mathematical Investigations', duration: 30, description: 'Students explore open-ended mathematical problems' },
                    { name: 'Technology Integration', duration: 25, description: 'Use graphing calculators or math software for exploration' },
                    { name: 'Real-World Applications', duration: 20, description: 'Apply mathematical concepts to solve real problems' }
                ]
            },
            science: {
                beginner: [
                    { name: 'Observation Walk', duration: 20, description: 'Students observe and record natural phenomena' },
                    { name: 'Simple Experiments', duration: 25, description: 'Conduct hands-on experiments with clear procedures' },
                    { name: 'Nature Journaling', duration: 15, description: 'Students document their scientific observations' }
                ],
                intermediate: [
                    { name: 'Lab Investigations', duration: 30, description: 'Students design and conduct their own experiments' },
                    { name: 'Data Analysis', duration: 20, description: 'Students collect, organize, and interpret scientific data' },
                    { name: 'Scientific Debates', duration: 25, description: 'Students research and debate scientific topics' }
                ],
                advanced: [
                    { name: 'Research Projects', duration: 40, description: 'Students conduct independent scientific research' },
                    { name: 'Model Building', duration: 30, description: 'Students create models to represent scientific concepts' },
                    { name: 'Peer Review', duration: 25, description: 'Students review and critique each other\'s scientific work' }
                ]
            },
            english: {
                beginner: [
                    { name: 'Shared Reading', duration: 20, description: 'Teacher and students read together, discussing as they go' },
                    { name: 'Word Study', duration: 15, description: 'Students explore vocabulary and word patterns' },
                    { name: 'Creative Writing', duration: 25, description: 'Students write stories, poems, or other creative pieces' }
                ],
                intermediate: [
                    { name: 'Literature Circles', duration: 30, description: 'Students discuss books in small groups with assigned roles' },
                    { name: 'Writing Workshop', duration: 35, description: 'Students work on writing projects with peer feedback' },
                    { name: 'Socratic Seminar', duration: 25, description: 'Students engage in structured discussion about texts' }
                ],
                advanced: [
                    { name: 'Literary Analysis', duration: 40, description: 'Students analyze texts using various critical approaches' },
                    { name: 'Research Papers', duration: 45, description: 'Students research and write formal academic papers' },
                    { name: 'Multimedia Presentations', duration: 30, description: 'Students create presentations using various media' }
                ]
            },
            general: {
                beginner: [
                    { name: 'Interactive Discussion', duration: 20, description: 'Engage students in guided discussion about the topic' },
                    { name: 'Visual Learning', duration: 15, description: 'Use charts, diagrams, and visual aids to teach concepts' },
                    { name: 'Hands-On Activities', duration: 25, description: 'Students actively participate in learning activities' }
                ],
                intermediate: [
                    { name: 'Group Projects', duration: 30, description: 'Students collaborate on projects related to the topic' },
                    { name: 'Case Studies', duration: 25, description: 'Students analyze real-world examples and scenarios' },
                    { name: 'Problem-Based Learning', duration: 35, description: 'Students solve complex problems related to the topic' }
                ],
                advanced: [
                    { name: 'Independent Research', duration: 40, description: 'Students conduct independent research on the topic' },
                    { name: 'Debate and Discussion', duration: 30, description: 'Students engage in formal debates about controversial topics' },
                    { name: 'Creative Applications', duration: 35, description: 'Students apply learning in creative and innovative ways' }
                ]
            }
        };
    }

    // Initialize assessment strategies
    initializeAssessments() {
        return {
            formative: [
                'Exit tickets',
                'Thumbs up/down',
                'One-minute papers',
                'Think-pair-share',
                'Quick quizzes',
                'Observation checklists'
            ],
            summative: [
                'Unit tests',
                'Projects',
                'Presentations',
                'Portfolios',
                'Essays',
                'Performance tasks'
            ]
        };
    }
}

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Check if working LLM integration is available
    if (window.WorkingLLMLessonGenerator) {
        new WorkingLLMLessonGenerator();
    } else if (window.FreeLLMLessonGenerator) {
        new FreeLLMLessonGenerator();
    } else if (window.LLMEnhancedLessonGenerator) {
        new LLMEnhancedLessonGenerator();
    } else {
        new LessonPlanGenerator();
    }
});
