# PRS Iceland Website Recreation

This is a recreation of the PRS Iceland (Precision Rifle Series Iceland) website with improved structure and standalone functionality.

## Features

- **Responsive Design**: Fully responsive layout that works on all devices
- **Smooth Animations**: Fade-in animations on scroll and hover effects
- **Transparent Header**: Header with smooth transition on scroll
- **Hero Section**: Full-screen hero with background image and parallax effect
- **About Section**: Two-column layout with image and content
- **Gallery**: Draggable image gallery with hover effects
- **Navigation**: Multi-level dropdown menu system

## Technologies Used

- Pure HTML5
- CSS3 with modern features (CSS Variables, Grid, Flexbox)
- Vanilla JavaScript (no dependencies)
- Google Fonts (Open Sans)
- Font Awesome icons

## Structure

```
prs-iceland/
├── pages/index.html       # Main HTML file with embedded styles and scripts
└── docs/README.md        # This file
```

## Features Implemented

1. **Header Navigation**
   - Transparent header that transitions to solid on scroll
   - Logo that shrinks on scroll
   - Dropdown menus with smooth animations
   - Mobile-responsive menu toggle

2. **Hero Section**
   - Full viewport height
   - Background image with overlay
   - Animated text and CTA button
   - Subtle zoom effect on background

3. **About Section**
   - Split layout with image and content
   - Animated content on scroll
   - Interactive CTA buttons

4. **Gallery Section**
   - Horizontal scrolling gallery
   - Draggable with mouse
   - Image hover effects

## Running the Website

Simply open the `index.html` file in any modern web browser. No server setup required.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Notes

- All images are loaded from the original website's CDN
- The website is fully standalone and doesn't require any build process
- Smooth scrolling is implemented for anchor links
- Intersection Observer API is used for scroll animations
