import * as d3 from 'd3';
import data from './data.json';


// Setup
const appElement = document.getElementsByClassName('app')[0];
let height = appElement.clientHeight;
let width = appElement.clientWidth;

const svg = d3.select('.app')
  .append('svg')
  .attr('viewBox', [0, 0, width, height])
  .attr('class', 'visualization')

const gContent = svg.append('g')
  .attr('class', 'visualization__content');


// Radial Tree
const processedData = d3.hierarchy(data).sort((a, b) => d3.ascending(a.data.name, b.data.name));

// Tree
const DEGREES_OF_CIRCLE = 2 * Math.PI;
const RADIUS = width / 2;
const tree = d3.tree()
  .size([DEGREES_OF_CIRCLE, RADIUS])
  .separation((a, b) => (a.parent == b.parent ? 1 : 2) / a.depth);

const root = tree(processedData);
console.log('processedData', processedData);
console.log('root', root);

// Draw
gContent.append('g')
  .attr('fill', 'none')
  .attr('stroke', '#555')
  .attr('stroke-opacity', 0.4)
  .attr('stroke-width', 1.5)
  .selectAll('path')
  .data(root.links())
  .join('path')
  .attr('d', d3.linkRadial()
    .angle(d => d.x)
    .radius(d => d.y)
  );

gContent.append("g")
  .selectAll("circle")
  .data(root.descendants())
  .join("circle")
  .attr("transform", d => `
        rotate(${d.x * 180 / Math.PI - 90})
        translate(${d.y},0)
      `)
  .attr("fill", d => d.children ? "#555" : "#999")
  .attr("r", 2.5);

gContent.append("g")
  .attr("font-family", "sans-serif")
  .attr("font-size", 10)
  .attr("stroke-linejoin", "round")
  .attr("stroke-width", 3)
  .selectAll("text")
  .data(root.descendants())
  .join("text")
  .attr("transform", d => `
        rotate(${d.x * 180 / Math.PI - 90})
        translate(${d.y},0)
        rotate(${d.x >= Math.PI ? 180 : 0})
      `)
  .attr("dy", "0.31em")
  .attr("x", d => d.x < Math.PI === !d.children ? 6 : -6)
  .attr("text-anchor", d => d.x < Math.PI === !d.children ? "start" : "end")
  .text(d => d.data.name)
  .clone(true).lower()
  .attr("stroke", "white");

const autoBox = () => {
  const contentBox = gContent.node().getBBox();
  // gContent.append('rect')
  //   .attr('width', contentBox.width)
  //   .attr('height', contentBox.height)
  //   .attr('x', contentBox.x)
  //   .attr('y', contentBox.y)
  //   .style('fill', 'transparent')
  //   .style('stroke', '#757575');
  const { x, y, width, height } = contentBox;
  return [x, y, width, height];
}

svg.attr("viewBox", autoBox).node();
