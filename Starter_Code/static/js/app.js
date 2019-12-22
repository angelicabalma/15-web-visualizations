function buildMetadata(sample) {
    d3.json("samples.json").then(function (data) {
        var metaData = data.metadata;
        var resultArray = metaData.filter(sampleObject => sampleObject.id == sample);
        var result = resultArray[0];
        var panel = d3.select("#sample-metadata");
        panel.html("");
        Object.entries(result).forEach(([key, value]) => {
        panel.append("h6").text(`${key.toUpperCase()}: ${value}`);
        });
    });  
}
function buildCharts(sample) {
    d3.json("samples.json").then(function (data) {
        var samples = data.samples;
        var resultArray = samples.filter(sampleObject => sampleObject.id == sample);
        var result = resultArray[0];
        var sample_values = result.sample_values; //reuse
        var otu_ids = result.otu_ids; //reuse
        var otu_labels = result.otu_labels; //reuse
        var bubbleLayout = {
            title: "Bubble Chart",
            margin:{t: 30},
            hovermode:"closest",
            xAxis: {title:"OTU ID"}
        }
        var bubbleData = [ {
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: "markers",
            marker: {
                size: sample_values,
                color: otu_ids,
                colorscale: "Earth", 
            }

        }]
        Plotly.newPlot("bubble", bubbleData, bubbleLayout);

        var yticks = otu_ids.slice(0,10).map(otu_id => `OTU ${otu_id}`).reverse()
        var barData = [ {
            x: sample_values.slice(0,10).reverse(),
            y: yticks,
            text: otu_labels.slice(0,10).reverse(),
            type: "bar",
            orientation: "h",

        }]
        var layout = {
            margin: {t:30, l: 150},
            title: "Bar chart"

        }
        Plotly.newPlot("bar", barData, layout)
    });
}


function init() {
    var selector = d3.select("#selDataset");


    d3.json("samples.json").then(function (data) {
        var sampleNames = data.names;
        sampleNames.forEach((sample) => {
            selector.append("option").text(sample).property("value", sample);
        });

        var firstSample = sampleNames[0];
        buildCharts(firstSample);
        buildMetadata(firstSample);
    });

};
function optionChanged(newSample) {
    buildCharts(newSample);
    buildMetadata(newSample);
}
init();

//slice of samples and slice of labels, and for y ticks