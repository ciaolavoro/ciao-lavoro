import { render, screen } from '@testing-library/react';
import { describe, test, expect } from '@jest/globals';
import { ContractCardWorker } from '../ContractCardWorker';

const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false  };
    return new Date(dateString).toLocaleDateString(undefined, options);
};

describe('ContractCardWorker', () => {
    test('Elementos estáticos', () => {
        const contractData = {
            client: { username: 'Nombre de usuario de ejemplo' },
            initial_date: new Date(),
            end_date: new Date(),
            estatus: 'Activo'
        };

        render(<ContractCardWorker contract={contractData} />);

        const textElement = screen.getByText('Nombre del Cliente:');
        const textElement1 = screen.getByText('Fecha de inicio:');
        const textElement2 = screen.getByText('Fecha fin:');
        const textElement3 = screen.getByText('Estado:');

        //Si quieres comprobar que el texto pertenece a un apartado "Heading":
        expect(screen.getByRole('heading')).toBe(textElement);
        //Si quieres comprobar que el elemento exista en el documento:
        expect(textElement).toBeTruthy();
        expect(textElement1).toBeTruthy();
        expect(textElement2).toBeTruthy();
        expect(textElement3).toBeTruthy();
    });

    test('Formato de fecha', () => {
        const contractData = {
            client: { username: 'Nombre de usuario de ejemplo' },
            initial_date: new Date(),
            end_date: new Date(),
            estatus: 'Activo'
        };

        render(<ContractCardWorker contract={contractData} />);

        const date = new Date('2024-03-22T12:30:00');
        const formattedDate = formatDate(date);
        expect(formattedDate).toBe('22 de marzo de 2024, 12:30');
    });
    test('Mostrar nombre de usuario del cliente', () => {
        const contractData = {
            client: { username: 'Nombre de usuario de ejemplo' },
            initial_date: new Date('2024-03-22T12:30:00'),
            end_date: new Date('2024-05-22T12:30:00'),
            estatus: 'Activo'
        };
    
        render(<ContractCardWorker contract={contractData} />);
    
        const usernameElement = screen.getByText('Nombre de usuario de ejemplo');
        const initialDateElement = screen.getByText('22 de marzo de 2024, 12:30');
        const endDateElement = screen.getByText('22 de mayo de 2024, 12:30');
        const statusElement = screen.getByText('Activo');
        expect(usernameElement).toBeTruthy();
        expect(initialDateElement).toBeTruthy();
        expect(endDateElement).toBeTruthy();
        expect(statusElement).toBeTruthy();

    });
    
    
    
});
