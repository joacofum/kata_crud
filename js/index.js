document.addEventListener('DOMContentLoaded', inicio, false);

function inicio() {
    //Variables del dom van con $ para diferenciarlas
    const d = document,
        $table = d.querySelector(".crud-table"),
        $form = d.querySelector(".crud-form"),
        $title = d.querySelector(".crud-title"),
        $template = d.getElementById("crud-template").content,
        $fragment = d.createDocumentFragment();

    const getAll = async () => {
        try {
            let res = await axios.get("http://localhost:3000/santos"),
                json = await res.data;

            json.forEach(el => {
                crearFilaTabla($template, el, d, $fragment)
            });

            $table.querySelector("tbody").appendChild($fragment);
        } catch (err) {
            mostrarError(err);
        }
    }

    getAll();

    d.addEventListener("submit", async e => {
        if (e.target === $form) {
            e.preventDefault();
            if (!e.target.id.value) {
                //Create - POST
                let metodo = "POST"
                ejecutarAjax(metodo, e);
            } else {
                //Update - PUT
                let metodo = "PUT"
                ejecutarAjax(metodo, e);
            }
        }
    });

    d.addEventListener("click", async e => {
        if (e.target.matches(".edit")) {
            $title.textContent = "Editar Santo";
            $form.nombre.value = e.target.dataset.name;
            $form.constelacion.value = e.target.dataset.constellation;
            $form.id.value = e.target.dataset.id;
        }

        if (e.target.matches(".delete")) {
            let isDelete = confirm(`¿Estás seguro de eliminar el id ${e.target.dataset.id}?`);

            if (isDelete) {
                //Delete - DELETE
                let metodo = "DELETE"
                ejecutarAjax(metodo, e);
            }
        }
    })
}

function crearFilaTabla($template, el, d, $fragment) {
    $template.querySelector(".name").textContent = el.nombre;
    $template.querySelector(".constellation").textContent = el.constelacion;
    $template.querySelector(".edit").dataset.id = el.id;
    $template.querySelector(".edit").dataset.name = el.nombre;
    $template.querySelector(".edit").dataset.constellation = el.constelacion;
    $template.querySelector(".delete").dataset.id = el.id;
    $template.querySelector(".fila").id = el.id

    let $clone = d.importNode($template, true);
    $fragment.appendChild($clone);
}

function mostrarError(err) {
    let message = err.statusText || "Ocurrió un error";
    alert(`Error ${err.status}: ${message}`);
}

async function ejecutarAjax(metodo, evento) {
    try {
        if (metodo === "DELETE") {
            let options = {
                method: metodo,
                headers: {
                    "Content-type": "application/json; charset=utf-8"
                }
            }
            var res = await axios(`http://localhost:3000/santos/${evento.target.dataset.id}`, options);
        } else {
            let options = {
                method: metodo,
                headers: {
                    "Content-type": "application/json; charset=utf-8"
                },
                data: JSON.stringify({
                    nombre: evento.target.nombre.value,
                    constelacion: evento.target.constelacion.value
                })
            }
            if (metodo === "PUT") {
                let id = document.getElementById("id");
                var res = await axios(`http://localhost:3000/santos/${id.value}`, options);

                $title = document.querySelector(".crud-title")
                $title.textContent = "Agregar Santo"
                id.value = ""


            } else {
                var res = await axios("http://localhost:3000/santos", options);
            }
        }
        let json = await res.data;

        if (metodo === "POST") {
            //Agregar el elemento a la tabla sin recargar la página.
            $table = document.querySelector(".crud-table")
            $template = document.getElementById("crud-template").content
            $fragment = document.createDocumentFragment()
            crearFilaTabla($template, json, document, $fragment)
            $table.querySelector("tbody").appendChild($fragment)
        }

        if (metodo === "PUT") {
            //Actualizar el elemento de la tabla sin recargar la página.
            let fila = document.getElementById(json.id);

            //Edito nombre y constelación de la fila.
            fila.children[0].textContent = json.nombre
            fila.children[1].textContent = json.constelacion

            //Obtengo el botón editar en la fila.
            let btn_editar = fila.children[2].children[0]

            //Edito los data-name y data-constellation de los botón editar.
            btn_editar.dataset.name = json.nombre
            btn_editar.dataset.constellation = json.constelacion

        }

        if (metodo === "DELETE") {
            //Eliminar elemento de una tabla sin regargar la página.          
            let id = evento.target.dataset.id;
            document.getElementById(id).remove();
        }

    } catch (err) {
        mostrarError(err);
    }
}