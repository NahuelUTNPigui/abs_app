<script>
    import Chart from 'chart.js/auto';
    import { beforeUpdate, afterUpdate } from 'svelte';
    export let abrazos = []
    let xs = []
    let ys = []
    //chart js
    let ctx;
	let canvas;
    let chart

    function createChart(){
        ctx = canvas.getContext('2d');
        if (chart) {
            chart.destroy();
        }

        chart = new Chart(ctx, {
            type: "line",
            data: {
                labels: xs.map(x=>new Date(x).toLocaleDateString()),
                datasets: [
                    {
                        label: "Evolucion abrazos",
                        backgroundColor: "rgb(255, 99, 132)",
                        borderColor: "rgb(255, 99, 132)",
                        data: ys.map(r=>r)
                    }
                ]
            },
            
        });
    }
    afterUpdate(() => {
		//LOgica
        xs = []
        ys = []
        let contadorDia = {}
        for(let i = 0;i<abrazos.length;i++){
            let a = abrazos[i]
            let fecha = new Date(a.fecha).toLocaleDateString()
            if(contadorDia[fecha]){
                contadorDia[fecha].cantidad += 1

            }
            else{
                contadorDia[fecha] ={
                    cantidad : 1,
                    fecha:a.fecha
                }
            }
        }
        Object.entries(contadorDia).forEach(fila=>{
            xs.push(fila[0])
            ys.push(fila[1].cantidad)
        })
        xs.reverse()
        ys.reverse()
        createChart()
	});

</script>
<p>Cantidad abrazos : {abrazos.length}</p>
<div class="chart-container justify-items-center">

    <canvas class="" bind:this={canvas} >
    </canvas>
</div>