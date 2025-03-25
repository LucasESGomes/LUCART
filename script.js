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
    container.querySelector('.valor-dolar').innerHTML = `Valor convertido dolar para real: ${valorFormatado}`;
}
// Atualizar a cada segundo
setInterval(refresh, 1000);





//Código da API - CEP (calcular frete)
// 1. Adicione estas funções (novas)
    function showPopup(content) {
        const popupOverlay = document.getElementById('popupOverlay');
        const popupContent = document.getElementById('popupContent');
        popupContent.innerHTML = content;
        popupOverlay.classList.add('active');
    }

    function hidePopup() {
        document.getElementById('popupOverlay').classList.remove('active');
    }

    // 2. Modifique APENAS a função consultarFrete() (substitua pela versão abaixo)
    function consultarFrete() {
        const cep = document.getElementById('cep').value;
        
        if (!cep || cep.length !== 8) {
            showPopup('Por favor, insira um CEP válido!');
            return;
        }
    
    fetch(`https://viacep.com.br/ws/${cep}/json/`)
        .then(response => response.json())
        .then(data => {
            if (data.erro) {
                showPopup('CEP não encontrado.');
            } else {
                const endereco = `${data.logradouro}, ${data.bairro}, ${data.localidade} - ${data.uf}`;
                let valorFrete = calcularFrete(data.uf);
                
                showPopup(`
                    <h3>Endereço Encontrado:</h3>
                    <p>${endereco}</p>
                    <h3>Valor do Frete:</h3>
                    <p>R$ ${valorFrete} (Estimado)</p>
                `);
            }
        })
        .catch(error => {
            console.error('Erro ao consultar o CEP:', error);
            showPopup('Ocorreu um erro na consulta.');
        });
}

// 3. Adicione este evento no final do seu JS (novo)
document.getElementById('popupClose').addEventListener('click', hidePopup);

// Função para calcular o valor do frete baseado no estado
function calcularFrete(estado) {
    const tabelaFrete = {
        'SP': "Gratis",   // São Paulo
        'RJ': 15,   // Rio de Janeiro
        'MG': 20,   // Minas Gerais
        'ES': 18,   // Espírito Santo
        'PR': 22,   // Paraná
        'SC': 25,   // Santa Catarina
        'RS': 30,   // Rio Grande do Sul
        'BA': 35,   // Bahia
        'PE': 40,   // Pernambuco
        'CE': 45,   // Ceará
        'PI': 50,   // Piauí
        'MA': 55,   // Maranhão
        'GO': 20,   // Goiás
        'DF': 12,   // Distrito Federal
        'MT': 25,   // Mato Grosso
        'MS': 28,   // Mato Grosso do Sul
        'AM': 60,   // Amazonas
        'PA': 65,   // Pará
        'AC': 70,   // Acre
        'RO': 75,   // Rondônia
        'RR': 80,   // Roraima
        'TO': 85,   // Tocantins
        'AL': 30,   // Alagoas
        'SE': 32,   // Sergipe
        'RN': 33,   // Rio Grande do Norte
        'PB': 38,   // Paraíba
        'PI': 45    // Piauí
    };
    
    // Retorna o valor do frete de acordo com o estado ou um valor padrão (caso o estado não esteja na tabela)
    return tabelaFrete[estado] || 50; // 50 é o valor padrão para estados não listados
}