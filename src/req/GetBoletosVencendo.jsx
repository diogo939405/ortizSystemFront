export default async function GetBoletosVencendo() {
    const url = import.meta.env.VITE_API_BOLETOS_VENCENDO;
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (response.ok) {
            const data = await response.json();
            console.log('Boletos vencendo:', data);
            return data;
        } else {
            throw new Error('Erro ao buscar boletos vencendo');
        }

    } catch (error) {
        console.error('Erro ao buscar boletos vencendo:', error);
        throw error;
    }
}
