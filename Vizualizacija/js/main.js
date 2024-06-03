d3.csv("data/lebron_stats.csv").then(function(data) {
    data.forEach(d => {
        d.Season = d.Season.trim();
        d.G = +d.G;
        d.PTS = +d.PTS;
        d.AST = +d.AST;
        d.TRB = +d.TRB;
        d.MP = +d.MP;
        d.STL = +d.STL;
        d.BLK = +d.BLK;
        d.TOV = +d.TOV;
    });
  
    const margin = {
        top: 20,
        right: 100,
        bottom: 40,
        left: 50
    };
    const width = 1000 - margin.left - margin.right;
    const height = 600 - margin.top - margin.bottom;
  
    
    const svg = d3.select("#chart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);
  
    
    const x = d3.scaleBand()
        .domain(data.map(d => d.Season))
        .range([0, width])
        .padding(0.1);
  
    const y = d3.scaleLinear()
        .range([height, 0]);
  
    
    const xAxis = d3.axisBottom(x);
    const yAxis = d3.axisLeft(y);
  
    
    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .attr("class", "x-axis")
        .call(xAxis)
        .selectAll("text")
        .attr("transform", "rotate(-45)")
        .style("text-anchor", "end");
  
    
    svg.append("g")
        .attr("class", "y-axis");
  
    
    const colorMapping = {
        LAL: "purple",
        CLE: "darkred",
        MIA: "red"
    };
  
    
    function update(selectedStat) {
        
        y.domain([0, d3.max(data, d => d[selectedStat])]);
  
        
        svg.select(".y-axis")
            .transition()
            .duration(1000)
            .call(yAxis);
  
        
        const bars = svg.selectAll(".bar")
            .data(data);
  
        
        bars.enter()
            .append("rect")
            .attr("class", "bar")
            .attr("x", d => x(d.Season))
            .attr("width", x.bandwidth())
            .attr("y", height)
            .attr("height", 0)
            .merge(bars) 
            .transition()
            .duration(1000)
            .attr("y", d => y(d[selectedStat]))
            .attr("height", d => height - y(d[selectedStat]))
            .attr("fill", d => colorMapping[d.Tm]); 
  
        
        bars.exit().remove();
  
        
        svg.selectAll(".text").remove();
  
        
        svg.selectAll(".text")
            .data(data)
            .enter().append("text")
            .attr("class", "text")
            .attr("x", d => x(d.Season) + x.bandwidth() / 2)
            .attr("y", d => y(d[selectedStat]) - 5) 
            .attr("text-anchor", "middle")
            .text(d => d[selectedStat])
            .style("font-size", "10px")
            .style("fill", "black");
  
        
        const legend = svg.append("g")
            .attr("class", "legend")
            .attr("transform", "translate(900,500)");
  
        const legendKeys = Object.keys(colorMapping);
        const legendHeight = 30;
  
        legend.selectAll(".legend-item")
            .data(legendKeys)
            .enter().append("g")
            .attr("class", "legend-item")
            .attr("transform", (d, i) => `translate(0,${i * legendHeight})`);
  
        legend.selectAll(".legend-item")
            .append("rect")
            .attr("width", 10)
            .attr("height", 10)
            .attr("fill", d => colorMapping[d]);
  
        legend.selectAll(".legend-item")
            .append("text")
            .attr("x", 15)
            .attr("y", 9)
            .attr("dy", ".35em")
            .style("font-size", "12px")
            .text(d => d);
    }
  
    
    update("PTS");
  
    
    d3.select("#stat-select").on("change", function() {
        const selectedStat = d3.select(this).property("value");
        update(selectedStat);
    });
  }).catch(function(error) {
    console.error("Error loading or parsing data:", error);
  });
  
  
  d3.csv("data/lebron_stats.csv").then(function(data) {
    
    data.forEach(d => {
        d.Season = d.Season.trim();
        
    });
  
    
    const teams = ["LAL", "CLE", "MIA"];
    const colors = ["purple", "darkred", "red"];
    
    
    const teamCounts = teams.map(team => {
        return {
            team: team,
            count: data.filter(d => d.Tm === team).length
        };
    });
  
    
    const margin = {top: 20, right: 30, bottom: 40, left: 50};
    const width = 400;
    const height = 400;
    const radius = Math.min(width, height) / 2 - margin.top;
  
    
    const svg = d3.select("#chart-pie")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${width / 2}, ${height / 2})`);
  
    
    const pie = d3.pie()
        .value(d => d.count);
  
    
    const arc = d3.arc()
        .innerRadius(0)
        .outerRadius(radius);
  
    
    const arcs = svg.selectAll(".arc")
        .data(pie(teamCounts))
        .enter().append("g")
        .attr("class", "arc");
  
    arcs.append("path")
        .attr("d", arc)
        .attr("fill", (d, i) => colors[i])
        .on("mouseover", function(event, d) {
            d3.select(this)
              .style("stroke", d3.select(this).attr("fill"))
              .style("stroke-width", 2)
              .style("fill-opacity", 0.8)
              .style("font-weight", "bold");
        })
        .on("mouseout", function() {
            d3.select(this)
              .style("stroke", "none")
              .style("stroke-width", 0)
              .style("fill-opacity", 1)
              .style("font-weight", "normal");
        });
  
    
    arcs.append("text")
        .attr("transform", d => `translate(${arc.centroid(d)})`)
        .attr("dy", ".35em")
        .style("text-anchor", "middle")
        .style("font-size", "14px")
        .style("font-weight", "bold")
        .style("fill", "white")
        .text(d => `${d.data.team}: ${d.data.count}`);
  
    
    const legend = d3.select("#legend")
        .append("svg")
        .attr("width", 120)
        .attr("height", 120);
  
    const legendKeys = teams;
    const legendHeight = 20;
  
    const legendItems = legend.selectAll(".legend-item")
        .data(legendKeys)
        .enter().append("g")
        .attr("class", "legend-item")
        .attr("transform", (d, i) => `translate(0,${i * legendHeight})`);
  
    legendItems.append("rect")
        .attr("width", 10)
        .attr("height", 10)
        .attr("fill", (d, i) => colors[i]);
  
    legendItems.append("text")
        .attr("x", 15)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("font-size", "12px")
        .text(d => d);
  
  }).catch(function(error) {
    console.error("Error loading or parsing data:", error);
  });
  
  d3.csv("data/lebron_stats.csv").then(function(data) {
    data.forEach(d => {
        d.Season = d.Season.trim();
        d.G = +d.G;
        d.PTS = +d.PTS;
        d.AST = +d.AST;
        d.TRB = +d.TRB;
        d.MP = +d.MP;
        d.STL = +d.STL;
        d.BLK = +d.BLK;
        d.TOV = +d.TOV;
    });
  
    const margin = {top: 20, right: 100, bottom: 40, left: 50};
    const width = 1000 - margin.left - margin.right;
    const height = 600 - margin.top - margin.bottom;
  
    const svg = d3.select("#chart-line")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);
  
    const x = d3.scaleBand()
        .domain(data.map(d => d.Season))
        .range([0, width])
        .padding(0.1);
  
    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => Math.max(d.PTS, d.AST, d.TRB, d.STL, d.BLK, d.TOV))])
        .range([height, 0]);
  
    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform", "rotate(-45)")
        .style("text-anchor", "end");
  
    svg.append("g")
        .call(d3.axisLeft(y));
  
    const line = d3.line()
        .x(d => x(d.Season) + x.bandwidth() / 2);
  
    const tooltip = d3.select("#tooltip");
  
    const updateChart = () => {
        svg.selectAll(".line").remove();
        
        if (document.getElementById("pts").checked) {
            svg.append("path")
                .datum(data)
                .attr("class", "line")
                .attr("fill", "none")
                .attr("stroke", "steelblue")
                .attr("stroke-width", 3)
                .attr("d", line.y(d => y(d.PTS)))
                .on("mouseover", function(event) {
                    tooltip.style("visibility", "visible").text("Points");
                })
                .on("mousemove", function(event) {
                    tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");
                })
                .on("mouseout", function() {
                    tooltip.style("visibility", "hidden");
                });
        }
        
        if (document.getElementById("ast").checked) {
            svg.append("path")
                .datum(data)
                .attr("class", "line")
                .attr("fill", "none")
                .attr("stroke", "green")
                .attr("stroke-width", 3)
                .attr("d", line.y(d => y(d.AST)))
                .on("mouseover", function(event) {
                    tooltip.style("visibility", "visible").text("Assists");
                })
                .on("mousemove", function(event) {
                    tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");
                })
                .on("mouseout", function() {
                    tooltip.style("visibility", "hidden");
                });
        }
        
        if (document.getElementById("trb").checked) {
            svg.append("path")
                .datum(data)
                .attr("class", "line")
                .attr("fill", "none")
                .attr("stroke", "red")
                .attr("stroke-width", 3)
                .attr("d", line.y(d => y(d.TRB)))
                .on("mouseover", function(event) {
                    tooltip.style("visibility", "visible").text("Rebounds");
                })
                .on("mousemove", function(event) {
                    tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");
                })
                .on("mouseout", function() {
                    tooltip.style("visibility", "hidden");
                });
        }
        if (document.getElementById("stl").checked) {
            svg.append("path")
                .datum(data)
                .attr("class", "line")
                .attr("fill", "none")
                .attr("stroke", "brown")
                .attr("stroke-width", 3)
                .attr("d", line.y(d => y(d.STL)))
                .on("mouseover", function(event) {
                    tooltip.style("visibility", "visible").text("Steals");
                })
                .on("mousemove", function(event) {
                    tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");
                })
                .on("mouseout", function() {
                    tooltip.style("visibility", "hidden");
                });
        }
        if (document.getElementById("blk").checked) {
            svg.append("path")
                .datum(data)
                .attr("class", "line")
                .attr("fill", "none")
                .attr("stroke", "black")
                .attr("stroke-width", 3)
                .attr("d", line.y(d => y(d.BLK)))
                .on("mouseover", function(event) {
                    tooltip.style("visibility", "visible").text("Blocks");
                })
                .on("mousemove", function(event) {
                    tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");
                })
                .on("mouseout", function() {
                    tooltip.style("visibility", "hidden");
                });
        }
        if (document.getElementById("tov").checked) {
            svg.append("path")
                .datum(data)
                .attr("class", "line")
                .attr("fill", "none")
                .attr("stroke", "violet")
                .attr("stroke-width", 3)
                .attr("d", line.y(d => y(d.TOV)))
                .on("mouseover", function(event) {
                    tooltip.style("visibility", "visible").text("Turnovers");
                })
                .on("mousemove", function(event) {
                    tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");
                })
                .on("mouseout", function() {
                    tooltip.style("visibility", "hidden");
                });
        }
    };
  
    updateChart();
    d3.selectAll(".checkbox-container input").on("change", updateChart);
  }).catch(function(error) {
    console.error("Error loading or parsing data:", error);
  });
    
  
  
  d3.csv("data/lebron_stats.csv").then(function(data) {
      const skills = ["PTS", "AST", "TRB", "STL", "BLK"];
      const maxValues = { PTS: 35, AST: 12, TRB: 13.7, STL: 2, BLK: 3.6 }; 
      const seasons = data.map(d => d.Season.trim());
    
      
      const dropdown = d3.select("#season-select");
      dropdown.selectAll("option")
        .data(seasons)
        .enter()
        .append("option")
        .text(d => d)
        .attr("value", d => d);
    
      
      const margin = {top: 50, right: 50, bottom: 50, left: 50};
      const width = 1000 - margin.left - margin.right;
      const height = 600 - margin.top - margin.bottom;
    
      const svg = d3.select("#chart-radar")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${(width + margin.left + margin.right) / 2}, ${(height + margin.top + margin.bottom) / 2})`);
    
      const angleSlice = Math.PI * 2 / skills.length;
      const axis = 5;
    
      const r = d3.scaleLinear()
        .range([0, Math.min(width / 2, height / 2)])
        .domain([0, 1]);
    
      const radarLine = d3.lineRadial()
        .curve(d3.curveLinearClosed)
        .radius(d => r(d.value / maxValues[d.axis]))
        .angle((d, i) => i * angleSlice);
    
      
      const gridLevels = svg.selectAll(".gridLevel")
        .data(d3.range(1, axis + 1).reverse())
        .enter().append("g")
        .attr("class", "gridLevel");
    
      gridLevels.append("circle")
        .attr("r", d => r(d / axis))
        .style("fill", "#ddd")
        .style("stroke", "#bbb")
        .style("fill-opacity", 0.3);
    
      gridLevels.append("text")
        .attr("x", 4)
        .attr("y", d => -r(d / axis))
        .attr("dy", "0.4em")
        .style("font-size", "10px")
        .attr("fill", "#737373")
        .text(d => (d / axis) * maxValues.PTS);
    
      
      const axes = svg.selectAll(".axis")
        .data(skills)
        .enter().append("g")
        .attr("class", "axis");
    
      axes.append("line")
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", (d, i) => r(1) * Math.cos(angleSlice * i - Math.PI / 2))
        .attr("y2", (d, i) => r(1) * Math.sin(angleSlice * i - Math.PI / 2))
        .style("stroke", "grey")
        .style("stroke-width", "2px");
    
      
      axes.append("text")
        .attr("class", "legend")
        .attr("text-anchor", "middle")
        .attr("dy", "0.35em")
        .attr("x", (d, i) => r(1.1) * Math.cos(angleSlice * i - Math.PI / 2))
        .attr("y", (d, i) => r(1.1) * Math.sin(angleSlice * i - Math.PI / 2))
        .style("font-size", "14px")
        .style("font-weight", "bold")
        .text(d => d);
    
      
      function updateChart(season) {
        const selectedData = data.find(d => d.Season.trim() === season);
        const radarData = skills.map(skill => ({
          axis: skill,
          value: +selectedData[skill]
        }));
    
        
        const radarArea = svg.selectAll(".radarArea")
          .data([radarData]);
    
        
        radarArea.enter()
          .append("path")
          .attr("class", "radarArea")
          .merge(radarArea)
          .transition()
          .duration(1000)
          .attr("d", radarLine)
          .style("fill", "blue")
          .style("fill-opacity", 0.5);
    
        const radarStroke = svg.selectAll(".radarStroke")
          .data([radarData]);
    
        radarStroke.enter()
          .append("path")
          .attr("class", "radarStroke")
          .merge(radarStroke)
          .transition()
          .duration(1000)
          .attr("d", radarLine)
          .style("stroke-width", "2px")
          .style("stroke", "blue")
          .style("fill", "none");
      }
    
      
      updateChart(seasons[seasons.length - 1]);
    
      
      dropdown.on("change", function() {
        const selectedSeason = d3.select(this).property("value");
        updateChart(selectedSeason);
      });
    }).catch(function(error) {
      console.error("Error loading or parsing data:", error);
    });
  
  
  d3.csv("data/lebron_stats.csv").then(function(data) {
    
    data.forEach(d => {
      d.FG = +d.FG;
      d.FGA = +d.FGA;
      d.FGPer = +d.FGPer;
      d.ThreeP = +d.ThreeP;
      d.ThreePA = +d.ThreePA;
      d.ThreePPer = +d.ThreePPer;
      d.TwoP = +d.TwoP;
      d.TwoPA = +d.TwoPA;
      d.TwoPPer = +d.TwoPPer;
      d.eFGPer = +d.eFGPer;
      d.FT = +d.FT;
      d.FTA = +d.FTA;
      d.FTPer = +d.FTPer;
    });
  
    const leagueAverages = {
      Season: "League Average",
      FG: 8,
      FGA: 20,
      FGPer: 0.474,
      ThreeP: 3,
      ThreePA: 7,
      ThreePPer: 0.366,
      TwoP: 6,
      TwoPA: 13,
      TwoPPer: 0.443,
      eFGPer: 0.547,
      FT: 5.5,
      FTA: 7,
      FTPer: 0.7
    };
  
    data.push(leagueAverages);
  
    
    const stats = [
      {name: "Field Goals Made", field: "FG"},
      {name: "Field Goals Attempted", field: "FGA"},
      {name: "Field Goal %", field: "FGPer"},
      {name: "3P Made", field: "ThreeP"},
      {name: "3P Attempted", field: "ThreePA"},
      {name: "3P %", field: "ThreePPer"},
      {name: "2P Made", field: "TwoP"},
      {name: "2P Attempted", field: "TwoPA"},
      {name: "2P %", field: "TwoPPer"},
      {name: "eFG %", field: "eFGPer"},
      {name: "Free Throws Made", field: "FT"},
      {name: "Free Throws Attempted", field: "FTA"},
      {name: "Free Throws %", field: "FTPer"}
    ];
    
    const seasons = data.map(d => d.Season);
  
    const margin = { top: 50, right: 50, bottom: 70, left: 150 },
          width = 1000 - margin.left - margin.right,
          height = 600 - margin.top - margin.bottom;
  
    const svg = d3.select("#chart-heatmap")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);
  
    const x = d3.scaleBand()
      .range([0, width])
      .domain(seasons)
      .padding(0.01);
  
    const y = d3.scaleBand()
      .range([height, 0])
      .domain(stats.map(d => d.name))
      .padding(0.01);
  
    
    const color = d3.scaleLinear()
      .domain([-1, 0, 1])
      .range(["red", "white", "green"]);
  
    svg.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "rotate(-45)")
      .style("text-anchor", "end");
  
    svg.append("g")
      .call(d3.axisLeft(y));
  
    const cells = svg.selectAll()
      .data(data)
      .enter()
      .append("g")
      .attr("transform", d => `translate(${x(d.Season)},0)`);
  
    stats.forEach(stat => {
      cells.append("rect")
        .attr("y", d => y(stat.name))
        .attr("width", x.bandwidth())
        .attr("height", y.bandwidth())
        .style("fill", d => color((d[stat.field] - leagueAverages[stat.field]) / leagueAverages[stat.field]));
  
      cells.append("text")
        .attr("x", x.bandwidth() / 2)
        .attr("y", d => y(stat.name) + y.bandwidth() / 2)
        .attr("dy", ".35em")
        .attr("text-anchor", "middle")
        .style("fill", "black")
        .style("font-size", "10px")
        .text(d => d[stat.field]);
    });
  }).catch(function(error) {
    console.error("Error loading or parsing data:", error);
  });