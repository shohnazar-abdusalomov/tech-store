# TechStore Frontend

A modern e-commerce product management frontend built with React and Vite.

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

The app will be available at http://localhost:5173

## Build

```bash
npm run build
```

## Deployment

### Netlify Deployment

1. Create a `.env` file (copy from `.env.example`) and set your API URL:
   ```
   VITE_API_URL=https://your-backend-url.onrender.com
   ```

2. Deploy to Netlify:
   - Connect your GitHub repository to Netlify
   - Set the build command: `npm run build`
   - Set the publish directory: `dist`
   - Add environment variable: `VITE_API_URL` = your backend URL

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | http://localhost:3001 |

## Backend Requirements

This frontend requires the TechStore Backend API to be running. Make sure to:

1. Deploy the backend to a service like Render, Railway, or similar
2. Set the `VITE_API_URL` environment variable to your backend URL
3. Update the backend's CORS configuration to allow your Netlify domain

## Features

- Modern, responsive product gallery
- Dark/Light theme toggle
- Product detail view with image gallery
- Add new products with auto-generated relevant images
- Delete products with confirmation
- Toast notifications
- Loading states and error handling
