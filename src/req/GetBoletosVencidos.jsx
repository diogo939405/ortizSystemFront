import React from 'react'

export default async function GetBoletosVencidos() {
    const url = import.meta.env.VITE_API_BOLETOS_VENCIDOS;
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        })
        if (response.ok) {
            const data = await response.json();
            console.log('Boletos vencidos:', data);
            return data;
        }
    } catch (error) {
        console.error('Erro ao buscar boletos vencidos:', error);
    }
}
