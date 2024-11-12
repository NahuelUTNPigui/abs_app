<script>
    import { browser } from "$app/environment"
    import Navbarr from '$lib/Navbarr.svelte';
    import PocketBase from 'pocketbase'
    import { onMount } from 'svelte';
    import { page } from '$app/stores';
    import { goto } from '$app/navigation';
    import unidades from '$lib/ubicaciones'
    import Swal from 'sweetalert2'
    //Variables
    let ruta = import.meta.env.VITE_RUTA
    const pb = new PocketBase(ruta);
    const HOY = new Date().toISOString().split("T")[0]
    let prioridades = [{id:1,desc:"ALTA"},{id:2,desc:"BAJA"}]
    let bebe404=false
    //Atributos bebe
    // Mama
    let nombremama=""
    let apellidomama = ""
    let edadmama=0
    let procedencia = ""
    //bebe
    let idbebe = "0"
    let nombrebebe=""
    let fechaingreso = ""
    let fechaegreso = ""
    let disponible = true
    let fechanacimiento = ""
    let prioridad = 1 
    let pesonacimiento = 0
    let edadgestacional = 0
    let maternidad = false
    let diagnostico = ""
    let unidad = "Prealta"
    //Abrazadora
    let abrazadora=""
    let nombreabrazadora = ""
    let confechaegreso = false
    //validar form
    let malnombre=false
    let malnombremadre=false
    let malapellidomadre=false
    let malnacimiento=false
    let malingreso=false
    let botonhabilitado=false
    //Informacion vieja 
    let olddata={
        nombre:"",
        nombremama,
        apellidomama,
        fechaingreso:"" ,
        fechanacimiento:"",
        procedencia,
        edadmadre:edadmama,
        prioridad,
        disponible : true,
        maternidadnacimiento : "",
        semanasgestacional :"",
        diagnostico,
        unidad,
        peso:""
    }
    //Metodos
    onMount(async()=>{
        idbebe = $page.params.slug
        if(idbebe!="0"){
            // Debo hacer un try and catch
            try{
                const record = await pb.collection('bebes').getOne(idbebe)
                nombrebebe = record.nombre
                olddata.nombre = record.nombre
                nombremama = record.nombremama
                olddata.nombremama = record.nombremama
                apellidomama = record.apellidomama
                olddata.apellidomama = record.apellidomama
                fechaingreso = record.fechaingreso.split(' ')[0]
                olddata.fechaingreso = record.fechaingreso
                prioridad = record.prioridad
                olddata.prioridad = record.prioridad
                fechanacimiento = record.fechanacimiento.split(' ')[0]
                olddata.fechanacimiento = record.fechanacimiento
                disponible = record.disponible
                olddata.disponible = record.disponible
                edadmama = record.edadmadre
                olddata.edadmadre = record.edadmadre
                procedencia = record.procedencia
                olddata.procedencia = record.procedencia
                edadgestacional = record.semanasgestacional
                olddata.semanasgestacional = record.semanasgestacional
                maternidad = record.maternidadnacimiento
                olddata.maternidadnacimiento = record.maternidadnacimiento
                diagnostico = record.diagnostico
                olddata.diagnostico = record.diagnostico
                fechaegreso = record.fechaegreso?record.fechaegreso.split(' ')[0]:""
                olddata.data = record.fechaegreso
                pesonacimiento = record.peso
                olddata.peso = record.peso
                unidad = record.unidad
                olddata.unidad = record.unidad
                if(fechaegreso!=''){
                    confechaegreso = true
                }

                const recorda = await pb.collection('users').getOne(record.abrazadora) 
                nombreabrazadora = `${recorda.apellido}, ${recorda.name}`

                botonhabilitado = true
                
            }catch(e){
                Swal.fire('Error editar', 'No existe el bebe', 'error');
                nombrebebe = ""
                nombremama = ""
                apellidomama = ""
                fechaingreso = ""
                fechaegreso = ""
                prioridad = 1
                fechanacimiento = ""
                edadmama = 0
                procedencia = ""
                pesonacimiento = 0
                edadgestacional = 0
                maternidad = false
                diagnostico = ""
                unidad = "Prealta"
                bebe404 = true
                botonhabilitado = false
            }      
        }
        else{
            if(browser){
                abrazadora = JSON.parse(localStorage.getItem("pocketbase_auth")).model.id
            }
            nombrebebe = ""
            nombremama = ""
            apellidomama = ""
            fechaingreso = ""
            fechaegreso = ""
            prioridad = 1
            fechanacimiento = ""
            edadmama = 0
            procedencia = ""
            pesonacimiento = 0
            edadgestacional = 0
            maternidad = false
            diagnostico = ""
            unidad = "Prealta"
            
        }
    })
    function validarform(){
        if(bebe404){
            return
        }
        if(idbebe=="0"){
            if(nombrebebe.length==0){
                Swal.fire('Error guardar', 'El nombre del bebe esta vacio', 'error');
                return false
            }            
            if(nombremama.length==0){
                Swal.fire('Error guardar', 'El nombre de la madre esta vacio', 'error');
                return false
            }
            if(apellidomama.length == 0){
                Swal.fire('Error guardar', 'El apellido de la madre esta vacio', 'error');
                return false
            }
            if(fechanacimiento.length == 0){
                Swal.fire('Error guardar', 'Debe seleccionar la fecha de nacimiento', 'error');
                return false
            }
            if(fechaingreso.length == 0){
                Swal.fire('Error guardar', 'Debe seleccionar la fecha de ingreso', 'error');
                return false
            }
            return true
        }
        else{
            if(nombrebebe.length==0){
                Swal.fire('Error editar', 'El nombre del bebe esta vacio', 'error');
                return false
            }            
            if(nombremama.length==0){
                Swal.fire('Error editar', 'El nombre de la madre esta vacio', 'error');
                return false
            }
            if(apellidomama.length == 0){
                Swal.fire('Error editar', 'El apellido de la madre esta vacio', 'error');
                return false
            }
            if(fechanacimiento.length == 0){
                Swal.fire('Error editar', 'Debe seleccionar la fecha de nacimiento', 'error');
                return false
            }
            if(fechaingreso.length == 0){
                Swal.fire('Error editar', 'Debe seleccionar la fecha de ingreso', 'error');
                return false
            }
            return true
        }
        
    }
    
    function onChangeInput(inputNombre){
        if(bebe404){
            return
        }
        botonhabilitado = true

        if(nombrebebe.length==0){
            botonhabilitado = false
        }
        if(nombremama.length==0){
            botonhabilitado = false
            
        }
        if(apellidomama.length == 0){
            botonhabilitado = false
            
        }
        if(fechanacimiento.length == 0){
            botonhabilitado = false
            
        }
        if(fechaingreso.length == 0){
            botonhabilitado = false

        }
        if(inputNombre == "NOMBREBEBE"){
            if(nombrebebe.length==0){
                malnombre = true
            }
            else{
                malnombre = false
            }
        }
        if(inputNombre == "NOMBREMAMA"){
            if(nombremama.length==0){
                malnombremadre = true
            }else{
                malnombre = false
            }
        }
        if(inputNombre == "APELLIDOMAMA"){
            if(apellidomama.length == 0){
                
                malapellidomadre = true
            }else{
                malapellidomadre = false
            }
        }
        if(inputNombre =="NACIMIENTO"){
            if(fechanacimiento.length == 0){
                
                malnacimiento = true
            }
            else{
                malnacimiento = false
            }
        }
        if(inputNombre =="INGRESO"){
            if(fechaingreso.length == 0){
                
                malingreso = true
            }
            else{
                malingreso =false
            }
        }        
    }
    async function guardar(){
        if(validarform()){
            if(idbebe=="0"){
                let data={
                    nombre:nombrebebe,
                    nombremama,
                    apellidomama,
                    fechaingreso:fechaingreso +' 03:00:00.000Z' ,
                    fechanacimiento:fechanacimiento +' 03:00:00.000Z' ,
                    procedencia,
                    edadmadre:edadmama,
                    prioridad,
                    active : true,
                    disponible : true,
                    maternidadnacimiento : maternidad,
                    semanasgestacional :edadgestacional,
                    diagnostico,
                    unidad,
                    peso:pesonacimiento,
                    abrazadora
                }
                try{
                    console.log(abrazadora)
                    const recordb = await pb.collection('bebes').create(data)
                    Swal.fire('Éxito guardar', 'Bebé guardado con éxito', 'success');
                    goto("/bebes")
                }
                catch(e){
                    Swal.fire('Error guardar', 'No se pudo guardar al bebé', 'error');
                }
            }
            else{
                let data={
                    nombre:nombrebebe,
                    nombremama,
                    apellidomama,
                    fechaingreso:fechaingreso +' 03:00:00.000Z' ,
                    fechanacimiento:fechanacimiento +' 03:00:00.000Z' ,
                    procedencia,
                    edadmadre:edadmama,
                    prioridad,
                    disponible,
                    maternidadnacimiento : maternidad,
                    semanasgestacional :edadgestacional,
                    diagnostico,
                    unidad,
                    peso:pesonacimiento
                }
                if(fechaegreso != ""){

                    data.fechaegreso = fechaegreso +' 03:00:00.000Z'
                }
                else{
                    if(confechaegreso){
                        data.fechaegreso=''
                    }
                }
                try{
                    let datah ={
                        ...olddata,
                        bebe:idbebe,
                        operacion:"Edicion"
                    }
                    const recordb = await pb.collection('bebes').update(idbebe,data)
                    const recordnewhistorial = await pb.collection('historialesbebe').create(datah);
                    goto("/bebes")
                    Swal.fire('Éxito guardar', 'Bebé editado con éxito', 'success');
                }
                catch(e){
                    Swal.fire('Error guardar', 'No se pudo editar al bebé', 'error'); 
                }
                
                
            }
            
        }
        else{
            Swal.fire('Error guardar', 'Hay errores en los datos', 'error'); 
        }
    }
    function cancelar(){
        goto("/bebes/")
    }

</script>
<Navbarr>
    
    <div class="container mx-auto">
        <!--NEW-->
        <h2 class="text-2xl mx-1 font-bold mb-6 text-left">
            {#if idbebe=="0"}
                    NUEVO BEBÉ
                {:else}
                    EDITAR A: 
                {/if}
        </h2>
        {#if idbebe!="0"}
            <h2 class="text-2xl mx-1 font-bold mb-6 text-left">
                {`${apellidomama},${nombremama} (${nombrebebe})`}
            </h2>
        {/if}
        {#if idbebe!="0"}
            <h3 class="text-xl mx-1 font-semibold mb-1 lg:mb-0 text-left">
                Datos abrazadora
            </h3>
            <div class="grid lg:grid-cols-4 lg:gap-6 mx-1 mb-2">
                <label for = "nombreabrazadora" class="label">
                    <span class="label-text text-base">Abrazadora que lo registró</span>
                </label>
                <label class="input-group">
                    <input id ="nombreabrazadora" type="text"  
                        class={`input input-bordered`}
                        disabled
                        bind:value={nombreabrazadora}
                    />
                </label>
            </div>
            
        {/if}
        <h3 class="text-xl mx-1 font-semibold mb-1 lg:mb-0 text-left">
            Datos madre
        </h3>
        <div class="grid lg:grid-cols-4 lg:gap-6 mx-1 mb-2">
            <div class="mb-4 lg:mb-0">
                <label for = "nombremama" class="label">
                    <span class="label-text text-base">Nombre Madre*</span>
                </label>
                <label class="input-group">
                    <input id ="nombremama" type="text"  
                        class={`input input-bordered ${malnombremadre?"input-error":""}`}
                        on:change={()=>onChangeInput("NOMBREMAMA")}
                        bind:value={nombremama}
                    />
                    <div class={`label ${malnombremadre?"":"hidden"}`}>
                        <span class="label-text-alt text-red-400">Error debe escribir el nombre de la madre</span>
                    </div>
                </label>
            </div>
            <div class="mb-4 lg:mb-0">
                <label for = "apellidomama" class="label">
                    <span class="label-text text-base">Apellido Madre*</span>
                </label>
                <label class="input-group">
                    <input id ="apellidomama" type="text"  
                        class={`input input-bordered ${malapellidomadre?"input-error":""}`}
                        on:change={()=>onChangeInput("APELLIDOMAMA")} 
                        bind:value={apellidomama}
                    />
                    <div class={`label ${malapellidomadre?"":"hidden"}`}>
                        <span class="label-text-alt text-red-400">Error debe escribir el apellido de la madre</span>
                    </div>
                </label>
            </div>
            <div class="mb-4 lg:mb-0">
                <label for = "edadmama" class="label">
                    <span class="label-text text-base">Edad Madre*</span>
                </label>
                <label class="input-group">
                    <input id ="apellidomama" type="text"  
                        class={`input input-bordered `}                        
                        bind:value={edadmama}
                    />
                </label>
            </div>
            <div class="mb-4 lg:mb-0">
                <label for = "procedencia" class="label">
                    <span class="label-text text-base">Procedencia</span>
                </label>
                <label class="input-group">
                    <input id ="procedencia" type="text"  class="input input-bordered" bind:value={procedencia}/>
                </label>
            </div>
        </div>
        <h3 class="text-xl font-semibold mb-1 lg:mb-0 text-left">
            Datos bebé
        </h3>
        <div class="grid lg:grid-cols-3 lg:gap-6 mx-1">
            <div class="mb-4 lg:mb-0">
                <label for = "nombre" class="label">
                    <span class="label-text text-base">Nombre*</span>
                </label>
                <label class="input-group">
                    <input id ="nombre" type="text"  
                        class={`input input-bordered ${malnombre?"input-error":""}`}
                        bind:value={nombrebebe}
                        on:change={()=>onChangeInput("NOMBREBEBE")}
                    />
                    <div class={`label ${malnombre?"":"hidden"}`}>
                        <span class="label-text-alt text-red-400">Error debe escribir el nombre del bebe</span>
                    </div>
                </label>
            </div>
            <div class="mb-4 lg:mb-0">
                <label for = "peso" class="label">
                    <span class="label-text text-base">Peso nacimiento(gramos)</span>
                </label>
                <label class="input-group">
                    <input id ="peso" type="text"  class="input input-bordered" bind:value={pesonacimiento}/>
                </label>
            </div>
            <div class="mb-4 lg:mb-0">
                <label for = "gest" class="label">
                    <span class="label-text text-base">Edad gestacional(semanas)</span>
                </label>
                <label class="input-group">
                    <input id ="gest" type="text"  class="input input-bordered" bind:value={edadgestacional}/>
                </label>
            </div>
        </div>
        
        <div class="lg:grid lg:grid-cols-3 lg:gap-6 mx-1">
            <div class="mb-4 lg:mb-0">
                <div class="label">
                    <span class="label-text">Nacio en maternidad</span>
                </div>
                <select class="select select-bordered" bind:value={maternidad}>
                    <option value={true}>{"Si"}</option>
                    <option value={false}>{"No"}</option>                        
                </select>
                
            </div>
            <div class="mb-4 lg:mb-0">
                <label for = "fechanacimiento" class="label">
                    <span class="label-text text-base">Fecha nacimiento*</span>
                </label>
                <label class="input-group ">
                    <input id ="fechanacimiento" type="date" max={HOY}
                        class={`input input-bordered w-3/4 lg:w-1/2 ${malnacimiento?"input-error":""}`}                        
                        on:change={()=>onChangeInput("NACIMIENTO")}
                        bind:value={fechanacimiento}
                    />
                    <div class={`label ${malnacimiento?"":"hidden"}`}>
                        <span class="label-text-alt text-red-400">Error debe tener una fecha de nacimiento</span>
                    </div>
                </label>
            </div>
            <div class="mb-4 lg:mb-0">
                <label for = "fechaingreso" class="label">
                    <span class="label-text text-base">Fecha ingreso*</span>
                </label>
                <label class="input-group ">
                    <input id ="fechaingreso" type="date" max={HOY}  
                        class={`input input-bordered w-3/4 lg:w-1/2 ${malingreso?"input-error":""}`}
                        on:change={()=>onChangeInput("INGRESO")}
                        bind:value={fechaingreso}
                    />
                    <div class={`label ${malingreso?"":"hidden"}`}>
                        <span class="label-text-alt text-red-400">Error debe tener una fecha de ingreso</span>
                    </div>
                </label>
            </div>
        </div>
        
        <div class="grid grid-cols-3 gap-4 sm:gap-6 md:gap-8 lg:mb-4 mx-1">
            <div class="w-full">
                <div class="mb-4 lg:mb-0">
                    <div class="label">
                        <span class="label-text">Prioridad</span>
                    </div>
                    <select class="select select-bordered " bind:value={prioridad}>
                        {#each prioridades as p}
                            <option value={p.id}>{p.desc}</option>
                        {/each}
                    </select>
                </div>
            </div>
            <div class="w-full">
                <div class="mb-4 lg:mb-0">
                    <div class="label">
                        <span class="label-text">Unidad</span>
                    </div>
                    <select class="select select-bordered " bind:value={unidad}>
                        {#each unidades as u}
                            <option value={u.nombre}>{u.nombre}</option>
                        {/each}
                    </select>
                </div>
            </div>
            {#if idbebe!="0"}
                <div class="w-full">
                    <div class="mb-4 lg:mb-0">
                        <div class="label">
                            <span class="label-text">Disponibilidad</span>
                        </div>
                        <select class="select select-bordered" bind:value={disponible}>
                            <option value={true}>{"Disponible"}</option>
                            <option value={false}>{"No disponible"}</option>                        
                        </select>
                        
                    </div>
                </div>
            {/if}
        </div>
        {#if idbebe !='0'}
            <div class="lg:grid lg:grid-cols-2 lg:gap-6 mx-1">
                <div class="mb-4 lg:mb-0">
                    <label for = "fechaegreso" class="label">
                        <span class="label-text text-base">Fecha egreso</span>
                    </label>
                    <label class="input-group">
                        <input id ="fechaegreso" type="date"  class="input input-bordered w-3/4 lg:w-1/2" bind:value={fechaegreso}/>
                    </label>
                </div>
            </div>
        {/if}
        <div class="grid mx-1">
            <div class="mb-4 lg:mb-1 w-full lg:w-2/3">
                <label class="form-control">
                    <div class="label">
                        <span class="label-text">Diagnostico</span>                    
                    </div>
                    <textarea style="line-height: 1.3;" class="textarea textarea-bordered h-36" bind:value={diagnostico} placeholder=""></textarea>
              </label>
            </div>
        </div>
        
        
        <div class="grid grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8 mx-1 mb-1">
            <div class="w-full">
                <button class="btn btn-success text-white" disabled='{!botonhabilitado}' on:click={guardar}>Guardar</button>
                
            </div>
            <div class="w-full">
                <button class="btn btn-error text-white" on:click={cancelar}>Cancelar</button>
            </div>

        </div>
        
        
    </div>

</Navbarr>
