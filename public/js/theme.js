document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.getElementById("themeToggle");
  const body = document.body;

  // If button not found, stop
  if (!toggleBtn) return;

  // Load saved theme
  const savedTheme = localStorage.getItem("theme");

  if (savedTheme === "dark") {
    body.classList.add("dark");
    toggleBtn.textContent = "☀️";
  } else {
    toggleBtn.textContent = "🌙";
  }

  // Toggle on click
  toggleBtn.addEventListener("click", () => {
    body.classList.toggle("dark");

    if (body.classList.contains("dark")) {
      localStorage.setItem("theme", "dark");
      toggleBtn.textContent = "☀️";
    } else {
      localStorage.setItem("theme", "light");
      toggleBtn.textContent = "🌙";
    }
  });
});
