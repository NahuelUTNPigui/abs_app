<script>
  import Oscuro from "./Oscuro.svelte";
  import PocketBase from 'pocketbase'
  import {enabled} from '$lib/enabled'
  import { onMount } from 'svelte';
  import {usuario} from '$lib/usuario'
  import { goto } from '$app/navigation';
  import {coordinadora} from '$lib/coordinadora'
  import { page } from '$app/stores';  
  let pageurl = $page.url.pathname  
  let ruta = import.meta.env.VITE_RUTA
  let nombreusuario = ''
  onMount(async ()=>{
    let hab = $enabled
    let pb_json = await JSON.parse(localStorage.getItem('pocketbase_auth'))
    nombreusuario = pb_json.model.apellido
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
  let classactive="bg-purple-200 bg-opacity-25 text-purple-500 dark:bg-pruple-600 dark:text-purple-200 "
</script>
<div class="drawer">
    <input id="my-drawer" type="checkbox" class="drawer-toggle" bind:checked={checked} />
    <div class="drawer-content w-full">
        <div class="navbar bg-purple-800 bg-opacity-10">
            <div class="flex-none">
              <button class="mx-0 px-1 lg:px-8  btn btn-ghost" on:click={handleClick}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  class="mx-0 px-0 inline-block h-6 w-6 lg:h-8 lg:w-8 stroke-current">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
              </button>
            </div>
            <div class="flex-1 ">
              <a href="/" class="pl-0 pr-1 btn btn-ghost text-2xl">Abrazadoras</a>
            </div>
            <div class="flex">
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
      
      <ul class="menu bg-base-200 text-base-content min-h-full w-50 p-4 ">
        <div class="border-b border-purple-500 ">
          <h1 class="text-lg text-purple-500 italic text-center">ABRAZADORAS</h1>
        </div>
        <!-- Sidebar content here -->
        <li class={`mt-2 ${pageurl.includes("inicio")?classactive:"" } rounded-full`}>
          
          <a class ="text-lg" href="/">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4">
              <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
            </svg>
            <span class="px-3"> Inicio </span>     
            
          </a>
        </li>
        <li class={`${pageurl.includes("users")?classactive:"" } rounded-full`}>
          <a class = "text-lg" href="/users">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
            </svg>
            
            Abrazadoras
          </a>
        </li>
        <li class={`${pageurl.includes("schelude")?classactive:"" } rounded-full`}>
          <a class ="text-lg" href="/schelude">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>            
            Cronograma
          </a>
        </li>
        <li class={`${pageurl.includes("bebes")?classactive:"" } rounded-full`}>
          <a class ="text-lg" href="/bebes">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4">
              <path stroke-linecap="round" stroke-linejoin="round" d="M14.25 6.087c0-.355.186-.676.401-.959.221-.29.349-.634.349-1.003 0-1.036-1.007-1.875-2.25-1.875s-2.25.84-2.25 1.875c0 .369.128.713.349 1.003.215.283.401.604.401.959v0a.64.64 0 0 1-.657.643 48.39 48.39 0 0 1-4.163-.3c.186 1.613.293 3.25.315 4.907a.656.656 0 0 1-.658.663v0c-.355 0-.676-.186-.959-.401a1.647 1.647 0 0 0-1.003-.349c-1.036 0-1.875 1.007-1.875 2.25s.84 2.25 1.875 2.25c.369 0 .713-.128 1.003-.349.283-.215.604-.401.959-.401v0c.31 0 .555.26.532.57a48.039 48.039 0 0 1-.642 5.056c1.518.19 3.058.309 4.616.354a.64.64 0 0 0 .657-.643v0c0-.355-.186-.676-.401-.959a1.647 1.647 0 0 1-.349-1.003c0-1.035 1.008-1.875 2.25-1.875 1.243 0 2.25.84 2.25 1.875 0 .369-.128.713-.349 1.003-.215.283-.4.604-.4.959v0c0 .333.277.599.61.58a48.1 48.1 0 0 0 5.427-.63 48.05 48.05 0 0 0 .582-4.717.532.532 0 0 0-.533-.57v0c-.355 0-.676.186-.959.401-.29.221-.634.349-1.003.349-1.035 0-1.875-1.007-1.875-2.25s.84-2.25 1.875-2.25c.37 0 .713.128 1.003.349.283.215.604.401.96.401v0a.656.656 0 0 0 .658-.663 48.422 48.422 0 0 0-.37-5.36c-1.886.342-3.81.574-5.766.689a.578.578 0 0 1-.61-.58v0Z" />
            </svg>            
            Bebés
          </a>
        </li>
        <li class={`${pageurl.includes("abrazos")?classactive:"" } rounded-full`}>
          <a class ="text-lg" href="/abrazos">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
            </svg>            
            Abrazos
          </a>
        </li>
        <li class={`${pageurl.includes("partes")?classactive:"" } rounded-full`}>
          <a class ="text-lg" href="/partes">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4">
              <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
            </svg>            
            Parte diario
          </a>
        </li>
        <li class={`${pageurl.includes("diagnosticos")?classactive:"" } rounded-full`}>
          <a class ="text-lg" href="/diagnosticos">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" />
            </svg>
                 
            Diagnosticos
          </a>
        </li>
      </ul>

    </div>
</div>
