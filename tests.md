# Testing Documentation

## Setup

First, install the required dependencies:
```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom @testing-library/user-event jest-environment-jsdom
```

## Running Tests

You can run the tests using any of these commands:
- `npm test` - Run all tests once
- `npm run test:watch` - Run tests in watch mode (tests will re-run when files change)
- `npm run test:coverage` - Run tests with coverage report

## Test Suite Overview

### ProductForm Tests
- Rendering with existing product data
- Rendering empty form
- Form field updates
- Form submission
- Image upload handling

### BlogForm Tests
- Rendering with existing blog data
- Rendering empty form
- Form field updates
- Tag management (add/remove)
- Form submission
- Image upload handling
- Blog update functionality

### Spinner Tests
- Basic rendering
- Class name verification

## Test Coverage

The tests cover the main functionality of your components, including:
- Component rendering
- User interactions
- Form submissions
- API calls
- File uploads
- State management
