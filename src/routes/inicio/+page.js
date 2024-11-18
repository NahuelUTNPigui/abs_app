import PocketBase from 'pocketbase'
let ruta = import.meta.env.VITE_RUTA

export async function load({params}){
    const pb = new PocketBase(ruta);
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
    for(let i = 0;i<recordscrono.length;i++){
      let fila = recordscrono[i]
      if(fila.lunes){
          if(fila.lunesback){
            if(fila.lunestarde){
              lunes.tarback.push(fila.expand.user.name[0]+". "+fila.expand.user.apellido+"-"+fila.expand.user.celular)
            }
            else{
              lunes.manback.push(fila.expand.user.name[0]+". "+fila.expand.user.apellido+"-"+fila.expand.user.celular)
            }
            //lunes.back.push(fila.expand.user.name[0]+". "+fila.expand.user.apellido+": "+fila.expand.user.celular)
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
          if(fila.martestarde){
            martes.tarback.push(fila.expand.user.name[0]+". "+fila.expand.user.apellido+"-"+fila.expand.user.celular)
          }
          else{
            martes.manback.push(fila.expand.user.name[0]+". "+fila.expand.user.apellido+"-"+fila.expand.user.celular)
          }
          //martes.back.push(fila.expand.user.name[0]+". "+fila.expand.user.apellido+": "+fila.expand.user.celular)
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
          if(fila.miercolestarde){
            miercoles.tarback.push(fila.expand.user.name[0]+". "+fila.expand.user.apellido+"-"+fila.expand.user.celular)
          }
          else{
            miercoles.manback.push(fila.expand.user.name[0]+". "+fila.expand.user.apellido+"-"+fila.expand.user.celular)
          }
          //miercoles.back.push(fila.expand.user.name[0]+". "+fila.expand.user.apellido+": "+fila.expand.user.celular)
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
          if(fila.juevestarde){
            jueves.tarback.push(fila.expand.user.name[0]+". "+fila.expand.user.apellido+"-"+fila.expand.user.celular)
          }
          else{
            jueves.manback.push(fila.expand.user.name[0]+". "+fila.expand.user.apellido+"-"+fila.expand.user.celular)
          }
          //jueves.back.push(fila.expand.user.name[0]+". "+fila.expand.user.apellido+": "+fila.expand.user.celular)
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
          if(fila.viernestarde){
            viernes.tarback.push(fila.expand.user.name[0]+". "+fila.expand.user.apellido+"-"+fila.expand.user.celular)
          }
          else{
            viernes.manback.push(fila.expand.user.name[0]+". "+fila.expand.user.apellido+"-"+fila.expand.user.celular)
          }
          //viernes.back.push(fila.expand.user.name[0]+". "+fila.expand.user.apellido+": "+fila.expand.user.celular)
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
          if(fila.sabadotarde){
            sabado.tarback.push(fila.expand.user.name[0]+". "+fila.expand.user.apellido+"-"+fila.expand.user.celular)
          }
          else{
            sabado.manback.push(fila.expand.user.name[0]+". "+fila.expand.user.apellido+"-"+fila.expand.user.celular)
          }
          //sabado.back.push(fila.expand.user.name[0]+". "+fila.expand.user.apellido+": "+fila.expand.user.celular)
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
          if(fila.domingotarde){
            domingo.tarback.push(fila.expand.user.name[0]+". "+fila.expand.user.apellido+"-"+fila.expand.user.celular)
          }
          else{
            domingo.manback.push(fila.expand.user.name[0]+". "+fila.expand.user.apellido+"-"+fila.expand.user.celular)
          }
          //domingo.back.push(fila.expand.user.name[0]+". "+fila.expand.user.apellido+": "+fila.expand.user.celular)
        }
        else if(fila.domingotarde){
          domingo.tar.push(fila.expand.user.name[0]+". "+fila.expand.user.apellido)
        }
        else{
          domingo.man.push(fila.expand.user.name[0]+". "+fila.expand.user.apellido)
        }
      }
    }
    let partesdiarios = await pb.collection("partes").getList(1,10,{
      sort:"-fecha",
      expand:"registrado,modificado"
    })
    
    let partehoy=partesdiarios.items[0]?partesdiarios.items[0]:null
    let parteayer=partesdiarios.items[1]?partesdiarios.items[1]:null
    
    return {
      lunes,
      martes,
      miercoles,
      jueves,
      viernes,
      sabado,
      domingo,
      partehoy,
      parteayer
    }
}