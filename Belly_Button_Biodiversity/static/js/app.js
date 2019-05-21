function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
    // Use d3 to select the panel with id of `#sample-metadata`

    console.log(`Sample Data : ` + sample); 

    url=`/metadata/`+sample;

    console.log(url);

    var metadata = d3.select('#sample-metadata');

    d3.json(url).then(function(data){

      d3.select('#sample-metadata').selectAll("h5").remove();  
      Object.entries(data).forEach(([key, value]) =>  d3.select('#sample-metadata').append("h5").text( key + ' : ' + value ) );

    });  

}

// Build the Gauge Chart
// buildGauge(data.WFREQ);

function buildGauge(sample) {

  console.log(`Sample Data : ` + sample); 

  url=`/wfreq/`+sample;

  console.log(url);

  d3.json(url).then(function(data){

    console.log(`Frequency : ` + data["WFREQ"]);
    var level = data["WFREQ"];
    
    // Trig to calc meter point
    var degrees = 10 - level,
        radius = .5;
    var radians = degrees * Math.PI / 10;
    var x = radius * Math.cos(radians);
    var y = radius * Math.sin(radians);

    // Path: may have to change to create a better triangle
    var mainPath = 'M -.0 -0.025 L .0 0.025 L ',
        pathX = String(x),
        space = ' ',
          pathY = String(y),
      pathEnd = ' Z';

    var path = mainPath.concat(pathX,space,pathY,pathEnd);

    var data3 = [{ type: 'scatter',
      x: [0], y:[0],
      marker: {size: 28, color:'850000'},
        showlegend: false,
        name: 'Wash Frequency : ',
        text: level,
        hoverinfo: 'name+text'},
        { values: [50/10, 50/10, 50/10, 50/10, 50/10, 50/10, 50/10, 50/10, 50/10, 50/10,50],
        
        rotation: 90,
        text: ['9-10', '8-9','7-8','6-7','5-6','4-5','3-4','2-3','1-2','0-1',''],
        textinfo: 'text',
        textposition:'inside',
        marker: {colors:[
                        'rgba(14, 127, 0, .5)', 
                        'rgba(20, 130, 8, .5)',
                        'rgba(30, 140, 15, .5)',
                        'rgba(70, 145, 20, .5)',
                        'rgba(110, 154, 22, .5)',
                        'rgba(170, 202, 42, .5)', 
                        'rgba(202, 206, 95, .5)',
                        'rgba(210, 209, 145, .5)',
                        'rgba(232, 215, 175, .5)',
                        'rgba(255, 230, 210, .5)',
                        'rgba(255, 255, 255, 0)'
                        ]
                },
        labels: ['9-10', '8-9','7-8','6-7','5-6','4-5','3-4','2-3','1-2','0-1',''],
        hoverinfo: 'label',
        hole: .5,
        type: 'pie',
        showlegend: false
  }];

      var layout3 = {
        shapes:[{
            type: 'path',
            path: path,
            fillcolor: '850000',
            line: {
              color: '850000'
            }
          }],
        title: '<b>Gauge</b> <br> Wash Freqency 0-10',
        height: 550,
        width: 550,
        xaxis: {zeroline:false, showticklabels:false,
                  showgrid: false, range: [-1, 1]},
        yaxis: {zeroline:false, showticklabels:false,
                  showgrid: false, range: [-1, 1]}
      };

  Plotly.newPlot('gauge', data3, layout3);

}); 

}


function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots

    // @TODO: Build a Bubble Chart using the sample data

    url=`/samples/`+sample;

    d3.json(url).then(function(data){      
            
      var data1 = [{
        x: data["otu_ids"],
        y: data["sample_values"],
        mode: 'markers',
        marker: {
          size: data["sample_values"],
          color: data["otu_ids"],
          text: data["otu_labels"]
        }
      }];
      
      var layout1={ title: '<b>Bubble Chart</b> <br> Sample Values'};            

      Plotly.newPlot('bubble', data1, layout1);

      var data2 = [{
        values: data["sample_values"].slice(0,10),       
        labels: data["otu_ids"].slice(0,10),
        hovertext: data["otu_labels"].slice(0,10),
        type: "pie"
      }];
    
      var layout2={ title: '<b>Pie Chart</b> <br> Sample Values'};
    
      Plotly.newPlot('pie', data2, layout2);  
    });
    
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
    buildGauge(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
  buildGauge(newSample);
}

// Initialize the dashboard
init();
