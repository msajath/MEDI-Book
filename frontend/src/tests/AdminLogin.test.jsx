import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { expect, test, vi } from 'vitest';
import AdminLogin from '../pages/AdminLogin';
import { AuthProvider } from '../context/AuthContext';

// Mock fetch
global.fetch = vi.fn();

test('renders AdminLogin form', () => {
  render(
    <BrowserRouter>
      <AuthProvider>
        <AdminLogin />
      </AuthProvider>
    </BrowserRouter>
  );

  expect(screen.getByText(/Admin Portal/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/admin@mednexus.com/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/Enter your password/i)).toBeInTheDocument();
});

test('handles input changes', () => {
  render(
    <BrowserRouter>
      <AuthProvider>
        <AdminLogin />
      </AuthProvider>
    </BrowserRouter>
  );

  const emailInput = screen.getByPlaceholderText(/admin@mednexus.com/i);
  fireEvent.change(emailInput, { target: { value: 'admin@test.com' } });
  expect(emailInput.value).toBe('admin@test.com');
});
