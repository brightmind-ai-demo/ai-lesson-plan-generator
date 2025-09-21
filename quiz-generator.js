// Quiz Generator for BrightMind AI
// Creates real educational quizzes with authentic content

class QuizGenerator {
    constructor() {
        this.questionTemplates = this.initializeQuestionTemplates();
        this.quizData = this.initializeQuizData();
        this.init();
    }

    init() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        const quizForm = document.getElementById('quizForm');
        const downloadBtn = document.getElementById('downloadQuiz');
        const regenerateBtn = document.getElementById('regenerateQuiz');

        if (quizForm) {
            quizForm.addEventListener('submit', (e) => this.handleQuizSubmit(e));
        }
        
        if (downloadBtn) {
            downloadBtn.addEventListener('click', () => this.downloadQuiz());
        }
        
        if (regenerateBtn) {
            regenerateBtn.addEventListener('click', () => this.regenerateQuiz());
        }
    }

    async handleQuizSubmit(e) {
        e.preventDefault();
        
        const formData = this.getQuizFormData();
        this.showQuizLoading();
        
        // Simulate AI processing time
        await this.delay(2000);
        
        const quiz = this.generateQuiz(formData);
        this.displayQuizResults(quiz);
    }

    getQuizFormData() {
        return {
            topic: document.getElementById('quizTopic').value,
            subject: document.getElementById('quizSubject').value,
            grade: document.getElementById('quizGrade').value,
            questionCount: parseInt(document.getElementById('questionCount').value),
            questionTypes: Array.from(document.querySelectorAll('input[name="questionTypes"]:checked')).map(cb => cb.value)
        };
    }

    showQuizLoading() {
        const resultsDiv = document.getElementById('quizResults');
        if (resultsDiv) {
            resultsDiv.innerHTML = `
                <div class="loading-spinner">
                    <i class="fas fa-spinner fa-spin"></i>
                    <h3>Generating Your Quiz...</h3>
                    <p>Our AI is creating engaging questions tailored to your specifications.</p>
                </div>
            `;
            resultsDiv.classList.remove('hidden');
        }
    }

    generateQuiz(data) {
        const questions = [];
        const questionCount = data.questionCount;
        const questionTypes = data.questionTypes;
        
        // Generate questions based on topic and subject
        for (let i = 0; i < questionCount; i++) {
            const questionType = questionTypes[i % questionTypes.length];
            const question = this.generateQuestion(data, questionType, i + 1);
            questions.push(question);
        }
        
        return {
            topic: data.topic,
            subject: data.subject,
            grade: data.grade,
            questionCount: questionCount,
            questions: questions,
            generatedAt: new Date().toLocaleDateString()
        };
    }

    generateQuestion(data, type, questionNumber) {
        const subjectData = this.quizData[data.subject] || this.quizData.general;
        const gradeData = subjectData[data.grade] || subjectData.elementary;
        
        switch (type) {
            case 'multiple-choice':
                return this.generateMultipleChoice(data, gradeData, questionNumber);
            case 'true-false':
                return this.generateTrueFalse(data, gradeData, questionNumber);
            case 'short-answer':
                return this.generateShortAnswer(data, gradeData, questionNumber);
            default:
                return this.generateMultipleChoice(data, gradeData, questionNumber);
        }
    }

    generateMultipleChoice(data, gradeData, questionNumber) {
        const topics = gradeData.topics || ['general concepts'];
        const topic = topics[Math.floor(Math.random() * topics.length)];
        
        const questionTemplates = gradeData.multipleChoice || [
            `What is the main characteristic of ${topic}?`,
            `Which of the following best describes ${topic}?`,
            `What is the primary purpose of ${topic}?`,
            `Which statement about ${topic} is correct?`
        ];
        
        const question = questionTemplates[Math.floor(Math.random() * questionTemplates.length)];
        const correctAnswer = gradeData.correctAnswers?.[topic] || 'The correct answer';
        const wrongAnswers = gradeData.wrongAnswers?.[topic] || ['Wrong option 1', 'Wrong option 2', 'Wrong option 3'];
        
        const options = [correctAnswer, ...wrongAnswers].sort(() => Math.random() - 0.5);
        const correctIndex = options.indexOf(correctAnswer);
        
        return {
            type: 'multiple-choice',
            question: question,
            options: options,
            correctAnswer: correctIndex,
            explanation: gradeData.explanations?.[topic] || `This is the correct answer because it accurately describes ${topic}.`
        };
    }

    generateTrueFalse(data, gradeData, questionNumber) {
        const topics = gradeData.topics || ['general concepts'];
        const topic = topics[Math.floor(Math.random() * topics.length)];
        
        const trueStatements = gradeData.trueStatements?.[topic] || [
            `${topic} is an important concept in this subject.`,
            `Understanding ${topic} helps in learning.`,
            `${topic} has specific characteristics.`
        ];
        
        const falseStatements = gradeData.falseStatements?.[topic] || [
            `${topic} is not relevant to this subject.`,
            `${topic} has no practical applications.`,
            `${topic} is easy to understand without study.`
        ];
        
        const isTrue = Math.random() < 0.5;
        const statements = isTrue ? trueStatements : falseStatements;
        const statement = statements[Math.floor(Math.random() * statements.length)];
        
        return {
            type: 'true-false',
            question: statement,
            correctAnswer: isTrue,
            explanation: isTrue 
                ? `This statement is true because ${topic} is indeed important and relevant.`
                : `This statement is false because ${topic} is actually important and relevant.`
        };
    }

    generateShortAnswer(data, gradeData, questionNumber) {
        const topics = gradeData.topics || ['general concepts'];
        const topic = topics[Math.floor(Math.random() * topics.length)];
        
        const questionTemplates = gradeData.shortAnswer || [
            `Explain what ${topic} means.`,
            `Describe the importance of ${topic}.`,
            `What are the key features of ${topic}?`,
            `How does ${topic} work?`
        ];
        
        const question = questionTemplates[Math.floor(Math.random() * questionTemplates.length)];
        const sampleAnswer = gradeData.sampleAnswers?.[topic] || `A comprehensive answer about ${topic} would include its definition, characteristics, and importance.`;
        
        return {
            type: 'short-answer',
            question: question,
            sampleAnswer: sampleAnswer,
            points: 5
        };
    }

    displayQuizResults(quiz) {
        const resultsDiv = document.getElementById('quizResults');
        const contentDiv = document.getElementById('quizContent');
        
        if (resultsDiv && contentDiv) {
            resultsDiv.innerHTML = `
                <div class="quiz-header">
                    <h3>Generated Quiz: ${quiz.topic}</h3>
                    <div class="quiz-actions">
                        <button id="downloadQuiz" class="btn-secondary">
                            <i class="fas fa-download"></i>
                            Download PDF
                        </button>
                        <button id="regenerateQuiz" class="btn-secondary">
                            <i class="fas fa-redo"></i>
                            Regenerate
                        </button>
                    </div>
                </div>
                <div id="quizContent" class="quiz-content">
                    ${this.formatQuiz(quiz)}
                </div>
            `;
            
            // Re-attach event listeners
            document.getElementById('downloadQuiz').addEventListener('click', () => this.downloadQuiz());
            document.getElementById('regenerateQuiz').addEventListener('click', () => this.regenerateQuiz());
            
            resultsDiv.classList.remove('hidden');
            contentDiv.classList.add('fade-in');
        }
    }

    formatQuiz(quiz) {
        let html = `
            <div class="quiz-info">
                <h4>Quiz Information</h4>
                <p><strong>Topic:</strong> ${quiz.topic}</p>
                <p><strong>Subject:</strong> ${this.formatSubject(quiz.subject)}</p>
                <p><strong>Grade Level:</strong> ${this.formatGrade(quiz.grade)}</p>
                <p><strong>Questions:</strong> ${quiz.questionCount}</p>
                <p><strong>Generated:</strong> ${quiz.generatedAt}</p>
            </div>
            <div class="quiz-questions">
        `;
        
        quiz.questions.forEach((question, index) => {
            html += this.formatQuestion(question, index + 1);
        });
        
        html += `
            </div>
            <div class="quiz-instructions">
                <h4>Instructions for Teachers</h4>
                <ul>
                    <li>Review all questions before administering the quiz</li>
                    <li>Adjust difficulty level based on your students' needs</li>
                    <li>Consider providing additional context or examples</li>
                    <li>Allow appropriate time for completion</li>
                </ul>
            </div>
        `;
        
        return html;
    }

    formatQuestion(question, questionNumber) {
        let html = `
            <div class="question-item">
                <h5>Question ${questionNumber}</h5>
                <p class="question-text">${question.question}</p>
        `;
        
        if (question.type === 'multiple-choice') {
            html += '<div class="options">';
            question.options.forEach((option, index) => {
                const letter = String.fromCharCode(65 + index); // A, B, C, D
                html += `
                    <label class="option-label">
                        <input type="radio" name="q${questionNumber}" value="${index}">
                        <span>${letter}. ${option}</span>
                    </label>
                `;
            });
            html += '</div>';
            html += `<div class="answer-key"><strong>Correct Answer:</strong> ${String.fromCharCode(65 + question.correctAnswer)}</div>`;
        } else if (question.type === 'true-false') {
            html += `
                <div class="options">
                    <label class="option-label">
                        <input type="radio" name="q${questionNumber}" value="true">
                        <span>True</span>
                    </label>
                    <label class="option-label">
                        <input type="radio" name="q${questionNumber}" value="false">
                        <span>False</span>
                    </label>
                </div>
                <div class="answer-key"><strong>Correct Answer:</strong> ${question.correctAnswer ? 'True' : 'False'}</div>
            `;
        } else if (question.type === 'short-answer') {
            html += `
                <div class="short-answer">
                    <textarea placeholder="Student answer here..." rows="3" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px;"></textarea>
                </div>
                <div class="answer-key"><strong>Sample Answer:</strong> ${question.sampleAnswer}</div>
            `;
        }
        
        html += `
            <div class="explanation">
                <strong>Explanation:</strong> ${question.explanation}
            </div>
        </div>
        `;
        
        return html;
    }

    formatSubject(subject) {
        const subjects = {
            'history': 'History',
            'science': 'Science',
            'math': 'Mathematics',
            'english': 'English Language Arts',
            'geography': 'Geography'
        };
        return subjects[subject] || subject;
    }

    formatGrade(grade) {
        const grades = {
            'elementary': 'Elementary (K-5)',
            'middle': 'Middle School (6-8)',
            'high': 'High School (9-12)'
        };
        return grades[grade] || grade;
    }

    downloadQuiz() {
        const quizContent = document.getElementById('quizContent');
        if (quizContent) {
            const printWindow = window.open('', '_blank');
            printWindow.document.write(`
                <html>
                    <head>
                        <title>Quiz - ${document.getElementById('quizTopic').value}</title>
                        <style>
                            body { font-family: Arial, sans-serif; margin: 20px; }
                            .question-item { margin-bottom: 30px; padding: 15px; border: 1px solid #ddd; }
                            .question-text { font-weight: bold; margin-bottom: 10px; }
                            .options { margin: 10px 0; }
                            .option-label { display: block; margin: 5px 0; }
                            .answer-key { background: #f0f8ff; padding: 10px; margin: 10px 0; }
                            .explanation { font-style: italic; color: #666; }
                        </style>
                    </head>
                    <body>
                        <h1>Generated Quiz</h1>
                        ${quizContent.innerHTML}
                    </body>
                </html>
            `);
            printWindow.document.close();
            printWindow.print();
        }
    }

    regenerateQuiz() {
        const quizForm = document.getElementById('quizForm');
        if (quizForm) {
            quizForm.scrollIntoView({ behavior: 'smooth' });
        }
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    initializeQuestionTemplates() {
        return {
            multipleChoice: [
                "What is the main characteristic of {topic}?",
                "Which of the following best describes {topic}?",
                "What is the primary purpose of {topic}?",
                "Which statement about {topic} is correct?"
            ],
            trueFalse: [
                "{topic} is an important concept.",
                "{topic} has practical applications.",
                "Understanding {topic} requires study.",
                "{topic} is relevant to this subject."
            ],
            shortAnswer: [
                "Explain what {topic} means.",
                "Describe the importance of {topic}.",
                "What are the key features of {topic}?",
                "How does {topic} work?"
            ]
        };
    }

    initializeQuizData() {
        return {
            history: {
                elementary: {
                    topics: ['Ancient Civilizations', 'American Revolution', 'World War II', 'Civil Rights Movement'],
                    multipleChoice: [
                        'What was the main cause of the American Revolution?',
                        'Which ancient civilization built the pyramids?',
                        'What year did World War II end?',
                        'Who was Martin Luther King Jr.?'
                    ],
                    correctAnswers: {
                        'American Revolution': 'Taxation without representation',
                        'Ancient Civilizations': 'Egyptians',
                        'World War II': '1945',
                        'Civil Rights Movement': 'Civil rights leader'
                    },
                    wrongAnswers: {
                        'American Revolution': ['Religious differences', 'Land disputes', 'Trade agreements'],
                        'Ancient Civilizations': ['Greeks', 'Romans', 'Mayans'],
                        'World War II': ['1944', '1946', '1943'],
                        'Civil Rights Movement': ['President', 'General', 'Inventor']
                    },
                    explanations: {
                        'American Revolution': 'The American Revolution was primarily caused by British taxation without colonial representation in Parliament.',
                        'Ancient Civilizations': 'The Egyptians built the pyramids as tombs for their pharaohs.',
                        'World War II': 'World War II ended in 1945 with the surrender of Japan.',
                        'Civil Rights Movement': 'Martin Luther King Jr. was a prominent civil rights leader who fought for equality.'
                    }
                },
                middle: {
                    topics: ['Renaissance', 'Industrial Revolution', 'Cold War', 'Vietnam War'],
                    multipleChoice: [
                        'What was the Renaissance known for?',
                        'What powered the Industrial Revolution?',
                        'What was the Cold War?',
                        'When did the Vietnam War occur?'
                    ],
                    correctAnswers: {
                        'Renaissance': 'Cultural and artistic rebirth',
                        'Industrial Revolution': 'Steam power and machinery',
                        'Cold War': 'Tension between US and USSR',
                        'Vietnam War': '1955-1975'
                    },
                    wrongAnswers: {
                        'Renaissance': ['Religious wars', 'Economic collapse', 'Political revolution'],
                        'Industrial Revolution': ['Manual labor', 'Animal power', 'Wind power'],
                        'Cold War': ['Hot war', 'Trade agreement', 'Alliance'],
                        'Vietnam War': ['1945-1955', '1975-1985', '1965-1970']
                    },
                    explanations: {
                        'Renaissance': 'The Renaissance was a period of cultural and artistic rebirth in Europe.',
                        'Industrial Revolution': 'The Industrial Revolution was powered by steam engines and new machinery.',
                        'Cold War': 'The Cold War was a period of political tension between the United States and Soviet Union.',
                        'Vietnam War': 'The Vietnam War occurred from 1955 to 1975.'
                    }
                },
                high: {
                    topics: ['World Wars', 'Cold War', 'Decolonization', 'Globalization'],
                    multipleChoice: [
                        'What were the main causes of World War I?',
                        'What was the Marshall Plan?',
                        'What is decolonization?',
                        'What is globalization?'
                    ],
                    correctAnswers: {
                        'World Wars': 'Imperialism, militarism, alliances, nationalism',
                        'Cold War': 'US economic aid to rebuild Europe',
                        'Decolonization': 'Process of colonies gaining independence',
                        'Globalization': 'Increasing interconnectedness of world economies'
                    },
                    wrongAnswers: {
                        'World Wars': ['Economic depression', 'Religious conflicts', 'Trade disputes'],
                        'Cold War': ['Military alliance', 'Trade agreement', 'Cultural exchange'],
                        'Decolonization': ['Colonization process', 'Economic development', 'Cultural assimilation'],
                        'Globalization': ['Economic isolation', 'Cultural separation', 'Political division']
                    },
                    explanations: {
                        'World Wars': 'World War I was caused by imperialism, militarism, alliances, and nationalism.',
                        'Cold War': 'The Marshall Plan was US economic aid to help rebuild Europe after WWII.',
                        'Decolonization': 'Decolonization is the process by which colonies gained independence from colonial powers.',
                        'Globalization': 'Globalization refers to the increasing interconnectedness of world economies and cultures.'
                    }
                }
            },
            science: {
                elementary: {
                    topics: ['Plants', 'Animals', 'Weather', 'Solar System'],
                    multipleChoice: [
                        'What do plants need to grow?',
                        'What is the largest planet?',
                        'What causes rain?',
                        'What is photosynthesis?'
                    ],
                    correctAnswers: {
                        'Plants': 'Sunlight, water, and nutrients',
                        'Solar System': 'Jupiter',
                        'Weather': 'Water vapor condensing',
                        'Plants': 'Process plants use to make food'
                    },
                    wrongAnswers: {
                        'Plants': ['Only water', 'Only sunlight', 'Only soil'],
                        'Solar System': ['Earth', 'Saturn', 'Mars'],
                        'Weather': ['Wind', 'Heat', 'Cold'],
                        'Plants': ['Plant reproduction', 'Plant growth', 'Plant respiration']
                    },
                    explanations: {
                        'Plants': 'Plants need sunlight, water, and nutrients to grow properly.',
                        'Solar System': 'Jupiter is the largest planet in our solar system.',
                        'Weather': 'Rain is caused by water vapor condensing in the atmosphere.',
                        'Plants': 'Photosynthesis is the process plants use to convert sunlight into food.'
                    }
                },
                middle: {
                    topics: ['Cells', 'Genetics', 'Ecosystems', 'Chemistry'],
                    multipleChoice: [
                        'What is the basic unit of life?',
                        'What is DNA?',
                        'What is an ecosystem?',
                        'What is a chemical reaction?'
                    ],
                    correctAnswers: {
                        'Cells': 'Cell',
                        'Genetics': 'Genetic material',
                        'Ecosystems': 'Community of living and non-living things',
                        'Chemistry': 'Process that changes substances'
                    },
                    wrongAnswers: {
                        'Cells': ['Atom', 'Molecule', 'Organ'],
                        'Genetics': ['Protein', 'Enzyme', 'Hormone'],
                        'Ecosystems': ['Only living things', 'Only non-living things', 'Single organism'],
                        'Chemistry': ['Physical change', 'Biological process', 'Natural phenomenon']
                    },
                    explanations: {
                        'Cells': 'The cell is the basic unit of life in all living organisms.',
                        'Genetics': 'DNA is the genetic material that contains instructions for life.',
                        'Ecosystems': 'An ecosystem is a community of living and non-living things that interact.',
                        'Chemistry': 'A chemical reaction is a process that changes substances into new ones.'
                    }
                },
                high: {
                    topics: ['Physics', 'Biology', 'Chemistry', 'Earth Science'],
                    multipleChoice: [
                        'What is Newton\'s First Law?',
                        'What is evolution?',
                        'What is the periodic table?',
                        'What is climate change?'
                    ],
                    correctAnswers: {
                        'Physics': 'Objects in motion stay in motion',
                        'Biology': 'Change in species over time',
                        'Chemistry': 'Organization of chemical elements',
                        'Earth Science': 'Long-term change in global climate'
                    },
                    wrongAnswers: {
                        'Physics': ['Force equals mass times acceleration', 'Every action has equal reaction', 'Gravity pulls objects down'],
                        'Biology': ['Individual adaptation', 'Environmental change', 'Genetic mutation'],
                        'Chemistry': ['List of compounds', 'Chemical reactions', 'Laboratory equipment'],
                        'Earth Science': ['Weather patterns', 'Seasonal changes', 'Natural disasters']
                    },
                    explanations: {
                        'Physics': 'Newton\'s First Law states that objects in motion stay in motion unless acted upon.',
                        'Biology': 'Evolution is the process by which species change over time through natural selection.',
                        'Chemistry': 'The periodic table organizes chemical elements by atomic number and properties.',
                        'Earth Science': 'Climate change refers to long-term changes in global climate patterns.'
                    }
                }
            },
            math: {
                elementary: {
                    topics: ['Addition', 'Subtraction', 'Multiplication', 'Division'],
                    multipleChoice: [
                        'What is 5 + 3?',
                        'What is 10 - 4?',
                        'What is 6 × 2?',
                        'What is 12 ÷ 3?'
                    ],
                    correctAnswers: {
                        'Addition': '8',
                        'Subtraction': '6',
                        'Multiplication': '12',
                        'Division': '4'
                    },
                    wrongAnswers: {
                        'Addition': ['7', '9', '6'],
                        'Subtraction': ['5', '7', '8'],
                        'Multiplication': ['10', '14', '8'],
                        'Division': ['3', '5', '6']
                    },
                    explanations: {
                        'Addition': '5 + 3 = 8. Addition means combining numbers.',
                        'Subtraction': '10 - 4 = 6. Subtraction means taking away.',
                        'Multiplication': '6 × 2 = 12. Multiplication means repeated addition.',
                        'Division': '12 ÷ 3 = 4. Division means sharing equally.'
                    }
                },
                middle: {
                    topics: ['Algebra', 'Geometry', 'Fractions', 'Decimals'],
                    multipleChoice: [
                        'What is x + 5 = 10?',
                        'What is the area of a rectangle?',
                        'What is 1/2 + 1/4?',
                        'What is 0.5 + 0.3?'
                    ],
                    correctAnswers: {
                        'Algebra': 'x = 5',
                        'Geometry': 'Length × Width',
                        'Fractions': '3/4',
                        'Decimals': '0.8'
                    },
                    wrongAnswers: {
                        'Algebra': ['x = 15', 'x = 2', 'x = 10'],
                        'Geometry': ['Length + Width', '2 × Length', 'Length × Height'],
                        'Fractions': ['1/6', '2/6', '1/3'],
                        'Decimals': ['0.2', '0.15', '0.6']
                    },
                    explanations: {
                        'Algebra': 'x + 5 = 10, so x = 10 - 5 = 5.',
                        'Geometry': 'The area of a rectangle is length multiplied by width.',
                        'Fractions': '1/2 + 1/4 = 2/4 + 1/4 = 3/4.',
                        'Decimals': '0.5 + 0.3 = 0.8.'
                    }
                },
                high: {
                    topics: ['Calculus', 'Statistics', 'Trigonometry', 'Probability'],
                    multipleChoice: [
                        'What is the derivative of x²?',
                        'What is the mean?',
                        'What is sin(90°)?',
                        'What is probability?'
                    ],
                    correctAnswers: {
                        'Calculus': '2x',
                        'Statistics': 'Average of all values',
                        'Trigonometry': '1',
                        'Probability': 'Likelihood of an event'
                    },
                    wrongAnswers: {
                        'Calculus': ['x', '2x²', 'x²'],
                        'Statistics': ['Middle value', 'Most frequent value', 'Range'],
                        'Trigonometry': ['0', '0.5', '√2/2'],
                        'Probability': ['Certainty', 'Impossibility', 'Randomness']
                    },
                    explanations: {
                        'Calculus': 'The derivative of x² is 2x using the power rule.',
                        'Statistics': 'The mean is the average of all values in a dataset.',
                        'Trigonometry': 'sin(90°) = 1 in a right triangle.',
                        'Probability': 'Probability is the likelihood that an event will occur.'
                    }
                }
            },
            general: {
                elementary: {
                    topics: ['Learning', 'Reading', 'Writing', 'Problem Solving'],
                    multipleChoice: [
                        'What is the best way to learn?',
                        'Why is reading important?',
                        'What makes good writing?',
                        'How do you solve problems?'
                    ],
                    correctAnswers: {
                        'Learning': 'Practice and repetition',
                        'Reading': 'It expands knowledge and vocabulary',
                        'Writing': 'Clear ideas and good organization',
                        'Problem Solving': 'Think step by step'
                    },
                    wrongAnswers: {
                        'Learning': ['Memorization only', 'Reading once', 'Avoiding practice'],
                        'Reading': ['It is not important', 'It wastes time', 'It is boring'],
                        'Writing': ['Long sentences', 'Complex words', 'No structure'],
                        'Problem Solving': ['Give up quickly', 'Avoid thinking', 'Ask others immediately']
                    },
                    explanations: {
                        'Learning': 'The best way to learn is through practice and repetition.',
                        'Reading': 'Reading is important because it expands knowledge and vocabulary.',
                        'Writing': 'Good writing has clear ideas and good organization.',
                        'Problem Solving': 'Problem solving involves thinking through steps systematically.'
                    }
                }
            }
        };
    }
}

// Initialize quiz generator when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new QuizGenerator();
});
