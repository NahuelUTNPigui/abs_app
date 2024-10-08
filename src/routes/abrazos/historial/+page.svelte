<script>
    import Navbarr from '$lib/Navbarr.svelte';
    import Swal from 'sweetalert2'
    import PocketBase from 'pocketbase'
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import * as XLSX from "xlsx"
    let ruta = import.meta.env.VITE_RUTA
    const pb = new PocketBase(ruta);
    let usuarioid = ""
    let escoordinador=false
    let bebes = []
    let abrazadoras = []
    
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
    let idabrazadorabuscar = ""
    let idubicacion=""
    onMount(async ()=>{
        const recordsv = await pb.collection('users').getFullList({filter:"active=true",sort:"name"});
        abrazadoras  = recordsv
        
        const recordsb = await pb.collection('bebes').getFullList({filter:'active=true',sort:"nombre"});
        bebes = recordsb
        // Traigo todos los abrazos? Por ahora esta bien
        const recordaz = await pb.collection('abrazos').getFullList({filter:"active=true",expand:'abrazadora,bebe',sort:"-fecha"});
        abrazos = recordaz
        abrazosrows = recordaz
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
    async function guardar(){
        let data = {
            turno,
            ubicacion,
            fecha:fechaabrazo+" 03:00:00"
        }
        try{
            let recordaedit = await pb.collection('abrazos').update(idabrazo,data);
            
            const recordaz = await pb.collection('abrazos').getFullList({filter:"active=true",expand:'abrazadora,bebe'});
            abrazosrows = recordaz
            Swal.fire('Éxito editar', 'Abrazo editado con éxito', 'success');
        }
        catch(e){
            Swal.fire('Error editar', 'No se pudo editar el abrazo', 'error');
        }
        idabrazo = ""
        turno = ""
        ubicacion = ""
        fechaabrazo=""
        nombreabrazadora = ""
        nombrebebe = ""
    }
    async function eliminar(id){
        Swal.fire({
            title: 'Eliminar abrazo',
            text: '¿Seguro que deseas eliminar abrazo?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Si',
            cancelButtonText: 'No'
        }).then(async result => {
            if(result.value){
                idabrazo = id
                let data = {
                    active:false
                }
                try{
                    let recordaedit = await pb.collection('abrazos').update(idabrazo,data);
                    const recordaz = await pb.collection('abrazos').getFullList({filter:"active=true",expand:'abrazadora,bebe'});
                    abrazosrows = recordaz
                    Swal.fire('Abrazo eliminado!', 'Se eliminó el abrazo correctamente.', 'success');
                }
                catch(e){
                    Swal.fire('Acción cancelada', 'No se pudo eliminar al abrazo', 'error');
                }
                idabrazo = ""
            }
        })
        
    }
    function volver(){
        goto("/abrazos/")
    }
    function acortarPalabra(palabra){
        let n = 7
        return (palabra.length > n) ? palabra.slice(0, n-1) + '...' : palabra;  
    }
    // Si tengo todos los abrazos para que haria una llamada a la bae
    function filterUpdate(){
        abrazosrows = abrazos
        if(idbebebuscar !=""){    
            abrazosrows = abrazosrows.filter(a=>a.bebe==idbebebuscar)
        }
        
        if(idabrazadorabuscar!=""){
            abrazosrows = abrazosrows.filter(a=>a.abrazadora == idabrazadorabuscar)
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
        XLSX.utils.book_append_sheet(wb, ws, 'Abrazos');
        // Filtros
        let bebesfilter = bebes.filter(b=>idbebebuscar==b.id)
        let bebe = {
            nombre:"",apellidomama:"",nombremama:""
        }
        if(bebesfilter.length!=0){
            bebe = bebesfilter[0]
        }
        let abrazadorasfilter = abrazadoras.filter(a =>idabrazadorabuscar==a.id)
        let abrazadora = {name:"",apellido:""}
        if(abrazadorasfilter.length!=0){
            abrazadora = abrazadorasfilter[0]
        }
        const wsFilter = XLSX.utils.aoa_to_sheet([
            ['Filtro','Valor'],
            ['Fecha desde',fechadesde],
            ['Fecha hasta',fechahasta],
            ['Unidad',idubicacion],
            ['Bebé',bebe.nombre==""?"":`${bebe.nombre}(${bebe.apellidomama},${bebe.nombremama})`],
            ['Abrazadora',abrazadora.name==""?"":`${abrazadora.apellido},${abrazadora.name}`]
        ])
        XLSX.utils.book_append_sheet(wb, wsFilter, 'Filtros aplicados');
        // Guardar el excel
        XLSX.writeFile(wb, `${titulo.replace(/\//g, "-")}.xlsx`, { cellStyles: true });
    
    }

</script>
<Navbarr>
    <div class="grid justify-start mx-1">
        <button class="btn btn-primary text-white " on:click={()=>volver()}>
            <span class="text-xl">Volver</span>
        </button>  
    </div>
    <div class="flex flex-wrap -mx-3 mb-6 mt-2">
        <div class="w-1/2 px-3 mb-6 md:mb-0">
            <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-first-name">
              Fecha desde
            </label>
            <input id ="fechadesde" type="date"  class="input input-bordered" bind:value={fechadesde} on:change={filterUpdate}/>
        </div>
        <div class="w-1/2 px-3 mb-6 md:mb-0">
            <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-first-name">
              Fecha Hasta
            </label>
            <input id ="fechadesde" type="date"  class="input input-bordered" bind:value={fechahasta} on:change={filterUpdate}/>
        </div>
    </div>
    <div class="flex flex-wrap -mx-3 mb-6 mt-2">
        <div class="w-1/2 px-3 mb-6 md:mb-0">
            <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-first-name">
                Bebes    
            </label>
            <select class="select select-bordered" name="bebes" id="bebes" bind:value={idbebebuscar} on:change={filterUpdate}>
                <option value={""}>{`Todos`}</option>
                {#each bebes as b}
                    
                    <option value={b.id}>{`${acortarPalabra(b.nombre)}(${acortarPalabra(b.apellidomama)})`}</option>
                    
                {/each}
            </select>
        </div>
        <div class="w-1/2 px-3 mb-6 md:mb-0">
            <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-first-name">
                Voluntaria    
            </label>
            <select class="select select-bordered" name="bebes" id="bebes" bind:value={idabrazadorabuscar} on:change={filterUpdate}>
                <option value={""}>{`Todas`}</option>
                {#each abrazadoras as a}
                    
                    <option value={a.id}>{`${a.name}, ${a.apellido}`}</option>
                {/each}
            </select>
        </div>
    </div>
    <div class="flex flex-wrap -mx-3 mb-6 mt-2">
        <div class="w-1/2 px-3 mb-6 md:mb-0">
            <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-first-name">
                Ubicación    
            </label>
            <select class="select select-bordered" name="bebes" id="bebes" bind:value={idubicacion} on:change={filterUpdate}>
                <option value={""}>{`Todos`}</option>
                {#each ubicaciones as u}
                    
                    <option value={u.nombre}>{`${u.nombre}`}</option>
                    
                {/each}
            </select>
        </div>
    </div>
    <div class="grid justify-start mx-1">
        <button class="btn btn-primary text-white " on:click={exportarXLSX}>
            <span class="text-xl">Exportar EXCEL</span>
        </button>  
    </div>
    <div class="w-full grid justify-items-center lg:m-20 lg:w-3/4">
        
        <div class="w-full grid justify-items-left mx-10">
            <h1 class="text-xl font-bold italic md:mx-3 sm:mx-3 lg:mx-5">HISTORIAL ABRAZOS</h1>  
        </div>
        <table class="table table-md">
            <thead>
                <tr>
                    <th>Fecha</th>
                    <th>Bebe</th>
                    <th>Abrazadora</th>
                    <th>Acciones</th>
                </tr>

            </thead>
            <tbody>
                {#each abrazosrows as a}
                    <tr>
                        <td>{new Date(a.fecha).toLocaleDateString()}</td>
                        <td>{`${a.expand.bebe.nombre} (${a.expand.bebe.apellidomama})`}</td>
                        <td>{a.expand.abrazadora.name+","+a.expand.abrazadora.apellido}</td>
                        <td>
                            <div class="tooltip" data-tip="Editar">
                                <button on:click={()=>openModal(a.id)}>
                                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-4">
                                    <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32L19.513 8.2Z" />
                                  </svg>
                                </button>
                              </div>
                              <div class="tooltip" data-tip="Eliminar">
                                <button on:click={()=>eliminar(a.id)}>
                                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-4">
                                    <path fill-rule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z" clip-rule="evenodd" />
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
                        <span class="label-text text-base">Fecha</span>
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
                      <button class="btn btn-success" on:click={guardar}>Guardar</button>
                      <button class="btn btn-error" on:click={cerrar}>Cancelar</button>
                    </form>
                </div>
            </div>
        </dialog>
    </div>
</Navbarr>