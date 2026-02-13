let images = ["images/shoe1.jpg","images/shoe2.jpg","images/shoe3.jpg"];
let i = 0;

setInterval(()=>{
i++;
if(i>=images.length){i=0;}
document.getElementById("slide").src = images[i];
},3000);

function showSection(sectionId, el){
  let pages = document.querySelectorAll(".page");
  pages.forEach(page => {
    page.style.display = "none";
    page.classList.remove("fade");
  });

  document.getElementById(sectionId).style.display = "block";
  document.getElementById(sectionId).classList.add("fade");

//active menu
let links = document.querySelectorAll(".navlink");
links.forEach(l=>classList.remove("active"));
el.classList.add("active");
}

window.onload=function(){
document.getElementById("home").style.display="block";
};
function loadFromHash(){
let hash=window.location.hash.replace("#","") || "home";
let link=document.querySelector(`a[href="#${hash}"]`);
if(link){
showSection(hash,link);
}
}

window.addEventListener("hashchange",loadFromHash);
window.onload=loadFromHash;
