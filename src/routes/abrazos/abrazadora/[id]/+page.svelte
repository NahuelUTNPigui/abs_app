<script>
    import Navbarr from '$lib/Navbarr.svelte';
    import PocketBase from 'pocketbase'
    import { onMount } from 'svelte';
    import { page } from '$app/stores';
    import { goto } from '$app/navigation';
    import * as XLSX from "xlsx"
    let ruta = import.meta.env.VITE_RUTA
    const pb = new PocketBase(ruta);
    let usuarioid = ""
    let escoordinador=false
    let abrazadora = null
    let bebes=[]
    let abrazosrows = []
    let abrazos = []
    let ubicaciones =[{nombre:"UTI1"},{nombre:"UTI2"},{nombre:"UTI3"},{nombre:"UCI1"},{nombre:"UCI2"},{nombre:"UCI3"},{nombre:"Prealta"}]
    let turnos=[{nombre:"Mañana"},{nombre:"Tarde"}]
    let nombrebebe=""
    let nombreabrazadora=""
    let turno=""
    let ubicacion=""
    let fechaabrazo=""
    let idabrazo=""
    let fechadesde = ""
    let fechahasta = ""
    let idbebebuscar =""
    let idabrazadora = ""
    let idubicacion=""

    export async function load({ params }) {
        const { id } = params;
        // Aquí puedes hacer una llamada a la API o a tu fuente de datos
        return { props: { id } };
    }
    onMount(async()=>{
        idabrazadora = $page.params.id
        const recordsv = await pb.collection('users').getOne(idabrazadora);
        abrazadora  = recordsv
        nombreabrazadora = `${abrazadora.apellido},${abrazadora.name}`
        const recordaz = await pb.collection('abrazos').getFullList({filter:`active=true&&abrazadora='${idabrazadora}'`,expand:'abrazadora,bebe',sort:"-fecha"});
        abrazos = recordaz
        abrazosrows = recordaz
        const recordsb = await pb.collection('bebes').getFullList({filter:'active=true',sort:"nombre"});
        bebes = recordsb
        let pb_json = await JSON.parse(localStorage.getItem('pocketbase_auth'))
        usuarioid = pb_json.model.id
        escoordinador = pb_json.model.coordinador
    })
    function openModal(id){
        let abrazo = abrazosrows.filter(a=>a.id==id)[0]
        turno = abrazo.turno
        ubicacion=abrazo.ubicacion
        
        fechaabrazo = abrazo.fecha.split(" ")[0]
        nombrebebe = `${abrazo.expand.bebe.nombre}(${abrazo.expand.bebe.apellidomama},${abrazo.expand.bebe.nombremama})`
        nombreabrazadora = `${abrazo.expand.abrazadora.apellido},${abrazo.expand.abrazadora.name}`
        idabrazo = id
        formAbrazo.showModal() 
    }
    function cerrar(){
        turno = ""
        ubicacion = ""
        fechaabrazo=""
        nombreabrazadora = ""
        nombrebebe = ""
    }
    function acortarPalabra(palabra){
        let n = 10
        return (palabra.length > n) ? palabra.slice(0, n-1) + '...' : palabra;  
    }
    function filterUpdate(){
        abrazosrows = abrazos
        if(idbebebuscar !=""){    
            abrazosrows = abrazosrows.filter(a=>a.bebe==idbebebuscar)
        }     
        if(fechadesde!=""){
            abrazosrows= abrazosrows.filter(a=>a.fecha>fechadesde)   
        }
        if(fechahasta!=""){
            abrazosrows= abrazosrows.filter(a=>a.fecha<fechahasta)
        }
        if(idubicacion!=""){
            abrazosrows = abrazosrows.filter(a=>a.ubicacion == idubicacion)
        }
        
    }
    function exportarXLSX(){
        let csvdata = abrazosrows.map(item=>({
            UNIDADES:item.ubicacion,
            BEBE:`${item.expand.bebe.nombre}(${item.expand.bebe.apellidomama},${item.expand.bebe.nombremama})`,
            ABRAZADORA:`${item.expand.abrazadora.apellido},${item.expand.abrazadora.name}`,
            FECHA:new Date(item.fecha).toLocaleDateString(),
            TURNO:item.turno
        }))
        
        const wb = XLSX.utils.book_new();
        // Abrazos
        const ws = XLSX.utils.aoa_to_sheet([])
        let titulo = "ABRAZOS"
        if(fechadesde!=""){
            titulo = `${titulo} Desde ${fechadesde}`
        }
        if(fechahasta!=""){
            titulo = `${titulo} Hasta ${fechahasta}`
        }
        ws['A1']={t:'s',v:titulo,s:{}}
        const range = XLSX.utils.decode_range('A1:K1');
        ws['!merges'] = [{ s: { r: range.s.r, c: range.s.c }, e: { r: range.e.r, c: range.e.c } }];
        XLSX.utils.sheet_add_json(ws, csvdata, { origin: 'A2' });
        let totalfilas = [{"CANTIDAD ABRAZOS":csvdata.length}]
        XLSX.utils.sheet_add_json(ws,totalfilas,{origin:'G2'})
        XLSX.utils.book_append_sheet(wb, ws, 'Abrazos');
        // Filtros
        let bebesfilter = bebes.filter(b=>idbebebuscar==b.id)
        let bebe = {
            nombre:"",apellidomama:"",nombremama:""
        }
        if(bebesfilter.length!=0){
            bebe = bebesfilter[0]
        }
        const wsFilter = XLSX.utils.aoa_to_sheet([
            ['Filtro','Valor'],
            ['Fecha desde',fechadesde],
            ['Fecha hasta',fechahasta],
            ['Unidad',idubicacion],
            ['Abrazadora',nombreabrazadora],
            ['Bebe',bebe.nombre==""?"":`${bebe.nombre}(${bebe.apellidomama},${bebe.nombremama})`]
        ])
        XLSX.utils.book_append_sheet(wb, wsFilter, 'Filtros aplicados');
        // Guardar el excel
        XLSX.writeFile(wb, `${titulo.replace(/\//g, "-")}.xlsx`, { cellStyles: true });
    
    }
    function volver(){
        goto("/users/")
    }
</script>
<Navbarr>
    <div class="flex flex-wrap lg:mx-10 mb-6 mt-2 sm:mx-0 xm:mx-0" >
        <div class="lg:w-1/4 md:w-1/2 lg:mx-10 mb-6 md:mb-0 sm:mb-0 sm:mx-0">
            <button class="btn btn-outline"on:click={()=>volver()}>
                <span class="text-xl">Volver</span>
            </button>  
        </div>
    </div>
    <div class="flex flex-wrap lg:mx-10 mb-1 mt-2 sm:mx-0 xm:mx-0" >
        <div class="lg:w-1/4 md:w-1/2 lg:mx-10 mb-1 md:mb-0 sm:mb-0 sm:mx-0">
            <label class="block uppercase tracking-wide text-xs font-bold mb-2" for="grid-first-name">
              Fecha desde
            </label>
            <input id ="fechadesde" type="date"  class="input input-bordered" bind:value={fechadesde} on:change={filterUpdate}/>
        </div>
        <div class="lg:w-1/4 px-1 md:w-1/2 lg:mx-10 mb-1 md:mb-0 sm:mb-0 sm:mx-0">
            <label class="block uppercase tracking-wide text-xs font-bold mb-2" for="grid-first-name">
              Fecha Hasta
            </label>
            <input id ="fechadesde" type="date"  class="input input-bordered" bind:value={fechahasta} on:change={filterUpdate}/>
        </div>
    </div>
    <div class="flex flex-wrap lg:mx-10 mb-1 lg:mt-2 sm:mt-1 sm:mx-0 xm:mx-0">
        <div class="lg:w-1/4 md:w-1/2 lg:mx-10 mb-1 md:mb-0 sm:mb-0 sm:mx-0">
            <label class="block uppercase tracking-wide text-xs font-bold mb-2" for="grid-first-name">
                Bebes    
            </label>
            <select class="select select-bordered" name="bebes" id="bebes" bind:value={idbebebuscar} on:change={filterUpdate}>
                <option value={""}>{`Todos`}</option>
                {#each bebes as b}
                    <option value={b.id}>{`${acortarPalabra(b.nombre)}(${acortarPalabra(b.apellidomama)})`}</option>
                {/each}
            </select>
        </div>
        <div class="lg:w-1/4 px-1 md:w-1/2 lg:mx-10 mb-1 md:mb-0 sm:mb-0 sm:mx-0">
            <label class="block uppercase tracking-wide text-xs font-bold mb-2" for="grid-first-name">
                Unidad    
            </label>
            <select class="select select-bordered" name="bebes" id="bebes" bind:value={idubicacion} on:change={filterUpdate}>
                <option value={""}>{`Todos`}</option>
                {#each ubicaciones as u}
                    
                    <option value={u.nombre}>{`${u.nombre}`}</option>
                    
                {/each}
            </select>
        </div>
    </div>
    <div class="flex flex-wrap lg:mx-10 mb-1 lg:mt-2 sm:mt-1 sm:mx-0 xm:mx-0">
        <div class="lg:w-1/4 md:w-1/2 lg:mx-10 mb-1 md:mb-0 sm:mb-0 sm:mx-0">
            <button class="btn btn-outline" on:click={exportarXLSX}>
                <span class="text-xl">Exportar EXCEL</span>
            </button>
        </div>
    </div>
    <div class="w-full grid justify-items-center lg:m-20 lg:w-3/4">
        
        <div class="w-full grid justify-items-left mx-10">
            <h1 class="text-xl font-bold italic md:mx-3 sm:mx-3 lg:mx-5">HISTORIAL ABRAZOS DE : {nombreabrazadora}</h1>  
        </div>
        <table class="table table-md">
            <thead>
                <tr>
                    <th>Fecha</th>
                    <th>Bebe</th>
                    <th>Unidad</th>
                    <th>Acciones</th>
                </tr>

            </thead>
            <tbody>
                {#each abrazosrows as a}
                    <tr>
                        <td>{new Date(a.fecha).toLocaleDateString()}</td>
                        <td>{`${a.expand.bebe.nombre} (${a.expand.bebe.apellidomama})`}</td>
                        <td>{a.ubicacion}</td>
                        <td>
                            <div class="tooltip" data-tip="Ver">
                                <button on:click={()=>openModal(a.id)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-4">
                                        <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                                        <path fill-rule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 0 1 0-1.113ZM17.25 12a5.25 5.25 0 1 1-10.5 0 5.25 5.25 0 0 1 10.5 0Z" clip-rule="evenodd" />
                                    </svg>
                                </button>
                            </div>
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
                        <span class="label-text text-base ">Fecha</span>
                    </label>
                    <label class="input-group">
                        <input id ="fecha" type="date"  class="input input-bordered" bind:value={fechaabrazo}/>
                    </label>
                    <label for="bebe" class="label">
                        <span class="label-text text-base">Bebé</span>
                    </label>
                    <label class="input-group">
                        <input id ="bebe" type="text"  class="input input-bordered" bind:value={nombrebebe}/>
                    </label>
                    <label for="abrazadora" class="label">
                        <span class="label-text text-base">Abrazadora</span>
                    </label>
                    <label class="input-group">
                        <input id ="abrazadora" type="text"  class="input input-bordered" bind:value={nombreabrazadora}/>
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
                      <button class="btn btn-error text-white" on:click={cerrar}>Cerrar</button>
                    </form>
                </div>
            </div>
        </dialog>
    </div>
</Navbarr>