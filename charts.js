function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });
    PANEL.style.backgroundColor = 'brown';

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var sampleData = data.samples;
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var sampleArray = sampleData.filter(sampleObj => sampleObj.id == sample);
    // 1. Create a variable that filters the metadata array for the object with the desired sample number.
    var metaArray = data.metadata.filter(metaObj => metaObj.id == sample)
    //  5. Create a variable that holds the first sample in the array.
    var selSample = sampleArray[0];
    // 2. Create a variable that holds the first sample in the metadata array.
    var selMeta = metaArray[0]

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otu_ids = selSample.otu_ids;
    var otu_labels = selSample.otu_labels;
    var sample_values = selSample.sample_values;

    // 3. Create a variable that holds the washing frequency.
    var wfreq = parseFloat(selMeta.wfreq)

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    // var yticks = otu_ids.slice(0, 10);
    var yticks = otu_ids.slice(0,10).map(i => 'OTU ' + i).reverse()

    // 8. Create the trace for the bar chart. 
    var barData = [
      {
        x: sample_values.slice(0, 10).reverse(),
        y: yticks,
        type: "bar",
        text: otu_labels.slice(0, 10).reverse(),
        orientation: 'h'
      }
    ];

    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacterial Cultures Found",
      paper_bgcolor: "rgba(0,0,0,0)"
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);
    
    // 1. Create the trace for the bubble chart.
    var bubbleData = [
      {
        x: otu_ids,
        y: sample_values,
        text: otu_labels,
        mode: 'markers',
        marker: {
          color: otu_ids,
          size: sample_values,
          colorscale: "Earth"
        }
      }
    ];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      xaxis: {title: "OTU ID"},
      title: 'Bacteria Cultures Per Sample',
      showlegend: false,
      // height: 600,
      // width: 1200,
      hovermode:'closest'
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout); 

    // 4. Create the trace for the gauge chart.
    var gaugeData = [
      {
        type: "indicator",
        mode: "gauge+number",
        value: wfreq,
        title: { text: "Scrubs per Week", font: { size: 14 } },
        delta: { reference: 400, increasing: { color: "RebeccaPurple" } },
        gauge: {
          axis: { range: [null, 10], tickwidth: 1, tickcolor: "darkblue" },
          bar: { color: "black" },
          bgcolor: "white",
          borderwidth: 2,
          bordercolor: "gray",
          steps: [
            { range: [0, 2], color: "red" },
            { range: [2, 4], color: "orange" },
            { range: [4, 6], color: "yellow" },
            { range: [6, 8], color: "forestgreen" },
            { range: [8, 10], color: "green" }
          ]
        }
      }
    ];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      // width: 400,
      height: 300,
      title: {text: "Belly Button Washing Frequency", font: { size: 20}},
      paper_bgcolor: "rgba(0,0,0,0)"
      // margin: { t: 100, r: 0, l: 0, b: 0 },
      // paper_bgcolor: "lavender",
      // font: { color: "darkblue", family: "Arial" }
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);
  });
}
