# Project Structure

## Directory Organization

```
medifind-ui/
├── docs/                  # Documentation files
├── public/               # Static assets
├── src/                  # Source code
│   ├── assets/          # Images, fonts, and other static assets
│   ├── components/      # Reusable React components
│   ├── customHooks/     # Custom React hooks
│   ├── layout/          # Layout components
│   ├── pages/           # Page components
│   ├── styles/          # Global styles and themes
│   ├── index.css        # Global CSS
│   └── main.jsx         # Application entry point
├── .gitignore           # Git ignore rules
├── eslint.config.js     # ESLint configuration
├── index.html           # HTML template
├── package.json         # Project dependencies and scripts
├── package-lock.json    # Locked dependency versions
└── vite.config.js       # Vite configuration
```

## Key Files and Directories

### Source Directory (`src/`)

#### Components (`src/components/`)
- Reusable UI components
- Component-specific styles
- Component documentation

#### Pages (`src/pages/`)
- Main application pages
- Page-specific components
- Route components

#### Layout (`src/layout/`)
- Application layout components
- Navigation components
- Footer components

#### Custom Hooks (`src/customHooks/`)
- Reusable custom hooks
- State management hooks
- API interaction hooks

#### Assets (`src/assets/`)
- Images
- Icons
- Fonts
- Other static assets

#### Styles (`src/styles/`)
- Global styles
- Theme configurations
- CSS variables
- Utility classes

### Configuration Files

#### `package.json`
- Project metadata
- Dependencies
- Scripts
- Configuration

#### `vite.config.js`
- Build configuration
- Development server settings
- Plugin configurations

#### `eslint.config.js`
- Code style rules
- Linting configurations
- Code quality settings

## Component Architecture

### Core Components
- Navigation
- Layout
- Forms
- Modals
- Cards
- Buttons
- Inputs

### Page Components
- Login
- Signup
- Home
- Medicine Management
- Donor Management
- Request Management

### Layout Components
- Header
- Footer
- Sidebar
- Main Content
- Navigation

## File Naming Conventions

- Components: PascalCase (e.g., `MedicineCard.jsx`)
- Styles: kebab-case (e.g., `medicine-card.css`)
- Hooks: camelCase (e.g., `useMedicineData.js`)
- Pages: PascalCase (e.g., `MedicinePage.jsx`)

## Import Structure

```javascript
// External dependencies
import React from 'react';
import { useState } from 'react';

// Internal components
import MedicineCard from '../components/MedicineCard';
import { useMedicineData } from '../customHooks/useMedicineData';

// Styles
import './MedicinePage.css';
```

## State Management

- Component-level state using React hooks
- Context API for global state
- Custom hooks for reusable state logic

## Routing Structure

- Client-side routing using React Router
- Protected routes for authenticated users
- Nested routes for complex pages
- Route parameters for dynamic content

## Asset Management

- Static assets in `public/` directory
- Component-specific assets in component directories
- Global assets in `src/assets/`
- Optimized image loading
- Font management 