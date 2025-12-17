import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import SearchBar from '../SearchBar';

describe('SearchBar', () => {
    const mockOnSearchChange = vi.fn();
    const mockOnSearch = vi.fn();
    const mockOnLocationDetect = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders search input', () => {
        render(
            <MemoryRouter> {/* Envuelve con MemoryRouter */}
                <SearchBar
                    searchQuery=""
                    onSearchChange={mockOnSearchChange}
                    onSearch={mockOnSearch}
                    onLocationDetect={mockOnLocationDetect}
                />
            </MemoryRouter>
        );
        expect(screen.getByPlaceholderText(/search for resources/i)).toBeInTheDocument();
    });

    it('calls onSearchChange when typing', () => {
        render(
            <MemoryRouter> {/* Envuelve con MemoryRouter */}
                <SearchBar
                    searchQuery=""
                    onSearchChange={mockOnSearchChange}
                    onSearch={mockOnSearch}
                    onLocationDetect={mockOnLocationDetect}
                />
            </MemoryRouter>
        );

        const input = screen.getByPlaceholderText(/search for resources/i);
        fireEvent.change(input, { target: { value: 'food' } });

        expect(mockOnSearchChange).toHaveBeenCalledWith('food');
    });

    it('calls onSearch when form is submitted', () => {
        render(
            <MemoryRouter> {/* Envuelve con MemoryRouter */}
                <SearchBar
                    searchQuery="food"
                    onSearchChange={mockOnSearchChange}
                    onSearch={mockOnSearch}
                    onLocationDetect={mockOnLocationDetect}
                />
            </MemoryRouter>
        );

        const form = screen.getByRole('textbox').closest('form');
        fireEvent.submit(form);

        expect(mockOnSearch).toHaveBeenCalledWith('food', expect.any(String));
    });
});