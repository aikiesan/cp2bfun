# Testing Guide

This project uses Vitest and React Testing Library for unit and integration testing.

## Running Tests

```bash
# Run tests in watch mode (recommended for development)
npm test

# Run tests once
npm run test:run

# Run tests with UI (interactive browser interface)
npm run test:ui

# Run tests with coverage report
npm run test:coverage
```

## Writing Tests

### Test Files Location
- Component tests: `src/components/__tests__/ComponentName.test.jsx`
- Page tests: `src/pages/__tests__/PageName.test.jsx`
- Utility tests: `src/utils/__tests__/utilName.test.js`

### Using Test Utilities

We provide a custom render function that wraps components with all necessary providers:

```jsx
import { renderWithProviders } from '../../test/utils';
import MyComponent from '../MyComponent';

describe('MyComponent', () => {
  it('renders correctly', () => {
    const { getByText } = renderWithProviders(<MyComponent />);
    expect(getByText('Hello')).toBeInTheDocument();
  });
});
```

### Example Test

```jsx
import { describe, it, expect } from 'vitest';
import { renderWithProviders, screen } from '../../test/utils';
import Footer from '../Footer';

describe('Footer', () => {
  it('displays copyright information', () => {
    renderWithProviders(<Footer />);
    const currentYear = new Date().getFullYear();
    expect(screen.getByText(new RegExp(currentYear.toString()))).toBeInTheDocument();
  });
});
```

## Test Coverage

After running `npm run test:coverage`, you can view the coverage report at:
- HTML report: `coverage/index.html`
- Console summary: displayed in terminal

## Best Practices

1. **Use descriptive test names**: Describe what the test does, not how it does it
2. **Test user behavior**: Focus on what users see and do, not implementation details
3. **Use screen queries**: Prefer `screen.getByRole` over `getByTestId`
4. **Clean up**: Tests automatically cleanup after each test via our setup file
5. **Mock external dependencies**: Use `vi.mock()` for external APIs and services

## CI/CD Integration

Tests can be integrated into your CI/CD pipeline:

```yaml
# Example GitHub Actions workflow
- name: Run tests
  run: npm run test:run

- name: Generate coverage
  run: npm run test:coverage
```

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Testing Library Queries](https://testing-library.com/docs/queries/about)
