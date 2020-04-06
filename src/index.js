import {
  select,
  csv,
  scaleLinear,
  max,
  scaleBand,
  axisLeft,
  axisBottom,
} from "d3";
import "./style.css";

const svg = select("svg");
const height = +svg.attr("height");
const width = +svg.attr("width");

const render = (data) => {
  const margin = {
    left: 100,
    right: 20,
    top: 20,
    bottom: 20,
  };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  //create instance of d3 linear scale
  const xScale = scaleLinear()
    .domain([0, max(data, (d) => d.population)])
    .range([0, innerWidth]);
  //   console.log(xScale.domain());
  //   console.log(xScale.range());

  const yScale = scaleBand()
    .domain(data.map((d) => d.country))
    .range([0, innerHeight])
    .padding(0.1);

  const yAxis = axisLeft(yScale);
  const xAxis = axisBottom(xScale);

  const g = svg
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  g.append("g").call(yAxis);
  g.append("g").call(xAxis).attr("transform", `translate(0, ${innerHeight})`);

  //select all rect that are on the page and do a data join
  //append rect for each object in data
  g.selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr("y", (d) => yScale(d.country))
    .attr("width", (d) => xScale(d.population))
    .attr("height", yScale.bandwidth());
};

csv("../data.csv").then((data) => {
  data.forEach((d) => {
    d.population = +d.population;
  });
  render(data);
});
