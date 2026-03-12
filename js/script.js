// ===============================
// ROYAL SHOES MAIN SCRIPT
// Handles:
// - SPA navigation
// - Firebase product loading
// - Store rendering
// - Filtering
// - Admin delete mode
// ===============================


// ---------------- ADMIN MODE CHECK ----------------
// If URL contains ?admin=true → enable admin mode
let isAdmin = window.location.search.includes("admin=true");


// ---------------- GLOBAL VARIABLES ----------------

// Store all products from Firebase
let allProducts = [];


// ---------------- SPA NAVIGATION ----------------
// Shows one section at a time (Home / About / Gallery / Contact)

function showSection(sectionId, el){

  // Get all page sections
  let pages = document.querySelectorAll(".page");

  // Hide every section
  pages.forEach(page=>{
    page.style.display = "none";
    page.classList.remove("fade");
  });

  // Show selected section
  document.getElementById(sectionId).style.display = "block";
  document.getElementById(sectionId).classList.add("fade");

  // Remove active class from all menu links
  let links = document.querySelectorAll(".navlink");
  links.forEach(l => l.classList.remove("active"));

  // Highlight clicked menu
  if(el) el.classList.add("active");

  // If gallery opened → load products
  if(sectionId === "gallery"){
    loadProducts();
  }
}


// ---------------- LOAD PRODUCTS FROM FIREBASE ----------------
// Reads products collection and stores them locally

async function loadProducts(){

  // Show loading text
  document.getElementById("productList").innerHTML="Loading...";

  // Reference to Firestore products collection
  const colRef = window.collection(window.db,"products");

  // Get documents
  const snapshot = await window.getDocs(colRef);

  // Reset product list
  allProducts=[];

  // Store products in array
  snapshot.forEach(doc=>{
    allProducts.push({
      ...doc.data(),
      id:doc.id
    });
  });

  // Render products on page
  renderProducts(allProducts);
}



// ---------------- RENDER PRODUCTS ----------------
// Displays product cards in the gallery/store

function renderProducts(list){

let html="";

list.forEach(p=>{

// Hide products that are out of stock
if(p.status === "Out of Stock") return;


// Create WhatsApp message
let message = `Hello, I want to buy ${p.name} for ₹${p.price}`;
let encodedMessage = encodeURIComponent(message);

// WhatsApp order link
let whatsappLink = `https://wa.me/917249222292?text=${encodedMessage}`;


// Product card
html+=`
<div class="productCard">

<img src="${p.imageURL}">

<h3>${p.name}</h3>

<p>₹${p.price}</p>

<p>${p.category || ""} ${p.type ? "/ "+p.type : ""}</p>

<p>${p.status || "In Stock"}</p>

<a href="${whatsappLink}" target="_blank" class="orderBtn">
Order on WhatsApp
</a>

${isAdmin ? `<button onclick="deleteProduct('${p.id}')">Delete</button>` : ""}

</div>
`;
});


// If no products found
if(html===""){
html="<p style='text-align:center'>No products available</p>";
}


// Display on page
document.getElementById("productList").innerHTML=html;

}



// ---------------- FILTER PRODUCTS BY CATEGORY ----------------

function filterCategory(cat){

// Show all
if(cat==="all"){
renderProducts(allProducts);
return;
}

// Filter by category
let filtered = allProducts.filter(p=>p.category===cat);

// Render filtered list
renderProducts(filtered);

}



// ---------------- DELETE PRODUCT (ADMIN ONLY) ----------------
// Removes product document from Firestore

async function deleteProduct(id){

await window.deleteDoc(window.doc(window.db,"products",id));

alert("Product Deleted");

// Reload products
loadProducts();

}



// ---------------- HASH ROUTING ----------------
// Loads section based on URL (#home, #gallery etc)

function loadFromHash(){

let hash = window.location.hash.replace("#","") || "home";

let link = document.querySelector(`a[href="#${hash}"]`);

if(link){
showSection(hash,link);
}

}


// Listen for browser back/forward buttons
window.addEventListener("hashchange",loadFromHash);


// Load default section on page load
window.onload = loadFromHash;



// ---------------- OPTIONAL CATEGORY DROPDOWN ----------------
// Used if a category dropdown exists somewhere on page

async function loadCategories(){

const snapshot = await window.getDocs(window.collection(window.db,"categories"));

const select = document.getElementById("categorySelect");

if(!select) return;

select.innerHTML = '<option value="">Select Category</option>';

snapshot.forEach(docSnap=>{
let data = docSnap.data();
select.innerHTML += `<option value="${docSnap.id}">${data.name}</option>`;
});

}

loadCategories();

// ---------------- OPEN STORE FROM HERO BUTTON ----------------
// Opens the gallery/store section and scrolls to it smoothly

function openStore(){

// open gallery section
showSection("gallery", document.querySelector('a[href="#gallery"]'));

// smooth scroll
document.getElementById("gallery").scrollIntoView({
behavior:"smooth"
});

}

// ---------------- OPEN STORE WITH CATEGORY FILTER ----------------
// Opens the gallery/store and filters products immediately

function openCategory(category){

// open store section
showSection("gallery", document.querySelector('a[href="#gallery"]'));

// apply filter
filterCategory(category);

// smooth scroll to store
document.getElementById("gallery").scrollIntoView({
behavior:"smooth"
});

}

// ---------------- BACK TO TOP BUTTON ----------------

// show button when user scrolls down
window.addEventListener("scroll",function(){

let btn = document.getElementById("backToTop");

if(window.scrollY > 300){
btn.style.display="block";
}else{
btn.style.display="none";
}

});


// scroll page to top smoothly
function scrollToTop(){

window.scrollTo({
top:0,
behavior:"smooth"
});

}