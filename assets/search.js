// scripts/assets/search.js — client-side title/summary substring search
(function () {
  const input = document.getElementById("search-input");
  const box = document.getElementById("search-results");
  if (!input || !box) return;

  let records = [];
  fetch("search.json")
    .then((r) => r.json())
    .then((data) => { records = data; })
    .catch(() => {});

  function render(matches) {
    if (!matches.length) {
      box.innerHTML = '<div class="r-empty">一致するページがありません</div>';
      box.classList.add("open");
      return;
    }
    box.innerHTML = matches
      .slice(0, 8)
      .map(
        (m) =>
          `<a href="${m.url}"><div class="r-title">${esc(m.title)}</div>` +
          `<div class="r-sum">${esc(m.summary)}</div></a>`
      )
      .join("");
    box.classList.add("open");
  }

  function esc(s) {
    return (s || "").replace(/[&<>"]/g, (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c])
    );
  }

  input.addEventListener("input", () => {
    const q = input.value.trim().toLowerCase();
    if (!q) { box.classList.remove("open"); box.innerHTML = ""; return; }
    const matches = records.filter(
      (m) =>
        m.title.toLowerCase().includes(q) ||
        (m.summary || "").toLowerCase().includes(q) ||
        (m.category || "").toLowerCase().includes(q)
    );
    render(matches);
  });

  document.addEventListener("click", (e) => {
    if (!box.contains(e.target) && e.target !== input) box.classList.remove("open");
  });
})();
