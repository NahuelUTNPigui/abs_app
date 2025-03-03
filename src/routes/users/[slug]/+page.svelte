<script>
    import Navbarr from '$lib/Navbarr.svelte';
    import { browser } from "$app/environment"
    import Swal from 'sweetalert2'
    import PocketBase from 'pocketbase'
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    let ruta = import.meta.env.VITE_RUTA
    const pb = new PocketBase(ruta);
    //Datos 
    let email = ""
    let contra = ""
    let confcontra = ""
    let nombre = ""
    let apellido = ""
    let coordinador = false
    
</script>
<Navbarr>

</Navbarr>
