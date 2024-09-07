<script>
    import PocketBase from 'pocketbase'
    let ruta = import.meta.env.VITE_RUTA
    
    export let cronovoluntaria = {
        userid:"",
        id:"",
        lunes:{turno:"man",fijo:"fijo"},
        martes:{turno:"tarde",fijo:"fijo"},
        miercoles:{turno:"tarde",fijo:"emer"},
        jueves:{turno:"no",fijo:"no"},
        viernes:{turno:"no",fijo:"no"},
        sabado:{turno:"no",fijo:"no"},
        domingo:{turno:"no",fijo:"no"}
    }
    function agregarDia(dia){
        if(dia=="lu"){
            cronovoluntaria.lunes.turno="man"
            cronovoluntaria.lunes.fijo="fijo"
        }
        if(dia=="ma"){
            cronovoluntaria.martes.turno="man"
            cronovoluntaria.martes.fijo="fijo"
        }
        if(dia=="mi"){
            cronovoluntaria.miercoles.turno="man"
            cronovoluntaria.miercoles.fijo="fijo"
        }
        if(dia=="ju"){
            cronovoluntaria.jueves.turno="man"
            cronovoluntaria.jueves.fijo="fijo"
        }
        if(dia=="vi"){
            cronovoluntaria.viernes.turno="man"
            cronovoluntaria.viernes.fijo="fijo"
        }
        if(dia=="sa"){
            cronovoluntaria.sabado.turno="man"
            cronovoluntaria.sabado.fijo="fijo"
        }
        if(dia=="do"){
            cronovoluntaria.domingo.turno="man"
            cronovoluntaria.domingo.fijo="fijo"
        }
    }
    function eliminarDia(dia){
        if(dia=="lu"){
            cronovoluntaria.lunes.turno="no"
            cronovoluntaria.lunes.fijo="no"
        }
        if(dia=="ma"){
            cronovoluntaria.martes.turno="no"
            cronovoluntaria.martes.fijo="no"
        }
        if(dia=="mi"){
            cronovoluntaria.miercoles.turno="no"
            cronovoluntaria.miercoles.fijo="no"
        }
        if(dia=="ju"){
            cronovoluntaria.jueves.turno="no"
            cronovoluntaria.jueves.fijo="no"
        }
        if(dia=="vi"){
            cronovoluntaria.viernes.turno="no"
            cronovoluntaria.viernes.fijo="no"
        }
        if(dia=="sa"){
            cronovoluntaria.sabado.turno="no"
            cronovoluntaria.sabado.fijo="no"
        }
        if(dia=="do"){
            cronovoluntaria.domingo.turno="no"
            cronovoluntaria.domingo.fijo="no"
        }
    }
    async function editarcrono(){
        const pb = new PocketBase(ruta);
        let data = {
            lunes:cronovoluntaria.lunes.turno=="no"?false:true,
            lunestarde:cronovoluntaria.lunes.turno=="no"?false:cronovoluntaria.lunes.turno=="tarde"?true:false,
            lunesback:cronovoluntaria.lunes.turno=="no"?false:cronovoluntaria.lunes.fijo=="emer"?true:false,

            martes:cronovoluntaria.martes.turno=="no"?false:true,
            martestarde:cronovoluntaria.martes.turno=="no"?false:cronovoluntaria.martes.turno=="tarde"?true:false,
            martesback:cronovoluntaria.martes.turno=="no"?false:cronovoluntaria.martes.fijo=="emer"?true:false,

            miercoles:cronovoluntaria.miercoles.turno=="no"?false:true,
            miercolestarde:cronovoluntaria.miercoles.turno=="no"?false:cronovoluntaria.miercoles.turno=="tarde"?true:false,
            miercolesback:cronovoluntaria.miercoles.turno=="no"?false:cronovoluntaria.miercoles.fijo=="emer"?true:false,

            jueves:cronovoluntaria.jueves.turno=="no"?false:true,
            juevestarde:cronovoluntaria.jueves.turno=="no"?false:cronovoluntaria.jueves.turno=="tarde"?true:false,
            juevesback:cronovoluntaria.jueves.turno=="no"?false:cronovoluntaria.jueves.fijo=="emer"?true:false,

            viernes:cronovoluntaria.viernes.turno=="no"?false:true,
            viernestarde:cronovoluntaria.viernes.turno=="no"?false:cronovoluntaria.viernes.turno=="tarde"?true:false,
            viernesback:cronovoluntaria.viernes.turno=="no"?false:cronovoluntaria.viernes.fijo=="emer"?true:false,

            sabado:cronovoluntaria.sabado.turno=="no"?false:true,
            sabadotarde:cronovoluntaria.sabado.turno=="no"?false:cronovoluntaria.sabado.turno=="tarde"?true:false,
            sabadoback:cronovoluntaria.sabado.turno=="no"?false:cronovoluntaria.sabado.fijo=="emer"?true:false,

            domingo:cronovoluntaria.domingo.turno=="no"?false:true,
            domingotarde:cronovoluntaria.domingo.turno=="no"?false:cronovoluntaria.lundomingoes.turno=="tarde"?true:false,
            domingoback:cronovoluntaria.domingo.turno=="no"?false:cronovoluntaria.domingo.fijo=="emer"?true:false,
        }
        try{
            
            const record = await pb.collection('cronogramas').update(cronovoluntaria.id, data);
            edit = false
            
        }
        catch(e){
            console.log(e)
        }
    }
    let edit = false


</script>
<h1 class="text-3xl font-bold underline m-6">Cronograma:</h1>
<div class="grid grid-cols-2">
    <div class="w-1/3 indent-4">
        <div class="form-control">
            <label class="label cursor-pointer">
                {#if edit}
                    <span class="label-text">Leer</span>    
                {:else}
                    <span class="label-text">Editar</span>    
                {/if}
                
                <input type="checkbox" class="toggle" bind:checked={edit} />
              
            </label>
        </div>
    </div>
    
    
</div>
{#if edit}

    {#if cronovoluntaria.lunes.turno != "no"}
        <div>
            <div class="grid grid-cols-2">
                <div>
                    <h3 class="text-2xl m-4">Lunes </h3>
                </div>
                <div>
                    <button class="btn" on:click={()=>eliminarDia("lu")}> Quitar lunes </button>
                </div>
                
            </div>
            <div class="grid grid-cols-2">
                <div>
                    <span class="label-text"> Turno: </span>
                    
                    <select class="select select-bordered select-sm" bind:value={cronovoluntaria.lunes.turno}>

                        <option value={"man"}>Mañana</option>
                        <option value={"tarde"}>Tarde</option>
                    </select>
                </div>
                <div>
                    <span class="label-text"> Fijo: </span>
                    <select class="select select-bordered select-sm" bind:value={cronovoluntaria.lunes.fijo}>
                        
                        <option value={"fijo"}>Fijo</option>
                        <option value={"emer"}>Backup</option>
                    </select>
                </div>
            </div>
            
            <div class="divider"></div>
        </div>
    {:else}
        <div>
            <button class="btn" on:click={()=>agregarDia("lu")}> Agregar lunes </button>
            <div class="divider"></div>
        </div>
    {/if}
    {#if cronovoluntaria.martes.turno != "no"}
        <div>
            <div class="grid grid-cols-2">
                <div>
                    <h3 class="text-2xl m-4">Martes </h3>
                </div>
                <div>
                    <button class="btn" on:click={()=>eliminarDia("ma")}> Quitar martes </button>
                </div>
                
            </div>
            <div class="grid grid-cols-2">
                <div>
                    <span class="label-text"> Turno: </span>
                    
                    <select class="select select-bordered select-sm" bind:value={cronovoluntaria.martes.turno}>

                        <option value={"man"}>Mañana</option>
                        <option value={"tarde"}>Tarde</option>
                    </select>
                </div>
                <div>
                    <span class="label-text"> Fijo: </span>
                    <select class="select select-bordered select-sm" bind:value={cronovoluntaria.martes.fijo}>
                        
                        <option value={"fijo"}>Fijo</option>
                        <option value={"emer"}>Backup</option>
                    </select>
                </div>
            </div>
            
            <div class="divider"></div>
        </div>
    {:else}
        <div>
            <button class="btn" on:click={()=>agregarDia("ma")}> Agregar martes </button>
            <div class="divider"></div>
        </div>
    {/if}
    {#if cronovoluntaria.miercoles.turno != "no"}
        <div>
            <div class="grid grid-cols-2">
                <div>
                    <h3 class="text-2xl m-4">Miercoles </h3>
                </div>
                <div>
                    <button class="btn" on:click={()=>eliminarDia("mi")}> Quitar miercoles </button>
                </div>
                
            </div>
            <div class="grid grid-cols-2">
                <div>
                    <span class="label-text"> Turno: </span>
                    
                    <select class="select select-bordered select-sm" bind:value={cronovoluntaria.miercoles.turno}>

                        <option value={"man"}>Mañana</option>
                        <option value={"tarde"}>Tarde</option>
                    </select>
                </div>
                <div>
                    <span class="label-text"> Fijo: </span>
                    <select class="select select-bordered select-sm" bind:value={cronovoluntaria.miercoles.fijo}>
                        
                        <option value={"fijo"}>Fijo</option>
                        <option value={"emer"}>Backup</option>
                    </select>
                </div>
            </div>
            
            <div class="divider"></div>
        </div>
    {:else}
        <div>
            <button class="btn" on:click={()=>agregarDia("mi")}> Agregar miercoles </button>
            <div class="divider"></div>
        </div>
    {/if}
    {#if cronovoluntaria.jueves.turno != "no"}
        <div>
            <div class="grid grid-cols-2">
                <div>
                    <h3 class="text-2xl m-4">Jueves </h3>
                </div>
                <div>
                    <button class="btn" on:click={()=>eliminarDia("ju")}> Quitar jueves </button>
                </div>
                
            </div>
            <div class="grid grid-cols-2">
                <div>
                    <span class="label-text"> Turno: </span>
                    
                    <select class="select select-bordered select-sm" bind:value={cronovoluntaria.jueves.turno}>

                        <option value={"man"}>Mañana</option>
                        <option value={"tarde"}>Tarde</option>
                    </select>
                </div>
                <div>
                    <span class="label-text"> Fijo: </span>
                    <select class="select select-bordered select-sm" bind:value={cronovoluntaria.jueves.fijo}>
                        
                        <option value={"fijo"}>Fijo</option>
                        <option value={"emer"}>Backup</option>
                    </select>
                </div>
            </div>
            
            <div class="divider"></div>
        </div>
    {:else}
        <div>
            <button class="btn" on:click={()=>agregarDia("ju")}> Agregar jueves </button>
            <div class="divider"></div>
        </div>
    {/if}
    {#if cronovoluntaria.viernes.turno != "no"}
        <div>
            <div class="grid grid-cols-2">
                <div>
                    <h3 class="text-2xl m-4">Viernes </h3>
                </div>
                <div>
                    <button class="btn" on:click={()=>eliminarDia("vi")}> Quitar viernes </button>
                </div>
                
            </div>
            <div class="grid grid-cols-2">
                <div>
                    <span class="label-text"> Turno: </span>
                    
                    <select class="select select-bordered select-sm" bind:value={cronovoluntaria.viernes.turno}>

                        <option value={"man"}>Mañana</option>
                        <option value={"tarde"}>Tarde</option>
                    </select>
                </div>
                <div>
                    <span class="label-text"> Fijo: </span>
                    <select class="select select-bordered select-sm" bind:value={cronovoluntaria.viernes.fijo}>
                        
                        <option value={"fijo"}>Fijo</option>
                        <option value={"emer"}>Backup</option>
                    </select>
                </div>
            </div>
            
            <div class="divider"></div>
        </div>
    {:else}
        <div>
            <button class="btn" on:click={()=>agregarDia("vi")}> Agregar viernes </button>
            <div class="divider"></div>
        </div>
    {/if}
    {#if cronovoluntaria.sabado.turno != "no"}
        <div>
            <div class="grid grid-cols-2">
                <div>
                    <h3 class="text-2xl m-4">Sabado </h3>
                </div>
                <div>
                    <button class="btn" on:click={()=>eliminarDia("sa")}> Quitar sabado </button>
                </div>
                
            </div>
            <div class="grid grid-cols-2">
                <div>
                    <span class="label-text"> Turno: </span>
                    
                    <select class="select select-bordered select-sm" bind:value={cronovoluntaria.sabado.turno}>

                        <option value={"man"}>Mañana</option>
                        <option value={"tarde"}>Tarde</option>
                    </select>
                </div>
                <div>
                    <span class="label-text"> Fijo: </span>
                    <select class="select select-bordered select-sm" bind:value={cronovoluntaria.sabado.fijo}>
                        
                        <option value={"fijo"}>Fijo</option>
                        <option value={"emer"}>Backup</option>
                    </select>
                </div>
            </div>
            
            <div class="divider"></div>
        </div>
    {:else}
        <div>
            <button class="btn" on:click={()=>agregarDia("sa")}> Agregar sabado </button>
            <div class="divider"></div>
        </div>
    {/if}
    {#if cronovoluntaria.domingo.turno != "no"}
        <div>
            <div class="grid grid-cols-2">
                <div>
                    <h3 class="text-2xl m-4">Domingo </h3>
                </div>
                <div>
                    <button class="btn" on:click={()=>eliminarDia("do")}> Quitar domingo </button>
                </div>
                
            </div>
            <div class="grid grid-cols-2">
                <div>
                    <span class="label-text"> Turno: </span>
                    
                    <select class="select select-bordered select-sm" bind:value={cronovoluntaria.domingo.turno}>

                        <option value={"man"}>Mañana</option>
                        <option value={"tarde"}>Tarde</option>
                    </select>
                </div>
                <div>
                    <span class="label-text"> Fijo: </span>
                    <select class="select select-bordered select-sm" bind:value={cronovoluntaria.domingo.fijo}>
                        
                        <option value={"fijo"}>Fijo</option>
                        <option value={"emer"}>Backup</option>
                    </select>
                </div>
            </div>
            
            <div class="divider"></div>
        </div>
    {:else}
        <div>
            <button class="btn" on:click={()=>agregarDia("do")}> Agregar domingo </button>
            <div class="divider"></div>
        </div>
    {/if}
{:else}
    {#if cronovoluntaria.lunes.turno != "no"}
        <div>
            <h3 class="text-2xl m-4">Lunes </h3>
            <div class="grid grid-cols-2 gap-1">
                <div>
                    <h4 class="indent-4">Turno: {cronovoluntaria.lunes.turno==="man"?"\tMañana":"\tTarde"}</h4>
                </div>
                <div> 
                    <h4> {cronovoluntaria.lunes.fijo==="fijo"?"Fijo":"Backup"}</h4>
                </div>
            </div>
            
        </div>
        <div class="divider"></div>
    {/if}

    {#if cronovoluntaria.martes.turno != "no"}

        <div>
            <h3 class="text-2xl m-4">Martes</h3>
            <div class="grid grid-cols-2 gap-1">
                <div>
                    <h4 class="indent-4">Turno: {cronovoluntaria.martes.turno==="man"?"\tMañana":"\tTarde"}</h4>
                </div>
                <div> 
                    <h4> {cronovoluntaria.martes.fijo==="fijo"?"Fijo":"Backup"}</h4>
                </div>
            </div>
        </div>
        <div class="divider"></div>
    {/if}

    {#if cronovoluntaria.miercoles.turno != "no"}

        <div>
            <h3 class="text-2xl m-4">Miercoles</h3>
            <div class="grid grid-cols-2 gap-1">
                <div>
                    <h4 class="indent-4">Turno: {cronovoluntaria.miercoles.turno==="man"?"\tMañana":"\tTarde"}</h4>
                </div>
                <div> 
                    <h4> {cronovoluntaria.miercoles.fijo==="fijo"?"Fijo":"Backup"}</h4>
                </div>
            </div>
        </div>
        <div class="divider"></div>
    {/if}

    {#if cronovoluntaria.jueves.turno != "no"}

        <div>
            <h3 class="text-2xl m-4">Jueves</h3>
            <div class="grid grid-cols-2 gap-1">
                <div>
                    <h4 class="indent-4">Turno: {cronovoluntaria.jueves.turno==="man"?"\tMañana":"\tTarde"}</h4>
                </div>
                <div> 
                    <h4> {cronovoluntaria.jueves.fijo==="fijo"?"Fijo":"Backup"}</h4>
                </div>
            </div>
        </div>
        <div class="divider"></div>
    {/if}

    {#if cronovoluntaria.viernes.turno != "no"}

        <div>
            <h3 class="text-2xl m-4">Viernes</h3>
            <div class="grid grid-cols-2 gap-1">
                <div>
                    <h4 class="indent-4">Turno: {cronovoluntaria.viernes.turno==="man"?"\tMañana":"\tTarde"}</h4>
                </div>
                <div> 
                    <h4> {cronovoluntaria.viernes.fijo==="fijo"?"Fijo":"Backup"}</h4>
                </div>
            </div>
        </div>
        <div class="divider"></div>
    {/if}

    {#if cronovoluntaria.sabado.turno != "no"}
        
        <div>
            <h3 class="text-2xl m-4">Sabado</h3>
            <div class="grid grid-cols-2 gap-1">
                <div>
                    <h4 class="indent-4">Turno: {cronovoluntaria.sabado.turno==="man"?"\tMañana":"\tTarde"}</h4>
                </div>
                <div> 
                    <h4> {cronovoluntaria.sabado.fijo==="fijo"?"Fijo":"Backup"}</h4>
                </div>
            </div>
        </div>
        <div class="divider"></div>
    {/if}

    {#if cronovoluntaria.domingo.turno != "no"}
        
        <div>
            <h3 class="text-2xl m-4">Domingo</h3>
            <div class="grid grid-cols-2 gap-1">
                <div>
                    <h4 class="indent-4">Turno: {cronovoluntaria.domingo.turno==="man"?"\tMañana":"\tTarde"}</h4>
                </div>
                <div> 
                    <h4> {cronovoluntaria.domingo.fijo==="fijo"?"Fijo":"Backup"}</h4>
                </div>
            </div>
        </div>
        <div class="divider"></div>
    {/if}
{/if}

{#if edit}
    <div>
        <button class="btn btn-success text-gray-100" on:click={editarcrono}>Guardar Cronograma</button>
    </div>    
{/if}