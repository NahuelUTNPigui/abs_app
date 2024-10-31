<script>
    import Navbarr from '$lib/Navbarr.svelte';
    import PocketBase from 'pocketbase'
    import { onMount } from 'svelte';
    import { page } from '$app/stores';
    import { goto } from '$app/navigation';
    import ubicaciones from '$lib/ubicaciones'
    //Variables
    let ruta = import.meta.env.VITE_RUTA
    const pb = new PocketBase(ruta);
    const HOY = new Date().toISOString().split("T")[0]
    let prioridades = [{id:1,desc:"ALTA"},{id:2,desc:"BAJA"}]
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
    let diagnosticorich = ""
    let diagnostico = ""
    
    
    let confechaegreso = false
    //validar form
    let malnombre=false
    let malnombremadre=false
    let malapellidomadre=false
    let malnacimiento=false
    let malingreso=false
    let botonhabilitado=false
    //Metodos
    onMount(async()=>{
        idbebe = $page.params.slug
        if(idbebe!="0"){
            // Debo hacer un try and catch
            const record = await pb.collection('bebes').getOne(idbebe)
            if(record.code){
                alert("No existe el bebe")
            }
            else{
                nombrebebe = record.nombre
                nombremama = record.nombremama
                apellidomama = record.apellidomama
                fechaingreso = record.fechaingreso.split(' ')[0]
                prioridad = record.prioridad
                fechanacimiento = record.fechanacimiento.split(' ')[0]
                disponible = record.disponible
                edadmama = record.edadmama
                procedencia = record.procedencia
                edadgestacional = record.semanasgestacional
                maternidad = record.maternidadnacimiento
                diagnostico = record.diagnostico
                diagnosticorich = record.diagnosticorich
                fechaegreso = record.fechaegreso?record.fechaegreso.split(' ')[0]:""
                botonhabilitado = true
                if(fechaegreso!=''){
                    confechaegreso = true
                }
            }         
        }
        else{
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
            diagnosticorich = ""
            diagnostico = ""
            
        }
    })
    function validarform(){
        if(idbebe=="0"){
            if(nombrebebe.length==0){
                alert("El nombre no puede ser vacio")
                return false
            }            
            if(nombremama.length==0){
                alert("El nombre de la madre no pude ser vacio")
                return false
            }
            if(apellidomama.length == 0){
                alert("El apellido de la madre no puede ser vacio")
                return false
            }
            if(fechanacimiento.length == 0){
                alert("Debe tener fecha de nacimiento")
                return false
            }
            if(fechaingreso.length == 0){
                alert("Debe tener fecha de nacimiento")
                return false
            }
            return true
        }
        else{
            if(nombrebebe.length==0){
                alert("El nombre no puede ser vacio")
                return false
            }            
            if(nombremama.length==0){
                alert("El nombre de la madre no pude ser vacio")
                return false
            }
            if(apellidomama.length == 0){
                alert("El apellido de la madre no puede ser vacio")
                return false
            }
            if(fechanacimiento.length == 0){
                alert("Debe tener fecha de nacimiento")
                return false
            }
            if(fechaingreso.length == 0){
                alert("Debe tener fecha de nacimiento")
                return false
            }
            return true
        }
        
    }
    
    function onChangeInput(inputNombre){
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
                botonhabilitado = false
                malnombre = true
            }   
        }
        if(inputNombre == "NOMBREMAMA"){
            if(nombremama.length==0){
                botonhabilitado = false
                malnombremadre = true
            }
        }
        if(inputNombre == "APELLIDOMAMA"){
            if(apellidomama.length == 0){
                botonhabilitado = false
                malapellidomadre = true
            }
        }
        if(inputNombre =="NACIMIENTO"){
            if(fechanacimiento.length == 0){
                botonhabilitado = false
                malnacimiento = true
            }
        }
        if(inputNombre =="INGRESO"){
            if(fechaingreso.length == 0){
                botonhabilitado = false
                malingreso = true
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
                    edadmama,
                    prioridad,
                    active : true,
                    disponible : true,
                    maternidadnacimiento : maternidad,
                    semanasgestacional :edadgestacional,
                    diagnostico
                }
                alert("Se va a guardar el bebe")
                const recordb = await pb.collection('bebes').create(data)
                goto("/bebes")
            }
            else{
                let data={
                    nombre:nombrebebe,
                    nombremama,
                    apellidomama,
                    fechaingreso:fechaingreso +' 03:00:00.000Z' ,
                    fechanacimiento:fechanacimiento +' 03:00:00.000Z' ,
                    procedencia,
                    edadmama,
                    prioridad,
                    active : true,
                    disponible : true,
                    maternidadnacimiento : maternidad,
                    semanasgestacional :edadgestacional,
                    diagnostico
                }
                if(fechaegreso != ""){

                    data.fechaegreso = fechaegreso +' 03:00:00.000Z'
                }
                else{
                    if(confechaegreso){
                        data.fechaegreso=''
                    }
                }
                const recordb = await pb.collection('bebes').update(idbebe,data)
                goto("/bebes")
                alert("Se va a editar el bebe")
            }
            
        }
        else{
            alert("El bebe tiene errores")
        }
    }
    function cancelar(){
        goto("/bebes/")
    }

</script>
<Navbarr>
    <div class="container mx-auto">
        <!--NEW-->
        <h2 class="text-2xl font-bold mb-6 text-center">
            {#if idbebe=="0"}
                    NUEVO BEBÉ
                {:else}
                    EDITAR A: 
                {/if}
        </h2>
        {#if idbebe!="0"}
            <h2 class="text-2xl font-bold mb-6 text-center">
                {`${apellidomama},${nombremama} (${nombrebebe})`}
            </h2>
        {/if}
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
        <div class="grid lg:grid-cols-3 lg:gap-6 mx-1">
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
                <label for = "procedencia" class="label">
                    <span class="label-text text-base">Procedencia</span>
                </label>
                <label class="input-group">
                    <input id ="procedencia" type="text"  class="input input-bordered" bind:value={procedencia}/>
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
        <div class="grid mx-1">
            <div class="mb-4 lg:mb-1 w-full lg:w-2/3">
                <label class="form-control">
                    <div class="label">
                        <span class="label-text">Diagnostico</span>                    
                    </div>
                    <textarea class="textarea textarea-bordered h-24" bind:value={diagnostico} placeholder=""></textarea>
              </label>
            </div>
        </div>
        <div class="grid grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8 mx-1">
            <div class="w-full">
                <button class="btn btn-success text-white" disabled='{!botonhabilitado}' on:click={guardar}>Guardar</button>
                
            </div>
            <div class="w-full">
                <button class="btn btn-error text-white" on:click={cancelar}>Cancelar</button>
            </div>

        </div>
    </div>

</Navbarr>
