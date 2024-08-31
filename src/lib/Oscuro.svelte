<script>
    import {oscuro} from '$lib/oscuro'
    function cambiar(){
        let osc = $oscuro
        let light = osc === "no"
        if(light){
            document.querySelector("html").setAttribute("data-theme","dark")   
            oscuro.set("si")
        }
        else{
            
            document.querySelector("html").setAttribute("data-theme","light")   
            oscuro.set("no")
        }
        
        
    }
</script>
<input type="checkbox" value="synthwave" class="toggle theme-controller" on:click={cambiar}/>

