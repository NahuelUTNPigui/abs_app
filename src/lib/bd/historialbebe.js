export default async function guardarHistorial(pb , id,operacion,user) {
    let record = await pb.collection("bebes").getOne(id)
    let histo ={
        bebe:id,
        operacion,
        nombre:record.nombre,
        nombremama:record.nombremama,
        apellidomama:record.apellidomama,
        fechaingreso:record.fechaingreso,
        fechaegreso:record.fechaegreso,
        prioridad:record.prioridad,
        fechanacimiento:record.fechanacimiento,
        peso:record.peso,
        semanasgestacional:record.semanasgestacional,
        disponible:record.disponible,
        diagnostico:record.diagnostico,
        edadmadre:record.edadmadre,
        procedencia:record.procedencia,
        maternidadnacimiento:record.maternidadnacimiento,
        unidad:record.unidad,
        abrazadora:user,
        sexo:record.sexo,
        pesoingreso:record.pesoingreso,
        observacion:record.observacion  
    }
    await pb.collection("historialbebe").create(histo)    
}
