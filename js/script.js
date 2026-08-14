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
  /* =========================================================
   BUSCADOR INTELIGENTE DE PRODUCTOS
========================================================= */

const buscadorEDIJA =
    document.getElementById("buscador-productos");

const sugerenciasEDIJA =
    document.getElementById("sugerencias-productos");

const limpiarBuscadorEDIJA =
    document.getElementById("limpiar-busqueda");

const resultadoBuscadorEDIJA =
    document.getElementById("resultado-busqueda");

const sinResultadosEDIJA =
    document.getElementById("sin-resultados-productos");

const tarjetasBuscadorEDIJA =
    Array.from(
        document.querySelectorAll(
            ".grid-productos .tarjeta-producto"
        )
    );


/* =========================================================
   PALABRAS CLAVE

   No necesitamos modificar las tarjetas HTML.
   Asociamos cada página con palabras relacionadas.
========================================================= */

const palabrasClaveEDIJA = {

    "bomba-agua-2-pulgadas.html":
        "bomba agua riego liquido agricultura campo gasolina",

    "bomba-vacio.html":
        "bomba vacio ordeño ganado vacas leche litros",

    "briqueta-carbon.html":
        "briquetadora briqueta carbon compactar produccion",

    "clasificadora-granos.html":
        "clasificadora granos maiz soya cafe frejol cacao separar limpiar",

    "elevador.html":
        "elevador material carga acero inoxidable transportar subir",

    "mezclador-espiral.html":
        "mezclador mezcladora espiral alimento balanceado animales ganado",

    "mezcladora-balanceado-extrusora.html":
        "extrusora alimento balanceado pellets peces camaron aves mascotas",

    "mezcladora-balanceados.html":
        "mezcladora balanceado alimento animales ganado preparar mezcla",

    "molino.html":
        "molino domestico moler molienda maiz granos harina seco humedo",

    "montacarga-portatil.html":
        "montacarga portatil electrico carga levantar transportar camion camioneta",

    "motocultor-oruga-gasolina-9hp.html":
        "motocultor oruga gasolina agricultura tierra suelo terreno campo",

    "motoguadana.html":
        "motoguadana motoguadaña gasolina pasto hierba cesped jardin cortar",

    "ordenadora-1-puesto.html":
        "ordeñadora ordenadora ordeño vacas vaca leche ganado un puesto",

    "ordenadora-2-puesto.html":
        "ordeñadora ordenadora ordeño vacas leche ganado dos puestos kurtsan",

    "pelletilizadora.html":
        "pelletilizadora pellet pellets alimento camaron peces pollo patos conejos ganado cerdos chivos",

    "picadora-hierba.html":
        "picadora hierba pasto silo ensilaje ganado vacas alimento",

    "picadora-mixta.html":
        "picadora mixta maiz caña azucar hierba pasto ganado moler triturar multifuncional",

    "picadora-3-en-1.html":
        "picadora tres 3 en 1 pasto triturar cortar maiz moler multifuncional",

    "picadora-pasto.html":
        "picadora pasto hierba ganado alimento animales triturar cortar",

    "piladora.html":
        "piladora arroz domestica cuatro 4 en 1 arocillo polvillo piedras impurezas limpiar",

    "varios.html":
        "otros productos maquinaria pedido agricultura ganaderia fumigacion boquilla atomizador accesorios"

};


/* =========================================================
   NORMALIZAR TEXTO

   Maíz -> maiz
   ORDEÑADORA -> ordenadora
========================================================= */

function normalizarBusquedaEDIJA(texto) {

    return texto
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim();

}


/* =========================================================
   DISTANCIA LEVENSHTEIN

   Permite tolerar errores pequeños:
   picdora -> picadora
   arros   -> arroz
========================================================= */

function distanciaEDIJA(a, b) {

    const matriz = [];


    for (let i = 0; i <= b.length; i++) {

        matriz[i] = [i];

    }


    for (let j = 0; j <= a.length; j++) {

        matriz[0][j] = j;

    }


    for (let i = 1; i <= b.length; i++) {

        for (let j = 1; j <= a.length; j++) {

            if (
                b.charAt(i - 1) ===
                a.charAt(j - 1)
            ) {

                matriz[i][j] =
                    matriz[i - 1][j - 1];

            }

            else {

                matriz[i][j] =
                    Math.min(

                        matriz[i - 1][j - 1] + 1,

                        matriz[i][j - 1] + 1,

                        matriz[i - 1][j] + 1

                    );

            }

        }

    }


    return matriz[b.length][a.length];

}


/* =========================================================
   COMPARAR PALABRAS
========================================================= */

function coincidePalabraEDIJA(
    buscada,
    producto
) {

    /* Coincidencia normal */

    if (
        producto.includes(buscada) ||
        buscada.includes(producto)
    ) {

        return true;

    }


    /* Para palabras muy cortas no usamos tolerancia */

    if (
        buscada.length < 4 ||
        producto.length < 4
    ) {

        return false;

    }


    const distancia =
        distanciaEDIJA(
            buscada,
            producto
        );


    const erroresPermitidos =
        buscada.length >= 7
            ? 2
            : 1;


    return distancia <= erroresPermitidos;

}


/* =========================================================
   PUNTUAR PRODUCTO
========================================================= */

function puntuarProductoEDIJA(
    tarjeta,
    busqueda
) {

    const nombre =
        normalizarBusquedaEDIJA(
            tarjeta.querySelector("h3")
                ?.textContent || ""
        );


    const ruta =
        tarjeta.dataset.producto || "";


    const archivo =
        ruta.split("/").pop();


    const claves =
        normalizarBusquedaEDIJA(
            palabrasClaveEDIJA[archivo] || ""
        );


    const textoCompleto =
        `${nombre} ${claves}`;


    /* Si la frase aparece directamente */

    if (
        textoCompleto.includes(busqueda)
    ) {

        return 100;

    }


    const palabrasBuscadas =
        busqueda.split(/\s+/);


    const palabrasProducto =
        textoCompleto.split(/\s+/);


    let puntuacion = 0;


    palabrasBuscadas.forEach(
        (palabraBuscada) => {

            const encontrada =
                palabrasProducto.some(
                    (palabraProducto) =>
                        coincidePalabraEDIJA(
                            palabraBuscada,
                            palabraProducto
                        )
                );


            if (encontrada) {

                puntuacion += 20;

            }

        }
    );


    return puntuacion;

}


/* =========================================================
   MOSTRAR SUGERENCIAS

   SOLO MOSTRAMOS EL NOMBRE.
   NO HAY FOTOGRAFÍAS.
========================================================= */

function mostrarSugerenciasEDIJA(
    resultados
) {

    if (!sugerenciasEDIJA) {
        return;
    }


    sugerenciasEDIJA.innerHTML = "";


    if (
        resultados.length === 0 ||
        !buscadorEDIJA.value.trim()
    ) {

        sugerenciasEDIJA.hidden = true;

        return;

    }


    /* Máximo 7 sugerencias */

    resultados
        .slice(0, 7)
        .forEach(
            ({ tarjeta }) => {

                const enlace =
                    tarjeta.querySelector("a");


                const nombre =
                    tarjeta.querySelector("h3");


                if (
                    !enlace ||
                    !nombre
                ) {

                    return;

                }


                const opcion =
                    document.createElement(
                        "button"
                    );


                opcion.type = "button";

                opcion.className =
                    "sugerencia-producto";


                const texto =
                    document.createElement(
                        "strong"
                    );


                texto.textContent =
                    nombre.textContent;


                opcion.appendChild(texto);


                opcion.addEventListener(
                    "click",
                    () => {

                        window.location.href =
                            enlace.href;

                    }
                );


                sugerenciasEDIJA.appendChild(
                    opcion
                );

            }
        );


    sugerenciasEDIJA.hidden = false;

}


/* =========================================================
   BUSCAR
========================================================= */

function ejecutarBusquedaEDIJA() {

    if (!buscadorEDIJA) {
        return;
    }


    const busqueda =
        normalizarBusquedaEDIJA(
            buscadorEDIJA.value
        );


    /* Botón limpiar */

    if (limpiarBuscadorEDIJA) {

        limpiarBuscadorEDIJA.hidden =
            busqueda.length === 0;

    }


    /* Si está vacío, mostrar todo */

    if (!busqueda) {

        tarjetasBuscadorEDIJA.forEach(
            (tarjeta) => {

                tarjeta.style.display = "";

            }
        );


        if (sugerenciasEDIJA) {

            sugerenciasEDIJA.hidden = true;

            sugerenciasEDIJA.innerHTML = "";

        }


        if (resultadoBuscadorEDIJA) {

            resultadoBuscadorEDIJA.textContent =
                "";

        }


        if (sinResultadosEDIJA) {

            sinResultadosEDIJA.hidden = true;

        }


        return;

    }


    const resultados = [];


    tarjetasBuscadorEDIJA.forEach(
        (tarjeta) => {

            const puntuacion =
                puntuarProductoEDIJA(
                    tarjeta,
                    busqueda
                );


            if (puntuacion > 0) {

                tarjeta.style.display = "";


                resultados.push({
                    tarjeta,
                    puntuacion
                });

            }

            else {

                tarjeta.style.display = "none";

            }

        }
    );


    /* Mejor coincidencia primero */

    resultados.sort(
        (a, b) =>
            b.puntuacion -
            a.puntuacion
    );


    /* Cantidad */

    if (resultadoBuscadorEDIJA) {

        if (resultados.length === 1) {

            resultadoBuscadorEDIJA.textContent =
                "1 producto encontrado";

        }

        else if (
            resultados.length > 1
        ) {

            resultadoBuscadorEDIJA.textContent =
                `${resultados.length} productos encontrados`;

        }

        else {

            resultadoBuscadorEDIJA.textContent =
                "No se encontraron productos";

        }

    }


    if (sinResultadosEDIJA) {

        sinResultadosEDIJA.hidden =
            resultados.length !== 0;

    }


    mostrarSugerenciasEDIJA(
        resultados
    );

}


/* =========================================================
   EVENTOS DEL BUSCADOR
========================================================= */

if (buscadorEDIJA) {

    buscadorEDIJA.addEventListener(
        "input",
        ejecutarBusquedaEDIJA
    );


    buscadorEDIJA.addEventListener(
        "focus",
        () => {

            if (
                buscadorEDIJA.value.trim()
            ) {

                ejecutarBusquedaEDIJA();

            }

        }
    );

}


/* Limpiar */

if (limpiarBuscadorEDIJA) {

    limpiarBuscadorEDIJA.addEventListener(
        "click",
        () => {

            buscadorEDIJA.value = "";

            ejecutarBusquedaEDIJA();

            buscadorEDIJA.focus();

        }
    );

}


/* Cerrar desplegable al hacer clic fuera */

document.addEventListener(
    "click",
    (evento) => {

        if (
            sugerenciasEDIJA &&
            !evento.target.closest(
                ".buscador-catalogo"
            )
        ) {

            sugerenciasEDIJA.hidden = true;

        }

    }
);


  
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