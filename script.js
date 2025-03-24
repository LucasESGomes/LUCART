function refresh() {
    fetch(`https://economia.awesomeapi.com.br/last/USD-BRL`)
        .then(resposta => resposta.json()).then(economia => {
            console.log(economia);

            // Pegar o valor atual do dólar
            var valorAtual = parseFloat(economia['USDBRL'].bid);

            // Selecionar todos os produtos (página de listagem)
            var produtos = document.querySelectorAll('.product');
            if (produtos.length > 0) {
                produtos.forEach(produto => {
                    atualizarValorConvertido(produto, valorAtual);
                });
            }

            // Selecionar o produto individual (página do produto)
            var produtoIndividual = document.querySelector('.information-product');
            if (produtoIndividual) {
                atualizarValorConvertido(produtoIndividual, valorAtual);
            }
        })
        .catch(erro => {
            console.error('Erro ao buscar a cotação do dólar:', erro);
            // Exibir mensagem de erro em todos os produtos
            document.querySelectorAll('.valor-dolar').forEach(elemento => {
                elemento.innerHTML = 'Erro ao carregar o valor convertido.';
            });
        });
}

function atualizarValorConvertido(container, valorAtual) {
    // Pegar o valor do produto (que está no <p class="value-product">)
    var valorProduto = parseFloat(container.querySelector('.value-product').textContent);

    // Calcular o valor convertido para Real
    var valorConvertido = (valorAtual * valorProduto).toFixed(2);

    // Formatar o valor convertido como moeda
    var valorFormatado = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(valorConvertido);

    // Atualizar o elemento que exibe o valor convertido
    container.querySelector('.valor-dolar').innerHTML = `Valor convertido para real: ${valorFormatado}`;
}

// Atualizar a cada segundo
setInterval(refresh, 1000);