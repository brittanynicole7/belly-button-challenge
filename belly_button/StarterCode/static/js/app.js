// Read in the samples data
const samples = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

// Create a dropdown function and create a loop to add new dropdown options. Dropdown code created with the help of my tutor and Stack Overflow
// "https://stackoverflow.com/questions/43121679/how-to-append-option-into-select-combo-box-in-d3"
function dropdown(){
    d3.json(samples).then(function(data) {
        console.log(data);

    let dropdownMenu = d3.select("#selDataset");
    let ids = data.names
    console.log(ids);
    ids.forEach((sample) => {
        dropdownMenu
            .append("option")
            .text(sample)
            .property("value", sample);
    });

//Setting up the id index
    demographic(ids[0])
    charts(ids[0])
      });
}

// Add a function for changing options on the dropdown menu
function optionChanged(x){
    demographic(x)
    charts(x)
}

// Add a function to create the demographic table. This code and the following block of code
// were developed with the help of my tutor. "For each" logic developed with my tutor with documentation
// from Mastering JS "https://masteringjs.io/tutorials/fundamentals/foreach-object" and MDN Web Docs
// "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach"
function demographic(x){
    d3.json(samples).then(function(data) {
        console.log(data);

    let metadataTable = d3.select("#sample-metadata");
    let metadata = data.metadata
    console.log(metadata);
    metadataTable.html("")

    // Store the demographic data for each ID in the demographic table   
    let metaresult = metadata.filter(sample => sample.id == x)[0];
    Object.entries(metaresult).forEach(entry => {
        const [key, value] = entry;
        metadataTable
        .append("h5")
        .text(`${key}: ${value}`)
      });
      });

}

// Create a function for all three charts
function charts(x){

    // Fetch the JSON data and console log it
    d3.json(samples).then(function(data) {
        console.log(data);
        let samplesdata = data.samples
        console.log(samplesdata);
        let samplesresult = samplesdata.filter(sample => sample.id == x)[0];

        // Save the ids, labels, and values as variables
        otu_ids = samplesresult.otu_ids
        otu_labels = samplesresult.otu_labels
        sample_values = samplesresult.sample_values

        let metadata = data.metadata;
        let metaresult = metadata.filter(sample => sample.id == x)[0];
        let washing_frequency = metaresult.wfreq
        console.log(washing_frequency);

    // Create the bar chart and create a filter for the top 10 OTUs
    let trace1 = {
      x: sample_values.slice(0,10).reverse(),
      y: otu_ids.slice(0,10).map(object => `OTU ${object}`).reverse(),
      text: otu_labels.slice(0,10).reverse(),
      name: "Otu",
      type: "bar",
      orientation: "h"
      };
  
    // Data array
    let traceData1 = [trace1];

    // Apply a title to the layout
    let layout1 = {
    title: "Top OTUs",
    };

// Plot the bar
Plotly.newPlot("bar", traceData1, layout1);

    // Create the bubble chart that designates different OTUs as different marker sizes.
    // Bubble and gauge charts developed using plotly documentation/code. 
    var trace2 = {
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: 'markers',
      marker: {
        color: otu_ids,
        size: sample_values
      }
    };
  
    // Data array
    var data2 = [trace2];
  
    // Apply titles to the layout
    var layout2 = {
      title: {text: 'OTU Values'},
      xaxis: {title:
      {text: "OTU IDs"}}
    };

// Plot the bubble chart
Plotly.newPlot('bubble', data2, layout2);

    // Create the gauge chart to track belly button washing frequency per week
    var data3 = [
      {
      domain: { x: [0, 1], y: [0, 1] },
      value: washing_frequency,
      type: "indicator",
      mode: "gauge+number",
      gauge: {
      axis: { range: [0, 9],
            tickmode: 'linear' },
      bar: { color: "Black" }, 
      steps: [
        { range: [0,1], color: "FFFAF0" },
        { range: [1,2], color: "FFF8DC" },
        { range: [2,3], color: "F5F5DC" },
        { range: [3,4], color: "EEE8AA" },
        { range: [4,5], color: "F0E68C" },
        { range: [5,6], color: "BDB76B" },
        { range: [6,7], color: "3CB371" },
        { range: [7,8], color: "8FBC8F" },
        { range: [8,9], color: "2E8B57" }]
    }}];


  // Add a title and subtitle
  var layout3 = {title: {text: "Belly Button Washing Frequency<br><sub>Scrubs Per Week</sub>"},
                  };
  

// Plot the gauge chart
Plotly.newPlot('gauge', data3, layout3);

});

}

dropdown()