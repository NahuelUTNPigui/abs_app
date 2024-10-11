<script>
    import Navbarr from '$lib/Navbarr.svelte';
    import Swal from 'sweetalert2'
    export let data
    let lunes = data.lunes
    let martes = data.martes
    let miercoles = data.miercoles
    let jueves = data.jueves
    let viernes = data.viernes
    let sabado = data.sabado
    let domingo = data.domingo
    function mostrarNumero(numero){
        Swal.fire({
            title:"Numero de la abrazadora",
            text:"Numero: "+numero,
            icon:'info'
        })
    }
    
</script>
<Navbarr>
    <div class="w-11/12 ml-5">
        <div >
            <details class="collapse collapse-plus bg-base-200">
                <summary class="collapse-title text-xl font-medium">LUNES</summary>
                <div class="collapse-content">
                    <div class="grid grid-cols-2">
                        <div >
                            <h2 class="text-lg font-normal italic">Mañana</h2>
                            <ul class="list-disc m-2">
                                {#each lunes.man as v}
                                    <li>{v}</li>    
                                {/each}
                            </ul>
                        </div>
                        <div >
                            <h2 class="text-lg font-normal italic">Tarde</h2>
                            <ul class="list-disc">
                                {#each lunes.tar as v}
                                    <li>{v}</li>    
                                {/each}
                            </ul>
                        </div>
                        
                    </div>
                    <div class="grid grid-cols-2">
                        <div >
                            <h2 class="text-lg font-normal italic">Backup mañana</h2>
                            <ul class="list-disc">
                                {#each lunes.manback as v}
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
                            <h2 class="text-lg font-normal italic">Backup tarde</h2>
                            <ul class="list-disc">
                                {#each lunes.tarback as v}
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
            </details>
            <br>
            <details class="collapse collapse-plus bg-base-200">
                <summary class="collapse-title text-xl font-medium">MARTES</summary>
                <div class="collapse-content">
                    <div class="grid grid-cols-2">
                        <div >
                            <h2 class="text-lg font-normal italic">Mañana</h2>
                            <ul class="list-disc m-2">
                                {#each martes.man as v}
                                    <li>{v}</li>    
                                {/each}
                            </ul>
                        </div>
                        <div >
                            <h2 class="text-lg font-normal italic">Tarde</h2>
                            <ul class="list-disc">
                                {#each martes.tar as v}
                                    <li>{v}</li>    
                                {/each}
                            </ul>
                        </div>
                        
                    </div>
                    <div class="grid grid-cols-2">
                        <div >
                            <h2 class="text-lg font-normal italic">Backup mañana</h2>
                            <ul class="list-disc">
                                {#each martes.manback as v}
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
                            <h2 class="text-lg font-normal italic">Backup tarde</h2>
                            <ul class="list-disc">
                                {#each martes.tarback as v}
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
            </details>
            <br>
            <details class="collapse collapse-plus bg-base-200">
                <summary class="collapse-title text-xl font-medium">MIÉRCOLES</summary>
                <div class="collapse-content">
                    <div class="grid grid-cols-2">
                        <div >
                            <h2 class="text-lg font-normal italic">Mañana</h2>
                            <ul class="list-disc m-2">
                                {#each miercoles.man as v}
                                    <li>{v}</li>    
                                {/each}
                            </ul>
                        </div>
                        <div >
                            <h2 class="text-lg font-normal italic">Tarde</h2>
                            <ul class="list-disc">
                                {#each miercoles.tar as v}
                                    <li>{v}</li>    
                                {/each}
                            </ul>
                        </div>
                    </div>
                    <div class="grid grid-cols-2">
                        <div >
                            <h2 class="text-lg font-normal italic">Backup mañana</h2>
                            <ul class="list-disc">
                                {#each miercoles.manback as v}
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
                            <h2 class="text-lg font-normal italic">Backup tarde</h2>
                            <ul class="list-disc">
                                {#each miercoles.tarback as v}
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
            </details>
            <br>
            <details class="collapse collapse-plus bg-base-200">
                <summary class="collapse-title text-xl font-medium">JUEVES</summary>
                <div class="collapse-content">
                    <div class="grid grid-cols-2">
                        <div >
                            <h2 class="text-lg font-normal italic">Mañana</h2>
                            <ul class="list-disc m-2">
                                {#each jueves.man as v}
                                    <li>{v}</li>    
                                {/each}
                            </ul>
                        </div>
                        <div >
                            <h2 class="text-lg font-normal italic">Tarde</h2>
                            <ul class="list-disc"> 
                                {#each jueves.tar as v}
                                    <li>{v}</li>    
                                {/each}
                            </ul>
                        </div>
                    </div>
                    <div class="grid grid-cols-2">
                        <div >
                            <h2 class="text-lg font-normal italic">Backup mañana</h2>
                            <ul class="list-disc">
                                {#each jueves.manback as v}
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
                            <h2 class="text-lg font-normal italic">Backup tarde</h2>
                            <ul class="list-disc">
                                {#each jueves.tarback as v}
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
            </details>
            <br>
            <details class="collapse collapse-plus bg-base-200">
                <summary class="collapse-title text-xl font-medium">VIERNES</summary>
                <div class="collapse-content">
                    <div class="grid grid-cols-2">
                        <div >
                            <h2 class="text-lg font-normal italic">Mañana</h2>
                            <ul class="list-disc m-2">
                                {#each viernes.man as v}
                                    <li>{v}</li>    
                                {/each}
                            </ul>
                        </div>
                        <div >
                            <h2 class="text-lg font-normal italic">Tarde</h2>
                            <ul class="list-disc">
                                {#each viernes.tar as v}
                                    <li>{v}</li>    
                                {/each}
                            </ul>
                        </div>
                        
                    </div>
                    <div class="grid grid-cols-2">
                        <div >
                            <h2 class="text-lg font-normal italic">Backup mañana</h2>
                            <ul class="list-disc">
                                {#each viernes.manback as v}
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
                            <h2 class="text-lg font-normal italic">Backup tarde</h2>
                            <ul class="list-disc">
                                {#each viernes.tarback as v}
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
            </details>
            <br>
            <details class="collapse collapse-plus bg-base-200">
                <summary class="collapse-title text-xl font-medium">SÁBADO</summary>
                <div class="collapse-content">
                    <div class="grid grid-cols-2">
                        <div >
                            <h2 class="text-lg font-normal italic">Mañana</h2>
                            <ul class="list-disc m-2">
                                {#each sabado.man as v}
                                    <li>{v}</li>    
                                {/each}
                            </ul>
                        </div>
                        <div >
                            <h2 class="text-lg font-normal italic">Tarde</h2>
                            <ul class="list-disc">
                                {#each sabado.tar as v}
                                    <li>{v}</li>    
                                {/each}
                            </ul>
                        </div>
                    </div>
                    <div class="grid grid-cols-2">
                        <div >
                            <h2 class="text-lg font-normal italic">Backup mañana</h2>
                            <ul class="list-disc">
                                {#each sabado.manback as v}
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
                            <h2 class="text-lg font-normal italic">Backup tarde</h2>
                            <ul class="list-disc">
                                {#each sabado.tarback as v}
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
            </details>
            <br>
            <details class="collapse collapse-plus bg-base-200">
                <summary class="collapse-title text-xl font-medium">DOMINGO</summary>
                <div class="collapse-content">
                    <div class="grid grid-cols-2">
                        <div >
                            <h2 class="text-lg font-normal italic">Mañana</h2>
                            <ul class="list-disc m-2">
                                {#each domingo.man as v}
                                    <li>{v}</li>    
                                {/each}
                            </ul>
                        </div>
                        <div >
                            <h2 class="text-lg font-normal italic">Tarde</h2>
                            <ul class="list-disc">
                                {#each domingo.tar as v}
                                    <li>{v}</li>    
                                {/each}
                            </ul>
                        </div>
                        
                    </div>
                    <div class="grid grid-cols-2">
                        <div >
                            <h2 class="text-lg font-normal italic">Backup mañana</h2>
                            <ul class="list-disc">
                                {#each domingo.manback as v}
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
                            <h2 class="text-lg font-normal italic">Backup tarde</h2>
                            <ul class="list-disc">
                                {#each domingo.tarback as v}
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
            </details>
            <br>
        </div>
    </div>
</Navbarr>
<style>
    .icono,
    .texto {
    vertical-align: middle;
    display: inline-block;
    }
</style>