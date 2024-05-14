function carregarSite(){
    document.getElementById("negotiation").value = `Primeiro bloqueio: DD/MM/AAAA

NEGOCIAÇÃO
    
Faturas:
- Fatura FAT111111111111111/1, vencimento DD/MM/AAAA, valor R$ 0,00
Excedente:
- Periodo DD/MM/AAAA, a DD/MM/AAAA, 0 dia(s), valor R$ 0,00
    
TOTAL DEVIDO: R$ 0,00

r. serra em 12 de mai '24`

    alert("AVISO: Operações com eventuais ainda em fase de desenvolvimento. Talvez não funcionem como desejado.")
}

function cleanNegotiation() {
    // Obter todos os botões de rádio com o nome "eventuals"
    const eventualsRadioButtons = document.querySelectorAll('input[name="eventuals"]');
    var eventualAdd = document.getElementById("eventualAdd");
    eventualAdd.style.display = "none";

    document.getElementById("negotiation").value = "";
    document.getElementById("subscriptionPlan").value = "";
    document.getElementById("usageStop").value = "";
    document.getElementById("negotiationRet").value = "";

    // Iterar sobre os botões de rádio e desmarcá-los
    eventualsRadioButtons.forEach(radioButton => {
        radioButton.checked = false;
    });
}


// Função para copiar o texto retificado
function copyRetNegotiation() {
    const textArea = document.getElementById("negotiationRet");
    
    if (textArea === "") {
        alert("Nenhum texto foi copiado. O campo está vazio.");
    } else {
        textArea.select();
        document.execCommand("copy");
        alert("Texto copiado com sucesso.");
    }
}


function eventualAdd() {
    var eventualAdd = document.getElementById("eventualAdd");
    var simRadio = document.querySelector('input[name="eventuals"][value="Sim"]');
    
    if (simRadio.checked) {
        eventualAdd.style.display = "flex";
    } else {
        eventualAdd.style.display = "none";
    }
}


// Função para formatar a data como dd/mm/aaaa
function formatarData(input) {
    let value = input.value.replace(/\D/g, '').substring(0, 8);
    if (value.length > 2) value = `${value.substring(0, 2)}/${value.substring(2, 4)}/${value.substring(4, 8)}`;
    input.value = value;
}

// Adicionando um event listener para o campo de data
document.querySelector('input[name="usageStop"]').addEventListener('input', function() {
    formatarData(this);
});

// Função para formatar o valor do plano como números decimais
function formatarValorPlano(input) {
    let value = input.value.replace(/\D/g, '');
    const number = parseFloat(value) / 100; // Divide por 100 para tratar como centavos
    input.value = number.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
}

// Adicionando um event listener para o campo do valor do plano
document.querySelector('input[name="subscriptionPlan"]').addEventListener('input', function() {
    formatarValorPlano(this);
});

function retificarRenegociacao() {
    const subscriptionPlanValue = document.getElementById("subscriptionPlan").value.trim();
    const usageStopValue = document.getElementById("usageStop").value.trim();
    const negotiationValue = document.getElementById("negotiation").value.trim();
    const eventualsValue = document.querySelector('input[name="eventuals"]').value.trim();

    if (subscriptionPlanValue === "" || usageStopValue === "" || negotiationValue === "" || eventualsValue === "") {
        alert("Por favor, preencha todos os campos corretamente");
        return false;
    } else {
        // Pegar as informações fornecidas pelo usuário
    const negotiation = document.getElementById("negotiation").value;
    const subscriptionPlan = parseFloat(document.getElementById("subscriptionPlan").value.replace(".", "").replace(",", "."));
    const usageStop = document.getElementById("usageStop").value;

    // Expressões regulares para extrair as informações desejadas
    const regexPrimeiroBloqueio = /Primeiro bloqueio: (\d{2}\/\d{2}\/\d{4})/;
    const regexFatura = /- Fatura (.*?), vencimento (\d{2}\/\d{2}\/\d{4}), valor (R\$ \d+,\d{2})/;
    const regexDataInicio = /Periodo (\d{2}\/\d{2}\/\d{4}) a (\d{2}\/\d{2}\/\d{4})/;

    // Executando as expressões regulares no texto da negociação
    const primeiroBloqueio = negotiation.match(regexPrimeiroBloqueio)[0];
    const fatura = negotiation.match(regexFatura)[0];
    const valorFatura = parseFloat(negotiation.match(regexFatura)[3].replace("R$ ", "").replace(".", "").replace(",", "."));
    const dataInicioMatch = negotiation.match(regexDataInicio);
    const dataInicio = dataInicioMatch[1];
    const dataFim = dataInicioMatch[2];

    // Convertendo datas para objetos Date
    const dataInicioObj = new Date(dataInicio.split('/').reverse().join('/'));
    const dataFimObj = new Date(dataFim.split('/').reverse().join('/'));
    const usageStopObj = new Date(usageStop.split('/').reverse().join('/'));

    // Cálculos
    const diasUtilizados = Math.floor((usageStopObj - dataInicioObj) / (1000 * 60 * 60 * 24)+1);
    const excedente = subscriptionPlan / 30 * diasUtilizados;
    const totalDevido = excedente + valorFatura;

    // Formatando datas para o formato dd/mm/aaaa
    const dataInicioFormatada = `${dataInicioObj.getDate().toString().padStart(2, '0')}/${(dataInicioObj.getMonth() + 1).toString().padStart(2, '0')}/${dataInicioObj.getFullYear()}`;
    const dataFimFormatada = `${usageStopObj.getDate().toString().padStart(2, '0')}/${(usageStopObj.getMonth() + 1).toString().padStart(2, '0')}/${usageStopObj.getFullYear()}`;

    // Exibir resultado
    document.getElementById("negotiationRet").value = `RETIFICANDO:

${primeiroBloqueio}
Utilizou até: ${dataFimFormatada}

NEGOCIAÇÃO

Faturas:
${fatura}
Excedente:
- Periodo ${dataInicioFormatada} a ${dataFimFormatada}, ${diasUtilizados} dia(s), valor R$ ${excedente.toFixed(2).replace(".", ",")}

TOTAL DEVIDO: R$ ${totalDevido.toFixed(2).replace(".", ",")}`;
    }
}
