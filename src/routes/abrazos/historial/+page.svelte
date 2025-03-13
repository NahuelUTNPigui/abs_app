<script>
    import Navbarr from '$lib/Navbarr.svelte';
    import Swal from 'sweetalert2'
    import PocketBase from 'pocketbase'
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import * as XLSX from "xlsx"
    import ubicaciones from "$lib/ubicaciones"
    let ruta = import.meta.env.VITE_RUTA
    const pb = new PocketBase(ruta);
    let usuarioid = ""
    let escoordinador=false
    let bebes = []
    let abrazadoras = []
    
    let abrazosrows = []
    let abrazos = []
    
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
    // Validar
    let malturno = false
    let malubicacion = false
    let malfecha = false
    let botonhabilitado = false
    onMount(async ()=>{
        const recordsv = await pb.collection('users').getFullList({filter:"active=true",sort:"name"});
        abrazadoras  = recordsv
        abrazadoras.sort((a1,a2)=>a1.apellido > a2.apellido?1:-1)
        const recordsb = await pb.collection('bebes').getFullList({filter:'active=true',sort:"nombre"});
        bebes = recordsb
        bebes.sort((b1,b2)=>b1.apellidomama>b2.apellidomama?1:-1)
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
        botonhabilitado = true
        formAbrazo.showModal()
    }
    function cerrar(){
        turno = ""
        ubicacion = ""
        fechaabrazo=""
        nombreabrazadora = ""
        nombrebebe = ""
    }
    function isEmpty(str) {
        return (!str || str.length === 0 );
    }
    function onChangeInput(inputName){
        botonhabilitado = true
        if(isEmpty(fechaabrazo)){
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
    async function guardar(){
        let data = {
            turno,
            ubicacion,
            fecha:fechaabrazo+" 03:00:00"
        }
        try{
            let recordaedit = await pb.collection('abrazos').update(idabrazo,data);
            
            const recordaz = await pb.collection('abrazos').getFullList({filter:"active=true",expand:'abrazadora,bebe',sort:"-fecha"});
            abrazosrows = recordaz
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
            BEBE:`${item.expand.bebe.apellidomama},${item.expand.bebe.nombremama}(${item.expand.bebe.nombre})`,
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
    function exportarAgrupar(porBebe){
        let contador = {}
        let cantidad = 0
        for(let i = 0;i< abrazosrows.length;i++){
            let item = abrazosrows[i]
            let nombre = porBebe ?
                `${item.expand.bebe.apellidomama},${item.expand.bebe.nombremama}(${item.expand.bebe.nombre})`
                :`${item.expand.abrazadora.apellido},${item.expand.abrazadora.name}`;
            if(contador[nombre]){
                contador[nombre] += 1
            }
            else{
                contador[nombre] = 1
            }
            cantidad += 1
        }
        let data = []
        for (const [key, value] of Object.entries(contador)) {
            data.push({nombre:key,abrazos:value})
        }
        data.sort((d1,d2)=>d1.nombre.replace("ñ","n").toLowerCase()>d2.nombre.replace("ñ","n").toLowerCase()?1:-1)
        let csvdata = []
        
        if(porBebe){
            csvdata = data.map(item=>({            
                BEBE:`${item.nombre}`,
                CANTIDAD:item.abrazos
            }))
        }
        else{
            csvdata = data.map(item=>({            
                ABRAZADORA  :`${item.nombre}`,
                CANTIDAD:item.abrazos
            }))
        }
        const wb = XLSX.utils.book_new();
        // Abrazos
        const ws = XLSX.utils.aoa_to_sheet([])
        let titulo = `Abrazos agrupados por ${porBebe?"bebés":"abrazadoras"}`
        if(fechadesde!=""){
            titulo = `${titulo} Desde ${fechadesde}`
        }
        if(fechahasta!=""){
            titulo = `${titulo} Hasta ${fechahasta}`
        }
        ws['A1']={t:'s',v:titulo,s:{}}
        const range = XLSX.utils.decode_range('A1:D1');
        ws['!merges'] = [{ s: { r: range.s.r, c: range.s.c }, e: { r: range.e.r, c: range.e.c } }];
        XLSX.utils.sheet_add_json(ws, csvdata, { origin: 'A2' });
        
        let totalfilas = [{"CANTIDAD ABRAZOS":cantidad}]
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
    <div class="flex flex-wrap mx-1 lg:mx-10 mb-1 mt-2 lg:mb-4" >
        <div class="w-1/2 lg:w-1/4 ">
            <button class="btn btn-outline"on:click={()=>volver()}>
                <span class="text-xl">Volver</span>
            </button>  
        </div>
        <div class="w-1/2 lg:w-1/4 px-1 ">
            <button class="btn btn-outline" on:click={exportarXLSX}>
                <span class="text-xl">Exportar EXCEL</span>
            </button>
        </div>
        <div class="w-1/2 lg:w-1/4 mt-1 lg:mt-0">
            <button class="btn btn-outline" on:click={()=>exportarAgrupar(false)}>
                <span class="text-xl">Excel por abrazadora</span>
            </button>
        </div>
        <div class="w-1/2 lg:w-1/4 mt-1   lg:mt-0">
            <button class="btn btn-outline" on:click={()=>exportarAgrupar(true)}>
                <span class="text-xl">Excel por bebé</span>
            </button>
        </div>
    </div>
    <div class="grid grid-cols-2 lg:grid-cols-4 mx-1 lg:mx-10 mb-1" >
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
        <div class="mt-3 lg:mt-0">
            <label class="block uppercase tracking-wide text-xs font-bold" for="grid-first-name">
                Bebes    
            </label>
            <select class="select select-bordered" name="bebes" id="bebes" bind:value={idbebebuscar} on:change={filterUpdate}>
                <option value={""}>{`Todos`}</option>
                {#each bebes as b}
                    <option value={b.id}>{`${acortarPalabra(b.apellidomama)}(${acortarPalabra(b.nombre)})`}</option>
                    
                {/each}
            </select>
        </div>
        <div class="mt-3 lg:mt-0">
            <label class="block uppercase tracking-wide text-xs font-bold" for="grid-first-name">
                Voluntaria    
            </label>
            <select class="select select-bordered" name="bebes" id="bebes" bind:value={idabrazadorabuscar} on:change={filterUpdate}>
                <option value={""}>{`Todas`}</option>
                {#each abrazadoras as a}
                    
                    <option value={a.id}>{`${a.apellido},${acortarPalabra(a.name)}`}</option>
                {/each}
            </select>
        </div>
    </div>
    <div class="grid grid-cols-2 lg:grid-cols-4 mx-1 lg:mx-10 mb-1 mt-3">
        <div class="">
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
    
    
        
    <div class="w-full grid justify-items-left mx-1 lg:mx-10 mt-3">
        <h1 class="text-xl font-bold italic">HISTORIAL ABRAZOS</h1>  
    </div>
    <table class="table table-lg w-full lg:mx-10">
        <thead>
            <tr>
                <th class="text-base ml-3 pl-3 mr-1 pr-1 ">Fecha</th>
                <th class="text-base mx-1 px-1">Bebe</th>
                <th class="text-base mx-1 px-1">Abrazadora</th>
                <th class="text-base mx-1 px-1">Acciones</th>
            </tr>
        </thead>
        <tbody>
            {#each abrazosrows as a}
                <tr>
                    <td class="text-base ml-3 pl-3 mr-1 pr-1 lg:ml-10">{new Date(a.fecha).toLocaleDateString()}</td>
                    <td class="text-base mx-1 px-1">
                        {`${a.expand.bebe.apellidomama},\n${a.expand.bebe.nombremama}\n(${a.expand.bebe.nombre})`}
                    </td>
                    <td class="text-base mx-1 px-1">
                        {`${a.expand.abrazadora.apellido},\n${a.expand.abrazadora.name}`}
                    </td>
                    <td class="flex gap-2 text-base mx-1 px-1">
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
                    <span class="label-text text-base">Fecha*</span>
                </label>
                <label class="input-group">
                    <input id ="fecha" type="date"
                        class="input input-bordered" 
                        bind:value={fechaabrazo}
                        on:change={()=>onChangeInput("FECHA")}
                    />
                    <div class={`label ${malfecha?"":"hidden"}`}>
                        <span class="label-text-alt text-red-400">Error debe seleccionar una fecha</span>
                    </div>
                </label>
                <label for="bebe" class="label">
                    <span class="label-text text-base">Bebé</span>
                </label>
                <label class="input-group">
                    <input id ="bebe" type="text" disabled class="input input-bordered" bind:value={nombrebebe}/>
                </label>
                <label for="abrazadora" class="label">
                    <span class="label-text text-base">Abrazadora</span>
                </label>
                <label class="input-group">
                    <input id ="abrazadora" type="text" disabled  class="input input-bordered" bind:value={nombreabrazadora}/>
                </label>
                <label class="form-control w-3/5">
                    <div class="label">
                        <span class="label-text text-base">Unidad*</span>
                    </div>
                    <select 
                        class={`input input-bordered ${malubicacion?"input-error":""}`}  
                        name="ubicacion" 
                        id="ubicacion" 
                        bind:value={ubicacion}
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
                <label class="form-control w-3/5">
                    <div class="label">
                        <span class="label-text text-base">Turno*</span>
                    </div>
                    <select 
                    class={`input input-bordered ${malturno?"input-error":""}`} 
                        name="turno" id="turno" 
                        bind:value={turno}
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
    
</Navbarr>