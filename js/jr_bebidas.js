let menuAberto = !1;
function resetarMenuNoCarregamento() {
  const e = document.querySelector("#menu ul"),
    t = document.getElementById("menu-icon");
  e &&
    t &&
    (e.classList.remove("active", "menu-mobile-active"),
    t.classList.remove("ativo"),
    (menuAberto = !1),
    (e.style.display = ""),
    (e.style.opacity = ""),
    (e.style.transform = ""),
    (e.style.transition = ""));
}
function inicializarMenu() {
  const e = document.getElementById("menu-icon"),
    t = document.querySelector("#menu ul"),
    n = document.querySelectorAll("#menu ul li a");
  e &&
    t &&
    (e.addEventListener("click", function (e) {
      e.preventDefault(), e.stopPropagation(), toggleMenu();
    }),
    n.forEach((e) => {
      e.addEventListener("click", function () {
        fecharMenu();
      });
    }),
    document.addEventListener("click", function (n) {
      !menuAberto ||
        e.contains(n.target) ||
        t.contains(n.target) ||
        fecharMenu();
    }),
    window.addEventListener("resize", function () {
      window.innerWidth > 767 &&
        (fecharMenu(),
        setTimeout(() => {
          const e = document.querySelector("#menu ul");
          e &&
            window.innerWidth > 767 &&
            ((e.style.display = ""),
            (e.style.opacity = ""),
            (e.style.transform = ""),
            (e.style.transition = ""));
        }, 100));
    }));
}
function toggleMenu() {
  document.querySelector("#menu ul") &&
    window.innerWidth <= 767 &&
    (menuAberto ? fecharMenu() : abrirMenu());
}
function abrirMenu() {
  const e = document.querySelector("#menu ul"),
    t = document.getElementById("menu-icon");
  e &&
    t &&
    window.innerWidth <= 767 &&
    (e.classList.add("active"),
    e.classList.add("menu-mobile-active"),
    t.classList.add("ativo"),
    (menuAberto = !0),
    (e.style.opacity = "0"),
    (e.style.transform = "translateY(-10px)"),
    setTimeout(() => {
      (e.style.transition = "opacity 0.3s ease, transform 0.3s ease"),
        (e.style.opacity = "1"),
        (e.style.transform = "translateY(0)");
    }, 10));
}
function fecharMenu() {
  const e = document.querySelector("#menu ul"),
    t = document.getElementById("menu-icon");
  e &&
    t &&
    (window.innerWidth <= 767
      ? ((e.style.transition = "opacity 0.3s ease, transform 0.3s ease"),
        (e.style.opacity = "0"),
        (e.style.transform = "translateY(-10px)"),
        setTimeout(() => {
          e.classList.remove("active"),
            e.classList.remove("menu-mobile-active"),
            t.classList.remove("ativo"),
            (menuAberto = !1),
            window.innerWidth <= 767 && (e.style.transition = "");
        }, 300))
      : (e.classList.remove("active"),
        e.classList.remove("menu-mobile-active"),
        t.classList.remove("ativo"),
        (menuAberto = !1),
        (e.style.display = ""),
        (e.style.opacity = ""),
        (e.style.transform = ""),
        (e.style.transition = "")));
}
document.addEventListener("DOMContentLoaded", function () {
  inicializarMenu(),
    inicializarCarrinho(),
    inicializarProdutos(),
    inicializarModal(),
    resetarMenuNoCarregamento();
});
let carrinho = [];
function adicionarAoCarrinho(e, t, n) {
  const a = carrinho.find((t) => t.nome === e);
  a
    ? (a.quantidade += 1)
    : carrinho.push({ nome: e, preco: t, emoji: n, quantidade: 1 }),
    atualizarContadorCarrinho(),
    mostrarNotificacao(`${e} adicionado ao carrinho!`);
}
function atualizarContadorCarrinho() {
  const e = carrinho.reduce((e, t) => e + t.quantidade, 0);
  document.getElementById("carrinho-contador").textContent = e;
}
function abrirCarrinho() {
  (document.getElementById("carrinho-modal").style.display = "block"),
    atualizarCarrinhoModal();
}
function fecharCarrinho() {
  document.getElementById("carrinho-modal").style.display = "none";
}
function atualizarCarrinhoModal() {
  const e = document.getElementById("carrinho-itens"),
    t = document.getElementById("carrinho-footer");
  if (0 === carrinho.length)
    return (
      (e.innerHTML =
        '\n          <div class="carrinho-vazio">\n            <p>Seu carrinho está vazio</p>\n            <p>Adicione alguns produtos para continuar!</p>\n          </div>\n        '),
      void (t.style.display = "none")
    );
  (t.style.display = "block"),
    (e.innerHTML = carrinho
      .map(
        (e, t) =>
          `\n        <div class="carrinho-item">\n          <div style="font-size: 2rem;">${
            e.emoji
          }</div>\n          <div class="item-info">\n            <div class="item-nome">${
            e.nome
          }</div>\n            <div class="item-preco">R$ ${e.preco
            .toFixed(2)
            .replace(
              ".",
              ","
            )}</div>\n            <div class="item-quantidade">\n              <button class="qty-btn" onclick="alterarQuantidade(${t}, -1)">-</button>\n              <span class="qty-display">${
            e.quantidade
          }</span>\n              <button class="qty-btn" onclick="alterarQuantidade(${t}, 1)">+</button>\n            </div>\n          </div>\n          <button class="item-remover" onclick="removerItem(${t})">Remover</button>\n        </div>\n      `
      )
      .join(""));
  const n = carrinho.reduce((e, t) => e + t.preco * t.quantidade, 0);
  document.getElementById("total-valor").textContent = `R$ ${n
    .toFixed(2)
    .replace(".", ",")}`;
}
function alterarQuantidade(e, t) {
  (carrinho[e].quantidade += t),
    carrinho[e].quantidade <= 0 && carrinho.splice(e, 1),
    atualizarContadorCarrinho(),
    atualizarCarrinhoModal();
}
function removerItem(e) {
  carrinho.splice(e, 1), atualizarContadorCarrinho(), atualizarCarrinhoModal();
}
function limparCarrinho() {
  document.getElementById("modal-confirmar-limpar").style.display = "flex";
}
function confirmarLimparCarrinho() {
  (carrinho = []),
    atualizarContadorCarrinho(),
    atualizarCarrinhoModal(),
    fecharModalLimparCarrinho();
}
function fecharModalLimparCarrinho() {
  document.getElementById("modal-confirmar-limpar").style.display = "none";
}
function finalizarCompra() {
  if (0 === carrinho.length) return void alert("Seu carrinho está vazio!");
  const e = carrinho.reduce((e, t) => e + t.preco * t.quantidade, 0),
    t = carrinho
      .map(
        (e) =>
          `<div>${e.quantidade}x ${e.nome} - R$ ${(e.preco * e.quantidade)
            .toFixed(2)
            .replace(".", ",")}</div>`
      )
      .join("");
  (document.getElementById(
    "detalhes-compra"
  ).innerHTML = `\n    <p><strong>Itens comprados:</strong></p>\n    ${t}\n    <p style="margin-top: 15px;"><strong>Total:</strong> R$ ${e
    .toFixed(2)
    .replace(".", ",")}</p>\n  `),
    (document.getElementById("modal-finalizacao").style.display = "flex"),
    (carrinho = []),
    atualizarContadorCarrinho(),
    fecharCarrinho();
}
function fecharModalFinalizacao() {
  document.getElementById("modal-finalizacao").style.display = "none";
}
function mostrarNotificacao(e) {
  const t = document.createElement("div");
  (t.style.cssText =
    "\n        position: fixed;\n        top: 20px;\n        right: 20px;\n        background: linear-gradient(135deg, #4caf50, #388e3c);\n        color: white;\n        padding: 15px 20px;\n        border-radius: 8px;\n        box-shadow: 0 4px 15px rgba(76, 175, 80, 0.3);\n        z-index: 3000;\n        font-weight: 600;\n        transform: translateX(400px);\n        transition: transform 0.3s ease;\n      "),
    (t.textContent = e),
    document.body.appendChild(t),
    setTimeout(() => {
      t.style.transform = "translateX(0)";
    }, 100),
    setTimeout(() => {
      (t.style.transform = "translateX(400px)"),
        setTimeout(() => {
          document.body.removeChild(t);
        }, 300);
    }, 3e3);
}
function mostrarCategoria(e) {
  document
    .querySelectorAll(".categoria-section")
    .forEach((e) => e.classList.remove("active"));
  document
    .querySelectorAll(".categoria-btn")
    .forEach((e) => e.classList.remove("active")),
    document.getElementById(e).classList.add("active"),
    event.target.classList.add("active");
}
function toggleVideoEffect() {
  const e = document.getElementById("vodka");
  e && e.classList.toggle("active");
}
document
  .getElementById("carrinho-modal")
  .addEventListener("click", function (e) {
    e.target === this && fecharCarrinho();
  }),
  document.addEventListener("DOMContentLoaded", function () {
    const e = document.getElementById("vodka"),
      t = document.getElementById("vid-vod");
    if (e && t) {
      if (
        ((t.muted = !0),
        (t.loop = !0),
        (t.autoplay = !0),
        "ontouchstart" in window)
      ) {
        let t = !1;
        e.addEventListener("touchstart", function (n) {
          n.preventDefault(),
            (t = !t),
            t ? e.classList.add("active") : e.classList.remove("active");
        }),
          document.addEventListener("touchstart", function (n) {
            e.contains(n.target) || (e.classList.remove("active"), (t = !1));
          });
      }
      e.addEventListener("mouseenter", function () {
        t.play().catch((e) => {});
      }),
        e.addEventListener("mouseleave", function () {}),
        t.addEventListener("loadeddata", function () {
          t.play().catch((e) => {});
        });
    }
  });
