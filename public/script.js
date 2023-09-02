const socket = io.connect(window.location.origin);
const svg = d3.select("#visualization");
const width = +svg.node().getBoundingClientRect().width;
const height = +svg.attr("height");
svg.attr("viewBox", `0 0 ${width} ${height}`);
let isSortingInProgress = false;

function startVisualization() {
  if (isSortingInProgress) {
    location.reload();
    return;
  }
  isSortingInProgress = true;
  const algorithm = document.getElementById("algorithm").value;
  const dataSize = +document.getElementById("dataSize").value;
  const speedMode = document.getElementById("speedMode").value;

  const durations = {
    slow: 30000,
    regular: 22000,
    fast: 15000,
  };

  const totalDuration = durations[speedMode];
  const data = Array.from({ length: dataSize }, () =>
    Math.floor(Math.random() * height)
  );
  socket.emit("startSorting", { algorithm, data, totalDuration });
  setTimeout(() => {
    isSortingInProgress = false;
  }, totalDuration);
}

const colorScale = d3.scaleSequential(d3.interpolateBlues).domain([0, height]);

socket.on("sortingData", ({ data, indices }, delay) => {
  const barWidth = Math.max(10, width / data.length);
  const bars = svg.selectAll("rect").data(data, (d) => d);

  bars
    .enter()
    .append("rect")
    .attr("x", (d, i) => i * barWidth)
    .attr("y", (d) => height - d)
    .attr("width", barWidth - 1)
    .attr("height", (d) => d)
    .attr("fill", (d) => colorScale(d));

  // Transition all bars
  bars
    .transition()
    .duration(delay)
    .attr("x", (d, i) => i * barWidth)
    .attr("y", (d) => height - d)
    .end() // Ensures that the next logic is executed after the transitions are complete
    .then(() => {
      bars.each(function (d, i) {
        if (!indices.includes(i)) {
          d3.select(this).attr("fill", (d) => colorScale(d));
        }
      });
    });

  bars.exit().remove();
});
