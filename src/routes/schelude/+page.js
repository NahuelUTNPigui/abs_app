import PocketBase from 'pocketbase'
import { addDays } from '$lib/strings/lib.js';
let ruta = import.meta.env.VITE_RUTA
function date2string(d){
  return d.toISOString().split("T")[0]
}

async function getAsistencias(p_abrazadoras,p_reemplazo,p_demas){
  const HOY = new Date()
  let tomorrow = addDays(HOY,1)
  let asistenciashoy = await pb.collection('asistencias').getFullList({
    filter:`fecha > ${date2string(HOY)} && fecha < ${date2string(tomorrow)}`
  })
  
}
export async function load({params}){
    
    const pb = new PocketBase(ruta);
    

    let demas = []
    let dianum = new Date().getDay()
    //Filtrar por inactivas
    const recordscrono = await pb.collection('cronogramas').getFullList({
        expand:"user",
        filter:"user.active=true"
    })
    let lunes = {
      man:[],
      tar:[],
      back:[],
      manback:[],
      tarback:[]
    }
    let martes = {
      man:[],
      tar:[],
      back:[],
      manback:[],
      tarback:[]
    }
    let miercoles = {
      man:[],
      tar:[],
      back:[],
      manback:[],
      tarback:[]
    }
    let jueves = {
      man:[],
      tar:[],
      back:[],
      manback:[],
      tarback:[]
    }
    let viernes = {
      man:[],
      tar:[],
      back:[],
      manback:[],
      tarback:[]
    }
    let sabado = {
      man:[],
      tar:[],
      back:[],
      manback:[],
      tarback:[]
    }
    let domingo = {
      man:[],
      tar:[],
      back:[],
      manback:[],
      tarback:[]
    }
    let abrazadorasdia = []
    let reemplazodia = []
    
    for(let i = 0;i<recordscrono.length;i++){
      let fila = recordscrono[i]
      let condia = false
      //debo preguntar si fijo o no y dentro de cada if si es tarde o mañana
      if(fila.lunesback){
        if(fila.lunesbacktarde){
          lunes.tarback.push(fila.expand.user.name[0]+". "+fila.expand.user.apellido+"-"+fila.expand.user.celular)

        }
        else{
          lunes.manback.push(fila.expand.user.name[0]+". "+fila.expand.user.apellido+"-"+fila.expand.user.celular)
        }
        if(dianum == 1){
          reemplazodia.push(fila.expand.user)
          condia = true
        }
        //lunes.back.push(fila.expand.user.name[0]+". "+fila.expand.user.apellido+": "+fila.expand.user.celular)
      }
      if(fila.lunes){  
        if(fila.lunestarde){
            lunes.tar.push(fila.expand.user.name[0]+". "+fila.expand.user.apellido)
        }
        else{
            
            lunes.man.push(fila.expand.user.name[0]+". "+fila.expand.user.apellido)
        }
        if(dianum == 1){
          abrazadorasdia.push(fila.expand.user)
          condia = true
        }
      }
      if(fila.martesback){
        if(fila.martesbacktarde){
          martes.tarback.push(fila.expand.user.name[0]+". "+fila.expand.user.apellido+"-"+fila.expand.user.celular)
        }
        else{
          martes.manback.push(fila.expand.user.name[0]+". "+fila.expand.user.apellido+"-"+fila.expand.user.celular)
        }
        if(dianum == 2){
          reemplazodia.push(fila.expand.user)
          condia = true
        }
      }
      if(fila.martes){
        
        if(fila.martestarde){
          martes.tar.push(fila.expand.user.name[0]+". "+fila.expand.user.apellido)
        }
        else{
          martes.man.push(fila.expand.user.name[0]+". "+fila.expand.user.apellido)
        }
        if(dianum == 2){
          abrazadorasdia.push(fila.expand.user)
          condia = true
        }
      }
      if(fila.miercolesback){
        if(fila.miercolesbacktarde){
          miercoles.tarback.push(fila.expand.user.name[0]+". "+fila.expand.user.apellido+"-"+fila.expand.user.celular)
        }
        else{
          miercoles.manback.push(fila.expand.user.name[0]+". "+fila.expand.user.apellido+"-"+fila.expand.user.celular)
        }
        if(dianum == 3){
          reemplazodia.push(fila.expand.user)
          condia = true
        }
        
      }
      if(fila.miercoles){
        
        if(fila.miercolestarde){
          miercoles.tar.push(fila.expand.user.name[0]+". "+fila.expand.user.apellido)
        }
        else{
          miercoles.man.push(fila.expand.user.name[0]+". "+fila.expand.user.apellido)
        }
        if(dianum == 3){
          abrazadorasdia.push(fila.expand.user)
          condia = true
        }
      }
      if(fila.juevesback){
        if(fila.juevesbacktarde){
          jueves.tarback.push(fila.expand.user.name[0]+". "+fila.expand.user.apellido+"-"+fila.expand.user.celular)
        }
        else{
          jueves.manback.push(fila.expand.user.name[0]+". "+fila.expand.user.apellido+"-"+fila.expand.user.celular)
        }
        if(dianum == 4){
          reemplazodia.push(fila.expand.user)
          condia = true
        }
      }
      if(fila.jueves){
        
        if(fila.juevestarde){
          jueves.tar.push(fila.expand.user.name[0]+". "+fila.expand.user.apellido)
        }
        else{
          jueves.man.push(fila.expand.user.name[0]+". "+fila.expand.user.apellido)
        }
        if(dianum == 4){
          abrazadorasdia.push(fila.expand.user)
          condia = true
        }
      }
      if(fila.viernesback){
        if(fila.viernesbacktarde){
          viernes.tarback.push(fila.expand.user.name[0]+". "+fila.expand.user.apellido+"-"+fila.expand.user.celular)
        }
        else{
          viernes.manback.push(fila.expand.user.name[0]+". "+fila.expand.user.apellido+"-"+fila.expand.user.celular)
        }
        if(dianum == 5){
          reemplazodia.push(fila.expand.user)
          condia = true
        }
        //viernes.back.push(fila.expand.user.name[0]+". "+fila.expand.user.apellido+": "+fila.expand.user.celular)
      }
      if(fila.viernes){
        
        if(fila.viernestarde){
          viernes.tar.push(fila.expand.user.name[0]+". "+fila.expand.user.apellido)
        }
        else{
          viernes.man.push(fila.expand.user.name[0]+". "+fila.expand.user.apellido)
        }
        if(dianum == 5){
          abrazadorasdia.push(fila.expand.user)
          condia = true
        }
      }
      if(fila.sabadoback){
        if(fila.sabadobacktarde){
          sabado.tarback.push(fila.expand.user.name[0]+". "+fila.expand.user.apellido+"-"+fila.expand.user.celular)
        }
        else{
          sabado.manback.push(fila.expand.user.name[0]+". "+fila.expand.user.apellido+"-"+fila.expand.user.celular)
        }
        if(dianum == 6){
          reemplazodia.push(fila.expand.user)
          condia = true
        }
      }
      if(fila.sabado){
        
        if(fila.sabadotarde){
          sabado.tar.push(fila.expand.user.name[0]+". "+fila.expand.user.apellido)
        }
        else{
          sabado.man.push(fila.expand.user.name[0]+". "+fila.expand.user.apellido)
        }
        if(dianum == 6){
          abrazadorasdia.push(fila.expand.user)
          condia = true
        }
      }
      if(fila.domingoback){
        if(fila.domingobacktarde){
          domingo.tarback.push(fila.expand.user.name[0]+". "+fila.expand.user.apellido+"-"+fila.expand.user.celular)
        }
        else{
          domingo.manback.push(fila.expand.user.name[0]+". "+fila.expand.user.apellido+"-"+fila.expand.user.celular)
        }
        if(dianum == 0){
          reemplazodia.push(fila.expand.user)
          condia = true
        }
        
      }
      if(fila.domingo){
        
        if(fila.domingotarde){
          domingo.tar.push(fila.expand.user.name[0]+". "+fila.expand.user.apellido)
        }
        else{
          domingo.man.push(fila.expand.user.name[0]+". "+fila.expand.user.apellido)
        }
        if(dianum == 0){
          abrazadorasdia.push(fila.expand.user)
          condia = true
        }
      }
      if(!condia){
        demas.push(fila.expand.user)
      }
    }
    abrazadorasdia.sort((a1,a2)=>a1.apellido.localeCompare(a2.apellido))
    reemplazodia.sort((a1,a2)=>a1.apellido.localeCompare(a2.apellido))
    demas.sort((a1,a2)=>a1.apellido.localeCompare(a2.apellido))
    reemplazodia = reemplazodia.concat(demas)
    return {
      lunes,
      martes,
      miercoles,
      jueves,
      viernes,
      sabado,
      domingo,
      abrazadorasdia,
      reemplazodia,
      demas,
    }
  }