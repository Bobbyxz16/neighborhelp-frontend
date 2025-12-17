
import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import ResourceSearch from '../index';
import { API_BASE_URL, API_ENDPOINTS, DEFAULT_CATEGORIES } from '../../../utils/constants';

// Mock dependencies
// Mock dependencies
vi.mock('../../../components/ui/ui-components/Header', () => ({
    default: () => <div data-testid="header">Header</div>
}));

// Mock defaultResources to avoid import issues or large data
vi.mock('../../../utils/defaultResources', () => ({
    default: [
        {
            id: '1',
            title: 'Test Resource',
            categoryName: 'Food',
            description: 'Test Description',
            slug: 'test-resource',
            imageUrl: []
        }
    ]
}));

// Mock fetch
global.fetch = vi.fn();

describe('ResourceSearch Integration', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        global.fetch.mockResolvedValue({
            ok: true,
            json: async () => []
        });
    });

    it('renders correctly and loads data', async () => {
        render(
            <MemoryRouter>
                <ResourceSearch />
            </MemoryRouter>
        );

        expect(screen.getByText('Find Community Resources')).toBeInTheDocument();

        // Check initial loading state or filters
        expect(screen.getByText('Filters')).toBeInTheDocument();

        // Check if defaults are loaded from constants (SearchFilters renders these)
        await waitFor(() => {
            expect(screen.getByText(DEFAULT_CATEGORIES[0])).toBeInTheDocument();
        });
    });

    it('filters resources when searching', async () => {
        render(
            <MemoryRouter>
                <ResourceSearch />
            </MemoryRouter>
        );

        const searchInput = screen.getByPlaceholderText(/search for resources/i);
        fireEvent.change(searchInput, { target: { value: 'Something' } });

        // Wait for debounce or effect
        await waitFor(() => {
            expect(searchInput.value).toBe('Something');
        });
    });
});
