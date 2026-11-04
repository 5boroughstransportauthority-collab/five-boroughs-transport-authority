"use strict";
(() => {
  const mobile = document.querySelector(".mobile-menu");
  const toggle = document.querySelector(".mobile-nav-toggler");
  let lastFocus;
  function setMenu(open) {
    if (!mobile || !toggle) return;
    if (open) lastFocus = document.activeElement;
    document.body.classList.toggle("mobile-menu-visible", open);
    mobile.setAttribute("aria-hidden", String(!open));
    mobile.inert = !open;
    toggle.setAttribute("aria-expanded", String(open));
    if (open) mobile.querySelector(".close-btn").focus();
    else if (lastFocus && typeof lastFocus.focus === "function") lastFocus.focus();
  }
  if (mobile) mobile.inert = true;
  if (toggle) toggle.addEventListener("click", () => setMenu(toggle.getAttribute("aria-expanded") !== "true"));
  document.querySelectorAll(".mobile-menu .close-btn,.mobile-menu .menu-backdrop").forEach(el => el.addEventListener("click", () => setMenu(false)));
  document.addEventListener("keydown", event => {
    if (!mobile || mobile.getAttribute("aria-hidden") === "true") return;
    if (event.key === "Escape") setMenu(false);
    if (event.key === "Tab") {
      const items = Array.from(mobile.querySelectorAll("a[href],button:not([tabindex='-1'])"));
      const first = items[0], last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {event.preventDefault();last.focus();}
      else if (!event.shiftKey && document.activeElement === last) {event.preventDefault();first.focus();}
    }
  });
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.querySelectorAll(".fbta-carousel").forEach((carousel, index) => {
    const slides = Array.from(carousel.querySelectorAll(":scope > .owl-item"));
    if (slides.length < 2) return;
    let selected = 0, timer;
    carousel.setAttribute("role", "region");
    carousel.setAttribute("aria-label", carousel.classList.contains("banner-carousel") ? "FBTA introduction slides" : "Testimonials");
    function show(next) {
      selected = (next + slides.length) % slides.length;
      slides.forEach((slide, i) => {slide.classList.toggle("active",i === selected);slide.setAttribute("aria-hidden",String(i !== selected));slide.inert = i !== selected;});
    }
    const nav = document.createElement("div");nav.className = "owl-nav";
    [[-1,"Previous slide","‹"],[1,"Next slide","›"]].forEach(([delta,label,symbol]) => {
      const btn = document.createElement("button");btn.type = "button";btn.className = delta < 0 ? "owl-prev" : "owl-next";btn.setAttribute("aria-label",label);const glyph=document.createElement("span");glyph.className=carousel.classList.contains("banner-carousel")?"icon-right-arrow":(delta<0?"left icon-next":"right icon-next");glyph.setAttribute("aria-hidden","true");btn.append(glyph);
      btn.addEventListener("click",() => {show(selected + delta);stop();});nav.append(btn);
    });
    const pause = document.createElement("button");pause.type = "button";pause.className = "carousel-pause";pause.textContent = "Ⅱ";pause.setAttribute("aria-label","Pause slides");
    function stop() {if(timer)clearInterval(timer);timer=undefined;pause.textContent="▷";pause.setAttribute("aria-label","Play slides");}
    function play() {stop();timer=setInterval(() => {if(!document.hidden)show(selected+1);},carousel.classList.contains("banner-carousel")?9000:5000);pause.textContent="Ⅱ";pause.setAttribute("aria-label","Pause slides");}
    pause.addEventListener("click",() => timer ? stop() : play());nav.append(pause);carousel.append(nav);
    carousel.addEventListener("focusin",stop);carousel.addEventListener("pointerenter",stop);
    carousel.addEventListener("keydown",e => {if(e.key==="ArrowRight"){show(selected+1);stop();}if(e.key==="ArrowLeft"){show(selected-1);stop();}});
    show(0);if(!reduce)play();else stop();
  });
  document.querySelectorAll(".fbta-multi-carousel").forEach(carousel=>{
    carousel.tabIndex=0;carousel.setAttribute("aria-label",carousel.classList.contains("partner-carousel")?"Partner logos":"Services carousel");
    const first=carousel.firstElementChild;if(!first)return;let timer;
    const stop=()=>{if(timer)clearInterval(timer);timer=undefined;};
    function move(direction){const step=first.getBoundingClientRect().width+parseFloat(getComputedStyle(carousel).gap||"0");const max=carousel.scrollWidth-carousel.clientWidth;let position=carousel.scrollLeft+direction*step;if(position>max+2)position=0;if(position<0)position=max;carousel.scrollTo({left:position,behavior:reduce?"instant":"smooth"});}
    if(carousel.classList.contains("service-element-carousel")){const nav=document.createElement("div");nav.className="multi-carousel-controls";for(const [direction,label] of [[-1,"Previous services"],[1,"Next services"]]){const b=document.createElement("button");b.type="button";b.className="btn-one";b.textContent=direction<0?"‹":"›";b.setAttribute("aria-label",label);b.addEventListener("click",()=>{stop();move(direction);});nav.append(b);}carousel.after(nav);}
    carousel.addEventListener("pointerenter",stop);carousel.addEventListener("focusin",stop);carousel.addEventListener("touchstart",stop,{passive:true});carousel.addEventListener("keydown",e=>{if(e.key==="ArrowRight"||e.key==="ArrowLeft"){e.preventDefault();stop();move(e.key==="ArrowRight"?1:-1);}});
    if(!reduce)timer=setInterval(()=>{if(!document.hidden)move(1);},carousel.classList.contains("partner-carousel")?6000:5000);
  });
  const top = document.querySelector(".scroll-top");
  const sticky = document.querySelector(".sticky-header");
  function scrollState(){if(top)top.classList.toggle("visible",scrollY>500);if(sticky)sticky.classList.toggle("animated",scrollY>300);if(sticky)sticky.classList.toggle("fadeInDown",scrollY>300);document.querySelector(".main-header")?.classList.toggle("fixed-header",scrollY>300);}
  addEventListener("scroll",scrollState,{passive:true});scrollState();
  top?.addEventListener("click",() => scrollTo({top:0,behavior:reduce?"instant":"smooth"}));
  document.querySelectorAll(".fbta-search").forEach(form=>{
    form.addEventListener("submit",event=>{
      event.preventDefault();const query=form.querySelector("input").value.trim().toLowerCase();const output=form.nextElementSibling;output.replaceChildren();
      const matches=(window.FBTA_SEARCH_INDEX||[]).filter(item=>(item.title+" "+item.text).toLowerCase().includes(query)).slice(0,12);
      if(!query){output.textContent="Enter a search term.";return;}
      if(!matches.length){output.textContent="No matching pages found.";return;}
      const list=document.createElement("ul");const script=Array.from(document.scripts).find(s=>s.src.endsWith("/assets/site.js"));const root=new URL("../",script.src);
      for(const item of matches){const li=document.createElement("li"),a=document.createElement("a");a.textContent=item.title;a.href=new URL(item.route,root).href;li.append(a);list.append(li);}output.append(list);
    });
  });
  const splash=document.querySelector(".fbta-splash");
  if(splash&&!reduce){
    let seen=false;try{seen=sessionStorage.getItem("fbta-animation-seen")==="yes";}catch{}
    if(!seen){splash.hidden=false;splash.setAttribute("aria-hidden","false");const close=()=>{splash.hidden=true;splash.setAttribute("aria-hidden","true");try{sessionStorage.setItem("fbta-animation-seen","yes");}catch{}};splash.querySelector("button").addEventListener("click",close);setTimeout(close,9000);if(document.readyState==="complete")setTimeout(close,500);else addEventListener("load",()=>setTimeout(close,500),{once:true});}
  }
})();
