<script>
  import Navbarr from '$lib/Navbarr.svelte';
  
  import Swal from 'sweetalert2'
  import PocketBase from 'pocketbase'
  import { onMount } from 'svelte';
  import CronogramaModal from './CronogramaModal.svelte';
  import {coordinadora} from '$lib/coordinadora'
  import { goto } from '$app/navigation';
  let ruta = import.meta.env.VITE_RUTA
  const pb = new PocketBase(ruta);
  let usuarioid = ""
  let escoordinador=false
  let voluntarias = []
  let voluntariasrows = []
  let cronogramas = []
  let nombrebuscar = ""
  onMount(async ()=>{
    const recordsv = await pb.collection('users').getFullList({filter:"active=true"});

    voluntarias  = recordsv.sort((v1,v2)=>v1.name.toLowerCase()>v2.name.toLowerCase()?1:-1)
    voluntariasrows = voluntarias
    let pb_json = await JSON.parse(localStorage.getItem('pocketbase_auth'))
    usuarioid = pb_json.model.id
    escoordinador = pb_json.model.coordinador

    const recordscrono = await pb.collection('cronogramas').getFullList({
      expand:"user",
      filter:"user.active=true"
    })
    cronogramas = recordscrono.map(c=>({
      userid:c.expand.user.id,
      id:c.id,
      lunes:{
        turno:c.lunes?c.lunestarde?"tarde":"man":"no",
        fijo:c.lunes?c.lunesback?"emer":"fijo":"no"
      },
      martes:{
        turno:c.martes?c.martestarde?"tarde":"man":"no",
        fijo:c.martes?c.martesback?"emer":"fijo":"no"
      },
      miercoles:{
        turno:c.miercoles?c.miercolestarde?"tarde":"man":"no",
        fijo:c.miercoles?c.miercolesback?"emer":"fijo":"no"
      },
      jueves:{
        turno:c.jueves?c.juevestarde?"tarde":"man":"no",
        fijo:c.jueves?c.juevesback?"emer":"fijo":"no"
      },
      viernes:{
        turno:c.viernes?c.viernestarde?"tarde":"man":"no",
        fijo:c.viernes?c.viernesback?"emer":"fijo":"no"
      },
      sabado:{
        turno:c.sabado?c.sabadotarde?"tarde":"man":"no",
        fijo:c.sabado?c.sabadoback?"emer":"fijo":"no"
      },
      domingo:{
        turno:c.domingo?c.domingotarde?"tarde":"man":"no",
        fijo:c.domingo?c.domingoback?"emer":"fijo":"no"
      }
    })
    )    
  })
  let nombre = ""
  let apellido = ""
  let cel = ""
  let idvol = ""
  let contra = ""
  let confirmcontra = ""
  let oldcontra=""
  let coordinador = false
  let cambiarcontra=false
  let cronovol = {
        userid:"",
        id:"",
        lunes:{turno:"no",fijo:"no"},
        martes:{turno:"no",fijo:"no"},
        miercoles:{turno:"no",fijo:"no"},
        jueves:{turno:"no",fijo:"no"},
        viernes:{turno:"no",fijo:"no"},
        sabado:{turno:"no",fijo:"no"},
        domingo:{turno:"no",fijo:"no"}
  }
  function isEmpty(str) {
    return (!str || str.length === 0 );
  }
  function openModal(id){
    idvol = id
    if(idvol===""){
      nombre = ""
      apellido = ""
      cel = ""
      contra = ""
      confirmcontra = ""
      coordinador = false
    }
    else{
      let vol = voluntarias.filter(v=>v.id===idvol)[0]
      nombre = vol.name
      apellido = vol.apellido
      cel = vol.celular
      coordinador = vol.coordinador
    }
    formModal.showModal()
  }
  function openSchModal(id){
    cronovol = cronogramas.filter(c=>c.userid==id)[0]
    schModal.showModal()
  }
  async function eliminar(id){
    let c = $coordinadora
    if(c=="No" || c==""){
      Swal.fire('Error eliminar', 'No tienes permisos para eliminar la voluntaria', 'error');
    }
    Swal.fire({
      title: 'Eliminar voluntaria',
      text: '¿Seguro que deseas eliminar la voluntaria?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No'
    }).then(async result => {
        if (result.value) {
          let data = {
          active:false
        }
        try{
          const recorddel = await pb.collection('users').update(id,data);
          voluntarias = await pb.collection('users').getFullList({filter:"active=true"});
          voluntariasrows = voluntarias
          Swal.fire('Usuaria eliminada!', 'Se eliminó la voluntaria correctamente.', 'success');
        }
        catch(e){
          Swal.fire('Acción cancelada', 'No se pudo eliminar al usuario', 'error');
          
        }
        
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Acción cancelada', 'Se canceló la accion', 'error');
      }
    });
    
  }
  function validarform(esguardar){
    if(esguardar){
      if(isEmpty(nombre)){
        Swal.fire('Error guardar', 'El nombre esta vacio', 'error');
        return false
      }
      if(isEmpty(apellido)){
        Swal.fire('Error guardar', 'El apellido esta vacio', 'error');
        return false
      }
      if(isEmpty(contra)){
        Swal.fire('Error guardar', 'La contraseña esta vacia esta vacio', 'error');
        return false
      }
      if(contra.length < 10){
        Swal.fire('Error guardar', 'La contraseña debe tener al menos 10 caracteres', 'error');
        return false
      }
      if(contra != confirmcontra){
        Swal.fire('Error guardar', 'La contraseña debe coincidir con el confirmar contraseña', 'error');
        return false
      }
      
    }
    else{
      if(!escoordinador && idvol != usuarioid){
        Swal.fire('Error modificar', 'Solo el usuario o una coordinadora puede modificar los datos', 'error');
        return false
      }
      if(isEmpty(nombre)){
        Swal.fire('Error modificar', 'El nombre esta vacio', 'error');
        return false
      }
      if(isEmpty(apellido)){
        Swal.fire('Error modificar', 'El apellido esta vacio', 'error');
        return false
      }
      if(cambiarcontra){
        if(contra.length < 10){
          Swal.fire('Error modificar', 'La contraseña debe tener al menos 10 caracteres', 'error');
          return false
        }
        if(contra != confirmcontra){
          Swal.fire('Error modificar', 'La contraseña debe coincidir con el confirmar contraseña', 'error');
          return false
        }
        if(oldcontra==""){
          Swal.fire('Error modificar', 'La contraseña vieja no puede estar vacia', 'error');
          return false
        }
      }
    }
    return true
  }
  async function guardar(){
    let c = $coordinadora
    if(idvol=="" && (c=="No" || c=="")){
      Swal.fire('Error guardar', 'No tienes permisos para guardar la voluntaria', 'error');
      return
    }
    if(idvol ==""){
      let valido = validarform(true)
      if (!valido){
       return
      }
      let data = {
        username : (nombre+apellido).toLowerCase()+"_abs",
        name:nombre,
        email: (nombre+apellido).toLowerCase()+"@abs.com",
        emailVisibility: true,
        apellido:apellido,
        password: contra,
        passwordConfirm: confirmcontra,
        coordinador: coordinador,
        celular:cel,
        active: true
      }
      
      try{
        const recordc = await pb.collection('users').create(data);
        voluntarias = await pb.collection('users').getFullList({filter:"active=true"});
        voluntariasrows = voluntarias
        nombre = ""
        apellido = ""
        cel = ""
        idvol = ""
        contra = ""
        confirmcontra = ""
        coordinador = false
        let datacrono={
          user:recordc.id,
          lunes:false,
          lunestarde:false,
          lunesback:false,
          martes:false,
          martestarde:false,
          martesback:false,
          miercoles:false,
          miercolestarde:false,
          miercolesback:false,
          jueves:false,
          juevestarde:false,
          juevesback:false,
          viernes:false,
          viernestarde:false,
          viernesback:false,
          sabado:false,
          sabadotarde:false,
          sabadoback:false,
          domingo:false,
          domingotarde:false,
          domingoback:false,
        }
        const nuevocrono = await pb.collection('cronogramas').create(datacrono)
        const recordscrono = await pb.collection('cronogramas').getFullList({
          expand:"user",
          filter:"user.active=true"
        })
        cronogramas = recordscrono.map(c=>({
          userid:c.expand.user.id,
          id:c.id,
          lunes:{
            turno:c.lunes?c.lunestarde?"tarde":"man":"no",
            fijo:c.lunes?c.lunesback?"emer":"fijo":"no"
          },
          martes:{
            turno:c.martes?c.martestarde?"tarde":"man":"no",
            fijo:c.martes?c.martesback?"emer":"fijo":"no"
          },
          miercoles:{
            turno:c.miercoles?c.miercolestarde?"tarde":"man":"no",
            fijo:c.miercoles?c.miercolesback?"emer":"fijo":"no"
          },
          jueves:{
            turno:c.jueves?c.juevestarde?"tarde":"man":"no",
            fijo:c.jueves?c.juevesback?"emer":"fijo":"no"
          },
          viernes:{
            turno:c.viernes?c.viernestarde?"tarde":"man":"no",
            fijo:c.viernes?c.viernesback?"emer":"fijo":"no"
          },
          sabado:{
            turno:c.sabado?c.sabadotarde?"tarde":"man":"no",
            fijo:c.sabado?c.sabadoback?"emer":"fijo":"no"
          },
          domingo:{
            turno:c.domingo?c.domingotarde?"tarde":"man":"no",
            fijo:c.domingo?c.domingoback?"emer":"fijo":"no"
          }
        }))
        Swal.fire('Éxito guardar', 'Voluntaria guardada con éxito', 'success');
      }
      catch(e){
        Swal.fire('Error guardar', 'No se pudo guardar la voluntaria', 'error');

      }
    }
    else{
      let valido = validarform(false)
      if (!valido){
        return
      }
      let data = {
        username : (nombre+apellido).toLowerCase()+"_abs",
        name:nombre,
        //email: (nombre+apellido).toLowerCase()+"@abs.com",
        //emailVisibility: true,
        apellido:apellido,
        coordinador: coordinador,
        celular:cel
      }
      if(cambiarcontra){
        data.password = contra
        data.passwordConfirm = confirmcontra
        data.oldPassword=oldcontra
      }

      try{
        const recordu = await pb.collection('users').update(idvol,data);
        voluntarias = await pb.collection('users').getFullList({filter:"active=true"});
        voluntariasrows = voluntarias
        nombre = ""
        apellido = ""
        cel = ""
        idvol = ""
        coordinador = false
        contra =""
        confirmcontra=""
        cambiarcontra =false
        oldcontra=""
        
        const recordscrono = await pb.collection('cronogramas').getFullList({
          expand:"user",
          filter:"user.active=true"
        })
        cronogramas = recordscrono.map(c=>({
          userid:c.expand.user.id,
          id:c.id,
          lunes:{
            turno:c.lunes?c.lunestarde?"tarde":"man":"no",
            fijo:c.lunes?c.lunesback?"emer":"fijo":"no"
          },
          martes:{
            turno:c.martes?c.martestarde?"tarde":"man":"no",
            fijo:c.martes?c.martesback?"emer":"fijo":"no"
          },
          miercoles:{
            turno:c.miercoles?c.miercolestarde?"tarde":"man":"no",
            fijo:c.miercoles?c.miercolesback?"emer":"fijo":"no"
          },
          jueves:{
            turno:c.jueves?c.juevestarde?"tarde":"man":"no",
            fijo:c.jueves?c.juevesback?"emer":"fijo":"no"
          },
          viernes:{
            turno:c.viernes?c.viernestarde?"tarde":"man":"no",
            fijo:c.viernes?c.viernesback?"emer":"fijo":"no"
          },
          sabado:{
            turno:c.sabado?c.sabadotarde?"tarde":"man":"no",
            fijo:c.sabado?c.sabadoback?"emer":"fijo":"no"
          },
          domingo:{
            turno:c.domingo?c.domingotarde?"tarde":"man":"no",
            fijo:c.domingo?c.domingoback?"emer":"fijo":"no"
          }
        }))
        Swal.fire('Éxito editar', 'Voluntaria editada con éxito', 'success');
      }
      catch(e){
        Swal.fire('Error editar', 'No se pudo editar la voluntaria', 'error');
      }
    }
    
  }
  function filterupdate(){
    voluntariasrows = voluntarias.filter(v=>{
      
      if(v.name.toLowerCase().includes(nombrebuscar.toLowerCase()) ||v.apellido.toLowerCase().includes(nombrebuscar.toLowerCase())){
        return true
      }
      else{
        return false
      }
    })
  }
  async function darAbrazo(id){

  }
  function historialabrazadora(id){
    goto("/abrazos/abrazadora/"+id)
  }
  
</script>
<Navbarr>
  
  
  
  <div class="w-full grid justify-items-center lg:m-20 lg:w-3/4  ">
    
    <div class="w-full grid justify-items-left mx-10">
      <h1 class="text-xl font-bold italic md:mx-3 sm:mx-3 lg:mx-5">ABRAZADORAS</h1>  
    </div>
    <div class="flex m-1 gap-2 lg:gap-10" >
        <div class="w-2/5 my-1">
        
          <label class="input input-bordered flex items-center gap-2">
            <input type="text" class="grow" placeholder="Buscar.." bind:value={nombrebuscar} on:input={filterupdate}/>

            
          </label>
        </div>
        <button class="btn btn-primary text-white " on:click={()=>openModal("")}>
            <!--<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4 lg:size-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>-->

            <span class="text-xl">Nueva Abrazadora</span>
        </button>  
          <br>
    </div>
    
    
    
    <table class="table table-lg" >
      <!-- head -->
      <thead>
        <tr>
          <th class="text-base">Nombre Abrazadora</th>
          <th class="text-base">Acciones</th>
        </tr>
      </thead>
      <tbody>
        {#each voluntariasrows as v}
        <tr>
          <td class="text-base">{v.name}, {v.apellido}</td>
          <td>

            <div class="tooltip" data-tip="Cronograma">
              <button on:click={()=>openSchModal(v.id)}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>              
              </button>
            </div>
            <!--<div class="tooltip" data-tip="Abrazar">
              <button on:click={()=>darAbrazo(v.id)}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-4">
                  <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
                </svg>                                           
              </button>
            </div>
            -->
            <div class="tooltip" data-tip="Historial abrazos">
              <button on:click={()=>historialabrazadora(v.id)}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-4">
                      <path d="M3.375 3C2.339 3 1.5 3.84 1.5 4.875v.75c0 1.036.84 1.875 1.875 1.875h17.25c1.035 0 1.875-.84 1.875-1.875v-.75C22.5 3.839 21.66 3 20.625 3H3.375Z" />
                      <path fill-rule="evenodd" d="m3.087 9 .54 9.176A3 3 0 0 0 6.62 21h10.757a3 3 0 0 0 2.995-2.824L20.913 9H3.087Zm6.163 3.75A.75.75 0 0 1 10 12h4a.75.75 0 0 1 0 1.5h-4a.75.75 0 0 1-.75-.75Z" clip-rule="evenodd" />
                  </svg>                                  
              </button>
            </div>
            <div class="tooltip" data-tip="Editar">
              <button on:click={()=>openModal(v.id)}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-4">
                  <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32L19.513 8.2Z" />
                </svg>
              </button>
            </div>
            <div class="tooltip" data-tip="Eliminar">
              <button on:click={()=>eliminar(v.id)}>
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
        {#if idvol==""}
          <h3 class="text-lg font-bold">Nueva Abrazadora</h3>  
        {:else}
          <h3 class="text-lg font-bold">Editar Abrazadora</h3>  
        {/if}
        <div class="form-control">
          <form action="">
          <label for = "nombre" class="label">
            <span class="label-text text-base">Nombre</span>
          </label>
          <label class="input-group">
            <input id ="nombre" type="text"  class="input input-bordered" bind:value={nombre}/>
          </label>
          <label for = "apellido" class="label">
            <span class="label-text text-base">Apellido</span>
          </label>
          <label class="input-group">
            <input id ="apellido" type="text"  class="input input-bordered" bind:value={apellido}/>
          </label>
          <label for = "cel" class="label ">
            <span class="label-text text-base">Celular</span>
          </label>
          <label class="input-group">
            <input id ="cel" type="text" class="input input-bordered" bind:value={cel}/>
          </label>
          {#if idvol==""}
            <label for = "contra" class="label">
              <span class="label-text text-base">Contraseña</span>
            </label>
            <label class="input-group">
              <input id ="contra" type="password" class="input input-bordered" bind:value={contra} autocomplete="off" />
            </label>
            <label for = "confcontra" class="label">
              <span class="label-text text-base">Confirmar Contraseña</span>
            </label>
            <label class="input-group">
              <input id ="confcontra" type="password" class="input input-bordered" bind:value={confirmcontra} autocomplete="off" />
            </label>
            
          {/if}
          <label class="form-control w-4/5">
            <div class="label">
              <span class="label-text">Coordinador</span>
            </div>
            <select class="select select-bordered" bind:value={coordinador}>
              <option value={true}>Si</option>
              <option value={false}>No</option>
            </select>
          </label>
          {#if idvol !=''}
            <div class="form-group">
              <br>
              <span class="label-text">Cambiar contraseña</span>  
              <br>
              <input type="checkbox" class="toggle" bind:checked={cambiarcontra} />
            </div>
            
            {#if cambiarcontra }
              <label for = "contra2" class="label">
                <span class="label-text text-base">Nueva Contraseña</span>
              </label>
              <label class="input-group">
                <input id ="contra2" type="password" class="input input-bordered" bind:value={contra} autocomplete="off" />
              </label>
              <label for = "confcontra2" class="label">
                <span class="label-text text-base">Confirmar Nueva Contraseña</span>
              </label>
              <label class="input-group">
                <input id ="confcontra2" type="password" class="input input-bordered" bind:value={confirmcontra} autocomplete="off" />
              </label>
              <label for = "confcontra3" class="label">
                <span class="label-text text-base">Escribir la contraseña anterior</span>
              </label>
              <label class="input-group">
                <input id ="confcontra3" type="password" class="input input-bordered" bind:value={oldcontra} autocomplete="off" />
              </label>
            {/if}
          {/if}
        
         </form>
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
    <dialog id="schModal" class="modal">
      <div class="modal-box">
        <CronogramaModal cronovoluntaria={cronovol}></CronogramaModal>
        <div class="modal-action justify-start">
          <form method="dialog">
            <button class="btn btn-error text-gray-100">Cerrar</button>
          </form>
          
        </div>
      </div>
    </dialog>
  </div>
</Navbarr>