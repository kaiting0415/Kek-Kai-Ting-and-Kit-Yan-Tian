// Immediately Invoked Function Expression to limit access to our 
// variables and prevent 
((() => {

  // Load the data from a json file (you can make these using
  // JSON.stringify(YOUR_OBJECT), just remove the surrounding "")
  d3.json("data/texas.json").then(data => {

    // General event type for selections, used by d3-dispatch
    // https://github.com/d3/d3-dispatch
    const dispatchString = "selectionUpdated";

    // Create a line chart given x and y attributes, labels, offsets; 
    // a dispatcher (d3-dispatch) for selection events; 
    // a div id selector to put our svg in; and the data to use.
    let lcYearPoverty = linechart()
      .x(d => d.year)
      .xLabel("YEAR")
      .y(d => d.poverty)
      .yLabel("POVERTY RATE")
      .yLabelOffset(40)
      .selectionDispatcher(d3.dispatch(dispatchString))
      ("#linechart", data);

    // Create a scatterplot given x and y attributes, labels, offsets; 
    // a dispatcher (d3-dispatch) for selection events; 
    // a div id selector to put our svg in; and the data to use.
    let spUnemployMurder = scatterplot()
      .x(d => d.unemployment)
      .xLabel("UNEMPLOYMENT RATE")
      .y(d => d.murder)
      .yLabel("MURDER RATE IN STATE PER 100000")
      .yLabelOffset(150)
      .selectionDispatcher(d3.dispatch(dispatchString))
      ("#scatterplot", data);

    // Create a table given as below: 
    // a dispatcher (d3-dispatch) for selection events; 
    // a div id selector to put our table in; and the data to use.
    let tableData = table()
      .selectionDispatcher(d3.dispatch(dispatchString))
      ("#table", data);
    
    // Brushing and Linking the line chart, scatterplot and table

    // When a line chart is updated via brushing, the scatterplot is updated and linked together
    lcYearPoverty.selectionDispatcher().on(dispatchString, function(selectedData) {
      spUnemployMurder.updateSelection(selectedData);
      // Table will also updated
      tableData.updateSelection(selectedData);
    });
    
    // When a scatterplot is updated via brushing, the line chart is updated and linked together
    spUnemployMurder.selectionDispatcher().on(dispatchString, function(selectedData) {
      lcYearPoverty.updateSelection(selectedData);
      // Table will also updated
      tableData.updateSelection(selectedData);
    });

    // When the table is updated via brushing, the line chart and scatter plot are updated and linked together
    tableData.selectionDispatcher().on(dispatchString, function(selectedData) {
      //update line chart and scatterplot
      lcYearPoverty.updateSelection(selectedData);
      spUnemployMurder.updateSelection(selectedData);
    });

  });

})());