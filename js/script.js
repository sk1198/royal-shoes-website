// ---------------- ADMIN MODE CHECK ----------------

// If URL contains ?admin=true → enable admin mode
let isAdmin = window.location.search.includes("admin=true");


// ---------- SPA Navigation ----------
// Shows one section at a time (Home / About / Gallery / Contact)

function showSection(sectionId, el){

  // Get all page sections
  let pages = document.querySelectorAll(".page");

  // Hide every section
  pages.forEach(page=>{
    page.style.display = "none";
    page.classList.remove("fade");   // remove animation class
  });

  // Show selected section
  document.getElementById(sectionId).style.display = "block";
  document.getElementById(sectionId).classList.add("fade"); // add animation

  // Remove active class from all menu links
  let links = document.querySelectorAll(".navlink");
  links.forEach(l => l.classList.remove("active"));

  // Highlight clicked menu
  if(el) el.classList.add("active");

  // If gallery opened → reload products from Firebase
  if(sectionId === "gallery"){
    loadProducts();
  }
}


// ---------- Load Products From Firebase ----------
// Reads products collection and displays cards

async function loadProducts(){

  // Show loading text
  document.getElementById("productList").innerHTML = "Loading...";

  // Reference to products collection
  const colRef = window.collection(window.db,"products");

  // Get all documents
  const snapshot = await window.getDocs(colRef);

  let html = "";

  // Loop through each product
  snapshot.forEach(doc=>{
    let p = doc.data();

    html += `
    <div class="card">
      <img src="${p.image}">
      <h4>${p.name}</h4>
      <p>₹${p.price}</p>
      ${isAdmin ? `<button onclick="deleteProduct('${doc.id}')">Delete</button>` : ""}
    </div>
    `;
  });

  // Display products on page
  document.getElementById("productList").innerHTML = html;
}

// Store all products globally
let allProducts = [];

// Modified loader to save products
async function loadProducts(){

document.getElementById("productList").innerHTML="Loading...";

const colRef = window.collection(window.db,"products");
const snapshot = await window.getDocs(colRef);

allProducts=[];

snapshot.forEach(doc=>{
allProducts.push({...doc.data(),id:doc.id});
});

renderProducts(allProducts);
}

// Render products on UI
// Render products on UI
function renderProducts(list){

let html="";

list.forEach(p=>{

// WhatsApp message (auto filled)
let message = `Hello, I am interested in ${p.name} - Price ₹${p.price}`;
let encodedMessage = encodeURIComponent(message);

// Replace with shop owner's WhatsApp number (with country code)
let whatsappLink = `https://wa.me/+917249222292?text=${encodedMessage}`;

html+=`
<div class="card">
<img src="${p.image}">
<h4>${p.name}</h4>
<p>₹${p.price}</p>

<a href="${whatsappLink}" target="_blank" class="orderBtn">
Order on WhatsApp
</a>

${isAdmin ? `<button onclick="deleteProduct('${p.id}')">Delete</button>` : ""}

</div>
`;
});

document.getElementById("productList").innerHTML=html;
}



// Filter products by category
function filterCategory(cat){

if(cat==="all"){
renderProducts(allProducts);
return;
}

let filtered=allProducts.filter(p=>p.category===cat);
renderProducts(filtered);
}



// ---------- Delete Product ----------
// Removes product document from Firestore

async function deleteProduct(id){

  // Delete document using ID
  await window.deleteDoc(window.doc(window.db,"products",id));

  alert("Product Deleted");

  // Reload gallery after delete
  loadProducts();
}


// ---------- Hash Routing ----------
// Loads section based on URL (#home, #gallery etc)

function loadFromHash(){
  let hash = window.location.hash.replace("#","") || "home";
  let link = document.querySelector(`a[href="#${hash}"]`);

  if(link){
    showSection(hash,link);
  }
}

// Listen for back/forward browser buttons
window.addEventListener("hashchange",loadFromHash);

// Load default section on page load
window.onload = loadFromHash;
