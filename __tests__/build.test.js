/**
 * @jest-environment node
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

describe('Build Configuration', () => {
  test('should have all required configuration files', () => {
    // Check for Next.js config
    expect(fs.existsSync(path.join(process.cwd(), 'next.config.js'))).toBe(true);
    
    // Check for Tailwind config
    expect(fs.existsSync(path.join(process.cwd(), 'tailwind.config.ts'))).toBe(true);
    
    // Check for PostCSS config
    expect(fs.existsSync(path.join(process.cwd(), 'postcss.config.js'))).toBe(true);
    
    // Check for TypeScript config
    expect(fs.existsSync(path.join(process.cwd(), 'tsconfig.json'))).toBe(true);
  });

  test('should have correct package.json scripts', () => {
    const packageJson = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf8'));
    
    expect(packageJson.scripts.build).toBe('next build');
    expect(packageJson.scripts.dev).toBe('next dev');
    expect(packageJson.scripts.start).toBe('next start');
  });

  test('should have correct PostCSS configuration', () => {
    const postcssConfig = require(path.join(process.cwd(), 'postcss.config.js'));
    
    expect(postcssConfig.plugins).toHaveProperty('@tailwindcss/postcss');
    expect(postcssConfig.plugins).toHaveProperty('autoprefixer');
  });

  test('should have correct Vercel configuration', () => {
    const vercelConfig = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'vercel.json'), 'utf8'));
    
    expect(vercelConfig.buildCommand).toBe('npm run build');
    expect(vercelConfig.framework).toBe('nextjs');
    expect(vercelConfig.outputDirectory).toBe('.next');
  });

  test('should have correct TypeScript module resolution', () => {
    const tsConfig = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'tsconfig.json'), 'utf8'));
    
    expect(tsConfig.compilerOptions.moduleResolution).toBe('bundler');
  });
});