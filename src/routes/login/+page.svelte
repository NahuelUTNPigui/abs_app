<script>
    import {enabled} from '$lib/enabled'
    import {usuario} from '$lib/usuario'
    import {coordinadora} from '$lib/coordinadora'
    import Swal from 'sweetalert2'
    import { goto } from '$app/navigation';
    import Oscuro from "$lib/Oscuro.svelte";
    import PocketBase from 'pocketbase'
    let ruta = 'http://127.0.0.1:8090'
    function isEmpty(str) {
        return (!str || str.length === 0 );
    }
    async function ingresar(){
        if(isEmpty(usuarioname)){
            Swal.fire('Error login', 'Nombre usuario vacio', 'error');
            return
        }
        if (isEmpty(contra)){
            Swal.fire('Error login', 'Contraseña vacia', 'error');
            return
        }
        const pb = new PocketBase(ruta);

        try{
            
            const authData = await pb.collection('users').authWithPassword(
                usuarioname,
                contra,
            );

            if(pb.authStore.isValid){
                if(pb.authStore.model.active){
                    // after the above you can also access the auth data from the authStore
                    usuario.set(pb.authStore.token)
                    coordinadora.set(pb.authStore.model.coordinador?"Si":"No")
                    enabled.set("si")
                    goto('/')
                }
                else{
                    Swal.fire('Error login', 'El usuario esta eliminado', 'error');
                }
                
            }
            else{
                Swal.fire('Error login', 'Mal puestas las credenciales', 'error');
            }
        }
        catch(e){
            Swal.fire('Error login', 'No se puede logear, puede que esten mal escritas las credenciales', 'error');
        }
        
    }
    let usuarioname=''
    let contra = ''
</script>
<div class="flex justify-end m-10">
    <Oscuro></Oscuro>
</div>

<div class="grid justify-items-center mt-20 w-full">
    
    <h1 class="text-4xl ">ABRAZADORAS</h1>
    <br>

    <div class="card bg-base-100 w-96 shadow-xl">
        <div class="card-body">
        <h2 class="card-title">Ingresar a la plataforma</h2>
        <div class="form-control">
            <label for = "nombre" class="label">
                <span class="label-text text-lg">Nombre</span>
            </label>
            <label class="input-group">
              <input id ="nombre" type="text"  class="input input-bordered" bind:value={usuarioname}/>
            </label>
            <label for = "nombre" class="label">
                <span class="label-text text-lg">Contraseña</span>
            </label>
            <label class="input-group">
              <input id ="pass" type="password"  class="input input-bordered" bind:value={contra}/>
            </label>
        </div>
        <div class="card-actions justify-start mt-10">
            <button class="btn btn-primary" on:click={ingresar}>Ingresar</button>
        </div>
        </div>
    </div>
</div>