//Conexão DB
import {
  initializeApp
} from "https://www.gstatic.com/firebasejs/9.9.3/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/9.9.3/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAp3ovOT_VBz2iQyaM-662yXo0rH2dF9L8",
  authDomain: "modainfantil-d1be7.firebaseapp.com",
  projectId: "modainfantil-d1be7",
  storageBucket: "modainfantil-d1be7.appspot.com",
  messagingSenderId: "521297135442",
  appId: "1:521297135442:web:8cdbd99d580399001b9c8b"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app)

async function fetchData(db) {
  const docsCol = collection(db, 'estoque')
  const docSnap = await getDocs(docsCol)
  const docList = docSnap.docs.map(doc => doc.data())
  return docList
}

let banco = await fetchData(db)
//FIM Conexão DB

let produtos = document.querySelector('.products')
let carrinho = []
carrinho = JSON.parse(localStorage.getItem("carrinho") || "[]")

//Executa uma funcao de acordo com a pagina aberta no navegador
let url = window.location.pathname

if (url.includes("index.html")) {
  index()
} else if (url.includes("checkout.html")) {
  checkout()
} else if (url.includes("produto.html")) {
  produto()
}

//Funcao para executar na pagina index.html
function index() {

  //SLIDER
  slider()

  function slider() {
    let count = 1

    document.getElementById("radio1").checked = true

    setInterval(function () {
      nextImage()
    }, 4000)

    function nextImage() {
      count++
      if (count > 3) {
        count = 1
      }
      document.getElementById("radio" + count).checked = true
    }
  }
  //FIM SLIDER

  ListarProdutos()
  //Listar Produtos
  function ListarProdutos() {

    for (let i = 0; i < banco.length; i++) {
      produtos.innerHTML += `
    <a key="${banco[i].id}" class="produtos">
    <div class="p1">
    <img src="${banco[i].img}" alt="">
    <p>${banco[i].nome}</p>
    <h4>R$ ${banco[i].valor}</h4>
    <button>COMPRAR</button>
    </div> 
    </a>`
    }
  }
  //FIM Listar Produtos

  //Salva a String da Memoria do Navegador (localStorage)
  //Os Dados Sao Salvos na Função updateVitrine
  let campoPesquisa = localStorage.getItem("campoPesquisa")
  //Se for Diferente de Null Faz a Busca e Limpa o localStorage
  console.log(campoPesquisa)
  if (campoPesquisa != null) {
    updateVitrine(campoPesquisa)
    localStorage.removeItem("campoPesquisa")
  }
}
//FIM Funcao para executar na pagina index.html

//Checkout
function checkout() {

  atualizarCheckout()
  loop()

  //Chama essa funcao sempre que excluir um item do pedido
  function loop() {
    let btnRemover = document.querySelectorAll(".btn-remover")
    btnRemover.forEach(element => {
      element.addEventListener("click", () => {
        removerDoCarrinho(element.attributes.key.value)
      })
    });
  }

  //Remove o item selecionado 
  function removerDoCarrinho(id) {
    id = Number(id)
    for (let i = 0; i < carrinho.length; i++) {
      if (carrinho[i].produtoID === id) {
        const index = carrinho.findIndex(element => element.produtoID == id)
        carrinho.splice(index, 1)
      }
    }
    atualizarCheckout()
    loop()
  }

  //Atualizar Checkout
  function atualizarCheckout() {
    localStorage.setItem("carrinho", JSON.stringify(carrinho))
    let total = ""
    let totalPedido = 0;
    let valorFinal = document.querySelector(".valorFinal")
    let checkout = document.querySelector(".checkout")
    checkout.innerHTML = ""
    for (let i = 0; i < carrinho.length; i++) {
      for (let j = 0; j < banco.length; j++) {
        if (carrinho[i].produtoID == banco[j].id) {
          checkout.innerHTML += `
                <div class="pedido">
            <div class="img">
                <img src="${banco[j].img}" alt="">
            </div>
            <div class="detalhes">
                <p>${banco[j].nome} - <b>${carrinho[i].produtoTamanho}</b> </p>
            </div>
            <div class="preco">
                <p>R$ ${banco[j].valor}</p>
            </div>
            <div class="quantidade">
                <input type="number" max="10" min="1" value="1" disabled>
            </div>
            <div class="total">
                <p>R$ ${banco[j].valor}</p>
            </div>
            <div class="remover-item">
            <i class="bi bi-x-lg btn-remover" key="${banco[j].id}"></i>     
            </div>
            `
          total = Number(banco[j].valor.replace(",", "."))
        }

      }
      totalPedido += total
    }

    valorFinal.innerHTML = `TOTAL: R$ ${totalPedido.toFixed(2).replace(".",",")}`
  }
  //FIM Atualizar Checkout
}
//FIM Checkout

//Passar ID na URL
const produtoID = document.querySelectorAll("a")
produtoID.forEach(element => {

  element.addEventListener('click', () => {
    if (element.classList[0] == "produtos") {
      window.location = "./produto.html?id=" + element.getAttribute("key");
    }
  })
})

//Produto
function produto() {

  //Obtém o ID do produto pela URL
  let produtoId = window.location
  let id = produtoId.href.split("=")[1]

  var produtoSelecionadoID
  let produto = document.querySelector(".produto")



  //Carrega os Dados do Produto Selecionado
  for (let i = 0; i < banco.length; i++) {
    if (banco[i].id == id) {
      produtoSelecionadoID = banco[i].id
      produto.innerHTML = `
          <div class="info">
            <div class="img-produto">
              <img src="${banco[i].img}" alt="">
          </div>
          <div class="info-produto">
            <h2>${banco[i].nome}</h2>                       
            <div class="descricao-preco">
              <h4><span class="blue">R$ ${banco[i].valor}</span></h4>
              <p><span class="blue n-parcela"> 4X </span>DE<span class="blue n-parcela"> R$ ${(Number(banco[i].valor.replace(',','.'))/4).toFixed(2)} </span> SEM JUROS</p>
            </div>
            <h4>Selecionar Tamanhos</h4>
            <div class="tamanhos">
              <div class="tam rn">RN</div>
              <div class="tam p">P</div>
              <div class="tam m">M</div>
              <div class="tam g">G</div>
            </div>
            <div class="btn-compra">
              <button id="btn-confirma-compra"><span>COMPRAR</span></button>
            </div>
            <div class="frete">
              <p>CALCULE O FRETE E O PRAZO:</p>
              <form name="formulario" action="" method="get">
                <input name="cep" id="cep" type="text" placeholder="_____-___">
                <i class="bi bi-search" onclick="alert('Em Breve!')"></i>
              </form>
              </div>
              </div>
            </div>`
    }
  }

  //Seleciona o Tamanho 
  let tamanho = document.querySelectorAll(".tam")
  tamanho.forEach(element => {
    element.addEventListener('click', () => {
      for (let i = 0; i < tamanho.length; i++) {
        tamanho[i].classList.remove("activeTam")
      }
      element.classList.toggle("activeTam")
    })
  });

  //Botão Comprar
  let btn = document.querySelector("#btn-confirma-compra")
  let tamanhos = document.querySelectorAll(".tam")
  let tamanhoSelecionado = ""

  btn.addEventListener("click", () => {
    tamanhos.forEach(element => {
      if (element.classList.contains("activeTam")) {
        tamanhoSelecionado = element.innerHTML
      }
    });
    if (tamanhoSelecionado == "") {
      alert("Por favor, selecione o tamanho desejado.")
    } else {
      // Adiciona no Carrinho (Salva na memoria do navegador)
      carrinho.push(atualizarBanco(produtoSelecionadoID, tamanhoSelecionado))
      localStorage.setItem("carrinho", JSON.stringify(carrinho))
      btn.innerHTML = "Adicionado"
      //Abre a pagina de checkout
      window.open("./checkout.html", "_self")
    }
  })
  //FIM Botão Comprar

  //Funcao Atualiza o Carrinho de Compras 
  function atualizarBanco(produtoSelecionadoID, tamanhoSelecionado) {
    for (let i = 0; i < banco.length; i++) {
      if (banco[i].id == produtoSelecionadoID) {
        return {
          produtoID: banco[i].id,
          produtoTamanho: tamanhoSelecionado,
          produtoNome: banco[i].nome,
          produtoValor: banco[i].valor
        }
      }
    }
  }
  //FIM Função Atualiza o Carrinho de Compras 

  //Formata o Campo do CEP
  $(document).ready(function () {
    $("#cep").mask("99999-999");
  });
}
//FIM Produto

//Exibe o carrinho de compras
let exibirCarrinho = document.querySelector("#cart")
let pedido = document.querySelector(".pedido")
exibirCarrinho.addEventListener("click", () => {
  exibirCarrinho.classList.toggle("activeCarrinho")
  atualizarCarrinho()
})

//Atualizar Carrinho
function atualizarCarrinho() {
  localStorage.setItem("carrinho", JSON.stringify(carrinho))
  let total = 0
  let totalPedido = 0
  pedido.innerHTML = ""
  for (let i = 0; i < carrinho.length; i++) {
    for (let j = 0; j < banco.length; j++) {
      if (carrinho[i].produtoID == banco[j].id) {
        pedido.innerHTML += `
          <div class="info-pedido">
          <div class="div-img">
              <img src="${banco[j].img}" alt="">
          </div>
          <!-- div-detalhes -->
          <div class="div-detalhes">
              <a href="./produto.html?id=${banco[j].id}">
                  <p class="info-produto">${banco[j].nome} - <b>${carrinho[i].produtoTamanho}</b></p>
              </a>
              <!-- preco-btn-delete -->
              <div class="preco-btn-delete">
                  <div class="valor-quantidade">
                      <p><span class="blue">R$ ${banco[j].valor}</span></p>
                      <input type="number" value="1" min="1" max="10" disabled>
                  </div>
                  <div class="delete">
                      <i class="bi bi-x btn-remover" key="${carrinho[i].produtoID}"></i>
                  </div>
              </div>
              <!-- FIM preco-btn-delete -->
          </div>
          <!-- FIM div-detalhes -->
      </div>
      `
        total = Number(banco[j].valor.replace(",", "."))
      }
    }
    totalPedido += total
  }

  let subtotal = document.querySelector("#subtotal")
  subtotal.innerHTML = totalPedido.toFixed(2).replace(".", ",")
  loopCarrinho()
}
//FIM Atualizar Carrinho

function loopCarrinho() {
  let btnRemover = document.querySelectorAll(".btn-remover")
  btnRemover.forEach(element => {
    element.addEventListener("click", () => {

      removerDoCarrinho(element.attributes.key.value)
    })
  });
}

//Remove o item selecionado 
function removerDoCarrinho(id) {
  id = Number(id)
  for (let i = 0; i < carrinho.length; i++) {
    if (carrinho[i].produtoID === id) {
      const index = carrinho.findIndex(element => element.produtoID == id)
      carrinho.splice(index, 1)
    }
  }
  atualizarCarrinho()
  loopCarrinho()
}

//Campo de Pesquisa
let btcPesquisa = document.querySelector("#btcPesquisar")

btcPesquisa.addEventListener('click', () => {
  let campoPesquisa = document.querySelector("#campoPesquisa").value
  if (campoPesquisa != "") {
    updateVitrine(campoPesquisa)
  }

})
//FIM Campo de Pesquisa

//Update Vitrine
function updateVitrine(campoPesquisa) {

  if (window.location.pathname.includes("produto.html")) {
    localStorage.setItem('campoPesquisa', campoPesquisa);
    window.open("./index.html", "_self")
  }
 
  document.querySelector("#title").innerHTML = ""
  produtos.innerHTML = ""
  for (let i = 0; i < banco.length; i++) {
    if ((banco[i].nome.toLowerCase()).includes(campoPesquisa)) {
      produtos.innerHTML += `
       <a key="${banco[i].id}" class="produtos">
       <div class="p1">
       <img src="${banco[i].img}" alt="">
       <p>${banco[i].nome}</p>
       <h4>R$ ${banco[i].valor}</h4>
       <button>COMPRAR</button>
       </div> `
    }
  }

  if (produtos.innerHTML == "") {
    produtos.innerHTML = `<h4>INFELIZMENTE NÃO FORAM ENCONTRADOS RESULTADOS
     PARA SUA BUSCA ${campoPesquisa}</h4>`
  }
  
  loop()
}
//FIM Update Vitrine

function loop() {
 
  const produtos = document.querySelectorAll(".produtos")
  console.log(produtos)
  produtos.forEach(element => {
    console.log("as")
    console.log(element)
    element.addEventListener('click', () => {
      window.location = "./produto.html?id=" + element.getAttribute("key");
    })
  })
}

let filter = document.querySelectorAll("a")

filter.forEach(element => {
  element.addEventListener("click", () => {
    if (element.classList[0] == "filter") {
      if (element.classList[1] != "") {
        updateVitrine(element.classList[1])
      }
    }
  })
});