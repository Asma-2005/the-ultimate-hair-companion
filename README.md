# The Ultimate Hair Companion - Gliss Interactive Chat System

An interactive web application for Gliss hair products that provides personalized hair care recommendations through an engaging chat interface.

## Features

### 🎯 **Personalized Recommendations**
- Interactive hair assessment survey with gamification elements
- AI-powered photo analysis for hair condition detection
- Personalized product recommendations based on user input

### 💬 **Interactive Chat System**
- Fun, animated chat interface with the Gliss Hair Expert bot
- Continuous conversation after recommendations
- Engaging animations and visual feedback

### 🎮 **Gamified Experience**
- Points system in the survey
- Progress tracking and achievements
- Fun facts and tips throughout the journey

### 🎨 **Gliss Brand Design**
- Official Gliss color palette and branding
- Modern, responsive design
- Beautiful animations and transitions

## Product Variants Supported

1. **Gliss Ultimate Repair** - For severely damaged hair
2. **Gliss Total Repair** - Complete hair restoration
3. **Gliss Oil Nutritive** - Deep nourishment and shine
4. **Gliss Aqua Revive** - Hydration and moisture boost
5. **Gliss Supreme Length** - Length protection and growth support

## Getting Started

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd the-ultimate-hair-companion
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) to view the application

## Project Structure

```
src/
├── components/
│   ├── LandingPage.js          # Main landing page with Gliss branding
│   ├── LandingPage.css
│   ├── Survey.js               # Gamified hair assessment quiz
│   ├── Survey.css
│   ├── PhotoUpload.js          # AI photo analysis interface
│   ├── PhotoUpload.css
│   ├── Chat.js                 # Interactive chat component
│   └── Chat.css
├── App.js                      # Main application component
├── App.css                     # Global styles and Gliss theme
└── index.js                    # Application entry point
```

## Key Features

### Landing Page
- Beautiful Gliss-branded introduction
- Two entry points: Survey or Photo Upload
- Product showcase with all 5 Gliss variants
- Responsive design with smooth animations

### Survey Component
- 6 interactive questions about hair type and concerns
- Points system with real-time feedback
- Fun facts and tips between questions
- Progress tracking with visual indicators

### Photo Upload
- Drag-and-drop or click to upload
- Simulated AI analysis with progress indicators
- Visual feedback during processing
- Feature explanations for transparency

### Chat Interface
- Animated bot avatar with online status
- Smooth message animations
- Product recommendations with detailed information
- Continuous conversation capability
- Typing indicators and message timestamps

## Customization

### Adding Real AI Integration
To integrate with a real AI API for chat responses:

1. Replace the `generateBotResponse` function in `Chat.js`
2. Add API configuration and error handling
3. Implement proper loading states

### Styling Customization
- Modify CSS variables in `App.css` for color scheme changes
- Update product colors in component CSS files
- Customize animations and transitions

## Technologies Used

- **React 19** - Frontend framework
- **CSS3** - Styling with custom properties and animations
- **JavaScript ES6+** - Modern JavaScript features
- **Create React App** - Build tooling and development environment

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is created for Gliss hair products demonstration purposes.