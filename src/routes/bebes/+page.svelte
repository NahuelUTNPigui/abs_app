<script>
  import Navbarr from '$lib/Navbarr.svelte';
  import Swal from 'sweetalert2'
  import PocketBase from 'pocketbase'
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  let ruta = import.meta.env.VITE_RUTA
  const pb = new PocketBase(ruta);
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
  let fechanacimiento = ""
  let prioridad = 1 
  let nombrebuscar=""
  let opcionesegresos=[{nombre:"Sin fecha egreso"},{nombre:"Todos"}]
  let conegreso = opcionesegresos[0].nombre
  let opcionesdisponibilidad=[{nombre:"Todos"},{nombre:"Disponibles"},{nombre:"No disponibles"}]
  let ubicaciones =[{nombre:"UTI1"},{nombre:"UTI2"},{nombre:"UTI3"},{nombre:"UCI1"},{nombre:"UCI2"},{nombre:"UCI3"},{nombre:"Prealta"}]
  let turnos=[{nombre:"Mañana"},{nombre:"Tarde"}]
  
  let idbebeabrazo = ""
  let idabrazadora=""
  let fechaabrazo=""
  let turno = ""
  let ubicacion = ""
  let disponible = true
  let iddisponible="Todos"
  onMount(async () =>{
    let pb_json = await JSON.parse(localStorage.getItem('pocketbase_auth'))
    usuarioid = pb_json.model.id
    escoordinador = pb_json.model.coordinador
    const recordsb = await pb.collection('bebes').getFullList({filter:"active=true"});

    bebes = recordsb
    bebesrows = recordsb
    bebesrows = bebesrows.filter(b=>b.fechaegreso=="")
    bebesselect = recordsb
    bebesselect.sort((b1,b2)=>b1.nombre>b2.nombre?1:-1)

    
    const recordsv = await pb.collection('users').getFullList({filter:"active=true"});
    abrazadorasselect = recordsv
    abrazadorasselect.sort((a1,a2)=>a1.name>a2.name?1:-1)


  })
  function openModal(id){
    idbebe = id
    if(idbebe == ""){
        nombrebebe=""
        nombremama=""
        apellidomama = ""
        fechaingreso = ""
        fechaegreso = ""
        fechanacimiento = ""
        prioridad = 1
    }
    else{
        let bebe = bebes.filter(b=>b.id===idbebe)[0]
        nombrebebe=bebe.nombre
        nombremama=bebe.nombremama
        apellidomama = bebe.apellidomama
        fechaingreso = bebe.fechaingreso.split(' ')[0]
        fechaegreso = bebe.fechaegreso?bebe.fechaegreso.split(' ')[0]:''
        fechanacimiento = bebe.fechanacimiento.split(' ')[0]
        prioridad = bebe.prioridad
        disponible = bebe.disponible
    }
    formModal.showModal()
  }
  function openModalAbrazo(id){
    idbebeabrazo = id
    formAbrazo.showModal()
  }
  async function guardarabrazo(){
    let data = {
      bebe:idbebeabrazo,
      abrazadora:idabrazadora,
      turno,
      ubicacion,
      fecha:fechaabrazo+" 03:00:00",
      active:true
    }
    try{
      const recorda = await pb.collection('abrazos').create(data)
      Swal.fire('Éxito guardar', 'Abrazo guardado con éxito', 'success');
      
    }
    catch(e){
      Swal.fire('Error guardar', 'No se pudo guardar el abrazo', 'error');
    }
    idbebeabrazo = ""
    idabrazadora = ""
    turno = ""
    ubicacion = ""
    fechaabrazo = ""

  }
  function cerrar(){
    idbebeabrazo = ""
    idabrazadora = ""
    turno = ""
    ubicacion = ""
    fechaabrazo = ""
  }
  function eliminar(id){
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
                bebesrows = bebes
                nombrebebe=""
                nombremama=""
                apellidomama = ""
                fechaingreso = ""
                fechaegreso = ""
                prioridad = 1
                Swal.fire('Bebe eliminado!', 'Se eliminó al bebé correctamente.', 'success');
            }
            catch(e){
                Swal.fire('Acción cancelada', 'No se pudo eliminar al bebe', 'error');
            }
        }
        else if(result.dismiss === Swal.DismissReason.cancel){
            Swal.fire('Acción cancelada', 'Se canceló la accion', 'error');
        }
        
        
    })
  }
  function isEmpty(str) {
    return (!str || str.length === 0 );
  }
  function validarform(){
    if(isEmpty(nombrebebe)){
        Swal.fire('Error guardar', 'El nombre del bebe esta vacio', 'error');
        return false
    }
    if(isEmpty(nombremama)){
        Swal.fire('Error guardar', 'El nombre de la mamá esta vacio', 'error');
        return false
    }
    if(isEmpty(apellidomama)){
        Swal.fire('Error guardar', 'El apellido de la mamá esta vacio', 'error');
        return false
    }
    if(isEmpty(fechaingreso)){
        Swal.fire('Error guardar', 'Debe seleccionar la fecha ingreso', 'error');
        return false
    }
    return true

  }
  async function guardar(){
    let valido = validarform()
    if(!valido){
        return
    }

    if(idbebe ==""){
        let data = {
            nombre:nombrebebe,
            nombremama,
            apellidomama,
            fechaingreso:fechaingreso +' 03:00:00.000Z' ,
            fechanacimiento:fechanacimiento +' 03:00:00.000Z' ,
            prioridad,
            active : true,
            disponible : true
        }
        try{
            const recordb = await pb.collection('bebes').create(data)
            const recordsb = await pb.collection('bebes').getFullList({filter:"active=true"});
            bebes = recordsb
            filterupdate()
            nombrebebe=""
            nombremama=""
            apellidomama = ""
            fechaingreso = ""
            fechaegreso = ""
            prioridad = 1
            Swal.fire('Éxito guardar', 'Bebé guardado con éxito', 'success');
        }
        catch(e){
            Swal.fire('Error guardar', 'No se pudo guardar al bebé', 'error');
        }
    }
    else{
        let data = {
            nombre:nombrebebe,
            nombremama,
            apellidomama,
            fechaingreso:fechaingreso +' 03:00:00.000Z',
            fechanacimiento:fechanacimiento +' 03:00:00.000Z' ,
            prioridad,
            disponible
        }
        if(fechaegreso != ""){

            data.fechaegreso = fechaegreso +' 03:00:00.000Z'
        }
        try{

            const recordb = await pb.collection('bebes').update(idbebe,data)
            const recordsb = await pb.collection('bebes').getFullList({filter:"active=true"});
            bebes = recordsb
            filterupdate()
            nombrebebe=""
            nombremama=""
            apellidomama = ""
            fechaingreso = ""
            fechaegreso = ""
            prioridad = 1
            Swal.fire('Éxito editar', 'Bebé editado con éxito', 'success');
        }
        catch(e){
            Swal.fire('Error editar', 'No se pudo editar al bebé', 'error');
        }
    }
  }
  function filterupdate(){
    bebesrows = bebes
    if(conegreso=="Sin fecha egreso"){
        bebesrows = bebesrows.filter(b=>b.fechaegreso=="")
    }
    if(iddisponible!="Todos"){
        if(iddisponible=="Disponibles"){
            bebesrows = bebesrows.filter(b=>b.disponible)
        }
        else{
            bebesrows = bebesrows.filter(b=>!b.disponible)
        }
    }
    bebesrows = bebesrows.filter(b=>{
        if(b.nombre.toLowerCase().includes(nombrebuscar.toLowerCase()) ){
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
</script>
<Navbarr>
    <div class="justify-start mx-2 lg:mx-10">
      <h1 class="text-xl font-bold italic md:mx-3 sm:mx-4 lg:mx-10">BEBÉS</h1>  
    </div>
    <div class="w-full grid justify-items-center lg:m-20 lg:w-3/4  ">
        <div class="flex m-1 gap-1 lg:gap-10" >
            <label for="opcionegresos">Buscar por:</label>
            <select id="opcionegreso" name="opcionegreso" class="select select-bordered" bind:value={ conegreso} on:change={filterupdate}>
                {#each opcionesegresos as o}
                    <option value={o.nombre}>{o.nombre}</option>
                {/each}

            </select>
            <select id="opciondisp" name="opciondisp" class="select select-bordered" bind:value={ iddisponible} on:change={filterupdate}>
                {#each opcionesdisponibilidad as o}
                    <option value={o.nombre}>{o.nombre}</option>
                {/each}

            </select>
        </div>
        <div class="flex m-1 gap-1 lg:gap-10" >
            <div class="w-2/5">
              <label class="input input-bordered flex items-center gap-2">
                <input type="text" class="grow" placeholder="Buscar.." bind:value={nombrebuscar} on:input={filterupdate} />
                
              </label>
            </div>
            <button class="btn btn-primary text-white " on:click={()=>openModal("")}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4 lg:size-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              <span class="text-xl"> bebé</span>
            </button>  
            <br>
        </div>
        <table class="table table-lg" >
            <thead>
                <tr>
                    <th class="text-base">Nombre bebé</th>
                    <th class="text-base">Mamá</th>
                    <th class="text-base">Acciones</th>
                </tr>
            </thead>
            <tbody>
                {#each bebesrows as b}
                    <tr>
                       <td class="text-base">{b.nombre}</td> 
                       <td class="text-base">{b.nombremama}, {b.apellidomama}</td> 
                       <td>
                        <!--<div class="tooltip" data-tip="Abrazar">
                          <button on:click={()=>openModalAbrazo(b.id)}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-4">
                                <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
                            </svg>                              
                          </button>
                        </div>-->
                        <div class="tooltip" data-tip="Editar">
                          <button on:click={()=>openModal(b.id)}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-4">
                              <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32L19.513 8.2Z" />
                            </svg>
                          </button>
                        </div>
                        <div class="tooltip" data-tip="Historial abrazos">
                            <button on:click={()=>historialbebe(b.id)}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-4">
                                    <path d="M3.375 3C2.339 3 1.5 3.84 1.5 4.875v.75c0 1.036.84 1.875 1.875 1.875h17.25c1.035 0 1.875-.84 1.875-1.875v-.75C22.5 3.839 21.66 3 20.625 3H3.375Z" />
                                    <path fill-rule="evenodd" d="m3.087 9 .54 9.176A3 3 0 0 0 6.62 21h10.757a3 3 0 0 0 2.995-2.824L20.913 9H3.087Zm6.163 3.75A.75.75 0 0 1 10 12h4a.75.75 0 0 1 0 1.5h-4a.75.75 0 0 1-.75-.75Z" clip-rule="evenodd" />
                                </svg>                                  
                            </button>
                        </div>
                        <div class="tooltip" data-tip="Eliminar">
                          <button on:click={()=>eliminar(b.id)}>
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
        <dialog id="formModal" class="modal">
            <div class="modal-box w-11/12 max-w-1md">
                {#if idbebe==""}
                    <h3 class="text-lg font-bold">Nuevo bebé</h3>  
                {:else}
                    <h3 class="text-lg font-bold">Editar bebé</h3>  
                {/if}
                <div class="form-control">
                    <label for = "nombre" class="label">
                        <span class="label-text text-base">Nombre</span>
                    </label>
                    <label class="input-group">
                        <input id ="nombre" type="text"  class="input input-bordered" bind:value={nombrebebe}/>
                    </label>
                    <label for = "nombremama" class="label">
                        <span class="label-text text-base">Nombre Madre</span>
                    </label>
                    <label class="input-group">
                        <input id ="nombremama" type="text"  class="input input-bordered" bind:value={nombremama}/>
                    </label>
                    <label for = "apellidomama" class="label">
                        <span class="label-text text-base">Apellido Madre</span>
                    </label>
                    <label class="input-group">
                        <input id ="apellidomama" type="text"  class="input input-bordered" bind:value={apellidomama}/>
                    </label>
                    <label for = "fechanacimiento" class="label">
                        <span class="label-text text-base">Fecha nacimiento</span>
                    </label>
                    <label class="input-group ">
                        <input id ="fechanacimiento" type="date"  class="input input-bordered" bind:value={fechanacimiento}/>
                    </label>
                    <label for = "fechaingreso" class="label">
                        <span class="label-text text-base">Fecha ingreso</span>
                    </label>
                    <label class="input-group ">
                        <input id ="fechaingreso" type="date"  class="input input-bordered" bind:value={fechaingreso}/>
                    </label>
                    {#if idbebe !=''}
                        <label for = "fechaegreso" class="label">
                            <span class="label-text text-base">Fecha egreso</span>
                        </label>
                        <label class="input-group">
                            <input id ="fechaegreso" type="date"  class="input input-bordered" bind:value={fechaegreso}/>
                        </label>
                    {/if}
                    <label class="form-control w-3/5">
                        <div class="label">
                          <span class="label-text">Prioridad</span>
                        </div>
                        <select class="select select-bordered" bind:value={prioridad}>
                            {#each prioridades as p}
                                <option value={p.id}>{p.desc}</option>
                            {/each}

                        </select>
                    </label>
                    {#if idbebe !=''}
                        <label class="form-control w-3/5">
                            <div class="label">
                            <span class="label-text">Disponible</span>
                            </div>
                            <select class="select select-bordered" bind:value={disponible}>
                                <option value={true}>{"Disponible"}</option>
                                <option value={false}>{"No disponible"}</option>
                                

                            </select>
                        </label>
                    {/if}
                    
                </div>
                <div class="modal-action justify-start">
                    <form method="dialog">
                      <!-- if there is a button, it will close the modal -->
                      <button class="btn btn-success" on:click={guardar}>Guardar</button>
                      <button class="btn btn-error">Cancelar</button>
                    </form>
                </div>
            </div>
        </dialog>
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
                      <select class="select select-bordered" name="bebes" id="bebes" bind:value={idbebeabrazo}>
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
                    <button class="btn btn-success" on:click={guardarabrazo}>Guardar</button>
                    <button class="btn btn-error" on:click={cerrar}>Cancelar</button>
                  </form>
              </div>
          </div>
      </dialog>
    </div>
</Navbarr>
