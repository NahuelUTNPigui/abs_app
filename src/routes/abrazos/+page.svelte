<script>
    import Navbarr from '$lib/Navbarr.svelte';
    import Swal from 'sweetalert2'
    import PocketBase from 'pocketbase'
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    let ruta = import.meta.env.VITE_RUTA
    const pb = new PocketBase(ruta);
    const HOY = new Date()
    let usuarioid = ""
    let escoordinador=false
    let altaprioridad=false
    let bebes = []
    let abrazadoras = []
    let abrazadorasselect = []
    let bebesrows = []
    let bebesselect = []
    let ubicaciones =[{nombre:"Central"},{nombre:"Sala"}]
    let turnos=[{nombre:"Mañana"},{nombre:"Tarde"}]
    let prioridades = [{id:1,nombre:"Todos"},{id:2,nombre:"Solo alta"}]
    let idbebe = ""
    let idabrazadora=""
    let fechaabrazo=""
    let turno = ""
    let ubicacion = ""
    let prioridad = 1
    
    onMount(async ()=>{
        const recordsv = await pb.collection('users').getFullList({filter:"active=true"});
        abrazadoras  = recordsv
        abrazadorasselect = recordsv
        abrazadorasselect.sort((a1,a2)=>a1.name>a2.name?1:-1)
        const recordsb = await pb.collection('bebes').getFullList({filter:"active=true"});
        bebes = recordsb
        //const record = await pb.collection('abrazos').getFirstListItem(`active=true&&bebe="${b.id}"`);
        bebesrows = []
        for(let i = 0;i<bebes.length;i++){
            let b = bebes[i]
            if(b.fechaegreso!=""){
                continue
            }
            const resultList = await pb.collection('abrazos').getList(1, 100, {
                filter:  `active=true&&bebe="${b.id}"&&bebe.fechaegreso!=''`,
                sort:"-fecha",
                expand:"bebe"
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
                b.dias ="-"
            }
            bebesrows.push(b)
        }
        //bebesrows = bebes
        bebesrows.sort((b1,b2)=>b1.diasnumero<b2.diasnumero?1:-1)
        bebesrows = bebesrows
        bebesselect = bebes
        bebesselect.sort((b1,b2)=>b1.nombre>b2.nombre?1:-1)
        let pb_json = await JSON.parse(localStorage.getItem('pocketbase_auth'))
        usuarioid = pb_json.model.id
        escoordinador = pb_json.model.coordinador
    })
    function openModal(){
        formAbrazo.showModal()
    }
    function darAbrazo(id){
        idbebe = id
        openModal()
    }
    function isEmpty(str) {
        return (!str || str.length === 0 );
    }
    async function guardar(){
        if(isEmpty(fechaabrazo)){
            Swal.fire('Error guardar','La fecha de abrazo no esta seleccionada','error')
            return
        }
        if(isEmpty(idbebe)){
            Swal.fire('Error guardar','No hay ningun bebé seleccionado','error')
            return 
        }
        if(isEmpty(idabrazadora)){
            Swal.fire('Error guardar','No hay ninguna abrazadora seleccionada','error')
            return 
        }
        if(isEmpty(turno)){
            Swal.fire('Error guardar','No hay ningun turno seleccionado','error')
            return 
        }
        if(isEmpty(ubicacion)){
            Swal.fire('Error guardar','No hay ninguna ubicación seleccionada','error')
            return 
        }
        let data={
            ubicacion,
            turno,
            fecha:fechaabrazo+" 03:00:00",
            active:true,
            bebe:idbebe,
            abrazadora:idabrazadora
        }
        try{
            const recorda = await pb.collection('abrazos').create(data)
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
                    b.dias ="-"
                }
                bebesrows.push(b)
            }
            
            bebesrows.sort((b1,b2)=>b1.diasnumero<b2.diasnumero?1:-1)
            bebesrows = bebesrows
            Swal.fire('Éxito guardar', 'Abrazo guardado con éxito', 'success');
            
        }
        catch(e){
            Swal.fire('Error guardar', 'No se pudo guardar el abrazo', 'error');
        }
        idbebe = ""
        idabrazadora = ""
        turno = ""
        ubicacion = ""
        fechaabrazo = ""
        
    }
    function cerrar(){
        idbebe = ""
        idabrazadora = ""
        turno = ""
        ubicacion = ""
        fechaabrazo = ""
    }
    function irHistorial(){
        goto("/abrazos/historial/")
    }
    function cambiarFiltro(){
        bebesrows=[]
        if(prioridad==1){
            
            for(let i = 0;i<bebes.length;i++){
                
                bebesrows.push(bebes[i])
            }
        }
        else{
            for(let i = 0;i<bebes.length;i++){
                if(bebes[i].prioridad>1){
                    bebesrows.push(bebes[i])
                }
                
            }
        }
        bebesrows.sort((b1,b2)=>b1.diasnumero<b2.diasnumero?1:-1)
    }
    
</script>
<Navbarr>
    <div class="w-full grid justify-items-center lg:m-20 lg:w-3/4">
        <div class="w-full grid justify-items-left mx-10">
            <h1 class="text-xl font-bold italic md:mx-3 sm:mx-3 lg:mx-5">ABRAZOS</h1>  
        </div>
        <div class="flex m-1 gap-2 lg:gap-10" >
            <select class="select select-bordered" bind:value={prioridad} on:change={cambiarFiltro}>
                {#each prioridades as p}
                    <option value={p.id}>{p.nombre}</option>
                {/each}

            </select>
            <button class="btn btn-primary text-white " on:click={()=>irHistorial()}>
                <span class="text-xl">Historial</span>
            </button> 
            <button class="btn btn-primary text-white " on:click={()=>openModal()}>
                
                <span class="text-xl">Nuevo abrazo</span>
            </button>  
            <br>
        </div>
        <table class="table table-lg">
            <thead>
                <tr>
                    <th class="text-base">Nombre bebé</th>
                    <th class="text-base">Prioridad</th>
                    <th class="text-base">Acciones</th>
                    <th class="text-base">Último abrazo</th>
                    
                </tr>
            </thead>
            <tbody>
                {#each bebesrows as b}
                    <tr>
                        <td class="text-base">
                            {b.nombre}
                        </td>
                        <td class="text-base">
                            {b.prioridad==2?"Alta":"Baja"}
                        </td>
                        <td>
                            <div class="tooltip" data-tip="Abrazar">
                                <button on:click={()=>darAbrazo(b.id)}>
                                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-4">
                                      <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
                                  </svg>                              
                                </button>
                            </div>
                        </td>
                        <td class="text-base">
                            {b.dias}
                        </td>
                        
                    </tr>
                {/each}

            </tbody>
        </table>
        <dialog id="formAbrazo" class="modal">
            <div class="modal-box w-11/12 max-w-1md">
                <h3 class="text-lg font-bold">Nuevo abrazo</h3>
                <div class="form-control">
                    <label for="fecha" class="label">
                        <span class="label-text text-base">Fecha</span>
                    </label>
                    <label class="input-group">
                        <input id ="fecha" type="date"  class="input input-bordered" bind:value={fechaabrazo}/>
                    </label>
                    <label class="form-control w-3/5">
                        <div class="label">
                            <span class="label-text text-base">Bebé</span>
                        </div>
                        <select class="select select-bordered" name="bebes" id="bebes" bind:value={idbebe}>
                            {#each bebesselect as b}
                                <option value={b.id}>{`${b.nombre}(${b.apellidomama},${b.nombremama})`}</option>
                            {/each}
                        </select>
                    </label>
                    <label class="form-control w-3/5">
                        <div class="label">
                            <span class="label-text text-base">Abrazadoras</span>
                        </div>
                        <select class="select select-bordered" name="abrazadoras" id="abrazadoras" bind:value={idabrazadora}>
                            {#each abrazadorasselect as a}
                                <option value={a.id}>{`${a.name}, ${a.apellido}`}</option>
                            {/each}
                        </select>
                    </label>
                    <label class="form-control w-3/5">
                        <div class="label">
                            <span class="label-text text-base">Ubicación</span>
                        </div>
                        <select class="select select-bordered" name="ubicacion" id="ubicacion" bind:value={ubicacion}>
                            {#each ubicaciones as u}
                                <option value={u.nombre}>{`${u.nombre}`}</option>
                            {/each}
                        </select>
                    </label>
                    <label class="form-control w-3/5">
                        <div class="label">
                            <span class="label-text text-base">Turno</span>
                        </div>
                        <select class="select select-bordered" name="turno" id="turno" bind:value={turno}>
                            {#each turnos as t}
                                <option value={t.nombre}>{`${t.nombre}`}</option>
                            {/each}
                        </select>
                    </label>
                    
                </div>
                <div class="modal-action justify-start">
                    <form method="dialog">
                      <!-- if there is a button, it will close the modal -->
                      <button class="btn btn-success" on:click={guardar}>Guardar</button>
                      <button class="btn btn-error" on:click={cerrar}>Cancelar</button>
                    </form>
                </div>
            </div>
        </dialog>
        
    </div>
    
</Navbarr>