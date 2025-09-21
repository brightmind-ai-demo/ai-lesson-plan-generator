# 🎓 AI Lesson Plan Generator

A powerful, offline AI-powered lesson plan generator that creates comprehensive, standards-aligned lesson plans for teachers. **No API keys required** - works entirely with local data and smart algorithms!

## ✨ Features

- **🤖 Smart AI Generation**: Creates detailed lesson plans using local algorithms
- **📚 Standards Aligned**: Automatically aligns with Common Core and NGSS standards
- **⏰ Time-Based Planning**: Generates activities based on lesson duration
- **🎯 Differentiated Learning**: Includes strategies for different learning levels
- **📊 Assessment Ready**: Built-in formative and summative assessments
- **📱 Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **💾 Offline Ready**: No internet connection required after initial load
- **📄 PDF Export**: Download lesson plans as PDFs

## 🚀 Live Demo

Visit the live demo: **https://mahdinaser.github.io/ai-lesson-plan-generator**

## 🛠️ How It Works

1. **Select Subject & Grade**: Choose from Math, Science, English, History, Art, Music, PE, or Foreign Language
2. **Enter Topic**: Describe what you want to teach
3. **Set Duration**: Choose from 30-120 minutes
4. **Add Objectives**: Optional learning objectives (or let AI generate them)
5. **Generate**: AI creates a complete lesson plan with:
   - Learning objectives
   - Standards alignment
   - Detailed timeline
   - Engaging activities
   - Assessment strategies
   - Materials list
   - Differentiation strategies

## 📋 What You Get

Each generated lesson plan includes:

### 📚 Lesson Overview
- Subject, grade level, topic, and duration
- Difficulty level and learning objectives

### 🎯 Standards Alignment
- Common Core (Math & English)
- NGSS (Science)
- Automatically selected based on grade level

### ⏰ Detailed Timeline
- Opening/Hook activities
- Main learning activities
- Closing/Reflection time
- Precise timing for each segment

### 🎨 Engaging Activities
- Age-appropriate activities
- Hands-on learning experiences
- Collaborative learning opportunities
- Technology integration suggestions

### 📊 Assessment Strategies
- Formative assessments (during lesson)
- Summative assessments (end of lesson)
- Specific timing and implementation

### 📦 Materials List
- Basic classroom supplies
- Subject-specific materials
- Technology requirements

### 🎭 Differentiation Strategies
- For struggling learners
- For advanced learners
- For ELL students
- Specific accommodations and modifications

## 🎯 Perfect For

- **Elementary Teachers**: K-5 lesson planning
- **Middle School Teachers**: 6-8 curriculum development
- **High School Teachers**: 9-12 advanced planning
- **Substitute Teachers**: Quick, comprehensive plans
- **Student Teachers**: Learning effective lesson structure
- **Homeschool Parents**: Structured educational activities

## 🚀 Deployment to GitHub Pages

### Option 1: Quick Deploy
1. Fork this repository
2. Go to Settings → Pages
3. Select "Deploy from a branch"
4. Choose "main" branch
5. Your site will be live at `https://mahdinaser.github.io/ai-lesson-plan-generator`

### Option 2: Custom Domain
1. Add a `CNAME` file with your domain
2. Configure DNS settings
3. Deploy as above

## 🔧 Technical Details

### Built With
- **HTML5**: Semantic structure
- **CSS3**: Modern styling with Flexbox/Grid
- **Vanilla JavaScript**: No frameworks, pure performance
- **Font Awesome**: Beautiful icons
- **Google Fonts**: Professional typography

### Browser Support
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

### Performance
- **Load Time**: < 2 seconds
- **Bundle Size**: < 100KB
- **Offline Ready**: Works without internet
- **Mobile Optimized**: Responsive design

## 📊 Data Sources

The AI uses comprehensive local databases including:

- **500+ Educational Activities** across all subjects and grade levels
- **Common Core Standards** for Math and English
- **NGSS Standards** for Science
- **Differentiation Strategies** for diverse learners
- **Assessment Methods** for various learning styles
- **Materials Lists** for different subjects

## 🎨 Customization

### Adding New Subjects
Edit the `initializeActivities()` function in `script.js`:

```javascript
newSubject: {
    beginner: [
        { name: 'Activity Name', duration: 15, description: 'Description' }
    ]
}
```

### Adding New Standards
Update the `initializeStandards()` function:

```javascript
newSubject: {
    1: ['STANDARD.1.1', 'STANDARD.1.2']
}
```

### Styling Changes
Modify `styles.css` for custom colors, fonts, or layouts.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built for educators, by educators
- Inspired by the need for efficient lesson planning
- Uses research-based educational strategies
- Incorporates best practices from experienced teachers

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/mahdinaser/ai-lesson-plan-generator/issues)
- **Discussions**: [GitHub Discussions](https://github.com/mahdinaser/ai-lesson-plan-generator/discussions)
- **Email**: mahdinaser@github.com

---

**Made with ❤️ for teachers worldwide**

*Save time, teach better, inspire more.*
