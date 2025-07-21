export function CalcularParcelas(valorString, quantidadeString) {
    // Extrai valor numérico da string "R$ 1.234,56"
    const rawValor = parseFloat(valorString?.replace(/\D/g, '')) / 100;
    const quantidade = parseInt(quantidadeString);

    if (isNaN(rawValor) || isNaN(quantidade) || quantidade <= 0) {
        return [];
    }

    const valorParcela = (rawValor / quantidade).toFixed(2);

    return Array.from({ length: quantidade }, () => ({
        valor: 'R$ ' + valorParcela.replace('.', ','),
        vencimentoInicial: ''
    }));
}
