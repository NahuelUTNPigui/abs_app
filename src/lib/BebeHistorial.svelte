<script>
    import unidades from '$lib/ubicaciones'
    // Mama
    export let nombremama=""
    export let apellidomama = ""
    export let edadmama=0
    export let procedencia = ""
    //bebe
    export let nombrebebe=""
    export let fechaingreso = ""
    export let fechaegreso = ""
    export let disponible = true
    export let fechanacimiento = ""
    export let prioridad = 1 
    export let pesonacimiento = 0
    export let edadgestacional = 0
    export let maternidad = false
    export let diagnostico = ""
    export let unidad = "Prealta"
    //Variables
    let prioridades = [{id:1,desc:"ALTA"},{id:2,desc:"BAJA"}]
</script>
<div class="container mx-auto">
    <h3 class="text-xl mx-1 font-semibold mb-1 lg:mb-0 text-left">
        Datos madre
    </h3>
    <div class="grid lg:grid-cols-4 lg:gap-6 mx-1 mb-2">
        <div class="mb-4 lg:mb-0">
            <label for = "nombremama" class="label">
                <span class="label-text text-base">Nombre Madre*</span>
            </label>
            <label class="input-group">
                <input id ="nombremama" type="text"  
                    class={`input input-bordered`}
                    value={nombremama}
                />
            </label>
        </div>
        <div class="mb-4 lg:mb-0">
            <label for = "apellidomama" class="label">
                <span class="label-text text-base">Apellido Madre*</span>
            </label>
            <label class="input-group">
                <input id ="apellidomama" type="text"  
                    class={`input input-bordered `}
                    bind:value={apellidomama}
                />
            </label>
        </div>
        <div class="mb-4 lg:mb-0">
            <label for = "edadmama" class="label">
                <span class="label-text text-base">Edad Madre*</span>
            </label>
            <label class="input-group">
                <input id ="apellidomama" type="text"  
                    class={`input input-bordered `}                        
                    bind:value={edadmama}
                />
            </label>
        </div>
        <div class="mb-4 lg:mb-0">
            <label for = "procedencia" class="label">
                <span class="label-text text-base">Procedencia</span>
            </label>
            <label class="input-group">
                <input id ="procedencia" type="text"  class="input input-bordered" bind:value={procedencia}/>
            </label>
        </div>
    </div>
    <h3 class="text-xl font-semibold mb-1 lg:mb-0 text-left">
        Datos bebé
    </h3>
    <div class="grid lg:grid-cols-3 lg:gap-6 mx-1">
        <div class="mb-4 lg:mb-0">
            <label for = "nombre" class="label">
                <span class="label-text text-base">Nombre*</span>
            </label>
            <label class="input-group">
                <input id ="nombre" type="text"  
                    class={`input input-bordered`}
                    bind:value={nombrebebe}
                />
            </label>
        </div>
        <div class="mb-4 lg:mb-0">
            <label for = "peso" class="label">
                <span class="label-text text-base">Peso nacimiento(gramos)</span>
            </label>
            <label class="input-group">
                <input id ="peso" type="text"  class="input input-bordered" bind:value={pesonacimiento}/>
            </label>
        </div>
        <div class="mb-4 lg:mb-0">
            <label for = "gest" class="label">
                <span class="label-text text-base">Edad gestacional(semanas)</span>
            </label>
            <label class="input-group">
                <input id ="gest" type="text"  class="input input-bordered" bind:value={edadgestacional}/>
            </label>
        </div>
    </div>
    <div class="lg:grid lg:grid-cols-3 lg:gap-6 mx-1">
        <div class="mb-4 lg:mb-0">
            <div class="label">
                <span class="label-text">Nacio en maternidad</span>
            </div>
            <select class="select select-bordered" bind:value={maternidad}>
                <option value={true}>{"Si"}</option>
                <option value={false}>{"No"}</option>                        
            </select>
            
        </div>
        <div class="mb-4 lg:mb-0">
            <label for = "fechanacimiento" class="label">
                <span class="label-text text-base">Fecha nacimiento*</span>
            </label>
            <label class="input-group ">
                <input id ="fechanacimiento" type="date"
                    class={`input input-bordered w-3/4 lg:w-1/2 `}                                            
                    bind:value={fechanacimiento}
                />
                
            </label>
        </div>
        <div class="w-full">
            <div class="mb-4 lg:mb-0">
                <div class="label">
                    <span class="label-text">Disponibilidad</span>
                </div>
                <select class="select select-bordered" bind:value={disponible}>
                    <option value={true}>{"Disponible"}</option>
                    <option value={false}>{"No disponible"}</option>                        
                </select>
                
            </div>
        </div>
    </div>
    <div class="lg:grid lg:grid-cols-2 lg:gap-6 mx-1">
        <div class="mb-4 lg:mb-0">
            <label for = "fechaegreso" class="label">
                <span class="label-text text-base">Fecha egreso</span>
            </label>
            <label class="input-group">
                <input id ="fechaegreso" type="date"  class="input input-bordered w-3/4 lg:w-1/2" bind:value={fechaegreso}/>
            </label>
        </div>
        <div class="mb-4 lg:mb-0">
            <label for = "fechaingreso" class="label">
                <span class="label-text text-base">Fecha ingreso*</span>
            </label>
            <label class="input-group ">
                <input id ="fechaingreso" type="date" 
                    class={`input input-bordered w-3/4 lg:w-1/2`}    
                    bind:value={fechaingreso}
                />
                
            </label>
        </div>
    </div>
    <div class="grid grid-cols-3 gap-4 sm:gap-6 md:gap-8 lg:mb-4 mx-1">
        <div class="w-full">
            <div class="mb-4 lg:mb-0">
                <div class="label">
                    <span class="label-text">Prioridad</span>
                </div>
                <select class="select select-bordered " bind:value={prioridad}>
                    {#each prioridades as p}
                        <option value={p.id}>{p.desc}</option>
                    {/each}
                </select>
            </div>
        </div>
        <div class="w-full">
            <div class="mb-4 lg:mb-0">
                <div class="label">
                    <span class="label-text">Unidad</span>
                </div>
                <select class="select select-bordered " bind:value={unidad}>
                    {#each unidades as u}
                        <option value={u.nombre}>{u.nombre}</option>
                    {/each}
                </select>
            </div>
        </div>
    </div>
    <div class="grid mx-1">
        <div class="mb-4 lg:mb-1 w-full lg:w-2/3">
            <label class="form-control">
                <div class="label">
                    <span class="label-text">Diagnostico</span>                    
                </div>
                <textarea style="line-height: 1.3;" class="textarea textarea-bordered h-36" bind:value={diagnostico} placeholder=""></textarea>
          </label>
        </div>
    </div>
</div>