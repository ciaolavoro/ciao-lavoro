import { render, screen } from '@testing-library/react';
import { describe, test, expect } from '@jest/globals';
import { ContractCardWorker } from '../ContractCardWorker';

describe('ContractCardWorker', () => {
    test('Username exists', () => {
        const contractData = {
            client: { username: 'Nombre de usuario de ejemplo' },
            initial_date: new Date(),
            end_date: new Date(),
            estatus: 'Activo'
        };

        render(<ContractCardWorker contract={contractData} />);

        const textElement = screen.getByText('Nombre del Cliente:');
        expect(screen.getByRole('heading')).toBe(textElement);
    });
});
