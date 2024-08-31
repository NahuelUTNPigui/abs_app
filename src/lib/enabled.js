// src/stores/enabled.ts
import { writable } from 'svelte/store'
import { browser } from "$app/environment"

export const enabled = writable(browser && localStorage.getItem("enabled") || "no")
enabled.subscribe((val) => {    
    return (localStorage.setItem("enabled",val))    
})