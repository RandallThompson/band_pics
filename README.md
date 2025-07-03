# Band Pics - Next.js Application

A modern Next.js web application for organizing and displaying band pictures by genre, optimized for Vercel deployment.

## Features

- **Modern React Architecture**: Built with Next.js 15, React 19, and TypeScript
- **Responsive Design**: Styled with Tailwind CSS for mobile-first responsive design
- **Genre Organization**: Organize pictures by genre (Rock, Jazz, Pop, Events)
- **Search Functionality**: Real-time search to find specific bands or events
- **Image Optimization**: Next.js Image component for optimized loading
- **Testing**: Comprehensive test suite with Jest and React Testing Library
- **Vercel Ready**: Optimized for deployment on Vercel platform

## Tech Stack

- **Framework**: Next.js 15.3.4
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **Testing**: Jest + React Testing Library
- **Image Handling**: Next.js Image optimization
- **Deployment**: Vercel-ready configuration

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd band_pics
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm test` - Run test suite

## Project Structure

```
band_pics/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout component
│   │   ├── page.tsx            # Home page component
│   │   └── globals.css         # Global styles
│   ├── components/
│   │   ├── Header.tsx          # Header with navigation and search
│   │   ├── Gallery.tsx         # Image gallery component
│   │   └── Footer.tsx          # Footer component
│   └── hooks/
│       └── useImages.ts        # Custom hook for image management
├── __tests__/                  # Test files
├── backup/                     # Original static files
├── public/                     # Static assets
├── rock/                       # Rock band pictures
├── jazz/                       # Jazz band pictures
├── pop/                        # Pop band pictures
├── events/                     # Event pictures
└── vercel.json                 # Vercel deployment config
```

## Adding Pictures

Currently, the application uses placeholder images. To add real pictures:

1. **For Development**: Update the `useImages` hook in `src/hooks/useImages.ts` to load actual image data
2. **For Production**: Implement an image management system or API
3. **Static Images**: Place images in the `public` directory and update the image paths

### Supported Image Formats
- JPG/JPEG
- PNG
- WebP (recommended for web)
- GIF

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Vercel will automatically detect Next.js and deploy

### Manual Deployment

```bash
npm run build
npm run start
```

## Testing

Run the test suite:

```bash
npm test
```

The application includes tests for:
- Component rendering
- User interactions
- Search functionality
- Navigation

## Customization

### Styling
- Modify Tailwind classes in components
- Update `src/app/globals.css` for global styles
- Configure Tailwind in `tailwind.config.ts`

### Adding New Genres
1. Update the `GenreImages` interface in `src/hooks/useImages.ts`
2. Add new navigation links in `src/components/Header.tsx`
3. Add new Gallery components in `src/app/page.tsx`

### Search Enhancement
- Modify search logic in `src/components/Header.tsx`
- Update filtering in `src/components/Gallery.tsx`

## Browser Compatibility

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Run the test suite
6. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).
