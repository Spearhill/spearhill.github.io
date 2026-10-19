// The games slideshow. Add one entry per image; the section stays hidden while the list is empty.
//   image: a file in the images folder, e.g. "images/game-1.jpg" (16:9, 1920 x 1080 works well)
//   title: shown in the caption bar
//   link:  the store page the image leads to (Steam, Google Play...); leave it out for an image with no store page yet
//   caption: false hides the caption bar (for an image that already carries its own text)
const GALLERY = [
  { image: "images/placeholder.png", title: "Spearhill: coming soon", caption: false },
  // { image: "images/example.jpg", title: "Game name", link: "https://store.steampowered.com/app/0000000/" },
];
const SLIDE_SECONDS = 8; // How long each image shows before the next fades in.

(function () {
  const section = document.getElementById("games");
  if (!section || GALLERY.length === 0) return;
  section.hidden = false;
  const show = section.querySelector(".slideshow");
  const several = GALLERY.length > 1;

  const slides = GALLERY.map((item, i) => {
    const slide = document.createElement(item.link ? "a" : "div");
    slide.className = "slide" + (i === 0 ? " current" : "");
    if (item.link) { slide.href = item.link; slide.target = "_blank"; slide.rel = "noopener"; }
    const img = document.createElement("img");
    img.src = item.image; img.alt = item.title; if (i > 0) img.loading = "lazy";
    slide.appendChild(img);
    show.appendChild(slide);
    return slide;
  });

  const caption = document.createElement("div");
  caption.className = "caption";
  caption.innerHTML = '<span class="title"></span><a class="store" target="_blank" rel="noopener">View store page</a>';
  show.appendChild(caption);

  let dots = [];
  if (several) {
    show.insertAdjacentHTML("beforeend",
      '<button class="arrow prev" type="button" aria-label="Previous">&#8249;</button>' +
      '<button class="arrow next" type="button" aria-label="Next">&#8250;</button>' +
      '<div class="dots"></div>');
    const row = show.querySelector(".dots");
    dots = GALLERY.map((item, i) => {
      const dot = document.createElement("button");
      dot.type = "button"; dot.setAttribute("aria-label", item.title);
      dot.addEventListener("click", () => go(i, true));
      row.appendChild(dot);
      return dot;
    });
    show.querySelector(".prev").addEventListener("click", () => go(current - 1, true));
    show.querySelector(".next").addEventListener("click", () => go(current + 1, true));
  }

  let current = 0, timer = null;
  function go(i, byHand) {
    slides[current].classList.remove("current");
    current = (i + slides.length) % slides.length;
    slides[current].classList.add("current");
    const item = GALLERY[current];
    caption.hidden = item.caption === false;
    caption.querySelector(".title").textContent = item.title;
    const store = caption.querySelector(".store");
    if (item.link) { store.href = item.link; store.hidden = false; } else store.hidden = true;
    dots.forEach((dot, k) => dot.classList.toggle("on", k === current));
    if (byHand) restart();
  }
  function restart() {
    clearInterval(timer);
    if (several && !paused) timer = setInterval(() => go(current + 1), SLIDE_SECONDS * 1000);
  }
  let paused = false; // Paused while the pointer is over the slideshow, as a reader looks at an image.
  show.addEventListener("mouseenter", () => { paused = true; clearInterval(timer); });
  show.addEventListener("mouseleave", () => { paused = false; restart(); });
  let startX = null;
  show.addEventListener("touchstart", (e) => { startX = e.touches[0].clientX; }, { passive: true });
  show.addEventListener("touchend", (e) => {
    if (startX === null || !several) return;
    const dx = e.changedTouches[0].clientX - startX; startX = null;
    if (Math.abs(dx) > 50) go(current + (dx < 0 ? 1 : -1), true);
  });

  go(0);
  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) restart();
})();
