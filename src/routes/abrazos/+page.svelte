<script>
    import Navbarr from '$lib/Navbarr.svelte';
    import Swal from 'sweetalert2'
    import PocketBase from 'pocketbase'
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import ubicaciones from '$lib/ubicaciones'
    import guardarHistorial from "$lib/bd/historialbebe"
    import disponibilidades from "$lib/disponibilidades"
    let ruta = import.meta.env.VITE_RUTA
    const pb = new PocketBase(ruta);
    const HOY = new Date()
    const MAXHOY =new Date().toISOString().split("T")[0]
    let usuarioid = ""
    let escoordinador=false
    let bebes = []
    let abrazadoras = []
    let abrazadorasselect = []
    let bebesrows = []
    let bebesselect = []
    //let ubicaciones =[{nombre:"UTI1"},{nombre:"UTI2"},{nombre:"UTI3"},{nombre:"UCI1"},{nombre:"UCI2"},{nombre:"UCI3"},{nombre:"Prealta"}]
    let turnos=[{nombre:"Mañana"},{nombre:"Tarde"}]
    
    const formasordenar = [{id:"unidad"},{id:"mama"},{id:"bebe"},{id:"ultimo"}]
    let ordenar = "unidad"
    let iddisponible = ""
    let idbebe = ""
    let idabrazadora=""
    let fechaabrazo=""
    let turno = ""
    let ubicacion = ""
    let observacion = ""
    
    
    // Validar
    let malbebe = false
    let malabrazadora = false
    let malturno = false
    let malubicacion = false
    let malfecha = false
    let botonhabilitado = false
    
    function sortVoluntaria(v1,v2){
        return v1.apellido.toLowerCase().replaceAll("ñ","n")>v2.apellido.toLowerCase().replaceAll("ñ","n")?1:-1
    }
    onMount(async ()=>{
        const recordsv = await pb.collection('users').getFullList({filter:"active=true"});
        abrazadoras  = recordsv.sort((v1,v2)=>sortVoluntaria(v1,v2))
        abrazadorasselect = recordsv.sort((v1,v2)=>sortVoluntaria(v1,v2))
        abrazadorasselect.sort((a1,a2)=>a1.apellido.toLowerCase()>a2.apellido.toLowerCase()?1:-1)
        const recordsb = await pb.collection('bebes').getFullList({filter:`active=true&&fechaegreso=""`});
        
        bebes = recordsb
        
        //const record = await pb.collection('abrazos').getFirstListItem(`active=true&&bebe="${b.id}"`);
        bebesrows = []
        for(let i = 0;i<bebes.length;i++){
            let b = bebes[i]
            if(b.fechaegreso!=""){
                continue
            }
            const resultList = await pb.collection('abrazos').getFullList({
                filter:  `active=true && bebe='${b.id}'`,
                sort:"-fecha"
            });
            
            if(resultList.length > 0){
                
                let abrazo = resultList[0]
                let Difference_In_Time =HOY.getTime() - new Date(abrazo.fecha).getTime();
                // Calculating the no. of days between
                // two dates
                let Difference_In_Days =
                    Math.round
                        (Difference_In_Time / (1000 * 3600 * 24));
                b.dias = Difference_In_Days+" dias"
                b.diasnumero=Difference_In_Days
            }
            else{
                b.diasnumero = Number.MAX_VALUE
                b.dias ="Sin abrazo"
            }
            b.abrazos = resultList.length
            bebesrows.push(b)
        }
        
        ordenarBebes({id:ordenar})
        
        bebesselect = bebesrows
        bebesselect.sort((b1,b2)=>b1.apellidomama.toLocaleLowerCase()>b2.apellidomama.toLocaleLowerCase()?1:-1)
        
        let pb_json = await JSON.parse(localStorage.getItem('pocketbase_auth'))
        usuarioid = pb_json.model.id
        escoordinador = pb_json.model.coordinador
    })
    function openModal(){
        botonhabilitado = false
        
        formAbrazo.showModal()
    }
    function darAbrazo(id){
        idbebe = id
        let bebe = bebesrows.filter(b=>b.id==id)[0]
        ubicacion = bebe.unidad
        observacion = bebe.observacion    
        openModal()
    }
    function isEmpty(str) {
        return (!str || str.length === 0 );
    }
    function onChangeInput(inputName){
        botonhabilitado = true
    
        if(isEmpty(fechaabrazo)){
            botonhabilitado = false
        }
        if(isEmpty(idbebe)){
            botonhabilitado = false
        }
        if(isEmpty(idabrazadora)){
            botonhabilitado = false
        }
        if(isEmpty(turno)){
            botonhabilitado = false
        }
        if(isEmpty(ubicacion)){
            botonhabilitado = false
        }
        if(inputName=="FECHA"){
            if(isEmpty(fechaabrazo)){
                malfecha = true
            }
            else{
                malfecha = false
            }
        }
        if(inputName=="BEBE"){
            if(isEmpty(idbebe)){
                malbebe = true
            }
            else{
                malbebe = false
                let bebe = bebesrows.filter(b=>b.id==idbebe)[0]
                ubicacion = bebe.unidad 
                
                observacion = bebe.observacion
            }
        }
        if(inputName=="VOL"){
            if(isEmpty(idabrazadora)){
                malabrazadora = true
            }
            else{
                malabrazadora = false
            }
        }
        if(inputName=="UNIDAD"){
            if(isEmpty(ubicacion)){
                malubicacion = true
            }
            else{
                malubicacion = false
            }
        }
        if(inputName=="TURNO"){
            if(isEmpty(turno)){
                malturno = true
            }
            else{
                malturno = false
            }
        }

    }
    function validarform(){
        if(isEmpty(fechaabrazo)){
            Swal.fire('Error guardar','La fecha de abrazo no esta seleccionada','error')
            return false
        }
        if(isEmpty(idbebe)){
            Swal.fire('Error guardar','No hay ningun bebé seleccionado','error')
            return false
        }
        if(isEmpty(idabrazadora)){
            Swal.fire('Error guardar','No hay ninguna abrazadora seleccionada','error')
            return false
        }
        if(isEmpty(turno)){
            Swal.fire('Error guardar','No hay ningun turno seleccionado','error')
            return false
        }
        if(isEmpty(ubicacion)){
            Swal.fire('Error guardar','No hay ninguna ubicación seleccionada','error')
            return false
        }
        return true
    }
    async function guardar(){
        if(!validarform()){
            return
        }
        let b = bebes.filter(be=>be.id==idbebe)[0]
        let data={
            ubicacion,
            turno,
            fecha:fechaabrazo+" 03:00:00",
            active:true,
            bebe:idbebe,
            abrazadora:idabrazadora
        }
        try{
            
            let filter =`bebe='${idbebe}'&&abrazadora='${idabrazadora}'&&fecha~'${fechaabrazo}'` 
            //let filter =`bebe='${idbebe}'&&abrazadora='${idabrazadora}'` 
            const recordrepetido = await pb.collection('abrazos').getList(1,5,
                {
                    filter,
                    expand:"bebe,abrazadora"
                }                
            );
            if(recordrepetido.items.length != 0){
                let primerabrazo = recordrepetido.items[0]
                let nombrebebe = `${primerabrazo.expand.bebe.apellidomama},${primerabrazo.expand.bebe.nombremama} (${primerabrazo.expand.bebe.nombre})`
                let nombreabrazadora = `${primerabrazo.expand.abrazadora.apellido}, ${primerabrazo.expand.abrazadora.name}`
                let htmlmsg =`
                    <p>Ya se registró un abrazo para el bebe ${nombrebebe} con la abrazadora ${nombreabrazadora} en la fecha ${new Date(data.fecha).toLocaleDateString()}</p>
                    <p>¿Seguro que deseas registrar un nuevo abrazo?</p>
                `
                Swal.fire({
                    title: 'Guardar abrazo repetido',
                    //text: `Ya se registró un abrazo para el bebe ${nombrebebe},\n con la abrazadora ${nombreabrazadora} en la fecha ${fechaabrazo}. \n ¿Seguro que deseas registrar un nuevo abrazo?`,
                    html:htmlmsg,
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Si',
                    cancelButtonText: 'No'
                }).then(async result=>{
                    if(result.value){
                        const recorda = await pb.collection('abrazos').create(data)
                        if(observacion != b.observacion){
                            await guardarHistorial(pb,idbebe,"Abrazo")
                            await pb.collection("bebes").update(idbebe,{observacion})
                            b.observacion = observacion
                        }
                        
                        bebesrows = []
                        for(let i = 0;i<bebes.length;i++){
                            let b = bebes[i]
                            if(b.fechaegreso !=""){
                                
                                continue
                            }
                            const resultList = await pb.collection('abrazos').getList(1, 100, {
                                filter:  `active=true&&bebe="${b.id}"`,
                                sort:"-fecha"
                            });
                            if(resultList.totalItems > 0){
                                let abrazo = resultList.items[0]
                                let Difference_In_Time =HOY.getTime() - new Date(abrazo.fecha).getTime();
                                // Calculating the no. of days between
                                // two dates
                                let Difference_In_Days =
                                    Math.round
                                        (Difference_In_Time / (1000 * 3600 * 24));
                                b.dias = Difference_In_Days+" dias"
                                b.diasnumero=Difference_In_Days
                            }
                            else{
                                b.diasnumero = Number.MAX_VALUE
                                b.dias ="Sin abrazo"
                            }
                            bebesrows.push(b)
                        }
                        
                        bebesrows.sort((b1,b2)=>b1.diasnumero<b2.diasnumero?1:-1)
                        bebesrows = bebesrows
                        
                       
                        cambiarFiltro()
                        
                        Swal.fire('Éxito guardar', 'Abrazo guardado con éxito', 'success');
                    }
                })
            }
            else{
                const recorda = await pb.collection('abrazos').create(data)
                if(observacion != b.observacion){
                    await guardarHistorial(pb,idbebe,"Abrazo")
                    await pb.collection("bebes").update(idbebe,{observacion})
                    b.observacion = observacion
                }
                bebesrows = []
                for(let i = 0;i<bebes.length;i++){
                    let b = bebes[i]
                    if(b.fechaegreso!=""){
                        
                        continue
                    }
                    const resultList = await pb.collection('abrazos').getList(1, 100, {
                        filter:  `active=true&&bebe="${b.id}"`,
                        sort:"-fecha"
                    });
                    if(resultList.totalItems > 0){
                        let abrazo = resultList.items[0]
                        let Difference_In_Time =HOY.getTime() - new Date(abrazo.fecha).getTime();
                        // Calculating the no. of days between
                        // two dates
                        let Difference_In_Days =
                            Math.round
                                (Difference_In_Time / (1000 * 3600 * 24));
                        b.dias = Difference_In_Days+" dias"
                        b.diasnumero=Difference_In_Days
                    }
                    else{
                        b.diasnumero = Number.MAX_VALUE
                        b.dias ="Sin abrazo"
                    }
                    bebesrows.push(b)
                }
                        
                bebesrows.sort((b1,b2)=>b1.diasnumero<b2.diasnumero?1:-1)
                bebesrows = bebesrows
                
                cambiarFiltro()
                
                Swal.fire('Éxito guardar', 'Abrazo guardado con éxito', 'success');
            }
            
            
        }
        catch(e){
            Swal.fire('Error guardar', 'No se pudo guardar el abrazo', 'error');
        }
        idbebe = ""
        idabrazadora = ""
        turno = ""
        ubicacion = ""
        fechaabrazo = ""
        malbebe = false
        malabrazadora = false
        malubicacion = false
        malfecha = false
        malturno = false
        
    }
    function cerrar(){
        idbebe = ""
        idabrazadora = ""
        turno = ""
        ubicacion = ""
        fechaabrazo = ""
        observacion = ""
    }
    function irHistorial(){
        goto("/abrazos/historial/")
    }
    function cambiarFiltro(){
        bebesrows=bebes
        if(iddisponible !== ""){
            if(iddisponible == 0){
                bebesrows = bebesrows.filter(b=>b.disponibilidad != 3)
            }
            else{
                bebesrows = bebesrows.filter(b=>b.disponibilidad == iddisponible)
            }  
        }
        
        ordenarBebes({id:ordenar})
        //bebesrows.sort((b1,b2)=>b1.diasnumero<b2.diasnumero?1:-1)

    }
    function ordenarBebes(forma){
        ordenar = forma.id
        if(ordenar=="unidad"){
            bebesrows = bebesrows.sort((b1,b2)=>{
                if(b1.unidad>b2.unidad){
                    return 1
                }
                else if(b1.unidad < b2.unidad){
                    return -1
                }
                else{
                    if(b1.apellidomama.toLocaleLowerCase()<b2.apellidomama.toLocaleLowerCase()){
                        return -1
                    }
                    else{
                        return 1
                    }
                }
            })
        }
        else if(ordenar=="mama"){
            bebesrows =  bebesrows.sort((b1,b2)=>{
                if(b1.apellidomama.toLocaleLowerCase()<b2.apellidomama.toLocaleLowerCase()){
                        return -1
                    }
                    else{
                        return 1
                    }
            })
        }
        else if(ordenar=="bebe"){
            bebesrows =  bebesrows.sort((b1,b2)=>{
                if(b1.nombre.toLocaleLowerCase() < b2.nombre.toLocaleLowerCase()){
                    return -1
                }
                else{
                    return 1
                }
            })
        }
        else if(ordenar=="ultimo"){
            bebesrows = bebesrows.sort((b1,b2)=>b1.diasnumero<b2.diasnumero?1:-1)
        }
        bebesrows = bebesrows
    }
    function getEmojiDisp(disp){
        let d = disponibilidades.filter(di=>di.id == disp)[0]
        return d.emoji
    }
</script>
<Navbarr>
    <div class="grid grid-cols-2 mx-1 mb-3 mt-1 lg:mx-10 lg:mb-5">
        <div class="">
            <button class="btn btn-primary text-white " on:click={()=>irHistorial()}>
                <span class="text-xl">Historial</span>
            </button> 
        </div>
        <div class="mx-2">
            <button class="btn btn-primary text-white " on:click={()=>openModal()}>
                
                <span class="text-xl">Nuevo</span>
            </button>  
        </div>
    </div>
    <div class="hidden flex flex-wrap mx-1 mb-3 mt-1 lg:mx-10 lg:mb-5" >
        <div class="lg:w-1/4 md:w-1/2">
            <button class="btn btn-primary text-white " on:click={()=>irHistorial()}>
                <span class="text-xl">Historial</span>
            </button> 
        </div>
        <div class="lg:w-1/4 md:w-1/2 mx-2">
            <button class="btn btn-primary text-white " on:click={()=>openModal()}>
                
                <span class="text-xl">Nuevo abrazo</span>
            </button>  
        </div>
    </div>
    <div class="grid grid-cols-2 m-1 gap-2 lg:gap-10 mb-2 mt-1 mx-1 lg:mx-10" >
        
        <div class="">
            <label class="block uppercase tracking-wide text-xs font-bold mb-2" for="grid-first-name">
                Disponible
            </label>
            <select id="opciondisp" name="opciondisp" class="select select-bordered" bind:value={ iddisponible} on:change={cambiarFiltro}>
                <option value={""}>Todos</option>
                {#each disponibilidades as o}
                    <option value={o.id}>{o.nombre}</option>
                {/each}

            </select>
        </div>
    </div>
    
    <!--Por que funciona al reves los mx-->
    <div class="w-full mx-1 mb-1 mt-2 lg:mx-10 lg:mb-1">
        <h1 class="text-xl font-bold italic ">ABRAZOS</h1>  
        <span>
            <div class="badge badge-lg">
                {#each disponibilidades as d,i}
                    {#if i < 2}
                        <div class="mx-1 gap-1">
                            {d.emoji} {d.nombre}
                        </div>
                    {/if}
                {/each}
            </div>
        </span>
        <span>
            <div class="badge badge-lg my-1">
                {#each disponibilidades as d,i}
                    {#if i > 1}
                        <div class="mx-1 gap-1">
                            {d.emoji} {d.nombre}
                        </div>
                        
                    {/if}
                {/each}
            </div>
        </span>
    </div>
    <div class="w-full grid justify-items-center mx-1 lg:mx-10 lg:w-3/4 overflow-x-auto">
        <table class="table table-lg w-full ">
            <thead>
                <tr>
                    <th 
                        on:click={()=>ordenarBebes(formasordenar[0])}
                        class="text-base px-1 hover:cursor-pointer">
                        Unidad
                    </th>
                    <th 
                        on:click={()=>ordenarBebes(formasordenar[1])}
                        class="text-base px-1 hover:cursor-pointer"
                    >
                        Mamá
                    </th>
                    <th 
                        on:click={()=>ordenarBebes(formasordenar[2])}
                        class="text-base px-1 hover:cursor-pointer"
                    >
                        Bebé
                    </th>
                    <th 
                        
                        class="text-base px-1"
                    >
                        Historial
                    </th>
                    <th 
                        on:click={()=>ordenarBebes(formasordenar[3])}
                        class="text-base mx-1 px-1 hover:cursor-pointer"
                    >
                        Último abrazo
                    </th>            
                </tr>
            </thead>
            <tbody>
                {#each bebesrows as b}
                    <tr >
                        <td class="text-base px-1">{b.unidad}</td>
                        <td class="text-base px-1">
                            {#if b.apellidomama.length>10}
                                {`${b.apellidomama}`}  <br> {`${b.nombremama}`}
                            {:else}
                                {`${b.apellidomama},${b.nombremama}`}
                            {/if}
                            
                            
                        </td>
                        <td class="text-base px-1">
                            <button class="flex gap-1" on:click={()=>darAbrazo(b.id)}>
                                {b.nombre}
                                {getEmojiDisp(b.disponibilidad)}
                            </button>
                            
                        </td>
                        <td class="text-base  px-1 flex">
                            {b.abrazos} {b.abrazos==0?"Sin abrazos":"abrazos"}
                            <div class="tooltip" data-tip="Historial abrazos">
                                <button on:click={()=>{goto("/abrazos/bebe/"+b.id)}}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
                                    </svg>  
                                </button>
                            </div>
                        </td>
                        <td class="text-base px-1">
                            {b.dias}
                        </td>
                    </tr>
                {/each}
            </tbody>
        </table>
    </div>
</Navbarr>
<dialog id="formAbrazo" class="modal">
    <div class="modal-box w-11/12 max-w-1md">
        <form method="dialog">
            <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" on:click={cerrar}>✕</button>
        </form>
        <h3 class="text-lg font-bold">Nuevo abrazo</h3>
        <div class="form-control w-">
            <label for="fecha" class="label">
                <span class="label-text text-base">Fecha*</span>
            </label>
            <label class="input-group">
                <input id ="fecha" type="date"  
                    class={`input input-bordered w-full ${malfecha?"input-error":""}`} 
                    max={MAXHOY}
                    bind:value={fechaabrazo}
                    
                    on:change={()=>onChangeInput("FECHA")}
                    
                />
                <div class={`label ${malfecha?"":"hidden"}`}>
                    <span class="label-text-alt text-red-400">Error debe seleccionar una fecha</span>
                </div>
            </label>
            <label class="form-control w-full">
                <div class="label">
                    <span class="label-text text-base">Bebé*</span>
                </div>
                <select 
                    bind:value={idbebe}    
                    class={`input input-bordered ${malbebe?"input-error":""}`} 
                    on:change={()=>onChangeInput("BEBE")}
                    name="bebes" 
                    id="bebes" 
                    
                >
                    {#each bebesselect as b}
                        <option value={b.id}>{`${b.apellidomama},${b.nombremama} (${b.nombre})`}</option>
                    {/each}
                </select>
                <div class={`label ${malbebe?"":"hidden"}`}>
                    <span class="label-text-alt text-red-400">Error debe seleccionar un bebe</span>
                </div>
            </label>
            <label class="form-control w-full">
                <div class="label">
                    <span class="label-text text-base">Abrazadoras*</span>
                </div>
                <select  
                    name="abrazadoras" id="abrazadoras" 
                    bind:value={idabrazadora}
                    class={`input input-bordered ${malabrazadora?"input-error":""}`} 
                    on:change={()=>onChangeInput("VOL")}
                >
                    {#each abrazadorasselect as a}
                        <option value={a.id}>{`${a.apellido},${a.name}`}</option>
                    {/each}
                </select>
                <div class={`label ${malabrazadora?"":"hidden"}`}>
                    <span class="label-text-alt text-red-400">Error debe seleccionar una abrazadora</span>
                </div>
            </label>
            <label class="form-control w-full">
                <div class="label">
                    <span class="label-text text-base">Unidad*</span>
                </div>
                <select 
                    name="ubicacion" id="ubicacion" 
                    bind:value={ubicacion}
                    class={`input input-bordered ${malubicacion?"input-error":""}`} 
                    on:change={()=>onChangeInput("UNIDAD")}
                >
                    {#each ubicaciones as u}
                        <option value={u.nombre}>{`${u.nombre}`}</option>
                    {/each}
                </select>
                <div class={`label ${malubicacion?"":"hidden"}`}>
                    <span class="label-text-alt text-red-400">Error debe seleccionar una unidad</span>
                </div>
            </label>
            <label class="form-control w-full">
                <div class="label">
                    <span class="label-text text-base">Turno*</span>
                </div>
                <select 
                    name="turno" 
                    id="turno" 
                    bind:value={turno}
                    class={`input input-bordered ${malturno?"input-error":""}`} 
                    on:change={()=>onChangeInput("TURNO")}
                >
                    {#each turnos as t}
                        <option value={t.nombre}>{`${t.nombre}`}</option>
                    {/each}
                </select>
                <div class={`label ${malturno?"":"hidden"}`}>
                    <span class="label-text-alt text-red-400">Error debe seleccionar un turno</span>
                </div>
            </label>
            <div class="mb-4 lg:mb-1 w-full">
                <label class="form-control">
                    <div class="label">
                        <span class="label-text">Observacion</span>                    
                    </div>
                    <textarea style="line-height: 1.3;" class="textarea textarea-bordered h-16" bind:value={observacion} placeholder=""></textarea>
              </label>
            </div>
            
        </div>
        <div class="modal-action justify-start">
            <form method="dialog">
              <!-- if there is a button, it will close the modal -->
              <button class="btn btn-success" disabled='{!botonhabilitado}' on:click={guardar}>Guardar</button>
              <button class="btn btn-error" on:click={cerrar}>Cancelar</button>
            </form>
        </div>
    </div>
</dialog>
