# Nishanth G. Palaniswami - Portfolio

A modern, responsive portfolio website built with React, Tailwind CSS, and Framer Motion. Features dark mode toggle, project filtering, and smooth animations.

![Portfolio Preview](https://img.shields.io/badge/React-18.2.0-blue) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.10-38B2AC) ![Vite](https://img.shields.io/badge/Vite-7.1.1-646CFF)

## ✨ Features

- **Responsive Design** - Works perfectly on desktop, tablet, and mobile
- **Dark Mode Toggle** - Switch between light and dark themes
- **Project Filtering** - Filter projects by category (ML/AI, Cloud/AWS, Big Data, Leadership, Creative)
- **Search Functionality** - Real-time search through projects and skills
- **Smooth Animations** - Framer Motion powered transitions
- **Professional UI** - Glassmorphism effects and modern design
- **SEO Optimized** - Meta tags and proper structure

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/nishanth-portfolio.git
   cd nishanth-portfolio
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

## 📁 Project Structure

```
nishanth-portfolio/
├── public/
│   ├── favicon.ico
│   ├── nyu-logo.png
│   └── portfolio-icon.svg
├── src/
│   ├── App.jsx              # Main portfolio component
│   ├── index.css            # Global styles
│   └── main.jsx             # React entry point
├── index.html               # HTML template
├── package.json             # Dependencies and scripts
├── tailwind.config.js       # Tailwind configuration
├── vite.config.js           # Vite configuration
├── postcss.config.js        # PostCSS configuration
└── README.md                # This file
```

## 🛠️ Customization Guide

### 1. Personal Information
Update the `PROFILE` object in `src/App.jsx`:

```javascript
const PROFILE = {
  name: "Your Name",
  tagline: "Your Professional Title",
  University: "Your University",
  location: "Your Location",
  graduation: "Your Graduation Date",
  workAuth: "Your Work Authorization",
  summary: "Your professional summary..."
};
```

### 2. Social Links
Update the `LINKS` object:

```javascript
const LINKS = {
  email: "your.email@example.com",
  github: "https://github.com/yourusername",
  linkedin: "https://linkedin.com/in/yourusername",
  resume: "https://your-resume-link.com"
};
```

### 3. Skills
Customize the `SKILLS` object with your expertise:

```javascript
const SKILLS = {
  coreCloud: ["AWS", "Azure", "GCP"],
  mlAi: ["PyTorch", "TensorFlow", "scikit-learn"],
  programming: ["Python", "JavaScript", "React"],
  // Add more categories as needed
};
```

### 4. Projects
Update the `PROJECTS` array with your work:

```javascript
const PROJECTS = [
  {
    title: "Project Title",
    category: ["ml", "cloud"], // Categories for filtering
    summary: "Project description...",
    stack: ["Technology1", "Technology2"],
    impact: ["Achievement1", "Achievement2"],
    links: {
      github: "https://github.com/...",
      demo: "https://demo-link.com",
      ppt: "https://presentation-link.com"
    }
  }
];
```

### 5. Project Categories
Modify the `CATEGORIES` array to match your project types:

```javascript
const CATEGORIES = [
  { key: "all", label: "All" },
  { key: "ml", label: "ML/AI" },
  { key: "cloud", label: "Cloud/AWS" },
  { key: "data", label: "Big Data" },
  { key: "leadership", label: "Leadership" },
  { key: "creative", label: "Creative" }
];
```

## 🎨 Styling Customization

### Colors
The portfolio uses Tailwind CSS classes. You can customize colors by modifying the classes in `src/App.jsx`:

- **Primary colors**: `slate-900`, `slate-800`, `slate-700`
- **Accent colors**: `indigo-600`, `emerald-600`, `amber-600`
- **Dark mode**: `dark:` prefixed classes

### Animations
Framer Motion animations can be customized in the component:

```javascript
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
>
```

### Icons
The portfolio uses Lucide React icons. Browse available icons at [lucide.dev](https://lucide.dev).

## 📱 Responsive Design

The portfolio is fully responsive with breakpoints:
- **Mobile**: `< 768px`
- **Tablet**: `768px - 1024px`
- **Desktop**: `> 1024px`

## 🌙 Dark Mode

Dark mode is implemented using:
- Tailwind CSS `dark:` classes
- Local storage for persistence
- System preference detection
- Smooth transitions

## 🚀 Deployment

### Netlify (Recommended)
1. Push your code to GitHub
2. Connect your repository to Netlify
3. Build command: `npm run build`
4. Publish directory: `dist`

### Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Follow the prompts

### GitHub Pages
1. Add to `package.json`:
   ```json
   {
     "homepage": "https://yourusername.github.io/repo-name",
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d dist"
     }
   }
   ```
2. Install gh-pages: `npm install --save-dev gh-pages`
3. Deploy: `npm run deploy`

## 📦 Dependencies

### Core Dependencies
- **React** (^18.2.0) - UI framework
- **React DOM** (^18.2.0) - React rendering
- **Framer Motion** (^11.0.0) - Animations
- **Lucide React** (^0.453.0) - Icons

### Development Dependencies
- **Vite** (^7.1.1) - Build tool
- **@vitejs/plugin-react** (^4.3.0) - React plugin
- **Tailwind CSS** (^3.4.10) - CSS framework
- **PostCSS** (^8.4.35) - CSS processing
- **Autoprefixer** (^10.4.18) - CSS vendor prefixes

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Tailwind CSS** for the utility-first CSS framework
- **Framer Motion** for smooth animations
- **Lucide** for beautiful icons
- **Vite** for fast development and building

## 📞 Contact

- **Email**: ng3124@nyu.edu
- **LinkedIn**: [Nishanth G. Palaniswami](https://www.linkedin.com/in/nishanth-g-palaniswami)
- **GitHub**: [@Nishanth-G-Palaniswami](https://github.com/Nishanth-G-Palaniswami)

---

⭐ **Star this repository if you found it helpful!**
