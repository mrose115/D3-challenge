var svgWidth = 800;
var svgHeight = 800;

var margin = {
  top: 50,
  right: 50,
  bottom: 150,
  left: 150
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3.select("#scatter").append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Retrieve data from the CSV file and execute everything below
d3.csv("assets/data/data.csv").then(function(data) {

  // parse data
  data.forEach(function(data) {
    data.healthcare = +data.healthcare;
    data.poverty = +data.poverty;
  });

  // xLinearScale function above csv import
  var xLinearScale = d3.scaleLinear()
      .domain([d3.min(data, d => d.poverty) -1, d3.max(data, d => d.poverty) +1])
      .range([0, width]);

  // Create y scale function
  var yLinearScale = d3.scaleLinear()
    .domain([d3.min(data, d => d.healthcare) -2, d3.max(data, d => d.healthcare) +2])
    .range([height, 0]);

  // Create initial axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // append x axis
  var xAxis = chartGroup.append("g")
    //.classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  // append y axis
  chartGroup.append("g")
    .call(leftAxis);

  // append initial circles
  var circlesGroup = chartGroup.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.healthcare))
    .attr("r", 10)
    .attr("class", "stateCircle")
    .attr("opacity", "1");

 var toolTip = d3.tip()
 .attr("class", "tooltip")
 .offset([0, 0])
 .html(function(d) {
   return (`<strong>${d.state}</strong><br>Lacks Healthcare (%):<br>${d.healthcare}<br>Poverty (%):<br>${d.poverty}`);
 });

 svg.call(toolTip);

 circlesGroup.on("click", function(data) {
     toolTip.show(data, this);
 });

 circlesGroup.on("mouseover", function(data) {
     toolTip.show(data, this);
 });

 circlesGroup.on("mouseout", function(data) {
     toolTip.hide(data, this);
 });

 chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", 0 - (height / 2))
    .attr("y", 0 - margin.left + 50)
    .attr("dy", "1em")
    .classed("axis-text", true)
    .text("Lacks Healthcare (%)");

chartGroup.append("text")
    .attr("transform", `translate(${width / 2}, ${height + 30})`)
    .classed("active", true)
    .text("In Poverty (%)");


chartGroup.append("text")
    .attr("class", "stateText")
    .style("font-size", "10px")
    .selectAll("tspan")
    .data(data)
    .enter()
    .append("tspan")
    .attr("x", function(data) {
        return xLinearScale(data.poverty);
    })
    .attr("y", function(data) {
        return yLinearScale(data.healthcare -0.2);
    })
    .text(function(data) {
        return data.abbr
    });


}).catch(function(error) {
  console.log(error);
});