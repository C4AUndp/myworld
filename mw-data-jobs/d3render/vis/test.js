function draw(data, params) {

	d3.select("#vis").remove();

	var width = 200,
		height = 200,
		vis = d3.select("body").append("svg:svg")
				.attr("id", "vis")
				.attr("width", width)
				.attr("height", height);

	vis.append("rect")
		.attr("width", width)
		.attr("height", height)
		.attr("fill", "rgb("+data.r+", "+data.g+", "+data.b+")");

	vis.selectAll(".bar")
		.data(params.bars)
		.enter()
			.append("svg:rect")
				.attr("class", "bar")
				.attr("x", function(d, i) { return 10 + i*10; })
				.attr("y", function(d) { return 100 - d*10; })
				.attr("width", 7)
				.attr("height", function(d) { return d*10; })
				.attr("fill", "#000");

	return;

}