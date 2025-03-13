<script>
    import PocketBase from 'pocketbase'
    import { createEventDispatcher } from 'svelte'
    import Swal from 'sweetalert2'
    let ruta = import.meta.env.VITE_RUTA
    const dispatch = createEventDispatcher()
    export let voluntaria = ""
    export let cronovoluntaria = {
        userid:"",
        id:"",
        lunes:{
            //puede ser no,man,tarde
            turno:"no",
            back:"no",
            fijo:"fijo"
        },
        martes:{
            //puede ser no,man,tarde
            turno:"no",
            back:"no",
            fijo:"fijo"
        },
        miercoles:{
            //puede ser no,man,tarde
            turno:"no",
            back:"no",
            fijo:"fijo"
        },
        jueves:{
            //puede ser no,man,tarde
            turno:"no",
            back:"no",
            fijo:"fijo"
        },
        viernes:{
            //puede ser no,man,tarde
            turno:"no",
            back:"no",
            fijo:"fijo"
        },
        sabado:{
            //puede ser no,man,tarde
            turno:"no",
            back:"no",
            fijo:"fijo"
        },
        domingo:{
            //puede ser no,man,tarde
            turno:"no",
            back:"no",
            fijo:"fijo"
        }
    }
    
    function agregarDia(dia){
        if(dia=="lu"){
            cronovoluntaria.lunes.turno="man"
            cronovoluntaria.lunes.back="no"
            cronovoluntaria.lunes.fijo="fijo"
        }
        if(dia=="ma"){
            cronovoluntaria.martes.turno="man"
            cronovoluntaria.martes.back="no"
            cronovoluntaria.martes.fijo="fijo"
        }
        if(dia=="mi"){
            cronovoluntaria.miercoles.turno="man"
            cronovoluntaria.miercoles.back="no"
            cronovoluntaria.miercoles.fijo="fijo"
        }
        if(dia=="ju"){
            cronovoluntaria.jueves.turno="man"
            cronovoluntaria.jueves.back="no"
            cronovoluntaria.jueves.fijo="fijo"
        }
        if(dia=="vi"){
            cronovoluntaria.viernes.turno="man"
            cronovoluntaria.viernes.back="no"
            cronovoluntaria.viernes.fijo="fijo"
        }
        if(dia=="sa"){
            cronovoluntaria.sabado.turno="man"
            cronovoluntaria.sabado.back="no"
            cronovoluntaria.sabado.fijo="fijo"
        }
        if(dia=="do"){
            cronovoluntaria.domingo.turno="man"
            cronovoluntaria.domingo.back="no"
            cronovoluntaria.domingo.fijo="fijo"
        }
    }
    function eliminarDia(dia){
        if(dia=="lu"){
            cronovoluntaria.lunes.turno="no"
            cronovoluntaria.lunes.back="no"
            cronovoluntaria.lunes.fijo="no"
        }
        if(dia=="ma"){
            cronovoluntaria.martes.turno="no"
            cronovoluntaria.martes.back="no"
            cronovoluntaria.martes.fijo="no"
        }
        if(dia=="mi"){
            cronovoluntaria.miercoles.turno="no"
            cronovoluntaria.miercoles.back="no"
            cronovoluntaria.miercoles.fijo="no"
        }
        if(dia=="ju"){
            cronovoluntaria.jueves.turno="no"
            cronovoluntaria.jueves.back="no"
            cronovoluntaria.jueves.fijo="no"
        }
        if(dia=="vi"){
            cronovoluntaria.viernes.turno="no"
            cronovoluntaria.viernes.back="no"
            cronovoluntaria.viernes.fijo="no"
        }
        if(dia=="sa"){
            cronovoluntaria.sabado.turno="no"
            cronovoluntaria.sabado.back="no"
            cronovoluntaria.sabado.fijo="no"
        }
        if(dia=="do"){
            cronovoluntaria.domingo.turno="no"
            cronovoluntaria.domingo.back="no"
            cronovoluntaria.domingo.fijo="no"
        }
    }
    async function editarcrono(){
        const pb = new PocketBase(ruta);
        let data = {
            lunes:cronovoluntaria.lunes.turno=="no"?false:true,
            lunestarde:cronovoluntaria.lunes.turno=="no"?false:cronovoluntaria.lunes.turno=="tarde"?true:false,
            lunesback:cronovoluntaria.lunes.back=="no"?false:true,
            lunesbacktarde:cronovoluntaria.lunes.back=="no"?false:cronovoluntaria.lunes.back=="tarde"?true:false,

            martes:cronovoluntaria.martes.turno=="no"?false:true,
            martestarde:cronovoluntaria.martes.turno=="no"?false:cronovoluntaria.martes.turno=="tarde"?true:false,
            martesback:cronovoluntaria.martes.back=="no"?false:true,
            martesbacktarde:cronovoluntaria.martes.back=="no"?false:cronovoluntaria.martes.back=="tarde"?true:false,

            miercoles:cronovoluntaria.miercoles.turno=="no"?false:true,
            miercolestarde:cronovoluntaria.miercoles.turno=="no"?false:cronovoluntaria.miercoles.turno=="tarde"?true:false,
            miercolesback:cronovoluntaria.miercoles.back=="no"?false:true,
            miercolesbacktarde:cronovoluntaria.miercoles.back=="no"?false:cronovoluntaria.miercoles.back=="tarde"?true:false,

            jueves:cronovoluntaria.jueves.turno=="no"?false:true,
            juevestarde:cronovoluntaria.jueves.turno=="no"?false:cronovoluntaria.jueves.turno=="tarde"?true:false,
            juevesback:cronovoluntaria.jueves.back=="no"?false:true,
            juevesbacktarde:cronovoluntaria.jueves.back=="no"?false:cronovoluntaria.jueves.back=="tarde"?true:false,

            viernes:cronovoluntaria.viernes.turno=="no"?false:true,
            viernestarde:cronovoluntaria.viernes.turno=="no"?false:cronovoluntaria.viernes.turno=="tarde"?true:false,
            viernesback:cronovoluntaria.viernes.back=="no"?false:true,
            viernesbacktarde:cronovoluntaria.viernes.back=="no"?false:cronovoluntaria.viernes.back=="tarde"?true:false,

            sabado:cronovoluntaria.sabado.turno=="no"?false:true,
            sabadotarde:cronovoluntaria.sabado.turno=="no"?false:cronovoluntaria.sabado.turno=="tarde"?true:false,
            sabadoback:cronovoluntaria.sabado.back=="no"?false:true,
            sabadobacktarde:cronovoluntaria.sabado.back=="no"?false:cronovoluntaria.sabado.back=="tarde"?true:false,

            domingo:cronovoluntaria.domingo.turno=="no"?false:true,
            domingotarde:cronovoluntaria.domingo.turno=="no"?false:cronovoluntaria.domingo.turno=="tarde"?true:false,
            domingoback:cronovoluntaria.domingo.back=="no"?false:true,
            domingobacktarde:cronovoluntaria.domingo.back=="no"?false:cronovoluntaria.domingo.back=="tarde"?true:false
        }
        try{
            
            const record = await pb.collection('cronogramas').update(cronovoluntaria.id, data);
            edit = false
            Swal.fire('Exito guardar cronograma', 'Se pudo guardar el nuevo cronograma', 'success');
            cerrarFormModal()
            
        }
        catch(e){
            Swal.fire('Error editar', 'No se pude editar al cronograma', 'error');
        }
    }
    function  cerrarFormModal(){
        dispatch('cerrarModal',{},{})
    }
    let edit = false


</script>
<h1 class="text-3xl font-bold underline m-6">Cronograma:</h1>
<h3 class="text-lg font-semibold m-6">{voluntaria}</h3>
<div class="grid grid-cols-2">
    <div class="w-1/3 indent-4">
        <div class="form-control">
            <label class="label cursor-pointer">
                {#if edit}
                    <span class="label-text">Leer</span>    
                {:else}
                    <span class="label-text">Editar</span>    
                {/if}
                
                <input id="editarcrono" type="checkbox" class="mx-2 toggle" bind:checked={edit} />
              
            </label>
        </div>
    </div>
    
    
</div>
{#if edit}

    {#if cronovoluntaria.lunes.turno != "no" || cronovoluntaria.lunes.back != "no"}
        
        <div>
            <div class="grid grid-cols-2">
                <div>
                    <h3 class="text-2xl m-4">Lunes </h3>
                </div>
                <div>
                    <button id="quitarLunes" class="btn" on:click={()=>eliminarDia("lu")}> Quitar lunes </button>
                </div>
                
            </div>
            <div class="grid grid-cols-2">
                <div>
                    <span class="label-text"> Turno: </span>
                    <br>
                    <select class="select select-bordered select-sm" id="comboTurnoLunes" bind:value={cronovoluntaria.lunes.turno}>
                        <option class="optionManLunes" value={"no"}>No</option>
                        <option class="optionManLunes" value={"man"}>Mañana</option>
                        <option class="optionTardeLunes" value={"tarde"}>Tarde</option>
                    </select>
                </div>
                <div>
                    <span class="label-text"> Back: </span>
                    <br>
                    <select class="select select-bordered select-sm" id="comboFijoLunes" bind:value={cronovoluntaria.lunes.back}>
                        <option class="optionManLunes" value={"no"}>No</option>
                        <option class="optionFijoLunes" value={"man"}>Mañana</option>
                        <option class="optionBackLunes" value={"tarde"}>Tarde</option>
                    </select>
                </div>
            </div>
            
            <div class="divider"></div>
        </div>
    {:else}
        <div>
            <button class="btn" id="btnLunes" on:click={()=>agregarDia("lu")}> Agregar lunes </button>
            <div class="divider"></div>
        </div>
    {/if}
    {#if cronovoluntaria.martes.turno != "no" || cronovoluntaria.martes.back != "no"}
        <div>
            <div class="grid grid-cols-2">
                <div>
                    <h3 class="text-2xl m-4">Martes </h3>
                </div>
                <div>
                    <button class="btn" id="quitarMartes" on:click={()=>eliminarDia("ma")}> Quitar martes </button>
                </div>
                
            </div>
            <div class="grid grid-cols-2">
                <div>
                    <span class="label-text"> Turno: </span>
                    <br>
                    <select class="select select-bordered select-sm" id="comboTurnoMarte" bind:value={cronovoluntaria.martes.turno}>
                        <option class="optionNoMarte" value={"no"}>No</option>
                        <option class="optionManMarte" value={"man"}>Mañana</option>
                        <option class="optionTardeMarte" value={"tarde"}>Tarde</option>
                    </select>
                </div>
                <div>
                    <span class="label-text"> Back: </span>
                    <br>
                    <select class="select select-bordered select-sm" id="comboFijoMarte" bind:value={cronovoluntaria.martes.back}>
                        <option class="optionManLunes" value={"no"}>No</option>
                        <option class="optionFijoLunes" value={"man"}>Mañana</option>
                        <option class="optionBackLunes" value={"tarde"}>Tarde</option>
                    </select>
                </div>
            </div>
            
            <div class="divider"></div>
        </div>
    {:else}
        <div>
            <button class="btn" id="btnMartes" on:click={()=>agregarDia("ma")}> Agregar martes </button>
            <div class="divider"></div>
        </div>
    {/if}
    {#if cronovoluntaria.miercoles.turno != "no" || cronovoluntaria.miercoles.back != "no"}
        <div>
            <div class="grid grid-cols-2">
                <div>
                    <h3 class="text-2xl m-4">Miercoles </h3>
                </div>
                <div>
                    <button id="quitarMiercoles" class="btn" on:click={()=>eliminarDia("mi")}> Quitar miercoles </button>
                </div>
                
            </div>
            <div class="grid grid-cols-2">
                <div>
                    <span class="label-text"> Turno: </span>
                    <br>
                    <select class="select select-bordered select-sm" id="comboTurnoLunes" bind:value={cronovoluntaria.miercoles.turno}>
                        <option class="optionManLunes" value={"no"}>No</option>
                        <option class="optionManLunes" value={"man"}>Mañana</option>
                        <option class="optionTardeLunes" value={"tarde"}>Tarde</option>
                    </select>
                </div>
                <div>
                    <span class="label-text"> Back: </span>
                    <br>
                    <select class="select select-bordered select-sm" id="comboFijoLunes" bind:value={cronovoluntaria.miercoles.back}>
                        <option class="optionManLunes" value={"no"}>No</option>
                        <option class="optionFijoLunes" value={"man"}>Mañana</option>
                        <option class="optionBackLunes" value={"tarde"}>Tarde</option>
                    </select>
                </div>
            </div>
            
            <div class="divider"></div>
        </div>
    {:else}
        <div>
            <button class="btn" id="btnMiercoles" on:click={()=>agregarDia("mi")}> Agregar miercoles </button>
            <div class="divider"></div>
        </div>
    {/if}
    {#if cronovoluntaria.jueves.turno != "no" || cronovoluntaria.jueves.back != "no"}
        <div>
            <div class="grid grid-cols-2">
                <div>
                    <h3 class="text-2xl m-4">Jueves </h3>
                </div>
                <div>
                    <button id="quitarJueves" class="btn" on:click={()=>eliminarDia("ju")}> Quitar jueves </button>
                </div>
                
            </div>
            <div class="grid grid-cols-2">
                <div>
                    <span class="label-text"> Turno: </span>
                    <br>
                    <select class="select select-bordered select-sm" id="comboTurnoLunes" bind:value={cronovoluntaria.jueves.turno}>
                        <option class="optionManLunes" value={"no"}>No</option>
                        <option class="optionManLunes" value={"man"}>Mañana</option>
                        <option class="optionTardeLunes" value={"tarde"}>Tarde</option>
                    </select>
                </div>
                <div>
                    <span class="label-text"> Back: </span>
                    <br>
                    <select class="select select-bordered select-sm" id="comboFijoLunes" bind:value={cronovoluntaria.jueves.back}>
                        <option class="optionManLunes" value={"no"}>No</option>
                        <option class="optionFijoLunes" value={"man"}>Mañana</option>
                        <option class="optionBackLunes" value={"tarde"}>Tarde</option>
                    </select>
                </div>
            </div>
            
            <div class="divider"></div>
        </div>
    {:else}
        <div>
            <button class="btn" id="btnJueves" on:click={()=>agregarDia("ju")}> Agregar jueves </button>
            <div class="divider"></div>
        </div>
    {/if}
    {#if cronovoluntaria.viernes.turno != "no" || cronovoluntaria.viernes.back != "no"}
        <div>
            <div class="grid grid-cols-2">
                <div>
                    <h3 class="text-2xl m-4">Viernes </h3>
                </div>
                <div>
                    <button id="quitarViernes" class="btn" on:click={()=>eliminarDia("vi")}> Quitar viernes </button>
                </div>
                
            </div>
            <div class="grid grid-cols-2">
                <div>
                    <span class="label-text"> Turno: </span>
                    <br>
                    <select class="select select-bordered select-sm" id="comboTurnoLunes" bind:value={cronovoluntaria.viernes.turno}>
                        <option class="optionManLunes" value={"no"}>No</option>
                        <option class="optionManLunes" value={"man"}>Mañana</option>
                        <option class="optionTardeLunes" value={"tarde"}>Tarde</option>
                    </select>
                </div>
                <div>
                    <span class="label-text"> Back: </span>
                    <br>
                    <select class="select select-bordered select-sm" id="comboFijoLunes" bind:value={cronovoluntaria.viernes.back}>
                        <option class="optionManLunes" value={"no"}>No</option>
                        <option class="optionFijoLunes" value={"man"}>Mañana</option>
                        <option class="optionBackLunes" value={"tarde"}>Tarde</option>
                    </select>
                </div>
            </div>
            
            <div class="divider"></div>
        </div>
    {:else}
        <div>
            <button class="btn" id="btnViernes" on:click={()=>agregarDia("vi")}> Agregar viernes </button>
            <div class="divider"></div>
        </div>
    {/if}
    {#if cronovoluntaria.sabado.turno != "no" || cronovoluntaria.sabado.back != "no"}
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
                    <br>
                    <select class="select select-bordered select-sm" id="comboTurnoLunes" bind:value={cronovoluntaria.sabado.turno}>
                        <option class="optionManLunes" value={"no"}>No</option>
                        <option class="optionManLunes" value={"man"}>Mañana</option>
                        <option class="optionTardeLunes" value={"tarde"}>Tarde</option>
                    </select>
                </div>
                <div>
                    <span class="label-text"> Back: </span>
                    <br>
                    <select class="select select-bordered select-sm" id="comboFijoLunes" bind:value={cronovoluntaria.sabado.back}>
                        <option class="optionManLunes" value={"no"}>No</option>
                        <option class="optionFijoLunes" value={"man"}>Mañana</option>
                        <option class="optionBackLunes" value={"tarde"}>Tarde</option>
                    </select>
                </div>
            </div>
            
            <div class="divider"></div>
        </div>
    {:else}
        <div>
            <button class="btn" id="btnSabado" on:click={()=>agregarDia("sa")}> Agregar sabado </button>
            <div class="divider"></div>
        </div>
    {/if}
    {#if cronovoluntaria.domingo.turno != "no" || cronovoluntaria.domingo.back != "no"}
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
                    <br>
                    <select class="select select-bordered select-sm" id="comboTurnoLunes" bind:value={cronovoluntaria.domingo.turno}>
                        <option class="optionManLunes" value={"no"}>No</option>
                        <option class="optionManLunes" value={"man"}>Mañana</option>
                        <option class="optionTardeLunes" value={"tarde"}>Tarde</option>
                    </select>
                </div>
                <div>
                    <span class="label-text"> Back: </span>
                    <br>
                    <select class="select select-bordered select-sm" id="comboFijoLunes" bind:value={cronovoluntaria.domingo.back}>
                        <option class="optionManLunes" value={"no"}>No</option>
                        <option class="optionFijoLunes" value={"man"}>Mañana</option>
                        <option class="optionBackLunes" value={"tarde"}>Tarde</option>
                    </select>
                </div>
            </div>
            
            <div class="divider"></div>
        </div>
    {:else}
        <div>
            <button class="btn" id="btnDomingo" on:click={()=>agregarDia("do")}> Agregar domingo </button>
            <div class="divider"></div>
        </div>
    {/if}
{:else}
    {#if cronovoluntaria.lunes.turno != "no" || cronovoluntaria.lunes.back != "no"}
        <div>
            <h3 class="text-2xl m-4">Lunes </h3>
            <div class="grid grid-cols-2 gap-1">
                <div>
                    <h4 class="indent-4">Turno: {
                            cronovoluntaria.lunes.turno==="no"?
                            "\tSin turno":
                            cronovoluntaria.lunes.turno==="man"?
                            "\tMañana":
                            "\tTarde"
                        }
                    </h4>
                </div>
                <div> 
                    <h4 class="indent-4">Backup: {
                            cronovoluntaria.lunes.back==="no"?
                            "\tSin turno":
                            cronovoluntaria.lunes.back==="man"?
                            "\tMañana":
                            "\tTarde"
                        }
                    </h4>
                </div>
            </div>
            
        </div>
        <div class="divider"></div>
    {/if}

    {#if cronovoluntaria.martes.turno != "no" || cronovoluntaria.martes.back != "no"}

        <div>
            <h3 class="text-2xl m-4">Martes</h3>
            <div class="grid grid-cols-2 gap-1">
                <div>
                    <h4 class="indent-4">Turno: {
                            cronovoluntaria.martes.turno==="no"?
                            "\tSin turno":
                            cronovoluntaria.martes.turno==="man"?
                            "\tMañana":
                            "\tTarde"
                        }
                    </h4>
                </div>
                <div> 
                    <h4 class="indent-4">Backup: {
                            cronovoluntaria.martes.back==="no"?
                            "\tSin turno":
                            cronovoluntaria.martes.back==="man"?
                            "\tMañana":
                            "\tTarde"
                        }
                    </h4>
                </div>
            </div>
        </div>
        <div class="divider"></div>
    {/if}

    {#if cronovoluntaria.miercoles.turno != "no" || cronovoluntaria.miercoles.back != "no"}

        <div>
            <h3 class="text-2xl m-4">Miercoles</h3>
            <div class="grid grid-cols-2 gap-1">
                <div>
                    <h4 class="indent-4">Turno: {
                            cronovoluntaria.miercoles.turno==="no"?
                            "\tSin turno":
                            cronovoluntaria.miercoles.turno==="man"?
                            "\tMañana":
                            "\tTarde"
                        }
                    </h4>
                </div>
                <div> 
                    <h4 class="indent-4">Backup: {
                            cronovoluntaria.miercoles.back==="no"?
                            "\tSin turno":
                            cronovoluntaria.miercoles.back==="man"?
                            "\tMañana":
                            "\tTarde"
                        }
                    </h4>
                </div>
            </div>
        </div>
        <div class="divider"></div>
    {/if}

    {#if cronovoluntaria.jueves.turno != "no" || cronovoluntaria.jueves.back != "no"}

        <div>
            <h3 class="text-2xl m-4">Jueves</h3>
            <div class="grid grid-cols-2 gap-1">
                <div>
                    <h4 class="indent-4">Turno: {
                            cronovoluntaria.jueves.turno==="no"?
                            "\tSin turno":
                            cronovoluntaria.jueves.turno==="man"?
                            "\tMañana":
                            "\tTarde"
                        }
                    </h4>
                </div>
                <div> 
                    <h4 class="indent-4">Backup: {
                            cronovoluntaria.jueves.back==="no"?
                            "\tSin turno":
                            cronovoluntaria.jueves.back==="man"?
                            "\tMañana":
                            "\tTarde"
                        }
                    </h4>
                </div>
            </div>
        </div>
        <div class="divider"></div>
    {/if}

    {#if cronovoluntaria.viernes.turno != "no"   || cronovoluntaria.viernes.back != "no"}

        <div>
            <h3 class="text-2xl m-4">Viernes</h3>
            <div class="grid grid-cols-2 gap-1">
                <div>
                    <h4 class="indent-4">Turno: {
                            cronovoluntaria.viernes.turno==="no"?
                            "\tSin turno":
                            cronovoluntaria.viernes.turno==="man"?
                            "\tMañana":
                            "\tTarde"
                        }
                    </h4>
                </div>
                <div> 
                    <h4 class="indent-4">Backup: {
                            cronovoluntaria.viernes.back==="no"?
                            "\tSin turno":
                            cronovoluntaria.viernes.back==="man"?
                            "\tMañana":
                            "\tTarde"
                        }
                    </h4>
                </div>
            </div>
        </div>
        <div class="divider"></div>
    {/if}

    {#if cronovoluntaria.sabado.turno != "no" || cronovoluntaria.sabado.back != "no"}
        
        <div>
            <h3 class="text-2xl m-4">Sabado</h3>
            <div class="grid grid-cols-2 gap-1">
                <div>
                    <h4 class="indent-4">Turno: {
                            cronovoluntaria.sabado.turno==="no"?
                            "\tSin turno":
                            cronovoluntaria.sabado.turno==="man"?
                            "\tMañana":
                            "\tTarde"
                        }
                    </h4>
                </div>
                <div> 
                    <h4 class="indent-4">Backup: {
                            cronovoluntaria.sabado.back==="no"?
                            "\tSin turno":
                            cronovoluntaria.sabado.back==="man"?
                            "\tMañana":
                            "\tTarde"
                        }
                    </h4>
                </div>
            </div>
        </div>
        <div class="divider"></div>
    {/if}

    {#if cronovoluntaria.domingo.turno != "no" || cronovoluntaria.domingo.back != "no"}
        
        <div>
            <h3 class="text-2xl m-4">Domingo</h3>
            <div class="grid grid-cols-2 gap-1">
                <div>
                    <h4 class="indent-4">Turno: {
                            cronovoluntaria.domingo.turno==="no"?
                            "\tSin turno":
                            cronovoluntaria.domingo.turno==="man"?
                            "\tMañana":
                            "\tTarde"
                        }
                    </h4>
                </div>
                <div> 
                    <h4 class="indent-4">Backup: {
                            cronovoluntaria.domingo.back==="no"?
                            "\tSin turno":
                            cronovoluntaria.domingo.back==="man"?
                            "\tMañana":
                            "\tTarde"
                        }
                    </h4>
                </div>
            </div>
        </div>
        <div class="divider"></div>
    {/if}
{/if}

{#if edit}
    <div class="modal-action justify-start">
        <button id="btnGuardar" class="btn btn-success text-gray-100" on:click={editarcrono}>Guardar Cronograma</button>
        <button class="btn btn-error text-white" on:click={cerrarFormModal}>Cerrar</button>
    </div>    
{:else}
    <div class="modal-action justify-start">
    
        <button class="btn btn-error text-white" on:click={cerrarFormModal}>Cerrar</button>
    </div>    
{/if}
