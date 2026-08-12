document.addEventListener("DOMContentLoaded", () => {
  /* =========================================
       MENÚ RESPONSIVO
    ========================================= */

  const botonMenu = document.getElementById("boton-menu");
  const menuPrincipal = document.getElementById("menu-principal");
  const enlacesMenu = document.querySelectorAll("#menu-principal a");
  const slidersProductos = document.querySelectorAll(".slider-producto");

  function cerrarMenu() {
    if (!botonMenu || !menuPrincipal) {
      return;
    }

    menuPrincipal.classList.remove("menu-visible");
    botonMenu.setAttribute("aria-expanded", "false");
    botonMenu.textContent = "☰";
  }

  if (botonMenu && menuPrincipal) {
    botonMenu.addEventListener("click", () => {
      const menuVisible = menuPrincipal.classList.toggle("menu-visible");

      botonMenu.setAttribute("aria-expanded", menuVisible.toString());

      botonMenu.textContent = menuVisible ? "✕" : "☰";
    });

    enlacesMenu.forEach((enlace) => {
      enlace.addEventListener("click", cerrarMenu);
    });

    document.addEventListener("click", (evento) => {
      const clicDentroDelMenu = menuPrincipal.contains(evento.target);

      const clicEnBoton = botonMenu.contains(evento.target);

      if (!clicDentroDelMenu && !clicEnBoton) {
        cerrarMenu();
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 900) {
        cerrarMenu();
      }
    });
  }

  slidersProductos.forEach((slider) => {
    const imagen = slider.querySelector(".slider-imagen");
    const botonAnterior = slider.querySelector(".slider-anterior");
    const botonSiguiente = slider.querySelector(".slider-siguiente");
    const contador = slider.querySelector(".slider-contador");

    const carpeta = slider.dataset.carpeta;
    const totalImagenes = Number(slider.dataset.total);

    let indiceActual = Number(slider.dataset.indice) || 1;

    /* Cambiar la imagen mostrada */
    function mostrarImagen(indice) {
      /* Si llega después de la última,
           vuelve a la primera */
      if (indice > totalImagenes) {
        indiceActual = 1;
      } else if (indice < 1) {

      /* Si retrocede desde la primera,
           va a la última */
        indiceActual = totalImagenes;
      } else {
        indiceActual = indice;
      }

      /* Construye automáticamente la ruta:
           f1.png, f2.png, f3.png... */
      imagen.src = `../imagenes/${carpeta}/f${indiceActual}.png`;

      /* Actualiza el contador */
      if (contador) {
        contador.textContent = `${indiceActual} / ${totalImagenes}`;
      }
    }

    /* Imagen anterior */
    if (botonAnterior) {
      botonAnterior.addEventListener("click", () => {
        mostrarImagen(indiceActual - 1);
      });
    }

    /* Imagen siguiente */
    if (botonSiguiente) {
      botonSiguiente.addEventListener("click", () => {
        mostrarImagen(indiceActual + 1);
      });
    }

    /* =========================================
       DESLIZAR CON EL DEDO EN CELULAR
    ========================================= */

    let inicioX = 0;

    slider.addEventListener("touchstart", (evento) => {
      inicioX = evento.touches[0].clientX;
    });

    slider.addEventListener("touchend", (evento) => {
      const finX = evento.changedTouches[0].clientX;

      const diferencia = inicioX - finX;

      /* Deslizó hacia la izquierda */
      if (diferencia > 50) {
        mostrarImagen(indiceActual + 1);
      }

      /* Deslizó hacia la derecha */
      if (diferencia < -50) {
        mostrarImagen(indiceActual - 1);
      }
    });

    /* =========================================
       PRODUCTO CON UNA SOLA FOTO
    ========================================= */

    if (totalImagenes <= 1) {
      if (botonAnterior) {
        botonAnterior.style.display = "none";
      }

      if (botonSiguiente) {
        botonSiguiente.style.display = "none";
      }

      if (contador) {
        contador.style.display = "none";
      }
    }
  });

  /* =========================================
       AÑO AUTOMÁTICO
    ========================================= */

  const anio = document.getElementById("anio");

  if (anio) {
    anio.textContent = new Date().getFullYear();
  }

  /* =========================================
       FILTROS DEL CATÁLOGO
    ========================================= */

  const botonesFiltro = document.querySelectorAll(".boton-filtro");

  const tarjetasProductos = document.querySelectorAll(".tarjeta-producto");

  if (botonesFiltro.length > 0 && tarjetasProductos.length > 0) {
    botonesFiltro.forEach((boton) => {
      boton.addEventListener("click", () => {
        const filtroSeleccionado = boton.dataset.filtro;

        botonesFiltro.forEach((otroBoton) => {
          otroBoton.classList.remove("activo");
        });

        boton.classList.add("activo");

        tarjetasProductos.forEach((tarjeta) => {
          const categorias = tarjeta.dataset.categoria.toLowerCase().split(" ");

          const debeMostrarse =
            filtroSeleccionado === "todos" ||
            categorias.includes(filtroSeleccionado.toLowerCase());

          tarjeta.classList.toggle("oculto", !debeMostrarse);

          tarjeta.setAttribute("aria-hidden", (!debeMostrarse).toString());
        });
      });
    });
  }

  /* =========================================
       GALERÍA DE LA PÁGINA DEL PRODUCTO
    ========================================= */

  const imagenPrincipal = document.getElementById("imagen-principal");

  const imagenesGaleria = document.querySelectorAll(".elemento-galeria img");

  if (imagenPrincipal && imagenesGaleria.length > 0) {
    imagenesGaleria.forEach((imagen) => {
      imagen.setAttribute("tabindex", "0");
      imagen.setAttribute("role", "button");

      const mostrarImagen = () => {
        imagenPrincipal.src = imagen.src;
        imagenPrincipal.alt = imagen.alt;

        imagenesGaleria.forEach((otraImagen) => {
          otraImagen.classList.remove("imagen-seleccionada");
        });

        imagen.classList.add("imagen-seleccionada");

        imagenPrincipal.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      };

      imagen.addEventListener("click", mostrarImagen);

      imagen.addEventListener("keydown", (evento) => {
        if (evento.key === "Enter" || evento.key === " ") {
          evento.preventDefault();
          mostrarImagen();
        }
      });
    });
  }
});


/* =========================================
   CARGAR PRECIOS DE LOS PRODUCTOS
   DIRECTAMENTE DESDE CADA HTML
========================================= */

const tarjetasConPrecio = document.querySelectorAll(
    ".tarjeta-producto[data-producto]"
);

tarjetasConPrecio.forEach(async (tarjeta) => {

    const rutaProducto = tarjeta.dataset.producto;
    const precioIndex = tarjeta.querySelector(".precio-index");

    if (!rutaProducto || !precioIndex) {
        return;
    }

    try {

        /* Lee el archivo HTML del producto */
        const respuesta = await fetch(rutaProducto);

        if (!respuesta.ok) {
            throw new Error("No se pudo leer el producto");
        }

        const html = await respuesta.text();


        /* Convierte el HTML recibido para poder buscar elementos */
        const parser = new DOMParser();
        const documentoProducto = parser.parseFromString(
            html,
            "text/html"
        );


        /* Busca el precio dentro del producto */
        const precioProducto =
            documentoProducto.querySelector(".precio-detalle");


        /* Si existe precio, lo copia al index */
        if (precioProducto) {

            const precioPrincipal =
                precioProducto.childNodes[0]
                    ?.textContent
                    .trim();

            const textoPrecio =
                precioProducto.querySelector("span")
                    ?.textContent
                    .trim();


            if (precioPrincipal) {

                precioIndex.innerHTML = `
                    <strong>${precioPrincipal}</strong>
                    ${
                        textoPrecio
                            ? `<span>${textoPrecio}</span>`
                            : ""
                    }
                `;

            }

        }

        /* Si el producto todavía no tiene precio */
        else {

            precioIndex.textContent =
                "Consultar precio";

        }

    }

    catch (error) {

        console.error(
            `Error cargando precio de ${rutaProducto}:`,
            error
        );

        precioIndex.textContent =
            "Consultar precio";

    }

});