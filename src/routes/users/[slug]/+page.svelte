<script>
    import Navbarr from '$lib/Navbarr.svelte';
    
    import Swal from 'sweetalert2'
    import PocketBase from 'pocketbase'
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    let ruta = import.meta.env.VITE_RUTA
    const pb = new PocketBase(ruta);
</script>
