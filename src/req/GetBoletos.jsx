import useTableContext from '../contexts/UseTableContext';
import { useEffect } from 'react';

export default function GetBoletos() {
    const getBoletos = import.meta.env.VITE_API_BUSCAR_BOLETOS;
    const { setBoletosData, setLoading } = useTableContext();

    useEffect(() => {
        const fetchBoletos = async () => {
            setLoading(true);
            try {
                const response = await fetch(getBoletos, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    setBoletosData(data); // só isso
                    console.log(data);
                }
            } catch (error) {
                console.error('Erro ao buscar boletos:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchBoletos();
    }, [getBoletos, setBoletosData, setLoading]);

    return null;
}
