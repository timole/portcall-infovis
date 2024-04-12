import React, { useEffect, useState, useRef } from 'react';
import * as d3 from 'd3';
import './App.css';

function App() {
  const [portCallData, setPortCallData] = useState([]);
  const d3Container = useRef(null);

  const fetchData = async () => {
    try {
      const response = await fetch('https://meri.digitraffic.fi/api/port-call/v1/port-calls');
      const data = await response.json();
      setPortCallData(data.portCalls);
      console.log(data);
    } catch (error) {
      console.error('Error fetching data: ', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (portCallData.length > 0 && d3Container.current) {
      const svg = d3.select(d3Container.current);
      // Clear the SVG to prevent duplication
      svg.selectAll("*").remove();

      // Set up dimensions
      const margin = { top: 20, right: 30, bottom: 40, left: 90 };
      const width = 400 - margin.left - margin.right;
      const height = 200 - margin.top - margin.bottom;

      // Parse dates and sort by eta
      const portCallsSorted = portCallData.map(call => {
        const eta = new Date(call.portAreaDetails[0].etaTimestamp);
        const etd = new Date(call.portAreaDetails[0].etdTimestamp);
        return { ...call, eta, etd };
      }).sort((a, b) => a.eta - b.eta);

      // Create a time scale for the x-axis
      const x = d3.scaleTime()
        .domain(d3.extent(portCallsSorted, d => d.eta))
        .range([0, width]);

      // Add the x-axis
      svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x));

        // Add the circles for each port call
        svg.selectAll("circle")
          .data(portCallsSorted)
          .enter()
          .append("circle")
          // X position will be the eta date
          .attr("cx", d => x(d.eta))
          // Y position will be based on the index of the port call
          .attr("cy", (d, i) => i * 30)
          // Set the radius of the circle
          .attr("r", 3)
          // Set the fill color to blue
          .style("fill", "blue");
      // Add the rectangles for each port call
      svg.selectAll("rect")
        .data(portCallsSorted)
        .enter()
        .append("rect")
        // X position will be the eta date
        .attr("x", d => x(d.eta))
        // Y position will be based on the index of the port call
        .attr("y", (d, i) => i * 30)
        // Width will be the difference between etd and eta
        .attr("width", d => x(d.etd) - x(d.eta))
        // Set a fixed height for each rectangle
        .attr("height", 20)
        .style("fill", "steelblue");
    }
  }, [portCallData, d3Container]);

  return (
    <div className="App">
      <header className="App-header">
        <svg
          className="d3-component"
          width={400}
          height={200}
          ref={d3Container}
          style={{ backgroundColor: 'white' }}
        />
      </header>
    </div>
  );
}

export default App;
