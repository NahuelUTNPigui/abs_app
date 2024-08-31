import PocketBase from 'pocketbase'
let ruta = 'http://127.0.0.1:8090'

export async function load({params}){
    
    const pb = new PocketBase(ruta);
    const recordscrono = await pb.collection('cronogramas').getFullList({
        expand:"user",
        filter:"user.active=true"
    })
    
    let lunes = {
      man:[],
      tar:[],
      back:[]
    }
    let martes = {
      man:[],
      tar:[],
      back:[]
    }
    let miercoles = {
      man:[],
      tar:[],
      back:[]
    }
    let jueves = {
      man:[],
      tar:[],
      back:[]
    }
    let viernes = {
      man:[],
      tar:[],
      back:[]
    }
    let sabado = {
      man:[],
      tar:[],
      back:[]
    }
    let domingo = {
      man:[],
      tar:[],
      back:[]
    }
    for(let i = 0;i<recordscrono.length;i++){
      let fila = recordscrono[i]
      if(fila.lunes){
          if(fila.lunesback){
              lunes.back.push(fila.expand.user.name[0]+". "+fila.expand.user.apellido)
          }
          else if(fila.lunestarde){
              lunes.tar.push(fila.expand.user.name[0]+". "+fila.expand.user.apellido)
          }
          else{
              lunes.man.push(fila.expand.user.name[0]+". "+fila.expand.user.apellido)
          }
      }
      if(fila.martes){
        if(fila.martesback){
          martes.back.push(fila.expand.user.name[0]+". "+fila.expand.user.apellido)
        }
        else if(fila.martestarde){
          martes.tar.push(fila.expand.user.name[0]+". "+fila.expand.user.apellido)
        }
        else{
          martes.man.push(fila.expand.user.name[0]+". "+fila.expand.user.apellido)
        }
      }
      if(fila.miercoles){
        if(fila.miercolesback){
          miercoles.back.push(fila.expand.user.name[0]+". "+fila.expand.user.apellido)
        }
        else if(fila.miercolestarde){
          miercoles.tar.push(fila.expand.user.name[0]+". "+fila.expand.user.apellido)
        }
        else{
          miercoles.man.push(fila.expand.user.name[0]+". "+fila.expand.user.apellido)
        }
    }
    if(fila.jueves){
      if(fila.juevesback){
        jueves.back.push(fila.expand.user.name[0]+". "+fila.expand.user.apellido)
      }
      else if(fila.juevestarde){
        jueves.tar.push(fila.expand.user.name[0]+". "+fila.expand.user.apellido)
      }
      else{
        jueves.man.push(fila.expand.user.name[0]+". "+fila.expand.user.apellido)
      }
  }
  if(fila.viernes){
    if(fila.viernesback){
      viernes.back.push(fila.expand.user.name[0]+". "+fila.expand.user.apellido)
    }
    else if(fila.viernestarde){
      viernes.tar.push(fila.expand.user.name[0]+". "+fila.expand.user.apellido)
    }
    else{
      viernes.man.push(fila.expand.user.name[0]+". "+fila.expand.user.apellido)
    }
  }
  if(fila.sabado){
    if(fila.sabadoback){
      sabado.back.push(fila.expand.user.name[0]+". "+fila.expand.user.apellido)
    }
    else if(fila.sabadotarde){
      sabado.tar.push(fila.expand.user.name[0]+". "+fila.expand.user.apellido)
    }
    else{
      sabado.man.push(fila.expand.user.name[0]+". "+fila.expand.user.apellido)
    }
  }
  if(fila.domingo){
    if(fila.domingoback){
      domingo.back.push(fila.expand.user.name[0]+". "+fila.expand.user.apellido)
    }
    else if(fila.domingotarde){
      domingo.tar.push(fila.expand.user.name[0]+". "+fila.expand.user.apellido)
    }
    else{
      domingo.man.push(fila.expand.user.name[0]+". "+fila.expand.user.apellido)
    }
  }
    }
    return {
      lunes,
      martes,
      miercoles,
      jueves,
      viernes,
      sabado,
      domingo
    }
  }