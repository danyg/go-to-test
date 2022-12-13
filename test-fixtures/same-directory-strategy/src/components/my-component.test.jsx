import '@testing-library/jest-dom';
import { MyComponent } from './my-component';
import { render, screen } from '@testing-library/react';

describe('My Component', () => {
  it('should have a title', () => {
    render(<MyComponent />);

    expect(screen.getByText('My Component')).toBeInDocument();
  });
});
