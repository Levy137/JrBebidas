const menuIcon = document.getElementById("menu-icon");
const menu = document.getElementById("menu");

menuIcon.addEventListener("click", () => {
  menu.classList.toggle("active");
});

// Sistema de Carrinho
let carrinho = [];

function adicionarAoCarrinho(nome, preco, emoji) {
  const itemExistente = carrinho.find((item) => item.nome === nome);

  if (itemExistente) {
    itemExistente.quantidade += 1;
  } else {
    carrinho.push({
      nome: nome,
      preco: preco,
      emoji: emoji,
      quantidade: 1,
    });
  }

  atualizarContadorCarrinho();
  mostrarNotificacao(`${nome} adicionado ao carrinho!`);
}

function atualizarContadorCarrinho() {
  const contador = carrinho.reduce((total, item) => total + item.quantidade, 0);
  document.getElementById("carrinho-contador").textContent = contador;
}

function abrirCarrinho() {
  document.getElementById("carrinho-modal").style.display = "block";
  atualizarCarrinhoModal();
}

function fecharCarrinho() {
  document.getElementById("carrinho-modal").style.display = "none";
}

function atualizarCarrinhoModal() {
  const itensContainer = document.getElementById("carrinho-itens");
  const footer = document.getElementById("carrinho-footer");

  if (carrinho.length === 0) {
    itensContainer.innerHTML = `
          <div class="carrinho-vazio">
            <p>Seu carrinho está vazio</p>
            <p>Adicione alguns produtos para continuar!</p>
          </div>
        `;
    footer.style.display = "none";
    return;
  }

  footer.style.display = "block";

  itensContainer.innerHTML = carrinho
    .map(
      (item, index) => `
        <div class="carrinho-item">
          <div style="font-size: 2rem;">${item.emoji}</div>
          <div class="item-info">
            <div class="item-nome">${item.nome}</div>
            <div class="item-preco">R$ ${item.preco
              .toFixed(2)
              .replace(".", ",")}</div>
            <div class="item-quantidade">
              <button class="qty-btn" onclick="alterarQuantidade(${index}, -1)">-</button>
              <span class="qty-display">${item.quantidade}</span>
              <button class="qty-btn" onclick="alterarQuantidade(${index}, 1)">+</button>
            </div>
          </div>
          <button class="item-remover" onclick="removerItem(${index})">Remover</button>
        </div>
      `
    )
    .join("");

  const total = carrinho.reduce(
    (sum, item) => sum + item.preco * item.quantidade,
    0
  );
  document.getElementById("total-valor").textContent = `R$ ${total
    .toFixed(2)
    .replace(".", ",")}`;
}

function alterarQuantidade(index, mudanca) {
  carrinho[index].quantidade += mudanca;

  if (carrinho[index].quantidade <= 0) {
    carrinho.splice(index, 1);
  }

  atualizarContadorCarrinho();
  atualizarCarrinhoModal();
}

function removerItem(index) {
  carrinho.splice(index, 1);
  atualizarContadorCarrinho();
  atualizarCarrinhoModal();
}

function limparCarrinho() {
  if (confirm("Tem certeza que deseja limpar o carrinho?")) {
    carrinho = [];
    atualizarContadorCarrinho();
    atualizarCarrinhoModal();
  }
}

function finalizarCompra() {
  if (carrinho.length === 0) {
    alert("Seu carrinho está vazio!");
    return;
  }

  const total = carrinho.reduce(
    (sum, item) => sum + item.preco * item.quantidade,
    0
  );
  const itens = carrinho
    .map((item) => `${item.quantidade}x ${item.nome}`)
    .join("\n");

  alert(
    `Compra finalizada!\n\nItens:\n${itens}\n\nTotal: R$ ${total
      .toFixed(2)
      .replace(".", ",")}\n\nObrigado pela preferência!`
  );

  carrinho = [];
  atualizarContadorCarrinho();
  fecharCarrinho();
}

function mostrarNotificacao(mensagem) {
  const notificacao = document.createElement("div");
  notificacao.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #4caf50, #388e3c);
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 15px rgba(76, 175, 80, 0.3);
        z-index: 3000;
        font-weight: 600;
        transform: translateX(400px);
        transition: transform 0.3s ease;
      `;
  notificacao.textContent = mensagem;

  document.body.appendChild(notificacao);

  setTimeout(() => {
    notificacao.style.transform = "translateX(0)";
  }, 100);

  setTimeout(() => {
    notificacao.style.transform = "translateX(400px)";
    setTimeout(() => {
      document.body.removeChild(notificacao);
    }, 300);
  }, 3000);
}

document
  .getElementById("carrinho-modal")
  .addEventListener("click", function (e) {
    if (e.target === this) {
      fecharCarrinho();
    }
  });

function mostrarCategoria(categoria) {
  const secoes = document.querySelectorAll(".categoria-section");
  secoes.forEach((secao) => secao.classList.remove("active"));

  const botoes = document.querySelectorAll(".categoria-btn");
  botoes.forEach((botao) => botao.classList.remove("active"));

  document.getElementById(categoria).classList.add("active");

  event.target.classList.add("active");
}

document.addEventListener("DOMContentLoaded", function () {
  const vodkaSection = document.getElementById("vodka");
  const video = document.getElementById("vid-vod");

  if (vodkaSection && video) {
    video.muted = true;
    video.loop = true;
    video.autoplay = true;

    if ("ontouchstart" in window) {
      let isActive = false;

      vodkaSection.addEventListener("touchstart", function (e) {
        e.preventDefault();
        isActive = !isActive;

        if (isActive) {
          vodkaSection.classList.add("active");
        } else {
          vodkaSection.classList.remove("active");
        }
      });

      document.addEventListener("touchstart", function (e) {
        if (!vodkaSection.contains(e.target)) {
          vodkaSection.classList.remove("active");
          isActive = false;
        }
      });
    }

    vodkaSection.addEventListener("mouseenter", function () {
      video.play().catch((e) => console.log("Erro ao reproduzir vídeo:", e));
    });

    vodkaSection.addEventListener("mouseleave", function () {});

    video.addEventListener("loadeddata", function () {
      video.play().catch((e) => console.log("Autoplay bloqueado:", e));
    });
  }
});

function toggleVideoEffect() {
  const vodkaSection = document.getElementById("vodka");
  if (vodkaSection) {
    vodkaSection.classList.toggle("active");
  }
}
