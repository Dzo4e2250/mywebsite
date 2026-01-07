# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal portfolio/CV website for George Ristov (in Slovenian language). Static website built with vanilla HTML, CSS, and JavaScript - no build tools or frameworks.

## File Structure

- `index.html` - Main landing page with hero, story cards, projects, career journey, and contact sections
- `o-meni.html` - "About me" page (motivational letter)
- `projects.html` - GitHub projects showcase page
- `styles.css` - All styles with CSS custom properties (design tokens in `:root`)
- `app.js` - Main JavaScript with initialization and functionality
- `script.js` - Copy of app.js (kept in sync)

## Development

Open `index.html` directly in browser. No build step required.

For live reload during development, use any static file server (e.g., `python3 -m http.server` or VS Code Live Server).

## Architecture

### CSS Design System (`styles.css`)
- CSS custom properties define the design system in `:root`
- Colors: `--bg-*`, `--text-*`, `--accent-*`
- Typography: DM Sans (sans-serif), JetBrains Mono (monospace)
- Spacing: `--space-xs` through `--space-4xl`
- Uses BEM-like class naming conventions

### JavaScript Modules (`app.js`)
All functionality initializes on `DOMContentLoaded`:
- `initDynamicYears()` - Calculates years of experience from start dates (tech: 2013, sales: 2020), fetches GitHub repo count
- `initScrollAnimations()` - IntersectionObserver for fade-in animations
- `initSmoothScroll()` - Anchor link smooth scrolling
- `initNavHighlight()` - Active nav link highlighting based on scroll position
- `initNavScroll()` - Nav shadow on scroll
- `initFormHandler()` - Contact form submission (currently simulated)
- `initExpandableCards()` - Expandable story/career cards with toggle
- `initModalSystem()` - Project detail modals with templates stored in `modalTemplates` object

### Key UI Components
- **Expandable Cards**: Story and career cards use `data-expanded` attribute to toggle expanded state
- **Project Modals**: Modal content is templated in `app.js` (`modalTemplates` object) - each project (eva, tablespro, webprojects, automations, selfhosted) has its own HTML template

## Language & Content

Website is in Slovenian. When editing content, maintain proper Slovenian grammar (use the slovenian-proofreader agent for text corrections if needed).

## Assets

- `george-optimized.jpg` - Hero image (optimized version)
- `eva-architecture.svg` - Eva chatbot architecture diagram
- `tablespro-architecture.svg` - TablesPro architecture diagram
