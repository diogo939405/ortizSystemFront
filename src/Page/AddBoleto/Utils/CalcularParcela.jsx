export function CalcularParcelas(valorString, quantidadeString) {
    const rawValor = parseFloat(valorString?.replace(/\D/g, '')) / 100;
    const quantidade = parseInt(quantidadeString);

    if (isNaN(rawValor) || isNaN(quantidade) || quantidade <= 0) {
        return [];
    }



    const valorParcela = (rawValor / quantidade).toFixed(2);

    return Array.from({ length: quantidade }, (_, i) => ({
        numeroParcela: i + 1,
        valor: 'R$ ' + valorParcela.replace('.', ','),
        // vencimento: '',
        status: true
    }));
}