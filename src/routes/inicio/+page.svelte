<script>
    import Navbarr from '$lib/Navbarr.svelte';
    function diasemana(dia){
        if(dia == 1){
            return "lunes"
        }
        else if(dia == 2){
            return "martes"
        }
        else if(dia == 3){
            return "miércoles"
        }
        else if(dia == 4){
            return "jueves"
        }
        else if(dia == 5){
            return "viernes"
        }
        else if(dia == 6){
            return "sábado"
        }
        else{
            return "domingo"
        }
    }
    export let data
    let dianum = new Date().getDay()
    let schdia = data.lunes
    if(dianum==1){
        schdia = data.lunes
    }
    else if(dianum == 2){
        schdia = data.martes
    }
    else if(dianum == 3){
        schdia = data.miercoles
    }
    else if(dianum == 4){
        schdia = data.jueves
    }
    else if(dianum == 5){
        schdia = data.viernes
    }
    else if(dianum == 6){
        schdia = data.sabado
    }
    else {
        schdia = data.domingo
    }
</script>
<Navbarr>
    <div class="grid justify-items-center ml-5">
        <div class="card bg-base-100 shadow-xl lg:w-full">
            <div class="card-body">
                <h2 class="card-title">Cronograma {diasemana(new Date().getDay())}</h2>
                <div class="grid grid-cols-3">
                    <div >
                        <h2 class="text-lg underline">Mañana</h2>
                        <ul class="list-disc m-2">
                            {#each schdia.man as v}
                                <li>{v}</li>    
                            {/each}
                        </ul>
                    </div>
                    <div >
                        <h2 class="text-lg underline">Tarde</h2>
                        <ul class="list-disc">
                            {#each schdia.tar as v}
                                <li>{v}</li>    
                            {/each}
                        </ul>
                    </div>
                    <div >
                        <h2 class="text-lg underline">Back</h2>
                        <ul class="list-disc">
                            {#each schdia.back as v}
                                <li>{v}</li>    
                            {/each}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
</Navbarr>

