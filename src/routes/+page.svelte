<script>
    import { onMount } from 'svelte';
    import {enabled} from '$lib/enabled'
    import {oscuro} from '$lib/oscuro'
    import { goto } from '$app/navigation';
    onMount(async ()=>{        
        let hab = $enabled
        let osc = $oscuro
        if(hab==="si"){
            goto("/inicio")
        }
        else{
            goto("/login")
        }
        if(osc==="no"){
            document.querySelector("html").setAttribute("data-theme","light") 
        }
        else{
            document.querySelector("html").setAttribute("data-theme","dark") 
        }
        
    })
</script>
<h3>Pagina inicial</h3>