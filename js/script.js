const botonMenu = document.getElementById("boton-menu");
const menu = document.getElementById("menu");
const enlacesMenu = document.querySelectorAll("#menu a");
const anio = document.getElementById("anio");

botonMenu.addEventListener("click", () => {
    const menuVisible = menu.classList.toggle("menu-visible");

    botonMenu.setAttribute(
        "aria-expanded",
        menuVisible.toString()
    );

    botonMenu.textContent = menuVisible ? "✕" : "☰";
});

enlacesMenu.forEach((enlace) => {
    enlace.addEventListener("click", () => {
        menu.classList.remove("menu-visible");
        botonMenu.setAttribute("aria-expanded", "false");
        botonMenu.textContent = "☰";
    });
});

anio.textContent = new Date().getFullYear();