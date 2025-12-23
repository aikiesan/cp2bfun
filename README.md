# CP2B Website

Official website for **CP2B - Centro Paulista de Estudos em Biogás e Bioprodutos** (São Paulo Center for Biogas and Bioproducts Studies).

A research center funded by FAPESP, based at NIPE/UNICAMP, dedicated to developing innovative solutions for the biogas chain in the State of São Paulo.

## 🚀 Features

- **Modern React Application**: Built with React 18 and Vite for optimal performance
- **Responsive Design**: Mobile-first design that works on all devices
- **Progressive Web App (PWA)**: Installable, works offline, and provides app-like experience
- **Internationalization**: Portuguese and English language support
- **Dark Mode**: User-controlled theme switching
- **Accessibility**: WCAG 2.2 compliant with keyboard navigation and screen reader support
- **SEO Optimized**: Meta tags, structured data, and semantic HTML
- **Testing Infrastructure**: Comprehensive unit and integration testing with Vitest
- **Performance Optimized**: Code splitting, lazy loading, and asset optimization

## 📋 Prerequisites

- Node.js 16.x or higher
- npm 7.x or higher

## 🛠️ Installation

```bash
# Clone the repository
git clone <repository-url>

# Navigate to project directory
cd cp2bfun

# Install dependencies
npm install
```

## 💻 Development

```bash
# Start development server
npm run dev

# Open http://localhost:5173 in your browser
```

## 🧪 Testing

```bash
# Run tests in watch mode
npm test

# Run tests once
npm run test:run

# Run tests with UI
npm run test:ui

# Generate coverage report
npm run test:coverage
```

See [TESTING.md](./TESTING.md) for detailed testing documentation.

## 🏗️ Building for Production

```bash
# Create production build
npm run build

# Preview production build locally
npm run preview
```

The build output will be in the `dist/` directory.

## 📱 PWA Support

This application is a Progressive Web App and can be installed on devices:

- **Desktop**: Click the install icon in the address bar
- **Mobile**: Use "Add to Home Screen" from browser menu
- **Offline Support**: Core functionality available without internet connection
- **Auto-updates**: Service worker automatically updates the app

### PWA Features
- Offline-first caching strategy
- Background sync for data updates
- Push notifications (ready for implementation)
- App-like experience with no browser UI

## 🎨 Tech Stack

### Core
- **React 18** - UI library
- **Vite 5** - Build tool and dev server
- **React Router 6** - Client-side routing

### UI & Styling
- **Bootstrap 5** - Component library
- **React Bootstrap** - React components
- **Framer Motion** - Animations
- **React Icons** - Icon library

### Features
- **React Helmet Async** - Document head management
- **Vite PWA Plugin** - Progressive Web App support

### Development
- **Vitest** - Unit testing framework
- **React Testing Library** - Component testing
- **ESLint** - Code linting
- **jsdom** - DOM testing environment

## 📁 Project Structure

```
cp2bfun/
├── public/              # Static assets
│   ├── assets/         # Images, videos, etc.
│   ├── browserconfig.xml
│   └── robots.txt
├── src/
│   ├── components/     # Reusable components
│   │   └── __tests__/  # Component tests
│   ├── context/        # React context providers
│   ├── data/           # Static content and data
│   ├── pages/          # Page components
│   ├── test/           # Test utilities and setup
│   ├── App.jsx         # Root component
│   ├── index.css       # Global styles
│   └── main.jsx        # Application entry point
├── index.html          # HTML template
├── vite.config.js      # Vite configuration
├── vitest.config.js    # Vitest configuration
└── package.json        # Dependencies and scripts
```

## 🌐 Deployment

This project is configured for deployment on Vercel:

```bash
# Deploy to Vercel
vercel --prod
```

The `vercel.json` configuration handles routing for the SPA.

## ♿ Accessibility

This website follows WCAG 2.2 guidelines:

- Semantic HTML structure
- Keyboard navigation support
- Screen reader compatibility
- Sufficient color contrast
- Focus indicators
- Skip to content link
- ARIA labels and roles
- Responsive text sizing

## 🔧 Configuration

### Environment Variables

Create a `.env` file for environment-specific configuration:

```env
# Add your environment variables here
# VITE_API_URL=https://api.example.com
```

### PWA Configuration

PWA settings are in `vite.config.js`. Customize:
- App name and description
- Theme colors
- Icons
- Caching strategies
- Offline fallback

## 📄 License

[Add your license information here]

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Contact

**CP2B - NIPE/UNICAMP**

- Address: Rua Cora Coralina, 330, Campinas, SP 13083-896
- Website: [https://cp2b.nipe.unicamp.br/](https://cp2b.nipe.unicamp.br/)
- LinkedIn: [linkedin.com/company/cp2b-biogas](https://www.linkedin.com/company/cp2b-biogas/)

## 🙏 Acknowledgments

- Funded by FAPESP (Process 2021/10413-6)
- Hosted at NIPE/UNICAMP
- Built with open-source technologies
