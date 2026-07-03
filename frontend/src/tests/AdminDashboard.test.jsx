import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { expect, test, vi, beforeEach } from 'vitest';
import AdminDashboard from '../pages/AdminDashboard';
import { AuthProvider } from '../context/AuthContext';

global.fetch = vi.fn();

beforeEach(() => {
  global.fetch.mockReset();
});

test('renders AdminDashboard stats', async () => {
  // Mock the admin stats endpoint
  global.fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => ({
      success: true,
      stats: {
        totalDoctors: '10',
        totalPatients: '50',
        monthlyAppointments: '25',
        revenue: '$5000'
      }
    })
  });

  render(
    <BrowserRouter>
      <AuthProvider>
        <AdminDashboard />
      </AuthProvider>
    </BrowserRouter>
  );

  // Since it fetches data on mount, wait for the elements to appear
  expect(await screen.findByText(/Admin Overview/i)).toBeInTheDocument();
  expect(await screen.findByText('10')).toBeInTheDocument();
  expect(await screen.findByText('50')).toBeInTheDocument();
  expect(await screen.findByText('25')).toBeInTheDocument();
  expect(await screen.findByText('$5000')).toBeInTheDocument();
});
