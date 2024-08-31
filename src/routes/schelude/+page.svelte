<script>
    import Navbarr from '$lib/Navbarr.svelte';
    export let data
    let lunes = data.lunes
    let martes = data.martes
    let miercoles = data.miercoles
    let jueves = data.jueves
    let viernes = data.viernes
    let sabado = data.sabado
    let domingo = data.domingo
    
</script>
<Navbarr>
    <div class="w-11/12 ml-5">
        <div >
            <details class="collapse collapse-plus bg-base-200">
                <summary class="collapse-title text-xl font-medium">Lunes</summary>
                <div class="collapse-content">
                    <div class="grid grid-cols-3">
                        <div >
                            <h2 class="text-lg underline">Mañana</h2>
                            <ul class="list-disc m-2">
                                {#each lunes.man as v}
                                    <li>{v}</li>    
                                {/each}
                            </ul>
                        </div>
                        <div >
                            <h2 class="text-lg underline">Tarde</h2>
                            <ul class="list-disc">
                                {#each lunes.tar as v}
                                    <li>{v}</li>    
                                {/each}
                            </ul>
                        </div>
                        <div >
                            <h2 class="text-lg underline">Backup</h2>
                            <ul class="list-disc">
                                {#each lunes.back as v}
                                    <li>{v}</li>    
                                {/each}
                            </ul>
                        </div>
                    </div>
                </div>
            </details>
            <br>
            <details class="collapse collapse-plus bg-base-200">
                <summary class="collapse-title text-xl font-medium">Martes</summary>
                <div class="collapse-content">
                    <div class="grid grid-cols-3">
                        <div >
                            <h2 class="text-lg underline">Mañana</h2>
                            <ul class="list-disc m-2">
                                {#each martes.man as v}
                                    <li>{v}</li>    
                                {/each}
                            </ul>
                        </div>
                        <div >
                            <h2 class="text-lg underline">Tarde</h2>
                            <ul class="list-disc">
                                {#each martes.tar as v}
                                    <li>{v}</li>    
                                {/each}
                            </ul>
                        </div>
                        <div >
                            <h2 class="text-lg underline">Backup</h2>
                            <ul class="list-disc">
                                {#each martes.back as v}
                                    <li>{v}</li>    
                                {/each}
                            </ul>
                        </div>
                    </div>
                </div>
            </details>
            <br>
            <details class="collapse collapse-plus bg-base-200">
                <summary class="collapse-title text-xl font-medium">Miércoles</summary>
                <div class="collapse-content">
                    <div class="grid grid-cols-3">
                        <div >
                            <h2 class="text-lg underline">Mañana</h2>
                            <ul class="list-disc m-2">
                                {#each miercoles.man as v}
                                    <li>{v}</li>    
                                {/each}
                            </ul>
                        </div>
                        <div >
                            <h2 class="text-lg underline">Tarde</h2>
                            <ul class="list-disc">
                                {#each miercoles.tar as v}
                                    <li>{v}</li>    
                                {/each}
                            </ul>
                        </div>
                        <div >
                            <h2 class="text-lg underline">Backup</h2>
                            <ul class="list-disc">
                                {#each miercoles.back as v}
                                    <li>{v}</li>    
                                {/each}
                            </ul>
                        </div>
                    </div>
                </div>
            </details>
            <br>
            <details class="collapse collapse-plus bg-base-200">
                <summary class="collapse-title text-xl font-medium">Jueves</summary>
                <div class="collapse-content">
                    <div class="grid grid-cols-3">
                        <div >
                            <h2 class="text-lg underline">Mañana</h2>
                            <ul class="list-disc m-2">
                                {#each jueves.man as v}
                                    <li>{v}</li>    
                                {/each}
                            </ul>
                        </div>
                        <div >
                            <h2 class="text-lg underline">Tarde</h2>
                            <ul class="list-disc"> 
                                {#each jueves.tar as v}
                                    <li>{v}</li>    
                                {/each}
                            </ul>
                        </div>
                        <div >
                            <h2 class="text-lg underline">Backup</h2>
                            <ul class="list-disc">
                                {#each jueves.back as v}
                                    <li>{v}</li>    
                                {/each}
                            </ul>
                        </div>
                    </div>
                </div>
            </details>
            <br>
            <details class="collapse collapse-plus bg-base-200">
                <summary class="collapse-title text-xl font-medium">Viernes</summary>
                <div class="collapse-content">
                    <div class="grid grid-cols-3">
                        <div >
                            <h2 class="text-lg underline">Mañana</h2>
                            <ul class="list-disc m-2">
                                {#each viernes.man as v}
                                    <li>{v}</li>    
                                {/each}
                            </ul>
                        </div>
                        <div >
                            <h2 class="text-lg underline">Tarde</h2>
                            <ul class="list-disc">
                                {#each viernes.tar as v}
                                    <li>{v}</li>    
                                {/each}
                            </ul>
                        </div>
                        <div >
                            <h2 class="text-lg underline">Backup</h2>
                            <ul class="list-disc">
                                {#each viernes.back as v}
                                    <li>{v}</li>    
                                {/each}
                            </ul>
                        </div>
                    </div>
                </div>
            </details>
            <br>
            <details class="collapse collapse-plus bg-base-200">
                <summary class="collapse-title text-xl font-medium">Sábado</summary>
                <div class="collapse-content">
                    <div class="grid grid-cols-3">
                        <div >
                            <h2 class="text-lg underline">Mañana</h2>
                            <ul class="list-disc m-2">
                                {#each sabado.man as v}
                                    <li>{v}</li>    
                                {/each}
                            </ul>
                        </div>
                        <div >
                            <h2 class="text-lg underline">Tarde</h2>
                            <ul class="list-disc">
                                {#each sabado.tar as v}
                                    <li>{v}</li>    
                                {/each}
                            </ul>
                        </div>
                        <div >
                            <h2 class="text-lg underline">Backup</h2>
                            <ul class="list-disc">
                                {#each sabado.back as v}
                                    <li>{v}</li>    
                                {/each}
                            </ul>
                        </div>
                    </div>
                </div>
            </details>
            <br>
            <details class="collapse collapse-plus bg-base-200">
                <summary class="collapse-title text-xl font-medium">Domingo</summary>
                <div class="collapse-content">
                    <div class="grid grid-cols-3">
                        <div >
                            <h2 class="text-lg underline">Mañana</h2>
                            <ul class="list-disc m-2">
                                {#each domingo.man as v}
                                    <li>{v}</li>    
                                {/each}
                            </ul>
                        </div>
                        <div >
                            <h2 class="text-lg underline">Tarde</h2>
                            <ul class="list-disc">
                                {#each domingo.tar as v}
                                    <li>{v}</li>    
                                {/each}
                            </ul>
                        </div>
                        <div >
                            <h2 class="text-lg underline">Backup</h2>
                            <ul class="list-disc">
                                {#each domingo.back as v}
                                    <li>{v}</li>    
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