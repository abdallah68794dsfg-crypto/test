const birthday = new Date("2026-11-22T00:00:00");
const $ = (id) => document.getElementById(id);
function updateCountdown() {
  const diff = birthday - new Date();
  if (diff <= 0) {
    ["days","hours","minutes","seconds"].forEach(id => $(id).textContent = "00");
    $("countdownNote").textContent = "النهارده يومك يا نور الدين! كل سنة وأنت طيب 🎉";
    return;
  }
  $("days").textContent = String(Math.floor(diff / 86400000)).padStart(2,"0");
  $("hours").textContent = String(Math.floor(diff % 86400000 / 3600000)).padStart(2,"0");
  $("minutes").textContent = String(Math.floor(diff % 3600000 / 60000)).padStart(2,"0");
  $("seconds").textContent = String(Math.floor(diff % 60000 / 1000)).padStart(2,"0");
}
updateCountdown(); setInterval(updateCountdown,1000);
$("giftButton").addEventListener("click",()=>{
  const letter=$("letter"); letter.hidden=!letter.hidden;
  $("giftButton").querySelector(".gift-box").textContent=letter.hidden?"🎁":"💝";
  $("giftButton").querySelector(".gift-label").textContent=letter.hidden?"اضغط لفتح الهدية":"اضغط لإغلاق الرسالة";
  if(!letter.hidden){letter.scrollIntoView({behavior:"smooth",block:"center"});launchConfetti(150);}
});
const audio=$("birthdayAudio");
$("musicToggle").addEventListener("click",async()=>{
  try{if(audio.paused){await audio.play();$("musicToggle").innerHTML="♫ <span>إيقاف الموسيقى</span>";}
  else{audio.pause();$("musicToggle").innerHTML="♫ <span>تشغيل الموسيقى</span>";}}
  catch{alert("أضف ملف birthday.mp3 إلى مجلد الموقع لتشغيل الموسيقى.");}
});
document.querySelectorAll('input[type="file"][data-photo]').forEach(input=>{
  input.addEventListener("change",event=>{
    const file=event.target.files&&event.target.files[0];if(!file||!file.type.startsWith("image/"))return;
    const reader=new FileReader();reader.onload=()=>$(input.dataset.photo).src=reader.result;reader.readAsDataURL(file);
  });
});
$("wishButton").addEventListener("click",()=>{
  $("wishResult").textContent="أمنيتك في طريقها للسماء… وعقبال سنين كلها خير ونجاح يا نور! ✨";launchConfetti(190);
});
$("shareButton").addEventListener("click",async()=>{
  const data={title:"عيد ميلاد سعيد يا نور الدين",text:"كل سنة وأنت طيب يا نور الدين! 🎂✨",url:location.href};
  try{if(navigator.share)await navigator.share(data);else if(navigator.clipboard){await navigator.clipboard.writeText(location.href);alert("تم نسخ رابط الموقع.");}
  else alert("انسخ رابط الموقع من شريط العنوان.");}
  catch(e){if(e.name!=="AbortError")alert("انسخ رابط الموقع من شريط العنوان.");}
});
const canvas=$("confetti"),ctx=canvas.getContext("2d");let particles=[];
function resizeCanvas(){const dpr=Math.min(devicePixelRatio||1,2);canvas.width=innerWidth*dpr;canvas.height=innerHeight*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);}
addEventListener("resize",resizeCanvas);resizeCanvas();
function launchConfetti(amount=120){
  const colors=["#e8ca7b","#c69c43","#fff0bd","#a98237","#f7e5b1"];
  for(let i=0;i<amount;i++)particles.push({x:Math.random()*innerWidth,y:-20-Math.random()*innerHeight*.4,vx:(Math.random()-.5)*4,vy:2+Math.random()*4,size:3+Math.random()*5,rotation:Math.random()*6,spin:(Math.random()-.5)*.18,color:colors[Math.floor(Math.random()*colors.length)],life:150+Math.random()*100});
}
function animateConfetti(){
  ctx.clearRect(0,0,innerWidth,innerHeight);particles=particles.filter(p=>p.life>0&&p.y<innerHeight+30);
  for(const p of particles){p.x+=p.vx;p.y+=p.vy;p.vy+=.025;p.rotation+=p.spin;p.life--;ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.rotation);ctx.fillStyle=p.color;ctx.fillRect(-p.size/2,-p.size/2,p.size,p.size*.65);ctx.restore();}
  requestAnimationFrame(animateConfetti);
}
animateConfetti();