<script>
    import Navbarr from '$lib/Navbarr.svelte';
    import { browser } from "$app/environment"
    import Swal from 'sweetalert2'
    import PocketBase from 'pocketbase'
    import { onMount } from 'svelte';
    import turnos from "$lib/turnos"
    import {isCoordinadora} from "$lib/permisos"
    let ruta = import.meta.env.VITE_RUTA
    const pb = new PocketBase(ruta);
    const HOY = new Date().toISOString().split("T")[0]
    //Datos parte
    let idparte = ""
    let parte = ""
    let cadenaconsentimientos = ""
    let cadenaentran = ""
    let cadenasalen = ""
    let cadenaunidades = ""
    let cadenasituaciones = ""

    let consentimientos = []
    let entran = []
    let salen = []
    let unidades = []
    let situaciones = []



    let turno = "man"
    let fecha = HOY
    let malfecha = false
    let botonhabilitado = false
    let malparte = false

    let fechadesde = ""
    let fechahasta = ""
    let partesrow = []
    let partes = []
    let idabrazadora = ""
    
    onMount(async ()=>{
        if(browser){
            idabrazadora = JSON.parse(localStorage.getItem("pocketbase_auth")).model.id
        }
        const recordp = await pb.collection('partes').getFullList({
            sort:"-fecha"
        })
        partes = recordp
        partesrow = partes
    })
    function isEmpty(str) {
        return (!str || str.length === 0 );
    }
    function validarBoton(){
        botonhabilitado = true
        
        if(isEmpty(fecha)){
            botonhabilitado = false    
        }
    }
    function quitarConsentimiento(p_c){
        consentimientos  = consentimientos.filter(c=>c!=p_c)
    }
    function inputconsentimiento(){
        if(cadenaconsentimientos.slice(-1)==","){
            let s = cadenaconsentimientos.slice(0,-1)
            
            consentimientos.push(s)
            consentimientos = consentimientos
            cadenaconsentimientos = ""
        }
    }
    function quitarEntran(p_c){
        entran  = entran.filter(c=>c!=p_c)
    }
    function inputEntran(){
        if(cadenaentran.slice(-1)==","){
            let s = cadenaentran.slice(0,-1)
            
            entran.push(s)
            entran = entran
            cadenaentran = ""
        }
    }
    function quitarSalen(p_c){
        salen  = salen.filter(c=>c!=p_c)
    }
    function inputSalen(){
        if(cadenasalen.slice(-1)==","){
            let s = cadenasalen.slice(0,-1)
            
            salen.push(s)
            salen = salen
            cadenasalen = ""
        }
    }
    function quitarUnidades(p_c){
        //Va traer problemas el unidades
        unidades  = unidades.filter(c=>c!=p_c)
    }
    function inputUnidades(){
        if(cadenaunidades.slice(-1)==","){
            let s = cadenaunidades.slice(0,-1)
            
            unidades.push(s)
            unidades = unidades
            cadenaunidades = ""
        }
    }
    function quitarSituaciones(p_c){
        situaciones  = situaciones.filter(c=>c!=p_c)
    }
    function inputSituaciones(){
        if(cadenasituaciones.slice(-1)==","){
            let s = cadenasituaciones.slice(0,-1)
            
            situaciones.push(s)
            situaciones = situaciones
            cadenasituaciones = ""
        }
    }
    function onchange(inputName){
        validarBoton()
        malparte = false
        malfecha = false
        if(inputName =="PARTE"){
            if(isEmpty(parte)){
                
                malparte = true
            }
            
        }
        if(inputName =="FECHA"){
            if(isEmpty(fecha)){
                
                malfecha = true
            }
            
        }
        

    }
    
    async function guardar(){
        if(!isCoordinadora()){
            Swal.fire("Error permisos","No tienes permisos de edicion","error")
            return
        }
        if(malfecha){
            Swal.fire("Error parte","El parte tiene errores","error")
            return
        }
        if(idparte == "0"){
            let data = {
                parte,
                fecha:fecha +' 03:00:00.000Z',
                registrado:idabrazadora,
                turno,
                consentimientos:consentimientos.join(),
                entran:entran.join(),
                salen:salen.join(),
                unidades:unidades.join(),
                situaciones:situaciones.join()
            }
            try{
                const recordp = await pb.collection('partes').create(data)
                Swal.fire('Éxito guardar', 'Parte guardado con éxito', 'success');
            }
            catch(err){
                Swal.fire("Error guardar","No se pudo guardar el parte diario","error")
            }
            idparte = ""
            parte = ""
            fecha = HOY
        }
        else{
            let data = {
                parte,
                fecha:fecha +' 03:00:00.000Z',
                modificado:idabrazadora,
                turno,
                consentimientos:consentimientos.join(),
                entran:entran.join(),
                salen:salen.join(),
                unidades:unidades.join(),
                situaciones:situaciones.join()
            }
            try{
                const recordp = await pb.collection('partes').update(idparte,data)
                Swal.fire('Éxito modificar', 'Parte modificado con éxito', 'success');
            }
            catch(err){
                Swal.fire("Error modificar","No se pudo modificar el parte diario","error")
            }
            idparte = ""
            parte = ""
            fecha = HOY
        }
        const recordp = await pb.collection('partes').getFullList({
            sort:"-fecha"
        })
        partes = recordp
        partesrow = partes

    }
    function abrirModal(id){
        
        botonhabilitado = false
        idparte = id
        turno = ""
        parte = ""
        cadenaconsentimientos = ""
        cadenaentran = ""
        cadenasalen = ""
        cadenaunidades = ""
        cadenasituaciones = ""
        consentimientos = []
        entran = []
        salen = []
        unidades = []
        situaciones = []
        if(id!="0"){
            
            let p = partesrow.filter(ps=>ps.id==id)[0]
            parte = p.parte
            turno = p.turno
            consentimientos =  p.consentimientos.split(",")
            entran = p.entran.split(",")
            salen = p.salen.split(",")
            unidades = p.unidades.split(",")
            situaciones = p.situaciones.split(",")
            botonhabilitado = true
        }
        formParte.showModal()
        
    }
    async function eliminar(id){
        if(!isCoordinadora()){
            Swal.fire("Error permisos","No tienes permisos de edicion","error")
            return
        }
        Swal.fire({
            title: 'Eliminar parte',
            text: '¿Seguro que deseas eliminar el parte?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Si',
            cancelButtonText: 'No'
        }).then(async result => {
            if(result.value){
                idparte = id
                
                try{
                    let recordaedit = await pb.collection('partes').delete(idparte);
                    const recordp = await pb.collection('partes').getFullList({
                        sort:"-fecha"
                    })
                    partes = recordp
                    partesrow = partes
                    
                    Swal.fire('Parte eliminado!', 'Se eliminó el parte correctamente.', 'success');
                }
                catch(e){
                    Swal.fire('Acción cancelada', 'No se pudo eliminar el parte', 'error');
                }
                idabrazo = ""
            }
        })
    }
    function filterUpdate(){
        partesrow = partes
        if(fechadesde!=""){
            partesrow = partesrow.filter(p=>p.fecha>fechadesde)
        }
        if(fechahasta!=""){
            partesrow = partesrow.filter(p=>p.fecha<fechahasta)
        }
    }
    
    function cerrar(){
        idparte = ""
        parte = ""
        turno = ""
    }
    
</script>
<Navbarr>
    <div class="grid grid-cols-2 lg:grid-cols-3 mx-1 lg:mx-10 mb-1" >
        <div class="">
            <label class="block uppercase tracking-wide text-xs font-bold mb-2" for="grid-first-name">
              Fecha desde
            </label>
            <input id ="fechadesde" type="date"  class="input input-bordered" bind:value={fechadesde} on:change={filterUpdate}/>
        </div>
        <div class="">
            <label class="block uppercase tracking-wide text-xs font-bold mb-2" for="grid-first-name">
              Fecha Hasta
            </label>
            <input id ="fechadesde" type="date"  class="input input-bordered" bind:value={fechahasta} on:change={filterUpdate}/>
        </div>
        <div class="">
            <button class="btn btn-primary text-white mt-1 lg:mt-4" on:click={()=>abrirModal("0")}>
                <span class="text-xl">Nuevo parte</span>
            </button>  
          </div>
    </div>
    <div class="w-full grid justify-items-left mx-1 lg:mx-10 mt-3">
        <h1 class="text-xl font-bold italic">PARTES DIARIOS</h1>  
    </div>
    <table class="table table-lg w-full lg:mx-10">
        <thead>
            <tr>
                <th class="text-base ml-3 pl-3 mr-1 pr-1 ">Fecha</th>
                <th class=" hidden text-base ml-3 pl-3 mr-1 pr-1 ">Turno</th>
                <th class="text-base mx-1 px-1">Parte</th>
                <th class="hidden text-base mx-1 px-1">Acciones</th>
            </tr>
        </thead>
        <tbody>
            {#each partesrow as p}
                <tr on:click={()=>abrirModal(p.id)}>
                    <td class="text-base ml-3 pl-3 mr-1 pr-1 lg:ml-10">{new Date(p.fecha).toLocaleDateString() } <br> {p.turno}</td>
                    <td class="hidden text-base mx-1 px-1">{p.turno}</td>
                    <td class="text-base mx-1 px-1">
                        {p.parte}
                    </td>
                    <td class="hidden flex gap-2 text-base mx-1 px-1">
                        <div class="tooltip" data-tip="Editar">
                            <button on:click={()=>abrirModal(p.id)}>
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-4">
                                <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32L19.513 8.2Z" />
                              </svg>
                            </button>
                        </div>
                        <div class="tooltip" data-tip="Eliminar">
                            <button on:click={()=>eliminar(p.id)}>
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-4">
                                <path fill-rule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z" clip-rule="evenodd" />
                              </svg>            
                            </button>
                        </div>
                    </td>
                </tr>

            {/each}
    </table>
    
</Navbarr>
<dialog id="formParte" class="modal">
    <div class="modal-box w-11/12 max-w-xl">
        <form method="dialog">
            <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
        </form>
        {#if idparte=="0"}
            <h3 class="text-lg font-bold">Nuevo parte</h3>
        {:else}
            <h3 class="text-lg font-bold">Editar parte</h3>
        {/if}
        <div class="form-control">
            <label for="fecha" class="label">
                <span class="label-text text-base">Fecha*</span>
            </label>
            <label class="input-group">
                <input id ="fecha" type="date" 
                class={`input input-bordered w-3/4 lg:w-1/2 ${malfecha?"input-error":""}`}
                    bind:value={fecha}
                    on:change={()=>onchange("FECHA")}
                    
                    
                />
                <div class={`label ${malfecha?"":"hidden"}`}>
                    <span class="label-text-alt text-red-400">Error debe escribir una fecha</span>
                </div>
            </label>
            <div>
                <div class="mb-4 lg:mb-0">
                    <div class="label">
                        <span class="label-text">Turno</span>
                    </div>
                    <select class="select select-bordered " bind:value={turno}>
                        {#each turnos as t}
                            <option value={t.nombre}>{t.nombre}</option>
                        {/each}
                    </select>
                </div>
            </div>
            <div class="mx-1">
                <div class="mb-4 lg:mb-1 w-full lg:w-2/3">
                    <label class="form-control">
                        <div class="label">
                            <span class="label-text">Parte</span>                    
                        </div>
                        <textarea style="line-height: 1.3;" class="textarea textarea-bordered h-32" bind:value={parte} on:change={()=>onchange("PARTE")}  on:input={validarBoton} placeholder=""></textarea>
                    </label>
                </div>
            </div>
            <!--Consentimientos-->
            <div class="mx-1">
                <div class="mb-4 lg:mb-1 w-full lg:w-2/3">
                    <div class="label">
                        <span class="label-text">Consentimientos entregados</span> 
                        <span class="label-text">Ingresalos separados por coma</span> 
                    </div>
                    <input type="text"
                        class={`
                            input input-bordered w-full 
                        `}
                        bind:value={cadenaconsentimientos}
                        on:input={inputconsentimiento}
                    />
                    {#if consentimientos.length != 0}
                        <div class="flex-row">
                            {#each consentimientos as c}
                                <button class="mt-1" on:click={()=>quitarConsentimiento(c)}>
                                    <div class="badge badge-primary badge-outline">
                                        {c} 
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                                        </svg>
                                    </div>
                                </button> 
                            {/each}
                            
                        </div>
                    {/if}
                    
                </div>
            </div>
            <!--Entran-->
            <div class="mx-1">
                <div class="mb-4 lg:mb-1 w-full lg:w-2/3">
                    <div class="label">
                        <span class="label-text">Entran al programa</span>                    
                        <span class="label-text">Ingresalos separados por coma</span> 
                    </div>
                    <input type="text"
                        class={`
                            input input-bordered w-full 
                        `}
                        bind:value={cadenaentran}
                        on:input={inputEntran}
                    />
                    {#if entran.length != 0}
                        <div class="flex-row">
                            {#each entran as c}
                                <button class="mt-1" on:click={()=>quitarEntran(c)}>
                                    <div class="badge badge-primary badge-outline">
                                        {c} 
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                                        </svg>
                                    </div>
                                </button> 
                            {/each}
                            
                        </div>
                    {/if}
                    
                </div>
            </div>
            <!--Salen-->
            <div class="mx-1">
                <div class="mb-4 lg:mb-1 w-full lg:w-2/3">
                    <div class="label">
                        <span class="label-text">Salen del programa</span>            
                        <span class="label-text">Ingresalos separados por coma</span>         
                    </div>
                    <input type="text"
                        class={`
                            input input-bordered w-full 
                        `}
                        bind:value={cadenasalen}
                        on:input={inputSalen}
                    />
                    {#if salen.length != 0}
                        <div class="flex-row">
                            {#each salen as c}
                                <button class="mt-1" on:click={()=>quitarSalen(c)}>
                                    <div class="badge badge-primary badge-outline">
                                        {c} 
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                                        </svg>
                                    </div>
                                </button> 
                            {/each}
                            
                        </div>
                    {/if}
                    
                </div>
            </div>
            <!--Unidades-->
            <div class="mx-1">
                <div class="mb-4 lg:mb-1 w-full lg:w-2/3">
                    <div class="label">
                        <span class="label-text">Unidades</span>                    
                        <span class="label-text">Ingresalos separados por coma</span> 
                    </div>
                    <input type="text"
                        class={`
                            input input-bordered w-full 
                        `}
                        bind:value={cadenaunidades}
                        on:input={inputUnidades}
                    />
                    {#if unidades.length != 0}
                        <div class="flex-row">
                            {#each unidades as c}
                                <button class="mt-1" on:click={()=>quitarUnidades(c)}>
                                    <div class="badge badge-primary badge-outline">
                                        {c} 
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                                        </svg>
                                    </div>
                                </button> 
                            {/each}
                            
                        </div>
                    {/if}
                    
                </div>
            </div>
            <!--Situaciones-->
            <div class="mx-1">
                <div class="mb-4 lg:mb-1 w-full lg:w-2/3">
                    <div class="label">
                        <span class="label-text">Situaciones especiales</span>        
                        <span class="label-text">Ingresalos separados por coma</span>             
                    </div>
                    <input type="text"
                        class={`
                            input input-bordered w-full 
                        `}
                        bind:value={cadenasituaciones}
                        on:input={inputSituaciones}
                    />
                    {#if situaciones.length != 0}
                        <div class="flex-row">
                            {#each situaciones as c}
                                <button class="mt-1" on:click={()=>quitarSituaciones(c)}>
                                    <div class="badge badge-primary badge-outline">
                                        {c} 
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                                        </svg>
                                    </div>
                                </button> 
                            {/each}
                            
                        </div>
                    {/if}
                    
                </div>
            </div>
            
        </div>
        <div class="modal-action justify-start">
            <form method="dialog">
              <!-- if there is a button, it will close the modal -->
              <button class="btn btn-success" disabled='{!botonhabilitado}' on:click={guardar}>Guardar</button>
              <button class="btn btn-neutral" on:click={cerrar}>Cancelar</button>
              {#if idparte != "0"}
                <button class="btn btn-error" on:click={()=>eliminar(idparte)}>Eliminar</button>
              {/if}
            </form>
        </div>
    </div>
</dialog>
