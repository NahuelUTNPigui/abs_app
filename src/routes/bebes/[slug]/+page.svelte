<script>
    import { browser } from "$app/environment"
    import Navbarr from '$lib/Navbarr.svelte';
    import PocketBase from 'pocketbase'
    import { onMount } from 'svelte';
    import { page } from '$app/stores';
    import { goto } from '$app/navigation';
    import unidades from '$lib/ubicaciones'
    import guardarHistorial from "$lib/bd/historialbebe"
    import Swal from 'sweetalert2'
    import sexos from "$lib/sexo"
    import disponibilidades from "$lib/disponibilidades"
    //Variables
    let ruta = import.meta.env.VITE_RUTA
    const pb = new PocketBase(ruta);
    const HOY = new Date().toISOString().split("T")[0]
    let prioridades = [{id:1,desc:"ALTA"},{id:2,desc:"BAJA"}]
    let bebe404=false
    let diagnosticos = []
    let diagnosticosfilter = []
    //Atributos bebe
    // Mama
    let nombremama=""
    let apellidomama = ""
    let edadmama=""
    let procedencia = ""
    //bebe
    let idbebe = "0"
    let nombrebebe=""
    let fechaingreso = ""
    let fechaegreso = ""
    let disponible = true
    let fechanacimiento = ""
    let prioridad = 1 
    let pesonacimiento = ""
    let edadgestacional = ""
    let maternidad = false
    let disponibilidad = ""
    
    let unidad = "Prealta"
    let sexo = ""
    let pesoinicial = ""
    let observacion=""
    //Es una lista
    let cadenadiagnostico = ""
    let diagnostico = []
    let isOpenDiagnostico = false
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
    
    //Metodos
    onMount(async()=>{
        idbebe = $page.params.slug
        const diagsrecord = await pb.collection('diagnosticos').getFullList()
        diagnosticos = diagsrecord
        diagnosticosfilter = diagnosticos
        if(idbebe!="0"){
            // Debo hacer un try and catch
            try{
                const record = await pb.collection('bebes').getOne(idbebe)
                nombrebebe = record.nombre
                
                nombremama = record.nombremama
                
                apellidomama = record.apellidomama
                
                fechaingreso = record.fechaingreso.split(' ')[0]
                
                prioridad = record.prioridad
                
                fechanacimiento = record.fechanacimiento.split(' ')[0]
                
                disponible = record.disponible
                
                edadmama = record.edadmadre
                
                procedencia = record.procedencia
                
                edadgestacional = record.semanasgestacional
                
                maternidad = record.maternidadnacimiento
                
                //Hace falta procesamiento
                diagnostico = record.diagnostico.split(",")
                
                fechaegreso = record.fechaegreso?record.fechaegreso.split(' ')[0]:""
                
                pesonacimiento = record.peso
                
                unidad = record.unidad
                disponibilidad = record.disponibilidad
                
                sexo = record.sexo
                pesoinicial = record.pesoinicial
                observacion = record.observacion
                if(fechaegreso!=''){
                    confechaegreso = true
                }
                try{
                    const recorda = await pb.collection('users').getOne(record.abrazadora) 
                    nombreabrazadora = `${recorda.apellido}, ${recorda.name}`
                }
                catch(errabz){
                    nombreabrazadora = ""
                }
                

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
                disponibilidad = ""
                edadmama = 0
                procedencia = ""
                pesonacimiento = 0
                edadgestacional = 0
                sexo = ""
                maternidad = false
                diagnostico = []
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
            edadmama = ""
            procedencia = ""
            pesonacimiento = ""
            edadgestacional = ""
            maternidad = false
            diagnostico = []
            sexo = ""
            pesoinicial = ""
            observacion = ""
            disponibilidad = ""
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
                malnombremadre = false
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
                    diagnostico:diagnostico.join(),
                    unidad,
                    peso:pesonacimiento,
                    abrazadora,
                    sexo,
                    disponibilidad,
                    pesoingreso:pesoinicial,
                    observacion
                }
                try{
                    
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
                    
                    disponibilidad,
                    maternidadnacimiento : maternidad,
                    semanasgestacional :edadgestacional,
                    diagnostico : diagnostico.join(),
                    unidad,
                    sexo,
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
                    
                    await pb.collection('bebes').update(idbebe,data)
                    //Vamos a hacerlo como fertil con una funcion especiañ
                    //const recordnewhistorial = await pb.collection('historialesbebe').create(datah);
                    
                    await guardarHistorial(pb,idbebe,"Editar")
                    goto("/bebes")
                    Swal.fire('Éxito guardar', 'Bebé editado con éxito', 'success');
                }
                catch(e){
                    console.error(e)
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
    function inputdiagnostico(){
        diagnosticosfilter = diagnosticos.filter(d=>d.abreviaturas.toLocaleLowerCase().startsWith(cadenadiagnostico.toLocaleLowerCase()))
        diagnosticosfilter = diagnosticosfilter
        isOpenDiagnostico = true
        let ultima = cadenadiagnostico.slice(-1)

        if(ultima == ","){
            
            let abreviatura = cadenadiagnostico.slice(0,-1)
            let repetido = diagnostico.filter(d=>d==abreviatura).length != 0
            if(repetido){
                Swal.fire("Repetido","Ya existe este diagnostico","info")
                cadenadiagnostico = ""
                return
            }
            diagnostico.push(abreviatura)
            cadenadiagnostico = ""
            
            diagnostico = diagnostico
            isOpenDiagnostico = false
            diagnosticosfilter = diagnosticos
        }
    }
    function clickOption(diag){
        if(dentroDiagnostico(diag)){
            return 
        }
        let dia = diagnosticos.filter(di=>di.id == diag.id)[0]
        diagnostico.push(dia.abreviaturas)
        diagnostico = diagnostico
        isOpenDiagnostico = false
        diagnosticosfilter = diagnosticos
    }
    function dentroDiagnostico(d){
        let dia = diagnostico.filter(di=>di == d.abreviaturas)
        return dia.length > 0
    }
    function quitarDiagnostico(diag){
        diagnostico = diagnostico.filter(d=>d != diag)
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
                        bind:value={nombremama}
                        on:change={()=>onChangeInput("NOMBREMAMA")}
                        
                        
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
                        bind:value={apellidomama}
                        on:change={()=>onChangeInput("APELLIDOMAMA")} 
                        
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
        <h3 class="text-xl mx-1 font-semibold mb-1 lg:mb-0 text-left">
            Datos bebé
        </h3>
        <div class="grid grid-cols-1 lg:grid-cols-5 lg:gap-6 mx-1">
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
            <div class="w-full">
                <div class="mb-4 lg:mb-0">
                    <div class="label">
                        <span class="label-text">Sexo</span>
                    </div>
                    <select class="select select-bordered " bind:value={sexo}>
                        {#each sexos as s}
                            <option value={s.id}>{s.nombre}</option>
                        {/each}
                    </select>
                </div>
            </div>
            <div class="mb-4 lg:mb-0">
                <label for = "peso" class="label">
                    <span class="label-text text-base">Peso ingreso(gramos)</span>
                </label>
                <label class="input-group">
                    <input id ="peso" type="text"  class="input input-bordered" bind:value={pesoinicial}/>
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
                <select class="select select-bordered" 
                    bind:value={maternidad}>
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
                        bind:value={fechanacimiento}
                        on:change={()=>onChangeInput("NACIMIENTO")}
                        
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
                        bind:value={fechaingreso}
                        on:change={()=>onChangeInput("INGRESO")}
                        
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
            <div class="w-full">
                <div class="mb-4 lg:mb-0">
                    <div class="label">
                        <span class="label-text">Disponibilidad</span>
                    </div>
                    <select class="select select-bordered " bind:value={disponibilidad}>
                        {#each disponibilidades as d}
                            <option value={d.id}>{d.nombre}</option>
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
        <div class="mx-1">
            <div class="mb-4 lg:mb-1 w-full lg:w-2/3">
                <div class="label">
                    <span class="label-text">Diagnostico</span>                    
                </div>
                <input type="text"
                    class={`
                        input input-bordered w-full 
                    `}
                    bind:value={cadenadiagnostico} 
                    on:input={inputdiagnostico} 
                    on:click={()=>isOpenDiagnostico = !isOpenDiagnostico}
                    
                >
                {#if isOpenDiagnostico}
                <div 
                            class={`
                                absolute z-10 mt-0  rounded-md shadow-lg   
                                bg-white border-gray-300 dark:border-gray-600 dark:bg-gray-800 text-gray-900 dark:text-gray-100
                            `}
                        >
                            <ul 
                                class="
                                    text-base max-h-40 focus:outline-none sm:text-sm overflow-y-auto 
                                    w-80    
                                "
                            >
                                {#each diagnosticosfilter as d}
                                    <li class={`cursor-default hover:bg-purple-100 hover:text-purple-800 dark:hover:text-purple-800  dark:text-white `}>
                                        <button
                                            class={`text-start w-full relative py-2 pl-3 select-none pr-9 bg-transparent`}
                                            on:click={()=>clickOption(d)}
                                        >   
                                        <span
                                            class={`
                                                
                                                truncate
                                                ${dentroDiagnostico(d)?"font-semibold":"font-normal"}
                                            `}
                                        >
                                            {d.abreviaturas}
                                        </span>
                                        {#if dentroDiagnostico(d)}
                                        <span 
                                            class="absolute inset-y-0 right-0 flex items-center pr-4 text-green-600"
                                        >
                                            <svg class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path
                                                    fillRule="evenodd"
                                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </span>
                                        {/if}
                                        </button>
                                    </li>
                                {/each}
                            </ul>
                        </div>
                {/if}
                {#if diagnostico.length != 0}
                    <div class="flex-row">
                    {#each diagnostico as d}
                            <button class="mt-1" on:click={()=>quitarDiagnostico(d)}>
                                <div class="badge badge-primary badge-outline">
                                    {d}
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
        <div class="grid mx-1">
            <div class="mb-4 lg:mb-1 w-full lg:w-2/3">
                <label class="form-control">
                    <div class="label">
                        <span class="label-text">Observacion</span>                    
                    </div>
                    <textarea style="line-height: 1.3;" class="textarea textarea-bordered h-36" bind:value={observacion} placeholder=""></textarea>
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
