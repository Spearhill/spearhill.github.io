// The games gallery. Add one entry per image; the section stays hidden while the list is empty.
//   image: a file in the images folder, e.g. "images/game-1.jpg" (1920 x 1080 works well)
//   title: shown under the image and in the viewer
//   link:  the store page the image leads to (Steam, Google Play...); leave it out for an image with no store page yet
const GALLERY = [
  { image: "images/placeholder.png", title: "Coming soon" },
  // { image: "images/example.jpg", title: "Game name", link: "https://store.steampowered.com/app/0000000/" },
];

(function () {
  const section = document.getElementById("games");
  if (!section || GALLERY.length === 0) return;
  const grid = section.querySelector(".gallery");
  section.hidden = false;

  GALLERY.forEach((item, i) => {
    const button = document.createElement("button");
    button.className = "thumb";
    button.type = "button";
    button.setAttribute("aria-label", "View " + item.title);
    button.innerHTML = '<img loading="lazy" alt=""><span></span>';
    button.querySelector("img").src = item.image;
    button.querySelector("img").alt = item.title;
    button.querySelector("span").textContent = item.title;
    button.addEventListener("click", () => open(i));
    grid.appendChild(button);
  });

  // The viewer: one image at a time, previous and next, and the image's store link.
  const viewer = document.createElement("div");
  viewer.className = "viewer";
  viewer.hidden = true;
  viewer.setAttribute("role", "dialog");
  viewer.setAttribute("aria-modal", "true");
  viewer.innerHTML =
    '<button class="close" type="button" aria-label="Close">&times;</button>' +
    '<button class="prev" type="button" aria-label="Previous">&#8249;</button>' +
    '<figure><a class="shot" target="_blank" rel="noopener"><img alt=""></a>' +
    '<figcaption><span class="title"></span><a class="store" target="_blank" rel="noopener">View store page</a></figcaption></figure>' +
    '<button class="next" type="button" aria-label="Next">&#8250;</button>';
  document.body.appendChild(viewer);
  let current = 0, startX = null;

  function show(i) {
    current = (i + GALLERY.length) % GALLERY.length;
    const item = GALLERY[current];
    const img = viewer.querySelector("img");
    img.src = item.image; img.alt = item.title;
    viewer.querySelector(".title").textContent = item.title;
    const shot = viewer.querySelector(".shot"), store = viewer.querySelector(".store");
    if (item.link) { shot.href = item.link; store.href = item.link; store.hidden = false; }
    else { shot.removeAttribute("href"); store.hidden = true; } // No store page yet.
    const several = GALLERY.length > 1;
    viewer.querySelector(".prev").hidden = !several;
    viewer.querySelector(".next").hidden = !several;
  }
  function open(i) { show(i); viewer.hidden = false; document.body.classList.add("viewing"); viewer.querySelector(".close").focus(); }
  function close() { viewer.hidden = true; document.body.classList.remove("viewing"); }

  viewer.querySelector(".close").addEventListener("click", close);
  viewer.querySelector(".prev").addEventListener("click", () => show(current - 1));
  viewer.querySelector(".next").addEventListener("click", () => show(current + 1));
  viewer.addEventListener("click", (e) => { if (e.target === viewer) close(); });
  document.addEventListener("keydown", (e) => {
    if (viewer.hidden) return;
    if (e.key === "Escape") close();
    else if (e.key === "ArrowLeft") show(current - 1);
    else if (e.key === "ArrowRight") show(current + 1);
  });
  viewer.addEventListener("touchstart", (e) => { startX = e.touches[0].clientX; }, { passive: true });
  viewer.addEventListener("touchend", (e) => {
    if (startX === null) return;
    const dx = e.changedTouches[0].clientX - startX; startX = null;
    if (Math.abs(dx) > 50) show(current + (dx < 0 ? 1 : -1));
  });
})();
