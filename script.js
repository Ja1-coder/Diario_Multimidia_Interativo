//Lógica para adicionar entradas ao local Storage
let hoje = new Date();
let dia = String(hoje.getDate()).padStart(2, '0');
let mes = String(hoje.getMonth() + 1).padStart(2, '0');
let ano = hoje.getFullYear();

let dataHoje = `${ano}-${mes}-${dia}`;

document.getElementById("data").setAttribute("max", dataHoje);

document.getElementById("form").addEventListener("submit", function(event) {
    event.preventDefault();  // Impede o envio padrão do formulário

    const titulo = document.getElementById("titulo").value;
    const tipoMidia = document.querySelector('input[name="tipo_midia"]:checked')?.value || "";
    let data = document.getElementById("data").value;
    let dataEscolhida = new Date(data); 
    if(dataEscolhida > hoje){
        alert("Data inválida!");
        return;
    }
    const avaliacao = document.getElementById("avaliacao").value;
    const texto = document.getElementById("texto").value;
    const trailer = document.getElementById("trailer").value;

    const entrada = { titulo, tipoMidia, data, avaliacao, texto, trailer };

    let entradas = JSON.parse(localStorage.getItem("entradas")) || [];
    entradas.push(entrada);
    localStorage.setItem("entradas", JSON.stringify(entradas));

    alert("Entrada adicionada com sucesso!");
    this.reset(); // limpa o formulário
    document.getElementById("valorAvaliacao").textContent = 5; 
    location.reload();
});


function renderCards() {
    const container = document.getElementById("cards-container");
    container.innerHTML = ""; 

    let entradas = JSON.parse(localStorage.getItem("entradas")) || [];

    entradas.forEach(e => {
        // Cria card
        const card = document.createElement("div");
        card.classList.add("card");

        // --- card-media ---
        const cardMedia = document.createElement("div");
        cardMedia.classList.add("card-media");

        // Se for YouTube
        if (e.trailer.includes("youtube.com") || e.trailer.includes("youtu.be")) {
            // Extrair o ID do vídeo
            let videoId = "";
            if (e.trailer.includes("watch?v=")) {
                videoId = e.trailer.split("watch?v=")[1].split("&")[0];
            } else if (e.trailer.includes("youtu.be/")) {
                videoId = e.trailer.split("youtu.be/")[1].split("?")[0];
            }
            const iframe = document.createElement("iframe");
            iframe.width = "100%";
            iframe.height = "150";
            iframe.src = `https://www.youtube.com/embed/${videoId}`;
            iframe.frameBorder = "0";
            iframe.allowFullscreen = true;
            cardMedia.appendChild(iframe);
        }
        // Se for imagem
        else if (e.trailer.match(/\.(jpeg|jpg|png|gif|webp)$/i)) {
            const img = document.createElement("img");
            img.src = e.trailer;
            img.alt = e.titulo;
            cardMedia.appendChild(img);
        }

        // --- card-content ---
        const cardContent = document.createElement("div");
        cardContent.classList.add("card-content");
        cardContent.innerHTML = `
            <h4>${e.titulo}</h4>
            <p><strong>Tipo:</strong> ${e.tipoMidia}</p>
            <p><strong>Data:</strong> ${e.data}</p>
            <p><strong>Avaliação:</strong> ${e.avaliacao}/10</p>
            <p><strong>Opinião:</strong></p>
            <p>${e.texto}</p>
        `;

        // Monta card
        card.appendChild(cardMedia);
        card.appendChild(cardContent);
        container.appendChild(card);
    });
}

// Chama ao carregar a página
renderCards();

// Botão para limpar
document.getElementById("limpar").addEventListener("click", () => {
    localStorage.removeItem("entradas");
    alert("Entradas removidas com sucesso!");
    renderCards();
});




