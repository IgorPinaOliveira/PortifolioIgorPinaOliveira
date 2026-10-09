const botaoMenu = document.querySelector(".botao-menu");
const navegacao = document.querySelector(".navegacao");
const linksNavegacao = document.querySelectorAll(".link-navegacao");
const secoes = document.querySelectorAll("main section[id]");
const botaoTema = document.querySelector(".botao-tema");
const formularioContato = document.querySelector("#formulario-contato");
const campoTelefone = document.querySelector("#telefone");
const fundoModal = document.querySelector("#fundo-modal");
const botaoFecharModal = document.querySelector(".fechar-modal");
const botaoConfirmarModal = document.querySelector("#confirmar-modal");
const anoAtual = document.querySelector("#ano-atual");

anoAtual.textContent = new Date().getFullYear();

const chavePreferenciaTema = "preferenciaTemaIgorPina";

function aplicarTema(tema) {
    const temaClaroAtivo = tema === "claro";
    document.body.classList.toggle("tema-claro", temaClaroAtivo);
    botaoTema.textContent = temaClaroAtivo ? "☾" : "☼";
    botaoTema.setAttribute(
        "aria-label",
        temaClaroAtivo ? "Ativar modo escuro" : "Ativar modo claro"
    );
    botaoTema.setAttribute("aria-pressed", String(temaClaroAtivo));
}

let temaSalvo = null;
try {
    temaSalvo = localStorage.getItem(chavePreferenciaTema);
} catch (erro) {
    temaSalvo = null;
}
aplicarTema(temaSalvo === "claro" ? "claro" : "escuro");

botaoMenu.addEventListener("click", () => {
    const menuAberto = navegacao.classList.toggle("aberta");
    botaoMenu.setAttribute("aria-expanded", String(menuAberto));
    botaoMenu.setAttribute("aria-label", menuAberto ? "Fechar menu" : "Abrir menu");
});

linksNavegacao.forEach((link) => {
    link.addEventListener("click", () => {
        navegacao.classList.remove("aberta");
        botaoMenu.setAttribute("aria-expanded", "false");
        botaoMenu.setAttribute("aria-label", "Abrir menu");
    });
});

function atualizarNavegacao() {
    let secaoAtual = "inicio";

    secoes.forEach((secao) => {
        if (secao.getBoundingClientRect().top <= 160) {
            secaoAtual = secao.id;
        }
    });

    linksNavegacao.forEach((link) => {
        const destino = link.getAttribute("href").slice(1);
        const nomesSecoes = {
            inicio: "INÍCIO",
            sobre: "SOBRE",
            habilidades: "HABILIDADES",
            projetos: "PROJETOS",
            contato: "CONTATO"
        };

        link.classList.toggle("ativo", destino === secaoAtual);
        link.textContent = destino === secaoAtual
            ? `/ ${nomesSecoes[destino]}`
            : nomesSecoes[destino];
    });
}

window.addEventListener("scroll", atualizarNavegacao);
window.addEventListener("load", atualizarNavegacao);

botaoTema.addEventListener("click", () => {
    const temaClaroAtivo = !document.body.classList.contains("tema-claro");
    const novoTema = temaClaroAtivo ? "claro" : "escuro";
    aplicarTema(novoTema);

    try {
        localStorage.setItem(chavePreferenciaTema, novoTema);
    } catch (erro) {
        console.warn("Não foi possível salvar a preferência de tema neste navegador.");
    }
});

campoTelefone.addEventListener("input", () => {
    let numerosTelefone = campoTelefone.value.replace(/\D/g, "").slice(0, 11);

    if (numerosTelefone.length > 10) {
        numerosTelefone = numerosTelefone.replace(
            /^(\d{2})(\d{5})(\d{4})$/,
            "($1) $2-$3"
        );
    } else if (numerosTelefone.length > 6) {
        numerosTelefone = numerosTelefone.replace(
            /^(\d{2})(\d{4})(\d{0,4})$/,
            "($1) $2-$3"
        );
    } else if (numerosTelefone.length > 2) {
        numerosTelefone = numerosTelefone.replace(
            /^(\d{2})(\d{0,5})$/,
            "($1) $2"
        );
    }

    campoTelefone.value = numerosTelefone;
});

function abrirModal() {
    fundoModal.classList.add("aberto");
    fundoModal.setAttribute("aria-hidden", "false");
    botaoConfirmarModal.focus();
}

function fecharModal() {
    fundoModal.classList.remove("aberto");
    fundoModal.setAttribute("aria-hidden", "true");
}

formularioContato.addEventListener("submit", (evento) => {
    evento.preventDefault();

    if (!formularioContato.checkValidity()) {
        formularioContato.reportValidity();
        return;
    }

    const numerosTelefone = campoTelefone.value.replace(/\D/g, "");

    if (numerosTelefone.length < 10 || numerosTelefone.length > 11) {
        campoTelefone.setCustomValidity("Digite um telefone válido com DDD.");
        campoTelefone.reportValidity();
        campoTelefone.setCustomValidity("");
        return;
    }

    abrirModal();
});

botaoFecharModal.addEventListener("click", fecharModal);
botaoConfirmarModal.addEventListener("click", fecharModal);

fundoModal.addEventListener("click", (evento) => {
    if (evento.target === fundoModal) {
        fecharModal();
    }
});

document.addEventListener("keydown", (evento) => {
    if (evento.key === "Escape" && fundoModal.classList.contains("aberto")) {
        fecharModal();
    }
});

const elementosAnimados = document.querySelectorAll(".aparecer");

if ("IntersectionObserver" in window) {
    const observador = new IntersectionObserver((entradas, observadorAtual) => {
        entradas.forEach((entrada) => {
            if (entrada.isIntersecting) {
                entrada.target.classList.add("visivel");
                observadorAtual.unobserve(entrada.target);
            }
        });
    }, {
        threshold: 0.15
    });

    elementosAnimados.forEach((elemento) => observador.observe(elemento));
} else {
    elementosAnimados.forEach((elemento) => elemento.classList.add("visivel"));
}
