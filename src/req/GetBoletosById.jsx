// src/req/GetBoletosById.jsx
export default async function GetBoletosById(id) {
    const url = import.meta.env.VITE_API_BUSCAR_BOLETOS_POR_ID;

    try {
        const response = await fetch(`${url}${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }

        const data = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        console.error('Erro ao buscar boleto por ID:', error);
        return null;
    }
}
