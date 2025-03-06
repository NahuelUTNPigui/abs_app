<script>
    import Navbarr from '$lib/Navbarr.svelte';
    import Swal from 'sweetalert2'
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
    function mostrarNumero(numero){
        Swal.fire({
            title:"Numero de la abrazadora",
            text:"Numero: "+numero,
            icon:'info'
        })
    }
    export let data
    let dianum = new Date().getDay()
    let schdia = data.lunes
    let partehoy = data.partehoy
    let parteayer = data.parteayer
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
    <div class="justify-items-center mx-1 lg:mx-5">
        <div class="card bg-base-100 shadow-xl w-full">
            <div class="card-body">
                <h2 class="card-title text-xl">CRONOGRAMA {diasemana(new Date().getDay()).toUpperCase()}</h2>
                <div class="grid grid-cols-2">
                    <div >
                        <h2 class="text-lg font-normal italic">Mañana</h2>
                        <ul class="list-disc m-2">
                            {#each schdia.man as v}
                                <li>{v}</li>    
                            {/each}
                        </ul>
                    </div>
                    <div >
                        <h2 class="text-lg font-normal italic">Tarde</h2>
                        <ul class="list-disc">
                            {#each schdia.tar as v}
                                <li>{v}</li>    
                            {/each}
                        </ul>
                    </div>
                    
                </div>
                <div class="grid grid-cols-1 mb-0">
                    <h2 class="text-lg font-semibold mb-0">Backup</h2>
                </div>
                <div class="grid grid-cols-2">
                    <div >
                        <h2 class="text-lg font-normal italic">Mañana</h2>
                        <ul class="list-disc">
                            {#each schdia.manback as v}
                                <li>
                                    <span class="texto">{v.split("-")[0]}</span>
                                    <span class="icono">
                                        <button on:click={()=>mostrarNumero(v.split("-")[1])}   >
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-3" >
                                                <path fill-rule="evenodd" d="M1.5 4.5a3 3 0 0 1 3-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 0 1-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 0 0 6.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 0 1 1.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 0 1-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5Z" clip-rule="evenodd" />
                                            </svg>
                                        </button>
                                        
                                    </span>                                    
                                </li>
                            {/each}
                        </ul>
                    </div>
                    <div >
                        <h2 class="text-lg font-normal italic">Tarde</h2>
                        <ul class="list-disc">
                            {#each schdia.tarback as v}
                                <li>
                                    <span class="texto">{v.split("-")[0]}</span>
                                    <span class="icono">
                                        <button on:click={()=>mostrarNumero(v.split("-")[1])}   >
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-3" >
                                                <path fill-rule="evenodd" d="M1.5 4.5a3 3 0 0 1 3-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 0 1-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 0 0 6.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 0 1 1.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 0 1-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5Z" clip-rule="evenodd" />
                                            </svg>
                                        </button>
                                        
                                    </span>                                    
                                </li>   
                            {/each}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        {#if partehoy}
            <dir class="card bg-base-100 shadow-xl w-full mx-0 px-0">
                <div class="card-body">
                    <h2 class="card-title text-xl">PARTE {new Date(partehoy.fecha).toLocaleDateString()}</h2>
                    <h3 class="card-title text-lg">Turno :{partehoy.turno}</h3>
                    <div class="grid grid-cols-1">
                        <p class="text-md">
                            {partehoy.parte}
                        </p>
                    </div>
                    <div class="grid grid-cols-2">
                        <span class="text-xs">
                            {`Registrado por: ${partehoy.expand.registrado.apellido}, ${partehoy.expand.registrado.name}`}
                        </span>
                        {#if partehoy.expand.modificado}
                            <span class="text-xs">
                                {`Modificado por: ${partehoy.expand.modificado.apellido}, ${partehoy.expand.modificado.name}`}
                            </span>
                        {/if}
                    </div>
                </div>
            </dir>
        {/if}
        {#if parteayer}
            <dir class="card bg-base-100 shadow-xl w-full mx-0 px-0">
                <div class="card-body">
                    <h2 class="card-title text-xl">PARTE {new Date(parteayer.fecha).toLocaleDateString()}</h2>
                    <h3 class="card-title text-lg">Turno :{parteayer.turno}</h3>
                    <div class="grid grid-cols-1">
                        <p class="text-md">
                            {parteayer.parte}
                        </p>
                        
                    </div>
                    <div class="grid grid-cols-2">
                        <span class="text-xs">
                            {`Registrado por: ${parteayer.expand.registrado.apellido}, ${parteayer.expand.registrado.name}`}
                        </span>
                        {#if parteayer.expand.modificado}
                            <span class="text-xs">
                                {`Modificado por: ${parteayer.expand.modificado.apellido}, ${parteayer.expand.modificado.name}`}
                            </span>
                        {/if}
                    </div>
                </div>
            </dir>    
        {/if}
    </div>
</Navbarr>

