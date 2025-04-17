<script>
  import Navbarr from '$lib/Navbarr.svelte';
  import Swal from 'sweetalert2'
  import PocketBase from 'pocketbase'
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import disponibilidades from "$lib/disponibilidades"
  import * as XLSX from "xlsx"
  import {isCoordinadora} from "$lib/permisos"
  let ruta = import.meta.env.VITE_RUTA
  const pb = new PocketBase(ruta);
  const HOY = new Date().toISOString().split("T")[0]
  let usuarioid = ""
  let escoordinador=false
  let bebes = []
  // Estoy usando estos datos a lo largo de toda la aplicacion, usar un store?
  let bebesrows=[]
  let bebesselect = []
  let abrazadorasselect = []
  let prioridades = [{id:1,desc:"ALTA"},{id:2,desc:"BAJA"}]
  let idbebe = ""
  let nombrebebe=""
  let nombremama=""
  let apellidomama = ""
  let fechaingreso = ""
  let fechaegreso = ""
  let permisos = 0
  // Es una variable para indicar si el bebe tiene fecha de egreso, si la tiene y esta vacia borrarla
  let confechaegreso = false
  let fechanacimiento = ""
  let prioridad = 1 
  let nombrebuscar=""
  let opcionesegresos=[{nombre:"Sin fecha egreso"},{nombre:"Todos"}]
  
  let conegreso = opcionesegresos[0].nombre
  
  let ubicaciones =[{nombre:"UTI1"},{nombre:"UTI2"},{nombre:"UTI3"},{nombre:"UCI1"},{nombre:"UCI2"},{nombre:"UCI3"},{nombre:"Prealta"}]
  let turnos=[{nombre:"Mañana"},{nombre:"Tarde"}]
  
  let idbebeabrazo = ""
  let idabrazadora=""
  let fechaabrazo=""
  let turno = ""
  let ubicacion = ""
  let disponible = true
  let iddisponible=""

  onMount(async () =>{
    let pb_json = await JSON.parse(localStorage.getItem('pocketbase_auth'))
    usuarioid = pb_json.model.id
    escoordinador = pb_json.model.coordinador
    const recordsb = await pb.collection('bebes').getFullList({filter:"active=true"});
    bebes = recordsb
    bebes.sort((b1,b2)=>b1.apellidomama.toLowerCase()>b2.apellidomama.toLowerCase()?1:-1)
    bebesrows = bebes
    bebesrows = bebesrows.filter(b=>b.fechaegreso=="")
    bebesselect = bebes
    const recordsv = await pb.collection('users').getFullList({filter:"active=true"});
    abrazadorasselect = recordsv
    abrazadorasselect.sort((a1,a2)=>a1.name>a2.name?1:-1)


  })
  function openModal(id){
    goto('/bebes/'+id+"/")
  }
  
 
  
  function eliminar(id){
    if(!escoordinador){
        Swal.fire("Error eliminar","No tienes los permisos para eliminar al bebé","error")
        return 
    }
    
    Swal.fire({
      title: 'Eliminar bebé',
      text: '¿Seguro que deseas eliminar el bebé?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No'
    }).then(async result=>{
        if (result.value){
            try{
                const recordb = await pb.collection('bebes').update(id,{active:false})
                const recordsb = await pb.collection('bebes').getFullList({filter:"active=true"});

                bebes = recordsb
                bebes.sort((b1,b2)=>b1.apellidomama.toLowerCase()>b2.apellidomama.toLowerCase()?1:-1)

                bebesrows = bebes
                filterupdate()
                nombrebebe=""
                nombremama=""
                apellidomama = ""
                fechaingreso = ""
                fechaegreso = ""
                prioridad = 1
                Swal.fire('Bebe eliminado!', 'Se eliminó al bebé correctamente.', 'success');
            }
            catch(e){
                Swal.fire('Error eliminar', 'No se pudo eliminar al bebe', 'error');
            }
        }
        else if(result.dismiss === Swal.DismissReason.cancel){
            Swal.fire('Acción cancelada', 'Se canceló la accion', 'error');
        }
        
        
    })
  }
  
  
  
  function filterupdate(){
    bebesrows = bebes
    if(conegreso=="Sin fecha egreso"){
        bebesrows = bebesrows.filter(b=>b.fechaegreso=="")
    }
    
    if(iddisponible !== ""){
        bebesrows = bebesrows.filter(b=>b.disponibilidad == iddisponible)
        //if(iddisponible == 0){
        //    bebesrows = bebesrows.filter(b=>b.disponibilidad != 3)
        //}
        //else{
        //    bebesrows = bebesrows.filter(b=>b.disponibilidad == iddisponible)
        //}  
    }
    bebesrows = bebesrows.filter(b=>{
        if(b.apellidomama.toLowerCase().startsWith(nombrebuscar.toLowerCase()) ){
        return true
      }
      else{
        return false
      } 
    })
  }
  function historialbebe(id){
    goto("/abrazos/bebe/"+id)
  }
  function getEmojiDisp(disp){
    let d = disponibilidades.filter(di=>di.id == disp)[0]
    return d.emoji
  }
  function getDisponibilidadNombre(id){
    let dis = disponibilidades.filter(d=>d.id==id)
    if(dis.length>0){
        return dis[0].nombre
    }
    else{
        return ""
    }
  }
  function exportarXLSX(historico){
    if(historico){
        console.log("En el momento lo vemos")
    }
    else{
        let csvdata = bebesrows.map(item=>({
            NOMBRE:item.nombre,
            NOMBRE_MAMA:item.nombremama,
            APELLIDO_MAMA:item.apellidomama,
            FECHA_INGRESO:new Date(item.fechaingreso).toLocaleDateString(),
            PESO:item.peso,
            SEXO:item.sexo=="F"?"Femenino":item.sexo=="M"?"Masculino":"",
            UNIDAD:item.unidad,
            NACIMIENTO:new Date(item.fechanacimiento).toLocaleDateString(),
            DISPONIBILIDAD:getDisponibilidadNombre(item.disponibilidad),
            FECHA_EGRESO:item.fechaegreso?new Date(item.fechaegreso).toLocaleDateString():"",
            SEMANAS_GESTACIONAL:item.semanasgestacional,
            NACIMIENTO_MATERNIDAD:item.maternidadnacimiento?"SI":"NO",
            PESO_INGRESO:item.pesoingreso,
            PESO_EGRESO:item.pesoegreso
        }))
        const wb = XLSX.utils.book_new();
        // Abrazos
        const ws = XLSX.utils.aoa_to_sheet([])
        let titulo = "Bebes"
        ws['A1']={t:'s',v:titulo,s:{}}
        const range = XLSX.utils.decode_range('A1:K1');
        ws['!merges'] = [{ s: { r: range.s.r, c: range.s.c }, e: { r: range.e.r, c: range.e.c } }];
        XLSX.utils.sheet_add_json(ws, csvdata, { origin: 'A2' });
        XLSX.utils.book_append_sheet(wb, ws, 'Bebes');
        XLSX.writeFile(wb, `${titulo.replace(/\//g, "-")}.xlsx`, { cellStyles: true });
    }
  }

</script>
<Navbarr>
    <div class="px-1 lg:px-4 mx-1 lg:mx-4">
        <div class="w-full grid justify-items-left mx-1 lg:mx-4">
            <h1 class="">
                <span class="text-xl font-bold italic">BEBÉS</span>
            </h1>
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
            <span class="hidden">
                <div class="badge badge-outline">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="green" class="size-4 mx-1">
                        <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
                    </svg>
                    Alta prioridad
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="purple" class="size-4 mx-1">
                        <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
                    </svg>
                    Disponible
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="red" class="size-4 mx-1">
                        <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
                    </svg>
                    No disponible
                </div>
            </span>
        
        </div>
        
        <div class="grid grid-cols-2 m-1 gap-2 lg:gap-10 mb-2 mt-1 mx-1 lg:mx-4" >
            <div class="w-full hidden">
                <label class="block uppercase tracking-wide text-xs font-bold mb-2" for="grid-first-name">
                    Fecha egreso
                </label>
                <select id="opcionegreso" name="opcionegreso" class="select select-bordered" bind:value={ conegreso} on:change={filterupdate}>
                    {#each opcionesegresos as o}
                        <option value={o.nombre}>{o.nombre}</option>
                    {/each}
                </select>
            </div>
            <div class="w-full">
                <label class="block uppercase tracking-wide text-xs font-bold mb-2" for="grid-first-name">
                    Disponible
                </label>
                <select id="opciondisp" name="opciondisp" class="select select-bordered" bind:value={ iddisponible} on:change={filterupdate}>
                    <option value={""}>Todos</option>
                    {#each disponibilidades as o}
                        <option value={o.id}>{o.nombre}</option>
                    {/each}

                </select>
            </div>
            <div >
                <button class="btn btn-outline btn-lg" on:click={()=>exportarXLSX(false)}>
                    <span class="text-xl">Exportar Excel Bebes</span>
                </button>
            </div> 
            <div class="hidden">
                <button class="btn btn-outline btn-lg" on:click={()=>exportarXLSX(true)}>
                    <span class="text-xl">Exportar Bebes</span>
                </button>
            </div> 
        </div>
        <div class="grid lg:grid-cols-2 m-1 gap-2 lg:gap-10 mb-2 mt-1 mx-1 lg:mx-4" >
            <div class="w-11/12 lg:w-full">
                <label class="input input-bordered flex items-center gap-2">
                    <input type="text" class="grow" placeholder="Buscar por apellido madre.." bind:value={nombrebuscar} on:input={filterupdate} />
                </label>
            </div>
            <div class="w-full">
                <button class="btn btn-primary text-white " on:click={()=>openModal("0")}>
                    <span class="text-xl">Nuevo</span>
                </button>
            </div>
        </div>
        <div class="w-full grid justify-items-center overflow-x-auto">
            <table class="table table-lg w-full" >
                <thead>
                    <tr>
                        <th class="text-base w-3/12"  >Mamá</th>
                        <th class="text-base w-3/12"  >Bebé</th>
                        <th class="text-base w-3/12"  >Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {#each bebesrows as b}
                        <tr>
                        <td class="text-base">
                                {b.apellidomama}, {b.nombremama} {getEmojiDisp(b.disponibilidad)}
                                        
                            </td> 
                        <td class="text-base">
                                {`${b.nombre} (${b.unidad})`  }    
                                
                            </td> 
                        
                        <td class="flex gap-2">
                                <div class="tooltip" data-tip="Historia bebe">
                                    <button on:click={()=>goto('/bebes/historia/'+b.id+"/")}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
                                        </svg>                                      
                                    </button>
                                </div>
                                <div class="tooltip" data-tip="Editar">
                                    <button on:click={()=>openModal(b.id)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-5">
                                        <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32L19.513 8.2Z" />
                                        </svg>
                                    </button>
                                </div>
                                <div class="tooltip" data-tip="Historial abrazos">
                                    <button on:click={()=>historialbebe(b.id)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-5">
                                            <path d="M3.375 3C2.339 3 1.5 3.84 1.5 4.875v.75c0 1.036.84 1.875 1.875 1.875h17.25c1.035 0 1.875-.84 1.875-1.875v-.75C22.5 3.839 21.66 3 20.625 3H3.375Z" />
                                            <path fill-rule="evenodd" d="m3.087 9 .54 9.176A3 3 0 0 0 6.62 21h10.757a3 3 0 0 0 2.995-2.824L20.913 9H3.087Zm6.163 3.75A.75.75 0 0 1 10 12h4a.75.75 0 0 1 0 1.5h-4a.75.75 0 0 1-.75-.75Z" clip-rule="evenodd" />
                                        </svg>                                  
                                    </button>
                                </div>
                                <div class="tooltip" data-tip="Eliminar">
                                    <button on:click={()=>eliminar(b.id)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-5">
                                        <path fill-rule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z" clip-rule="evenodd" />
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

