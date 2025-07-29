export default async function GetBoletosVencendo() {
    const url = import.meta.env.VITE_API_BOLETOS_VENCENDO;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error('Erro ao buscar boletos vencendo');
        }

        const data = await response.json();
        return data;

    } catch (error) {
        console.error('Erro ao buscar boletos vencendo:', error);
        throw error;
    }
}
