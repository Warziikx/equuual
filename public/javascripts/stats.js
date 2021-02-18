window.addEventListener("load", function () {
	let colorArray = [];
	let labelsArray = [];
	let valueArray = [];
	repartitionChartData.map((data) => {
		colorArray.push(data.categoryColor);
		labelsArray.push(data.categoryName);
		valueArray.push(parseFloat(data.spendAmount.toFixed(2)));
	});
	var options = {
		series: valueArray,
		chart: {
			height: 320,
			width: 640,
			type: "pie",
		},
		labels: labelsArray,
		responsive: [
			{
				breakpoint: 640,
				options: {
					chart: {
						width: 440,
					},
					legend: {
						position: "bottom",
					},
				},
			},
			{
				breakpoint: 460,
				options: {
					chart: {
						width: 320,
					},
					legend: {
						position: "bottom",
					},
				},
			},
		],
		colors: colorArray,
	};

	var chart = new ApexCharts(document.querySelector("#categoryRepartitionChart"), options);
	chart.render();
});
