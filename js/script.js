let images = ["images/shoe1.jpg","images/shoe2.jpg","images/shoe3.jpg"];
let i = 0;

setInterval(()=>{
i++;
if(i>=images.length){i=0;}
document.getElementById("slide").src = images[i];
},3000);