
// Recupera o array salvo ou cria um array inicial.
let valores = JSON.parse(localStorage.getItem("valores")) || [5, 12, 18, 25];

// Recupera o histórico salvo ou cria um histórico vazio.
let historico = JSON.parse(localStorage.getItem("historico")) || [];

// Salva os dados e atualiza as informações na página.
function salvarDados() {
    localStorage.setItem("valores", JSON.stringify(valores));
    localStorage.setItem("historico", JSON.stringify(historico));

    mostrarArray();
    mostrarHistorico();
}

// Mostra os valores do array e seus índices.
function mostrarArray() {
    let texto = "";

    for (let i = 0; i < valores.length; i++) {
        texto += "[" + i + "] R$ " + valores[i].toFixed(2) + " | ";
    }

    if (valores.length === 0) {
        texto = "O array está vazio.";
    }

    document.getElementById("arrayPrincipal").textContent = texto;
    document.getElementById("listaIndices").textContent = texto;
}

// Registra a operação com data e horário.
function registrarHistorico(mensagem) {
    let data = new Date();
    let dataFormatada = data.toLocaleString("pt-BR");

    historico.unshift(dataFormatada + " - " + mensagem);

    salvarDados();
}

// Adiciona um valor ao array usando push().
function adicionarValor() {
    let campo = document.getElementById("valorNovo");
    let valor = Number(campo.value);

    if (campo.value === "" || !Number.isFinite(valor) || valor < 0) {
        alert("Digite um valor válido, igual ou maior que zero.");
        return;
    }

    valores.push(valor);

    document.getElementById("resultadoPush").textContent =
        "Valor adicionado! Array atual: [" + valores.join(", ") + "]";

    campo.value = "";

    registrarHistorico(
        "push(): valor R$ " + valor.toFixed(2) + " adicionado."
    );
}

// Transforma os valores usando map(), sem alterar o array principal.
function transformarArray() {
    let tipo = document.getElementById("tipoMap").value;
    let novoArray = [];
    let descricao = "";

    if (tipo === "dolar") {
        novoArray = valores.map(function(valor) {
            return (valor / 5).toFixed(2);
        });

        descricao = "Conversão para dólar (US$ 1 = R$ 5,00): ";

    } else if (tipo === "euro") {
        novoArray = valores.map(function(valor) {
            return (valor / 5.5).toFixed(2);
        });

        descricao = "Conversão para euro (€ 1 = R$ 5,50): ";

    } else {
        novoArray = valores.map(function(valor) {
            return "💰 R$ " + valor.toFixed(2);
        });

        descricao = "Valores com emoji de dinheiro: ";
    }

    document.getElementById("resultadoMap").textContent =
        descricao + "[" + novoArray.join(", ") + "]";

    registrarHistorico(
        "map(): " + descricao + "[" + novoArray.join(", ") + "]"
    );
}

// Filtra os valores usando filter().
function filtrarArray() {
    let tipo = document.getElementById("tipoFiltro").value;
    let filtrado = [];
    let condicao = "";

    if (tipo === "menor") {
        filtrado = valores.filter(function(valor) {
            return valor < 10;
        });

        condicao = "valores menores que R$ 10,00";

    } else if (tipo === "meio") {
        filtrado = valores.filter(function(valor) {
            return valor >= 10 && valor <= 20;
        });

        condicao = "valores entre R$ 10,00 e R$ 20,00";

    } else {
        filtrado = valores.filter(function(valor) {
            return valor > 20;
        });

        condicao = "valores maiores que R$ 20,00";
    }

    document.getElementById("resultadoFilter").textContent =
        "Condição: " + condicao +
        ". Resultado: [" + filtrado.join(", ") + "]";

    registrarHistorico(
        "filter(): " + condicao +
        ". Resultado: [" + filtrado.join(", ") + "]"
    );
}

// Remove valores usando splice().
function removerValores() {
    let campoInicio = document.getElementById("indiceInicio");
    let campoQuantidade = document.getElementById("quantidade");

    let inicio = Number(campoInicio.value);
    let quantidade = Number(campoQuantidade.value);

    if (campoInicio.value === "" || campoQuantidade.value === "") {
        alert("Preencha o índice inicial e a quantidade.");
        return;
    }

    if (!Number.isInteger(inicio) || inicio < 0 ||
        inicio >= valores.length) {
        alert("Digite um índice válido que exista no array.");
        return;
    }

    if (!Number.isInteger(quantidade) || quantidade < 1) {
        alert("A quantidade deve ser um número inteiro maior que zero.");
        return;
    }

    if (quantidade > valores.length - inicio) {
        alert("A quantidade é maior que o número de itens disponíveis.");
        return;
    }

    // splice() retorna os itens removidos.
    let removidos = valores.splice(inicio, quantidade);
    let textoRemovidos = removidos.join(", ");

    let resultado = document.getElementById("resultadoSplice");

    resultado.innerHTML =
        "Itens removidos: <span class='removido'>" +
        textoRemovidos +
        "</span><br>Array atualizado: [" + valores.join(", ") + "]";

    campoInicio.value = "";
    campoQuantidade.value = "";

    registrarHistorico(
        "splice(): removidos [" + textoRemovidos +
        "] a partir do índice " + inicio + "."
    );
}

// Mostra todas as operações registradas.
function mostrarHistorico() {
    let lista = document.getElementById("historico");
    lista.innerHTML = "";

    if (historico.length === 0) {
        let item = document.createElement("li");
        item.textContent = "Nenhuma operação registrada.";
        lista.appendChild(item);
        return;
    }

    for (let i = 0; i < historico.length; i++) {
        let item = document.createElement("li");
        item.textContent = historico[i];
        lista.appendChild(item);
    }
}

function limparHistorico() {
    let confirmar = confirm(
        "Deseja apagar o histórico? O array será mantido."
    );

    if (confirmar) {
        historico = [];
        salvarDados();
    }
}

mostrarArray();
mostrarHistorico();
