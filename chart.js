const config = {
    headers: {
        "X-RapidAPI-Host": "community-hitbtc.p.rapidapi.com",
        "X-RapidAPI-Key": "b32608d3c0mshdf4f114d52e7dfap1e499ejsn7edfa8f5f4f8"
    }
}

let trainingNumber = 5729,
    ctx = document.getElementById('myChart').getContext('2d'),
    lineChartData = {
        labels: [],
        datasets: [{
            steppedLine: true,
            label: 'Stock Price',
            data: [],
            backgroundColor: "rgba(231, 76, 60, 0.2)",
            borderColor: "#e74c3c",
            borderWidth: 3,
        }, {
            type: 'line',
            label: 'AI Market Predictions',
            data: [],
            backgroundColor: "rgba(231, 76, 60, 0)",
            borderColor: "#2ecc71",
            borderWidth: 1,
        }, {
            type: 'line',
            label: 'AI Self-Confidence',
            data: [],
            backgroundColor: "rgba(231, 76, 60, 0)",
            borderColor: "#9b59b6",
            borderWidth: 1,
        }]
    },
    myChart = new Chart.Line(ctx, {
        data: lineChartData,
        options: {
            animation: {
                duration: 0
            }
        }
    });

setInterval(() => {
    let requestBTC = $.get({
            url: "https://community-hitbtc.p.rapidapi.com/api/1/public/BTCUSD/trades?max_results=1&from=0&start_index=0&by=trade_id&sort=desc",
            beforeSend: (xhr) => {
                xhr.setRequestHeader("X-RapidAPI-Host", "community-hitbtc.p.rapidapi.com")
                xhr.setRequestHeader("X-RapidAPI-Key", "b32608d3c0mshdf4f114d52e7dfap1e499ejsn7edfa8f5f4f8")
            }
        }),
        averageBTC = (data) => {
            let sum = 0

            data.forEach((val, idx) => sum += parseFloat(val))

            return sum / data.length
        },
        selfConfidence = (data, avg) => {
            let vals = 0,
                avgs = parseFloat(avg[avg.length - 1])

            vals = parseFloat(vals + (parseFloat(data[data.length - 1]) - avgs) + 9700)

            return vals
        }

    function addData(chart, data, idx) {
        if (idx === 0) {
            let dt = new Date()
            chart.data.labels.push(dt.getHours() + ":" + dt.getMinutes())
        }
        chart.data.datasets.forEach((dataset, index) => {
            if (idx === index) {
                dataset.data.push(data)
            }
        });
    }

    function removeData(chart) {
        chart.data.labels.shift()
        chart.data.datasets.forEach((dataset, index) => {
            dataset.data.shift()
        });
    }

    requestBTC.then((response) => {
        let label = response.trades.map((x) => x[0]),
            data = response.trades.map((x) => x[1])
        if (myChart.data.datasets[0].data.length > 25) {
            removeData(myChart, 0)
            removeData(myChart, 1)
            // removeData(myChart, 2)
        }
        addData(myChart, data[0], 0)
        addData(myChart, averageBTC(myChart.data.datasets[0].data), 1)
        addData(myChart, selfConfidence(myChart.data.datasets[0].data, myChart.data.datasets[1].data), 2)

        myChart.update()
        trainingNumber++

        $('.training-number').html(trainingNumber)

        let decision = Math.random()

        if (decision > 0.75) {
            $('.ai-decision').html("<span class='badge badge-success'>BID</span>")
        } else {
            $('.ai-decision').html("<span class='badge badge-warning'>TAKE</span>")
        }

    })
}, 3000)