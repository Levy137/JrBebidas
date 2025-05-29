let menuAberto = false;

document.addEventListener("DOMContentLoaded", function () {
  inicializarMenu();
  inicializarCarrinho();
  inicializarProdutos();
  inicializarModal();
  resetarMenuNoCarregamento();
});

function resetarMenuNoCarregamento() {
  const menuUl = document.querySelector("#menu ul");
  const menuIcon = document.getElementById("menu-icon");

  if (menuUl && menuIcon) {
    menuUl.classList.remove("active", "menu-mobile-active");
    menuIcon.classList.remove("ativo");
    menuAberto = false;

    menuUl.style.display = "";
    menuUl.style.opacity = "";
    menuUl.style.transform = "";
    menuUl.style.transition = "";
  }
}

function inicializarMenu() {
  const menuIcon = document.getElementById("menu-icon");
  const menuUl = document.querySelector("#menu ul");
  const menuLinks = document.querySelectorAll("#menu ul li a");

  if (menuIcon && menuUl) {
    menuIcon.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      toggleMenu();
    });

    menuLinks.forEach((link) => {
      link.addEventListener("click", function () {
        fecharMenu();
      });
    });

    document.addEventListener("click", function (e) {
      if (
        menuAberto &&
        !menuIcon.contains(e.target) &&
        !menuUl.contains(e.target)
      ) {
        fecharMenu();
      }
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 767) {
        fecharMenu();

        setTimeout(() => {
          const menuUl = document.querySelector("#menu ul");
          if (menuUl && window.innerWidth > 767) {
            menuUl.style.display = "";
            menuUl.style.opacity = "";
            menuUl.style.transform = "";
            menuUl.style.transition = "";
          }
        }, 100);
      }
    });
  }
}

function toggleMenu() {
  const menuUl = document.querySelector("#menu ul");
  if (menuUl && window.innerWidth <= 767) {
    if (menuAberto) {
      fecharMenu();
    } else {
      abrirMenu();
    }
  }
}

function abrirMenu() {
  const menuUl = document.querySelector("#menu ul");
  const menuIcon = document.getElementById("menu-icon");

  if (menuUl && menuIcon && window.innerWidth <= 767) {
    menuUl.classList.add("active");
    menuUl.classList.add("menu-mobile-active");
    menuIcon.classList.add("ativo");
    menuAberto = true;

    menuUl.style.opacity = "0";
    menuUl.style.transform = "translateY(-10px)";

    setTimeout(() => {
      menuUl.style.transition = "opacity 0.3s ease, transform 0.3s ease";
      menuUl.style.opacity = "1";
      menuUl.style.transform = "translateY(0)";
    }, 10);
  }
}

function fecharMenu() {
  const menuUl = document.querySelector("#menu ul");
  const menuIcon = document.getElementById("menu-icon");

  if (menuUl && menuIcon) {
    if (window.innerWidth <= 767) {
      menuUl.style.transition = "opacity 0.3s ease, transform 0.3s ease";
      menuUl.style.opacity = "0";
      menuUl.style.transform = "translateY(-10px)";

      setTimeout(() => {
        menuUl.classList.remove("active");
        menuUl.classList.remove("menu-mobile-active");
        menuIcon.classList.remove("ativo");
        menuAberto = false;

        if (window.innerWidth <= 767) {
          menuUl.style.transition = "";
        }
      }, 300);
    } else {
      menuUl.classList.remove("active");
      menuUl.classList.remove("menu-mobile-active");
      menuIcon.classList.remove("ativo");
      menuAberto = false;

      menuUl.style.display = "";
      menuUl.style.opacity = "";
      menuUl.style.transform = "";
      menuUl.style.transition = "";
    }
  }
}

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
  document.getElementById("modal-confirmar-limpar").style.display = "flex";
}

function confirmarLimparCarrinho() {
  carrinho = [];
  atualizarContadorCarrinho();
  atualizarCarrinhoModal();
  fecharModalLimparCarrinho();
}

function fecharModalLimparCarrinho() {
  document.getElementById("modal-confirmar-limpar").style.display = "none";
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

  const detalhes = carrinho
    .map(
      (item) =>
        `<div>${item.quantidade}x ${item.nome} - R$ ${(
          item.preco * item.quantidade
        )
          .toFixed(2)
          .replace(".", ",")}</div>`
    )
    .join("");

  document.getElementById("detalhes-compra").innerHTML = `
    <p><strong>Itens comprados:</strong></p>
    ${detalhes}
    <p style="margin-top: 15px;"><strong>Total:</strong> R$ ${total
      .toFixed(2)
      .replace(".", ",")}</p>
  `;

  document.getElementById("modal-finalizacao").style.display = "flex";

  carrinho = [];
  atualizarContadorCarrinho();
  fecharCarrinho();
}

function fecharModalFinalizacao() {
  document.getElementById("modal-finalizacao").style.display = "none";
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
