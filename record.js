document.addEventListener('DOMContentLoaded', function() {
    const recordButton = document.querySelector('.record-button');
    const inputContainer = document.querySelector('.input-container');
    const saveButton = document.querySelector('.save-button');
    const weightDisplay = document.querySelector('.weight');
    const weightInput = document.querySelector('.weight-input');
    const goalButton = document.querySelector('.goal-button');
    const goalInputContainer = document.querySelector('.goal-input-container');
    const setGoalButton = document.querySelector('.set-goal-button');
    const goalWeightInput = document.querySelector('.goal-weight-input');

    let weightData = JSON.parse(localStorage.getItem('weightData')) || [];
    let goalWeight = localStorage.getItem('goalWeight') || null;

    recordButton.addEventListener('click', function() {
        inputContainer.style.display = 'block';
    });

    goalButton.addEventListener('click', function() {
        goalInputContainer.style.display = 'block';
    });

    saveButton.addEventListener('click', function() {
        const weightValue = weightInput.value;
        if (weightValue) {
            weightDisplay.textContent = weightValue;
            inputContainer.style.display = 'none';
            const date = new Date().toLocaleDateString();
            weightData.push({ date: date, weight: parseFloat(weightValue) });
            localStorage.setItem('weightData', JSON.stringify(weightData));
            updateChart();
        } else {
            alert('체중을 입력하세요.');
        }
    });

    setGoalButton.addEventListener('click', function() {
        const goalWeightValue = goalWeightInput.value;
        if (goalWeightValue) {
            goalWeight = parseFloat(goalWeightValue);
            localStorage.setItem('goalWeight', goalWeight);
            goalInputContainer.style.display = 'none';
            updateChart();
        } else {
            alert('목표 체중을 입력하세요.');
        }
    });

    function updateChart() {
        const dates = weightData.map(entry => entry.date);
        const weights = weightData.map(entry => entry.weight);
        const goalWeights = new Array(weights.length).fill(goalWeight);

        const ctx = document.getElementById('weightChart').getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: dates,
                datasets: [
                    {
                        label: '기록된 체중',
                        data: weights,
                        borderColor: 'pink',
                        borderWidth: 3,
                        fill: false,
                        pointStyle: 'circle'
                    },
                    {
                        label: '목표 체중',
                        data: goalWeights,
                        borderColor: 'gray',
                        borderWidth: 3,
                        fill: false,
                        pointStyle: 'circle'
                    }
                ]
            },
            options: {
                scales: {
                    x: {
                        ticks: {
                            color: '#fff', // x축 레이블 색상 흰색으로 변경
                            font: {
                                weight: 'bold' // x축 레이블 굵기 설정
                            }
                        },
                        grid: {
                            color: '#fff' // x축 눈금자 색상 흰색으로 변경
                        },
                        border: {
                            color: '#fff', // x축 경계 색상 흰색으로 변경
                            width: 2 // x축 경계 굵기 설정
                        }
                    },
                    y: {
                        ticks: {
                            color: '#fff', // y축 레이블 색상 흰색으로 변경
                            font: {
                                weight: 'bold' // y축 레이블 굵기 설정
                            }
                        },
                        grid: {
                            color: '#fff' // y축 눈금자 색상 흰색으로 변경
                        },
                        border: {
                            color: '#fff', // y축 경계 색상 흰색으로 변경
                            width: 2 // y축 경계 굵기 설정
                        },
                        beginAtZero: true
                    }
                },
                plugins: {
                    legend: {
                        labels: {
                            color: '#fff' // 범례 텍스트 색상 흰색으로 변경
                        },
                        onClick: function(e, legendItem) {
                            // 범례 항목을 클릭하면 발생하는 이벤트를 설정할 수 있습니다.
                        },
                        generateLabels: function(chart) {
                            const datasets = chart.data.datasets;
                            return datasets.map((dataset, index) => ({
                                text: dataset.label,
                                fillStyle: dataset.borderColor,
                                hidden: !chart.isDatasetVisible(index),
                                lineCap: dataset.borderCapStyle,
                                lineDash: dataset.borderDash,
                                lineDashOffset: dataset.borderDashOffset,
                                lineJoin: dataset.borderJoinStyle,
                                lineWidth: dataset.borderWidth,
                                strokeStyle: dataset.borderColor,
                                pointStyle: dataset.pointStyle,
                                datasetIndex: index
                            }));
                        }
                    }
                }
            }
        });
    }

    function loadGoalWeight() {
        const storedGoalWeight = localStorage.getItem('goalWeight');
        if (storedGoalWeight) {
            goalWeight = parseFloat(storedGoalWeight);
            goalWeightInput.value = goalWeight;
        }
    }

    // 페이지가 로드되면 목표 가중치 로드 및 차트 업데이트
    loadGoalWeight();
    if (weightData.length > 0 || goalWeight !== null) {
        updateChart();
    }
});
