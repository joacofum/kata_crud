document.addEventListener('DOMContentLoaded', inicio, false);

function inicio () {
    //Variables del dom van con $ para diferenciarlas
    const d = document, $table = d.querySelector(".crud-table"), $form = d.querySelector(".crud-form"), 
    $title = d.querySelector(".crud-title"), $template = d.getElementById("crud-template").content, $fragment = d.createDocumentFragment();

    const getAll = async () => {
        try {
            let res = await axios.get("http://localhost:3000/santos"),
                json = await res.data;

            json.forEach(el => {
                $template.querySelector(".name").textContent = el.nombre;
                $template.querySelector(".constellation").textContent = el.constelacion;
                $template.querySelector(".edit").dataset.id = el.id;
                $template.querySelector(".edit").dataset.name = el.nombre;
                $template.querySelector(".edit").dataset.constellation = el.constelacion;
                $template.querySelector(".delete").dataset.id = el.id;

                let $clone = d.importNode($template, true);
                $fragment.appendChild($clone);
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
            if (!e.target.id.value ) {
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

function mostrarError(err){
    let message = err.statusText || "Ocurrió un error";
    alert(`Error ${err.status}: ${message}`);
}

async function ejecutarAjax(metodo, evento){
    try {
        if(metodo === "DELETE"){
            let options = {
                method: metodo,
                headers: {
                    "Content-type": "application/json; charset=utf-8"
                }
            }
            var res = await axios(`http://localhost:3000/santos/${evento.target.dataset.id}`, options);
        }else{
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
            var res = await axios("http://localhost:3000/santos", options);     
        }
        let json = await res.data;
        location.reload();
    } catch (err) {
        console.log(err);
        mostrarError(err); 
    }
}