import Touro from "@/assets/touro.svg";
import Cerca from "@/assets/cerca.svg";
import Peru from "@/assets/peru.svg";

const nivel01 = {
    id: 1,
    titulo: "Nível 1 - A Fazenda",
    etapas: [
        {
            id: 1,
            tipo: "dialogo",
            fala: "Olá, pequeno(a)! Hoje temos uma missão especial na nossa fazenda."
        },
        {
            id: 2,
            tipo: "dialogo",
            fala: "Vamos descobrir como os sons se misturam!"
        },
        {
            id: 3,
            tipo: "dialogo",
            fala: "Você sabia que existe um som que faz a nossa língua dar um pulinho bem rápido?"
        },
        {
            id: 4,
            tipo: "dialogo",
            fala: "Ele gosta de aparecer bem no meio das palavras"
        },
        {
            id: 5,
            tipo: "dialogo",
            fala: "Hoje vamos aprender a fazer ele juntos! Vamos lá?"
        },
        {
            id: 6,
            tipo: "exercicio_ouvir",
            palavra: "TOURO",
            silaba: ["TOU", "RO"],
            fala: "Vamos ouvir como falamos o nome dele?",
            imagem: Touro,
            pronuncia: "/audios/touro.mp3"
        },
        {
            id: 7,
            tipo: "exercicio_ouvir",
            palavra: "TOURO",
            silaba: ["TOU", "RO"],
            fala: "Toque no botão azul para ouvir.",
            imagem: Touro,
            pronuncia: "/audios/touro.mp3"
        },
        {
            id: 8,
            tipo: "exercicio_ouvir",
            palavra: "TOURO",
            silaba: ["TOU", "RO"],
            fala: "Ouça quantas vezes quiser.",
            imagem: Touro,
            pronuncia: "/audios/touro.mp3"
        }, 
        {
            id: 9,
            tipo: "exercicio_falar",
            palavra: "TOURO",
            silaba: ["TOU", "RO"],
            fala: "Agora é a sua vez! Aperte o microfone para falar.",
            imagem: Touro,
            pronuncia: "/audios/touro.mp3"
        },
        {
            id: 10, 
            tipo: "dialogo",
            fala: "Muito bem! Vamos prosseguir"
        },
        {
            id: 11, 
            tipo: "exercicio_ouvir",
            palavra: "CERCA",
            silaba: ["CER", "CA"],
            fala: "Agora é com você!",
            imagem: Cerca,
            pronuncia: "/audios/cerca.mp3"
        },
        {
            id: 12,
            tipo: "exercicio_falar",
            palavra: "CERCA",
            silaba: ["CER", "CA"],
            imagem: Cerca,
            pronuncia: "/audios/cerca.mp3"
        },
        {
            id: 13,
            tipo: "dialogo",
            fala: "Muito bem! Vamos prosseguir"
        },
        {
            id: 14, 
            tipo: "exercicio_ouvir",
            palavra: "PERU",
            silaba: ["PE", "RU"],
            fala: "Agora é com você!",
            imagem: Peru,
            pronuncia: "/audios/peru.mp3"
        },
        {
            id: 15, 
            tipo: "exercicio_falar",
            palavra: "PERU",
            silaba: ["PE", "RU"],
            fala: "Agora é com você!",
            imagem: Peru,
            pronuncia: "/audios/peru.mp3"
        },
        {
            id: 16,
            tipo: "dialogo",
            fala: "Muito bem! Vamos prosseguir"
        }
    ]
}

export default nivel01;