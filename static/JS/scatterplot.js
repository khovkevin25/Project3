fetch('https://khovkevin25.github.io/Project3/static/Data/scatterplot.csv')
    .then(response => response.text())
    .then(csvData => {
        Papa.parse(csvData, {
            header: true,
            complete: function(results) {
                console.log(results);
                const xValues = results.data.map(row => row.Median);
                const yValues = results.data.map(row => row.LaSenior5);
                const x2 = results.data.map(row => row.Median);
                const y2 = results.data.map(row => row.LaKids5);

                const graph1 = {
                    x: xValues,
                    y: yValues,
                    type: 'scatter',
                    mode: 'markers',
                    
                    };
                const graph2 = {
                    x: x2,
                    y: y2,
                    type: 'scatter',
                    mode: 'markers'
                };

                const layout = {
                    
                    title: 'Median Income compared to Low-Access Seniors',
                    xaxis: {title: 'Median Income'},
                    yaxis: {title: 'Low-Access Seniors'}
                };
                const layout2 = {
                    title: 'Median Income compared to Low-Access Kids',
                    xaxis: {title: 'Median Income'},
                    yaxis: {title: 'Low-Access Kids'}
                };
                Plotly.newPlot('myDiv1', [graph1], layout);
                Plotly.newPlot('myDiv3', [graph2], layout2);



            }
        });
    });