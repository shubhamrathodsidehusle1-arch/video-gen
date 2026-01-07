# VibeClip AI Frontend

A modern, production-ready React frontend for VibeClip AI - an AI-powered video clip generation platform.

## 🚀 Tech Stack

- **React 18+** - Modern React with functional components and hooks
- **TypeScript** - Full type safety and enhanced developer experience
- **Vite** - Fast build tool with HMR (Hot Module Replacement)
- **Redux Toolkit** - State management with organized feature slices
- **React Router v6+** - Client-side routing
- **Tailwind CSS 3+** - Utility-first CSS framework
- **daisyUI** - Component library for rapid UI development
- **ESLint & Prettier** - Code quality and formatting tools

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── common/        # Generic components (ErrorBoundary, Loading, etc.)
│   ├── forms/         # Form-related components
│   └── layout/        # Layout components (Header, Sidebar, Footer)
├── features/          # Redux feature slices
│   ├── auth/          # Authentication state management
│   ├── jobs/          # Job processing state
│   ├── projects/      # Project management state
│   └── ui/            # UI state management (theme, modals, notifications)
├── hooks/             # Custom React hooks
├── pages/             # Page components (route components)
├── services/          # API services and external integrations
├── store/             # Redux store configuration
├── styles/            # Global styles and Tailwind configuration
└── utils/             # Utility functions and helpers
```

## 🛠 Setup & Development

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd vibeclip-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   
   Update the environment variables in `.env`:
   ```env
   # API Configuration
   VITE_API_URL=http://localhost:8000
   VITE_API_VERSION=v1
   
   # Authentication
   VITE_AUTH_TOKEN_KEY=vibeclip_token
   VITE_REFRESH_TOKEN_KEY=vibeclip_refresh_token
   
   # App Configuration
   VITE_APP_NAME=VibeClip AI
   VITE_APP_VERSION=0.1.0
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:3000`

### Available Scripts

- `npm run dev` - Start development server with HMR
- `npm run build` - Create production build
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint for code quality checks
- `npm run format` - Format code with Prettier

## 🏗 Architecture

### State Management

The application uses Redux Toolkit for state management with a feature-based organization:

- **Auth Slice** - User authentication, login/logout, user profile
- **UI Slice** - Theme, sidebar, notifications, modals
- **Jobs Slice** - Video processing job management (ready for implementation)
- **Projects Slice** - Project organization (ready for implementation)

### Routing

React Router v6+ is used for client-side routing with the following routes:

- `/` - Home page (landing page)
- `/login` - User authentication
- `/dashboard` - Main dashboard
- `/jobs` - Job management page
- `/projects` - Project organization page
- `/settings` - User settings

### Component Architecture

#### Layout Components
- **Layout** - Main app layout with header, sidebar, and footer
- **Header** - Navigation bar with user menu
- **Sidebar** - Navigation sidebar with quick actions
- **Footer** - Application footer

#### Common Components
- **ErrorBoundary** - Error handling and recovery
- **Loading** - Loading states and spinners
- **Notification** - Toast notifications and alerts

### Styling

The project uses **Tailwind CSS** with **daisyUI** components:

- **Utility-first approach** with Tailwind CSS classes
- **Component library** with daisyUI for rapid development
- **Custom theme** with VibeClip branding
- **Dark/Light mode** support
- **Responsive design** with mobile-first approach

## 🎨 Design System

### Colors

- **Primary**: Blue (#3b82f6) - Main brand color
- **Secondary**: Amber (#f59e0b) - Accent color
- **Accent**: Emerald (#10b981) - Success states
- **Neutral**: Gray (#374151) - Text and borders

### Components

All UI components follow daisyUI design patterns and include:
- Consistent spacing and typography
- Accessible color contrasts
- Hover and focus states
- Loading and disabled states

## 🔧 Configuration

### TypeScript

Strict mode is enabled with path mapping for clean imports:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### Vite

Configured with:
- React plugin
- Path aliasing
- Development server on port 3000
- Production build optimization with code splitting

### Code Quality

- **ESLint** - TypeScript-aware linting rules
- **Prettier** - Consistent code formatting
- **Git hooks** - Pre-commit and pre-push validation (configured in parent repository)

## 📱 Responsive Design

The application is fully responsive with:
- **Mobile-first** design approach
- **Breakpoint-aware** components using Tailwind CSS
- **Touch-friendly** interface for mobile devices
- **Adaptive navigation** (sidebar transforms to drawer on mobile)

## 🚢 Production Deployment

### Build Process

```bash
npm run build
```

The build generates optimized files in the `dist/` directory:
- Code splitting for optimal loading
- Asset optimization
- Tree shaking for smaller bundle sizes

### Docker Support

The frontend is configured for Docker deployment with multi-stage builds:

```dockerfile
# Multi-stage build for production
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## 🔒 Environment Variables

### Required Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API base URL | `http://localhost:8000` |
| `VITE_API_VERSION` | API version | `v1` |
| `VITE_AUTH_TOKEN_KEY` | LocalStorage key for auth token | `vibeclip_token` |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_APP_NAME` | Application name | `VibeClip AI` |
| `VITE_ENABLE_ANALYTICS` | Enable analytics | `true` |
| `VITE_DEV_MODE` | Development mode | `true` |

## 🧪 Testing

The project structure supports testing with:
- **React Testing Library** - Component testing
- **Jest** - Unit and integration testing
- **MSW** - API mocking for tests

*Testing setup will be implemented in future phases*

## 📚 API Integration

### Service Structure

API services are organized in the `services/` directory:
- `api.ts` - Axios instance with interceptors
- `auth.service.ts` - Authentication endpoints
- `jobs.service.ts` - Job management endpoints
- `projects.service.ts` - Project endpoints

### Authentication Flow

1. User credentials sent to backend
2. JWT token received and stored in Redux state
3. Token automatically added to API requests via interceptors
4. Automatic token refresh on expiration

## 🔄 Development Workflow

### Code Organization

1. **Feature-based structure** - Components grouped by feature
2. **TypeScript-first** - All files use `.ts` or `.tsx` extensions
3. **Consistent naming** - PascalCase for components, camelCase for functions
4. **Import organization** - External imports, internal imports, relative imports

### Best Practices

- **Functional components** with hooks
- **TypeScript interfaces** for all props and data structures
- **Redux best practices** with immer for immutable updates
- **Accessibility** - All components include proper ARIA labels
- **Performance** - Code splitting and lazy loading ready

## 🚀 Future Enhancements

- **Progressive Web App** (PWA) support
- **Service Worker** for offline functionality
- **Real-time updates** with WebSocket integration
- **Advanced analytics** and performance monitoring
- **A/B testing** framework integration
- **Internationalization** (i18n) support

## 📖 Contributing

1. Create feature branches from `main`
2. Follow existing code patterns and conventions
3. Run `npm run lint` and `npm run format` before committing
4. Write meaningful commit messages
5. Update documentation as needed

## 📄 License

This project is part of the VibeClip AI platform. All rights reserved.