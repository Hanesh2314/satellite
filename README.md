# SpaceTechHub Website

A modern space technology-themed website with 3D visualization, application forms with contact information, and an admin dashboard.

## Features

- 3D interactive satellite visualization using Three.js
- Department selection interface with detailed information
- Application submission system with contact information field
- Admin dashboard for reviewing applications
- About Us section with content management
- Responsive design for all devices

## Quick Deployment

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/yourusername/spacetechhub)

## Deployment Instructions

### GitHub to Netlify

1. Create a GitHub repository and push this code to it
2. Log in to [Netlify](https://app.netlify.com/)
3. Click "New site from Git" 
4. Select GitHub and authorize Netlify
5. Select your repository
6. Netlify will automatically detect settings from netlify.toml
7. Click "Deploy site"

### Direct Upload to Netlify

1. Run `npm run build` in this directory
2. Go to [Netlify Drop](https://app.netlify.com/drop)
3. Drag and drop the `dist` folder to deploy

## Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## License

MIT
