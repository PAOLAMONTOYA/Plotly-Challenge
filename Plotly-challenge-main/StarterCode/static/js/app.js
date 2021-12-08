//Use d3 library to read in samples.json
d3.json("samples.json").then(data => {
    console.log(data);
    
    //Getting the names/id of OTUs
    var names = data.names;
    console.log(names);
    
    // Getting a reference to the drop down menu on the page with the id property set to `selDataset`
    var dropdownmenu = d3.select("#selDataset");
    
    //calls the fuction for each element in the 'names' array
    names.forEach(item => {
        //append the option tag,id attribute and id on HTML for each element in the array
        var option = dropdownmenu.append("option").text(item).attr("id", item);
        console.log(option);
        })

    init()
});

// Create event handlers for changing ID of OTU
d3.selectAll("#selDataset").on("change", getdata);

// Set the initial plot to show
function init() {
    var dropdownmenu = d3.select("#selDataset");
    // Assign the value of the dropdown menu option to a variable
    var nameID = dropdownmenu.property("value");
    
    getdata(nameID)
}

function getdata() {
    //retrieve the name ID of OTU when it is changed on the drop down menu
    var dropdownmenu = d3.select("#selDataset");
    var nameID = dropdownmenu.property("value");
    console.log(nameID)

    //Use d3 library to read in samples.json
    d3.json("samples.json").then(data => {

        // Top 10 OTUs 
        //use filter function to retrieve the data on samples array that matches the ID on the drop down menu
        var OTU = data.samples.filter(data => {return data.id == nameID});
        console.log(OTU);
        
        //sorted the samples values in ascending order for the selected OTU
        var sorted_OTU = OTU.sort((a, b) => a.sample_values - b.sample_values);
        console.log(sorted_OTU);
        //get the OTU's ID 
        OTU_ids = sorted_OTU[0].otu_ids
        //add string 'OTU' in front of the ID
        named_OTU_ids = OTU_ids.map(item => `OTU ${item}`);
        //get the sample values of the selected OTU 
        OTU_sample_values = sorted_OTU[0].sample_values
        //get the lables of the selected OTU
        OTU_labels = sorted_OTU[0].otu_labels;
        console.log(OTU_ids)
        console.log(named_OTU_ids)
        console.log(OTU_sample_values)
        console.log(OTU_labels)

        // Demographic Information
        var selectmetadata = data.metadata.filter(data => {return data.id == nameID})
        console.log(selectmetadata)
        
        var demographicinfo = d3.select("#sample-metadata");
        demographicinfo.html("");

        Object.entries(selectmetadata[0]).forEach(function([key, value]) {
        demographicinfo.append("p").text(`${key}: ${value}`);
        });

        // Plot
        //select the top 10 OTU from the sorted OTU and plot the horizontal bar plot
        var trace1 = {
            y: named_OTU_ids.slice(0, 10).reverse(),
            x: OTU_sample_values.slice(0, 10).reverse(),
            text: OTU_labels.slice(0, 10).reverse(),
            type: "bar",
            orientation: "h"
        };

        //Create a bubble chart that displays each sample
        var trace2 = {
            x: OTU_ids,
            y: OTU_sample_values,
            mode: 'markers',
            text: OTU_labels,
            marker: {
                size: OTU_sample_values,
                color: OTU_ids
              }
        };

        //Create the Gauge Chart to plot the weekly washing frequency of the individual.
        var trace3 = {
            value: selectmetadata[0].wfreq,
            title: { text: "Belly Button Washing Frequency" },
            type: "indicator",
            mode: "gauge+number",
            gauge: {
              axis: { 
                  range: [null, 9] },
              steps: [
              { range: [0, 1], color: "rgb(248, 243, 236)"},
              { range: [1, 2], color: "rgb(240, 234, 220)" },
              { range: [2, 3], color: "rgb(230, 225, 205)" },
              { range: [3, 4], color: "rgb(218, 217, 190)" },
              { range: [4, 5], color: "rgb(204, 209, 176)" },
              { range: [5, 6], color: "rgb(189, 202, 164)" },
              { range: [6, 7], color: "rgb(172, 195, 153)" },
              { range: [7, 8], color: "rgb(153, 188, 144)" },
              { range: [8, 9], color: "rgb(132, 181, 137)" }
              ]
          }
      }

        var layout2 = {
            title:{text:"Bubble Chart of OTUs vs Sample Values for the Individuual"},
            xaxis: { title: "OTU ID"},
            yaxis: { title: "Sample Values"},
        }

        var layout1 = {
            title:{text:"Top 10 OTUs Found in the Individual"},
            xaxis: { title: "Samples Values"},
            yaxis: { title: "OTU ID"},
        }

        var data1 = [trace1]
        Plotly.newPlot("bar", data1,layout1);


        var data2 = [trace2]
        Plotly.newPlot("bubble", data2, layout2);

        data3 = [trace3]
        Plotly.newPlot("gauge", data3);

    })
};