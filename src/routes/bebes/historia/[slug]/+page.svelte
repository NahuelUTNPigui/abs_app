<script>
    import Navbarr from '$lib/Navbarr.svelte';
    import PocketBase from 'pocketbase'
    import { onMount } from 'svelte';
    import { page } from '$app/stores';
    import { goto } from '$app/navigation';
    import Swal from 'sweetalert2'
    import BebeHistorial from '$lib/BebeHistorial.svelte';
    //Variables
    let ruta = import.meta.env.VITE_RUTA
    const pb = new PocketBase(ruta);
    const HOY = new Date().toISOString().split("T")[0]
    let prioridades = [{id:1,desc:"ALTA"},{id:2,desc:"BAJA"}]
    let bebe404=false
    let idbebe = ""
    let modificaciones = []
    let nombrebebe= ""
    //Para el ver
    let nombre = ""
    let nombremama = ""
    let apellidomama = ""
    let edadmama=0  
    let procedencia = ""
    let fechaingreso = ""
    let fechaegreso=""
    let disponible=true
    let fechanacimiento = ""
    let prioridad = 1
    let pesonacimiento = 0
    let edadgestacional = 0
    let maternidad = false
    let diagnostico = ""
    let unidad = ""
    let sexo = ""
    let pesoinicial = ""
    let observacion = ""
    let disponibilidad = ""
    
    onMount(async()=>{
        idbebe = $page.params.slug
        // Debo hacer un try and catch
        try{
            const record = await pb.collection('bebes').getOne(idbebe)
            nombrebebe = `${record.apellidomama},${record.nombremama} (${record.nombre})`
            
            // you can also fetch all records at once via getFullList
            const recordsmods = await pb.collection('historialesbebe').getFullList({
                filter:"bebe='"+idbebe+"'",
                sort: '-created',
            });
            modificaciones = recordsmods
        }
        catch(e){
            Swal.fire('Error hsitoria', 'No existe el bebe', 'error');
            nombrebebe = ""
        }
        

    })
    function volver(){
        goto("/bebes/")
    }
    function ver(id){
        let historia = modificaciones.filter(m=>m.id == id)[0]
        nombre = historia.nombre
        nombremama = historia.nombremama
        apellidomama = historia.apellidomama
        edadmama = historia.edadmadre
        procedencia = historia.procedencia
        fechaingreso = historia.fechaingreso.split(" ")[0]
        fechaegreso = historia.fechaegreso.split(" ")[0]
        disponible = historia.disponible
        fechanacimiento = historia.fechanacimiento.split(" ")[0]
        prioridad = historia.prioridad
        pesonacimiento = historia.peso
        edadgestacional = historia.semanasgestacional
        maternidad = historia.maternidadnacimiento
        diagnostico = historia.diagnostico.split(",")
        sexo = historia.sexo
        pesoinicial = historia.pesoinicial
        observacion = historia.observacion
        disponibilidad = historia.disponibilidad
        unidad = historia.unidad
        formVer.showModal()
    }
</script>
<Navbarr>
    <div class="container mx-auto">
        <div class="hidden flex flex-wrap mx-1 lg:mx-10 mb-1 mt-2 lg:mb-4" >
            <div class="lg:w-1/4 md:w-1/2">
                <button class="btn btn-outline"on:click={()=>volver()}>
                    <span class="text-xl">Volver</span>
                </button>  
            </div>
        </div>
        <button on:click={volver}>
            <h2 class="text-2xl mx-1 font-bold mb-3 text-left flex mx-1 lg:mx-10 mt-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5 mt-2 ">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                </svg>                  
                {nombrebebe}
            </h2>
        </button>
        <div class="w-full grid justify-items-left mx-1 lg:mx-10 mt-1 lg:mt-2">
                <h1 class="text-xl font-bold italic">        
                    HISTORIA BEBÉ
                </h1>  
            
            
        </div>
        <div class="w-full grid justify-items-center mx-1 lg:mx-10 lg:w-3/4 overflow-x-auto">
            <table class="table table-lg w-full lg:mx-10">
                <thead>
                    <tr>
                        <th class="text-base ml-3 pl-3 mr-1 pr-1 ">Fecha</th>
                        <th class="text-base mx-1 px-1">Diagnostico</th>
                        <th class="text-base mx-1 px-1">Observacion</th>
                        <th class="text-base mx-1 px-1">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {#each modificaciones as m}
                        <tr>
                            <td class="text-base ml-3 pl-3 mr-1 pr-1 lg:ml-10">
                                {new Date(m.created).toLocaleDateString()}
                            </td>
                            <td class="text-base mx-1 px-1">
                                {m.diagnostico.split(",").join(" , ")}
                            </td>
                            <td class="text-base mx-1 px-1">
                                {m.observacion}
                            </td>
                            <td class="flex gap-2 text-base mx-1 px-1">
                                <div class="tooltip" data-tip="Ver">
                                    <button on:click={()=>ver(m.id)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
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
<dialog id="formVer" class="modal">
    <div class="modal-box md:max-w-7xl">
        <div class="form-control">
            <BebeHistorial
                nombrebebe = {nombre}
                {nombremama}
                {apellidomama}
                {edadmama}
                {procedencia}
                {fechaingreso}
                {fechaegreso}
                {fechanacimiento}
                {prioridad}
                {pesonacimiento}
                {edadgestacional}
                {maternidad}
                {diagnostico}
                {unidad}
                {sexo}
                {pesoinicial}
                {observacion}
                {disponibilidad}
            />
        </div>
        <div class="modal-action justify-start">
            <form method="dialog">
                <button class="btn btn-error text-gray-100">Cerrar</button>
            </form>
        </div>
    </div>

</dialog>
