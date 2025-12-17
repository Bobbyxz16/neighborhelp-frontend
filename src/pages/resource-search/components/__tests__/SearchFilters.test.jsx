
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import SearchFilters from '../SearchFilters';

describe('SearchFilters', () => {
    const mockFilters = {
        categoryIds: [],
        locationRadius: '10'
    };
    const mockOnFiltersChange = vi.fn();
    const mockOnClearFilters = vi.fn();
    const mockOnToggleExpanded = vi.fn();
    const mockOnCityChange = vi.fn();

    const mockCategories = [
        { id: '1', name: 'Food' },
        { id: '2', name: 'Housing' }
    ];

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders categories', () => {
        render(
            <SearchFilters
                filters={mockFilters}
                onFiltersChange={mockOnFiltersChange}
                onClearFilters={mockOnClearFilters}
                isExpanded={true}
                onToggleExpanded={mockOnToggleExpanded}
                categories={mockCategories}
                onCityChange={mockOnCityChange}
            />
        );

        expect(screen.getByText('Food')).toBeInTheDocument();
        expect(screen.getByText('Housing')).toBeInTheDocument();
    });

    it('calls onFiltersChange when category checkbox is clicked', () => {
        render(
            <SearchFilters
                filters={mockFilters}
                onFiltersChange={mockOnFiltersChange}
                onClearFilters={mockOnClearFilters}
                isExpanded={true}
                onToggleExpanded={mockOnToggleExpanded}
                categories={mockCategories}
                onCityChange={mockOnCityChange}
            />
        );

        const checkbox = screen.getAllByRole('checkbox')[0];
        fireEvent.click(checkbox);

        expect(mockOnFiltersChange).toHaveBeenCalled();
    });
});
