import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import ResourceCard from '../ResourceCard';

describe('ResourceCard', () => {
    const mockResource = {
        id: '1',
        slug: 'test-resource',
        title: 'Test Resource',
        description: 'This is a test resource',
        categoryName: 'Food',
        city: 'New York',
        fullAddress: '123 Test St, New York, NY',
        imageUrl: ['test.jpg'],
        isSaved: false
    };

    const mockOnSave = vi.fn();
    const mockOnShare = vi.fn();
    const mockOnContact = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders resource information', () => {
        render(
            <ResourceCard
                resource={mockResource}
                onSave={mockOnSave}
                onShare={mockOnShare}
                onContact={mockOnContact}
            />
        );

        expect(screen.getByText('Test Resource')).toBeInTheDocument();
        expect(screen.getByText('This is a test resource')).toBeInTheDocument();
        expect(screen.getByText('Food')).toBeInTheDocument();
        
        // IMPORTANTE: Cambia esto para usar expresión regular
        expect(screen.getByText(/New York/)).toBeInTheDocument();
        
        // O si quieres ser más específico, busca en el contexto de ubicación:
        // Busca el elemento que contiene la ubicación (puede ser un span, div, etc.)
        const locationElement = screen.getByText((content, element) => {
            // Busca cualquier elemento que contenga "New York" en su texto
            return content.includes('New York') && element.tagName !== 'SCRIPT';
        });
        expect(locationElement).toBeInTheDocument();
    });

    it('calls onContact when view details is clicked', () => {
        render(
            <ResourceCard
                resource={mockResource}
                onSave={mockOnSave}
                onShare={mockOnShare}
                onContact={mockOnContact}
            />
        );

        const button = screen.getByText(/View Details/i);
        fireEvent.click(button);

        expect(mockOnContact).toHaveBeenCalledWith(mockResource);
    });
});