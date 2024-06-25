document.addEventListener('DOMContentLoaded', function() {
    const recordButton = document.querySelector('.record-button');
    const inputContainer = document.querySelector('.input-container');
    const saveButton = document.querySelector('.save-button');
    const waterDisplay = document.querySelector('.water');
    const waterInput = document.querySelector('.water-input');
    const goalButton = document.querySelector('.goal-button');
    const goalInputContainer = document.querySelector('.goal-input-container');
    const setGoalButton = document.querySelector('.set-goal-button');
    const goalWaterInput = document.querySelector('.goal-water-input');

    let waterData = JSON.parse(localStorage.getItem('waterData')) || [];
    let goalWater = localStorage.getItem('goalWater') || null;

    console.log("Initial waterData:", waterData);
    console.log("Initial goalWater:", goalWater);

    recordButton.addEventListener('click', function() {
        inputContainer.style.display = 'block';
    });

    goalButton.addEventListener('click', function() {
        goalInputContainer.style.display = 'block';
    });

    saveButton.addEventListener('click', function() {
        const waterValue = waterInput.value;
        if (waterValue) {
            waterDisplay.textContent = waterValue;
            inputContainer.style.display = 'none';
            const date = new Date().toLocaleDateString();
            waterData.push({ date: date, water: parseFloat(waterValue) });
            localStorage.setItem('waterData', JSON.stringify(waterData));
            console.log("Updated waterData:", waterData);
            updateChart();
        } else {
            alert('물 섭취량을 입력하세요.');
        }
    });

    setGoalButton.addEventListener('click', function() {
        const goalWaterValue = goalWaterInput.value;
        if (goalWaterValue) {
            goalWater = parseFloat(goalWaterValue);
            localStorage.setItem('goalWater', goalWater);
            goalInputContainer.style.display = 'none';
            console.log("Set goalWater:", goalWater);
            updateChart();
        } else {
            alert('목표 섭취량을 입력하세요.');
        }
    });

    function updateChart() {
        const validWaterData = waterData.filter(entry => entry && entry.date && entry.water !== null);
        const dates = validWaterData.map(entry => entry.date);
        const waters = validWaterData.map(entry => entry.water);
        const goalWaters = new Array(waters.length).fill(goalWater);

        console.log("Updating chart with:", validWaterData, goalWater);

        const ctx = document.getElementById('waterChart').getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: dates,
                datasets: [
                    {
                        label: '기록된 섭취량',
                        data: waters,
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 3,
                        fill: false,
                        pointStyle: 'circle'
                    },
                    {
                        label: '목표 섭취량',
                        data: goalWaters,
                        borderColor: 'blue',
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
                        }
                    }
                }
            }
        });
    }

    function loadGoalWater() {
        const storedGoalWater = localStorage.getItem('goalWater');
        if (storedGoalWater) {
            goalWater = parseFloat(storedGoalWater);
            goalWaterInput.value = goalWater;
        }
        console.log("Loaded goalWater:", goalWater);
    }

    // 페이지가 로드되면 목표물을 로드하고 차트를 업데이트
    loadGoalWater();
    if (waterData.length > 0 || goalWater !== null) {
        updateChart();
    }
});
