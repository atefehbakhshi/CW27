const container = document.querySelector("#container");
const editModal=document.querySelector('#editModal');
const countData = 58;
const DEFAULT_PAGE_SIZE = 10;
const page_url = "https://6393170011ed187986aa5660.mockapi.io";

async function fetchCoffeInformations() {
  try {
    const response = await fetch(`${page_url}/coffee`);
    const data = response.json();
    console.log(data);
    return data;
  } catch (e) {
    console.log(e);
  }
}


async function addToDom(item) {
  const html = ` <div">
    <img src="${item.picture}" alt="caffe">
    <p>${item.name}</p>
    <button data-bs-toggle="modal" data-bs-target="#editModal" class="btn btn-primary btn-sm" id="${item.id}" onclick="editProduct(${item})">edit</button>
    </div>`;
  container.insertAdjacentHTML("beforeend", html);
}

readProducts();

// /////////////////////////////////////////////////
// Read
async function readProducts(page = 1, queryParam) {
  container.innerHTML = "";
  const param = queryParam ? `&name=${queryParam}` : "";
  try {
    const res = await fetch(
      `${page_url}/coffee?page=${page}&limit=${DEFAULT_PAGE_SIZE}${param}`
    );
    const data = await res.json();
    data.forEach(addToDom);
    createPagination(countData, page);
  } catch (e) {
    console.log(e);
  }
}

// //////////////////////////////////////////////////////
function createPagination(productCount, currentPage) {
  const pageCount = Math.ceil(productCount / DEFAULT_PAGE_SIZE);
  let lis = "";
  for (let i = 1; i <= pageCount; i++) {
    lis += `<li class="page-item ${
      i === currentPage ? "active" : ""
    }"><a href="#" class="page-link">${i}</a></li>`;
  }
  document.querySelector("ul.pagination").innerHTML = lis;
}

document.querySelector("ul.pagination").addEventListener("click", (e) => {
  const lis = document.querySelectorAll(".page-item");
  lis.forEach((li) => li.classList.remove("active"));
  e.target.parentElement.classList.add("active");
  const currentPage = Number(e.target.innerText);
  readProducts(currentPage);
});

// Create
const createButton = document.querySelector("#create-btn");
const coffeeName = document.querySelector("#name");
const file = document.querySelector("#file");

createButton.addEventListener("click", (e) => {
  e.preventDefault();

  const newProduct = {
    createdAt: new Date(),
    name: coffeeName.value,
    picture: "https://loremflickr.com/640/480/food",
    type: "fish",
    country: "Cyprus",
    material: [],
  };

  createCoffee(newProduct);
});

async function createCoffee(newProduct) {
  try {
    await fetch(`${page_url}/coffee`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(newProduct),
    });
  } catch (error) {
    console.log(error);
  }
}

// Edit


function editProduct(product) {
  editModal.querySelector("#name").value = product.name;
  editModal.querySelector("#confirm-edit-btn").dataset.id = product.id;
}

document.querySelector("#confirm-edit-btn").addEventListener("click", (e) => {
  const id = e.target.dataset.id;
  updateProduct(id);
});


function gatherEditFormData() {
  const name = editModal.querySelector("#name");
  return {
    name: name.value,
  };
}


async function updateProduct(id) {
  const updatedProduct = gatherEditFormData();
  try {
    const res = await fetch(`${page_url}/coffee/${id}`, {
      method: "PUT",
      body: JSON.stringify(updatedProduct),
      headers: { "Content-Type": "application/json" },
    });
    readProducts();
  } catch (error) {
    console.log(error.message);
  }
}
