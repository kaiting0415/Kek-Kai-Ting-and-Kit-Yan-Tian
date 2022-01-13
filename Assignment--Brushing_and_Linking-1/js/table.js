/* global D3 */

// Initialize a table. Modeled after Mike Bostock's
// Reusable Chart framework https://bost.ocks.org/mike/chart/
function table() {

   // Based on Mike Bostock's margin convention
   // https://bl.ocks.org/mbostock/3019563
   let ourBrush = null,
   selectableElements = d3.select(null),
   dispatcher;
  
  // Create the chart by adding an svg to the div with the id 
  // specified by the selector using the given data
  function chart(selector, data) {
      let table = d3.select(selector)
        .append("table")
          .classed("table-content", true);
  
      // We need to have the headers of the table
      let titles = d3.keys(data[0]);
  
      // append the header row
      let header = table.append('thead').append('tr')
                    .selectAll('th')
                    .data(titles).enter()
                    .append("th")
                    .text(d => d); 
  
      // create row for each object in the data
      let rows = table.append("tbody") 
                .selectAll("tr")
                .data(data)
                .enter()
                .append("tr");

      // create cell for each object in the data
      let cells = rows.selectAll("td")
                  .data(d => d3.values(d))
                  .enter()
                  .append("td")
                  .text(d => d);     
  
      // After that we need to do the implement interaction on the table
      // We use Mouse Event for the function

      // Create a variable to indicate whether the mouse is being pressed down or not
      let onMouseDown;   
      d3.selectAll("tr")
      .on("mouseover", (d, i, elements) => {                  // mouseover fired when a pointing device is moved onto the element to which the listener is attached or onto one of its children
        d3.select(elements[i]).classed("mouseover", true)     // when the mouse is passed by the table, the row will turn grey
        if (onMouseDown) {                                    
          d3.select(elements[i]).classed("selected", true)    // when the mouse is pressed down on the row, the row will turn pink
          
      // Sending selection updated events
      let dispatcherItem = Object.getOwnPropertyNames(dispatcher._); 
      dispatcher.call(dispatcherItem, this, table.selectAll(".selected").data());
        }
      })

      // When we released the mouse, the selection should be stopped
      .on("mouseup", (d, i, elements) => {                    // mouseup fired when a pointing device button is released on an element
        onMouseDown = false 
      })

      // 
      .on("mousedown", (d, i, elements) => {                  // mousedown fired when a pointing device button is pressed on an element
        d3.selectAll(".selected").classed("selected", false) 
        onMouseDown = true
        d3.select(elements[i]).classed("selected", true)      // select the row that want 

      // Sending selection updated events
      let dispatcherItem = Object.getOwnPropertyNames(dispatcher._); 
      dispatcher.call(dispatcherItem, this, table.selectAll(".selected").data());
      })

      // When we stopped passed by the table, the grey colour will away
      .on("mouseout", (d, i, elements) => {                   // mouseout fired when a pointing device (usually a mouse) is moved off the element to which the listener is attached or off one of its children
        d3.select(elements[i]).classed("mouseover", false) 
      });
      
      return chart;
    }
  
    // Gets or sets the dispatcher we use for selection events
    chart.selectionDispatcher = function (_) {
      if (!arguments.length) return dispatcher;
      dispatcher = _;
      return chart;
    };
  
    // Given selected data from another visualization 
    // select the relevant elements here (linking)
    chart.updateSelection = function (selectedData) {
      if (!arguments.length) return;
  
    // Select an element if its datum was selected
    d3.selectAll('tr').classed("selected", d => {
       return selectedData.includes(d)
     });
  
    };
  
    return chart;
  }