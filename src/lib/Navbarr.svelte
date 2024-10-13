<script>
  import Oscuro from "./Oscuro.svelte";
  import PocketBase from 'pocketbase'
  import {enabled} from '$lib/enabled'
  import { onMount } from 'svelte';
  import {usuario} from '$lib/usuario'
  import { goto } from '$app/navigation';
  import {coordinadora} from '$lib/coordinadora'
  let ruta = import.meta.env.VITE_RUTA
  let nombreusuario = ''
  onMount(async ()=>{
    let hab = $enabled
    let pb_json = await JSON.parse(localStorage.getItem('pocketbase_auth'))
    nombreusuario = pb_json.model.apellido+", "+pb_json.model.name
    if(hab==="no"){
      goto("/")
    }
  })

  function salir(){
      const pb = new PocketBase(ruta);
      pb.authStore.clear();
      usuario.set('')
      enabled.set("no")
      coordinadora.set('')
      goto("/")
  }
  let checked = '';

	function handleClick() {
		(checked == 'checked') ? checked = '': checked = 'checked';

	}
</script>


<div class="drawer">
    <input id="my-drawer" type="checkbox" class="drawer-toggle" bind:checked={checked} />
    <div class="drawer-content w-full">
        <div class="navbar bg-base-100">
            <div class="flex-none">
              <button class="btn btn-square btn-ghost" on:click={handleClick}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  class="inline-block h-5 w-5 stroke-current">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
              </button>
            </div>
            <div class="flex-1">
              <a href="/" class="btn btn-ghost text-3xl">Abrazadoras</a>
            </div>
            <div class="flex-none">
              <span>{nombreusuario}</span>
              
              <details class="dropdown">
                <summary class="btn btn-square btn-ghost">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    class="inline-block h-5 w-5 stroke-current">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"></path>
                  </svg>
                </summary>
                <ul class="menu dropdown-content bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
                  <li><button on:click={salir}>Salir</button></li>
                  
                </ul>
              </details>
              <Oscuro></Oscuro>
            </div>
        </div>
        <slot/>
    </div>
    <div class="drawer-side">
      <label for="my-drawer" aria-label="close sidebar" class="drawer-overlay"></label>
      
      <ul class="menu bg-base-200 text-base-content min-h-full w-40 p-4">
        <h1 class="text-lg text-purple-500 italic">ABRAZADORAS</h1>
        <!-- Sidebar content here -->
        <li><a class ="text-lg" href="/">Inicio</a></li>
        <li><a class ="text-lg" href="/users">Abrazadoras</a></li>
        <li><a class ="text-lg" href="/schelude">Cronograma</a></li>
        <li><a class ="text-lg" href="/bebes">Bebés</a></li>
        <li><a class ="text-lg" href="/abrazos">Abrazos</a></li>
      </ul>

    </div>
    
    
</div>
