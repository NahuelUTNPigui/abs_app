<script>
    import Navbarr from '$lib/Navbarr.svelte';
    import Swal from 'sweetalert2'
    import PocketBase from 'pocketbase'
    import { onMount } from 'svelte';
    import emptyString from '$lib/strings/lib'
    let ruta = import.meta.env.VITE_RUTA
    const pb = new PocketBase(ruta);
    let diagnosticos = []
    let diagnosticosrow = []
    
    let buscar = ""

    //Datos
    let iddiag = ""
    let abreviaturas = ""
    let nombre = ""
    let descripcion = ""
    //Validaciones
    let malabrev = false
    let botonhabilitado = false
    //Funciones
    function openModal(id){
        iddiag = id
        if(id != "0"){
            let d = diagnosticos.filter(dia=>dia.id==id)[0]
            abreviaturas = d.abreviaturas
            nombre = d.nombre
            descripcion = d.descripcion
            botonhabilitado = true
            malabrev = false
        }
        else{
            botonhabilitado = false
            malabrev = false
            abreviaturas = ""
            nombre = ""
            descripcion = ""
        }
        formModal.showModal()
    }
    function filterupdate(){
        diagnosticosrow = diagnosticos
        if(buscar != ""){
            diagnosticosrow = diagnosticosrow.filter(d=>{
                return d.abreviaturas.toLocaleLowerCase().startsWith(buscar.toLocaleLowerCase()) || d.nombre.toLocaleLowerCase().startsWith(buscar.toLocaleLowerCase())
            })
        }
        diagnosticosrow = diagnosticosrow
    }
    function validarBoton(){
        botonhabilitado = true
        if(emptyString(abreviaturas)){
            botonhabilitado = false
        }
    }
    function inputCampo(campo){
        validarBoton()
        if(campo == "ABREV"){
            if(emptyString(abreviaturas)){
                malabrev = true
            }
            else{
                malabrev = false
            }
        }
    }
    async function guardar(){
        let data = {
            abreviaturas,
            nombre,
            descripcion
        }
        
        try{
            if(iddiag != "0"){
                await pb.collection('diagnosticos').update(iddiag,data)
            }
            else{
                await pb.collection('diagnosticos').create(data)
            }
            let records=await pb.collection('diagnosticos').getFullList()
            diagnosticos = records
            filterupdate()    
            Swal.fire("Éxito guardar","Se pudo guardar el diagnóstico","success")

        }
        catch(err){
            console.error(err)
            Swal.fire("Error guardar","No se pudo guardar el diagnóstico","error")
        }
    }
    async function eliminar(id){

        try{
            await pb.collection("diagnosticos").delete(id)
            let records=await pb.collection('diagnosticos').getFullList()
            diagnosticos = records
            filterupdate()
            Swal.fire("Éxito eliminar","Se pudo eliminar el diagnóstico","success")
        }
        catch(err){
            console.error(err)
            Swal.fire("Error eliminar","No se pudo eliminar el diagnóstico","error")
        }
        
    }
    onMount(async()=>{
        let records=await pb.collection('diagnosticos').getFullList()
        diagnosticos = records
        filterupdate()
    })
</script>
<Navbarr>
    <div class="px-1 lg:px-4 mx-1 lg:mx-4">
        <div class="w-full grid justify-items-left mx-1 lg:mx-4">
            <h1 class="">
                <span class="text-xl font-bold italic">Diagnosticos</span>
            </h1>
        </div>
        <div class="grid lg:grid-cols-2 m-1 gap-2 lg:gap-10 mb-2 mt-1 mx-1 lg:mx-4" >
            <div class="w-11/12 lg:w-full">
                <label class="input input-bordered flex items-center gap-2">
                    <input type="text" class="grow" placeholder="Buscar por la abreviatura o el nombre.." bind:value={buscar} on:input={filterupdate} />
                </label>
            </div>
            <div class="w-full">
                <button class="btn btn-primary text-white " on:click={()=>openModal("0")}>
                    <span class="text-xl">Nuevo</span>
                </button>
            </div>
        </div>
        <div class="w-full grid justify-items-center overflow-x-auto">
            <table class="table table-lg w-full" >
                <thead>
                    <tr>
                        <th class="text-base w-3/12"  >Abreviatura</th>
                        <th class="text-base w-3/12"  >Nombre</th>
                        <th class="text-base w-3/12"  >Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {#each diagnosticosrow as d}
                        <tr>
                            <td class="text-base">
                                {d.abreviaturas}
                            </td>
                            <td class="text-base">
                                {d.nombre}
                            </td>
                            <td class="flex gap-2">
                                <div class="tooltip" data-tip="Editar">
                                    <button on:click={()=>openModal(d.id)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-5">
                                        <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32L19.513 8.2Z" />
                                        </svg>
                                    </button>
                                </div>
                                <div class="tooltip" data-tip="Eliminar">
                                    <button on:click={()=>eliminar(d.id)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-5">
                                        <path fill-rule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z" clip-rule="evenodd" />
                                        </svg>            
                                    </button>
                                </div>
                            </td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>
    </div>
</Navbarr>
<dialog id="formModal" class="modal modal-middle">
    <div class="modal-box w-11/12 max-w-1md">
        {#if iddiag=="0"}
            <h3 class="text-lg font-bold">Nuevo diagnóstico</h3>  
        {:else}
            <h3 class="text-lg font-bold">Editar diagnóstico</h3> 
        {/if}
        <div class="form-control">
            <label for = "abrev" class="label">
                <span class="label-text text-base">Abreviatura</span>
            </label>
            <label class="input-group">
                <input id ="abrev" type="text"  class="input input-bordered" bind:value={abreviaturas} on:input={()=>inputCampo("ABREV")}/>
            </label>
            {#if malabrev}
                <div class={`label `}>
                    <span class="label-text-alt text-red-400">Error debe escribir la abreviatura</span>
                </div>
            {/if}
            <label for = "nombre" class="label">
                <span class="label-text text-base">Nombre</span>
            </label>
            <label class="input-group">
                <input id ="nombre" type="text"  class="input input-bordered" bind:value={nombre}/>
            </label>
            <label for = "desc" class="label">
                <span class="label-text text-base">Descripcion</span>
            </label>
            <label class="input-group">
                <textarea class="textarea textarea-bordered h-20" bind:value={descripcion} placeholder=""></textarea>
            </label>  
        </div>
        <div class="modal-action justify-start">
            <form method="dialog">
              <!-- if there is a button, it will close the modal -->
              <button class="btn btn-success" disabled={!botonhabilitado} on:click={guardar}>Guardar</button>
              <button class="btn btn-error">Cancelar</button>
            </form>
        </div>
    </div>
</dialog>