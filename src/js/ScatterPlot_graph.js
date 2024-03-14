import * as d3 from "d3";
// import { scaleOrdinal, schemeCategory10, window } from "d3";
import "../sass/main.scss";

const render = (dataset) => {
  //d3.js code start

  const width = 950;
  const height = 600;
  const marginTop = 100;
  const marginRight = 100;
  const marginBottom = 100;
  const marginLeft = 120;
  const offSetYaxis = 20;
  const opacityValueHovered = 0.1;
  const opacityValue = 1;

  const x = d3
    .scaleTime()
    .domain([
      d3.min(dataset, (d) => new Date(`${d.Year}`)),
      d3.max(dataset, (d) => new Date(`${d.Year}`)),
    ])
    .rangeRound([marginLeft, width - marginRight])
    .nice();

  const formatTime = d3.timeFormat("%M:%S");
  const yTime = (d) => new Date(`1993-05-31T18:${d.Time}.788Z`);

  const y = d3
    .scaleTime()
    .domain([d3.max(dataset, yTime), d3.min(dataset, yTime)])
    .range([height - marginBottom, marginTop - 40]);

  const svg = d3
    .select("#scatterPlot")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("class", "svgElement");

  svg
    .append("g")
    .attr("class", "pathx")
    .attr("transform", `translate(0,${height - marginBottom})`)
    .call(d3.axisBottom(x));

  svg
    .append("g")
    .attr("class", "pathy")
    .attr("transform", `translate(${marginLeft - offSetYaxis},0)`)
    .call(d3.axisLeft(y).tickFormat(formatTime));
  svg.select(".pathx").select(".domain").attr("d", "M90.5,0V0.5H850.5V6");
  svg.select(".pathy").select(".domain").attr("d", "M-0,510.5H0.5V60.5H-6");

  // console.log(dataset);

  const tooltip = d3
    .select("#tooltip")
    .style("position", "absolute")
    .style("z-index", "10")
    .style("opacity", "0");

  svg
    .append("g")
    .attr("transform", `translate(${0},${0})`)
    .selectAll("circle")
    .data(dataset)
    .join("circle")
    .attr("class", (d) => (d.Doping.valueOf() == "" ? "green" : "red"))
    .attr("id", "mark")
    .attr("r", 0)
    .transition()
    .duration(2000)
    .delay((d, i) => i * 200)
    .attr("cx", (d) => x(new Date(`${d.Year}`)))
    .attr("cy", (d) => y(yTime(d)))
    .attr("r", 6)
    .attr("fill", (d) => (d.Doping.valueOf() == "" ? "green" : "red"))
    .attr("opacity", opacityValue)
    .attr("stroke", "blue");

  svg
    .selectAll("#mark")
    .on("mousemove", function (d) {
      tooltip
        .html(
          `${d.explicitOriginalTarget.__data__.Name}:${d.explicitOriginalTarget.__data__.Nationality}<br />
        Year:${d.explicitOriginalTarget.__data__.Year}, Time:${d.explicitOriginalTarget.__data__.Time}<br /><br />
        ${d.explicitOriginalTarget.__data__.Doping}`
        )
        .style(
          "top",
          d.pageY + document.getElementById("tooltip").clientHeight + 10 <
            document.body.clientHeight
            ? d.pageY + 10 + "px"
            : document.body.clientHeight +
                5 -
                document.getElementById("tooltip").clientHeight +
                "px"
        )
        .style(
          "left",
          d.pageX + document.getElementById("tooltip").clientHeight + 10 <
            document.body.clientWidth
            ? d.pageX + 10 + "px"
            : document.body.clientWidth +
                5 -
                document.getElementById("tooltip").clientHeight +
                "px"
        )
        .style("overflow", "hidden")
        .style("visibility", "visible")
        .style("opacity", 1);
    })
    .on("mouseout", function (d) {
      tooltip.style("opacity", 0);
    });
  const newgroups = ["No doping allegations", "Riders with doping allegations"];
  const colors = ["green", "red"];
  svg
    .append("g")
    .attr("transform", `translate(${-marginLeft},${-20})`)
    .selectAll("rect")
    .data(colors)
    .join("rect")
    .attr("class", (d) => `rec-${d}`)
    .attr("id", "rectangle")
    .attr("height", 20)
    .attr("width", 20)
    .attr("x", (d, i) => width)
    .attr("y", (d, i) => height / 4 + 24 * i)
    .attr("fill", (d) => (d.valueOf() == "green" ? "green" : "red"))
    .attr("opacity", opacityValue)
    .attr("stroke", "black")
    .on("mouseover", function (d) {
      const selectedCategory = colors.find(
        (item) => item === this.getAttribute("fill")
      );
      if (selectedCategory === "green") {
        svg.selectAll(".red").attr("opacity", opacityValueHovered);
        svg.selectAll(".rec-red").attr("opacity", opacityValueHovered);
        svg.selectAll(".legend-red").attr("opacity", opacityValueHovered);
      } else {
        svg.selectAll(".green").attr("opacity", opacityValueHovered);
        svg.selectAll(".rec-green").attr("opacity", opacityValueHovered);
        svg.selectAll(".legend-green").attr("opacity", opacityValueHovered);
      }
    })
    .on("mouseout", function (d) {
      svg.selectAll("#mark").attr("opacity", opacityValue);
      svg.selectAll("#rectangle").attr("opacity", opacityValue);
      svg.selectAll("#label").attr("opacity", opacityValue);
    });

  svg
    .append("g")
    .attr("transform", `translate(${-marginLeft},${-20})`)
    .selectAll("text")
    .data(newgroups)
    .join("text")
    .attr("class", (d) => (d == "No doping allegations" ? "green" : "red"))
    .attr("id", "label")
    .attr("x", (d, i) => width - marginRight - 0.7 * marginLeft - 47 * (i - 1))
    .attr("y", (d, i) => height / 3.7 + 23 * i)
    .style("fill", (d) => "black")
    .text((d) => d)
    .attr("text-anchor", "right")
    .attr("opacity", opacityValue)
    .style("font-size", "12px")
    .style("font-weight", "bold");

  // add x axis label
  svg
    .append("text")
    .attr("text-anchor", "middle")
    .attr("x", width / 2)
    .attr("y", height - 60)
    .style("font-size", "15px")
    .text("Years");

  // add y axis label:
  svg
    .append("text")
    .attr("text-anchor", "middle")
    .attr("x", -height / 2)
    .attr("y", 50)
    .text("Time in minutes")
    .style("font-size", "15px")
    .attr("transform", "rotate(-90)");

  //Graph Title
  svg
    .append("text")
    .attr("x", width / 2 + 20)
    .attr("y", 50)
    .attr("text-anchor", "middle")
    .text("Doping in Professional Bicycle Racing")
    .style("font-size", "25px");

  svg
    .append("text")
    .attr("x", width / 2 + 20)
    .attr("y", 80)
    .attr("text-anchor", "middle")
    .text("35 Fastest times up Alpe d'Huez")
    .style("font-size", "20px");
  //d3.js code end
};

const data_process_and_draw = () => {
  const req = new XMLHttpRequest();
  req.open(
    "GET",
    "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json",
    true
  );
  req.send();
  req.onload = function () {
    const dataset = JSON.parse(req.responseText);
    render(dataset);
  };
};

data_process_and_draw();
