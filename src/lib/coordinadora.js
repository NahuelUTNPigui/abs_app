import { writable } from 'svelte/store'
import { browser } from "$app/environment"

export const coordinadora = writable(browser && localStorage.getItem("coord") || '')
coordinadora.subscribe((val) => {    
    return (localStorage.setItem("coord",val))    
})