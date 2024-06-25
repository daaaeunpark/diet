document.addEventListener('DOMContentLoaded', function() {
    const addButton = document.getElementById('addButton');
    const menuInput = document.getElementById('menuInput');
    const menuList = document.getElementById('menuList');
    const ctx = document.getElementById('caloriesChart').getContext('2d');

    const caloriesChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: '섭취 칼로리',
                data: [],
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
                fill: false
            }]
        },
        options: {
            scales: {
                x: {
                    title: {
                        display: true,
                        text: '날짜'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: '칼로리'
                    }
                }
            }
        }
    });

    addButton.addEventListener('click', function() {
        if (menuInput.value.trim() !== "") {
            const date = new Date();
            const dateString = date.toLocaleDateString();

            let dateSection = document.querySelector(`.date-section[data-date="${dateString}"]`);

            if (!dateSection) {
                dateSection = document.createElement('div');
                dateSection.classList.add('date-section');
                dateSection.setAttribute('data-date', dateString);

                const dateHeader = document.createElement('div');
                dateHeader.classList.add('date-header');
                dateHeader.textContent = dateString;

                dateSection.appendChild(dateHeader);
                menuList.appendChild(dateSection);
            }

            const newItem = document.createElement('div');
            newItem.classList.add('menu-item');
            newItem.textContent = menuInput.value;

            dateSection.appendChild(newItem);
            menuInput.value = "";

            // Save menu items to localStorage
            saveMenuItems();

            // Extract calories and update chart
            const calories = extractCalories(newItem.textContent);
            updateChart(dateString, calories);
        } else {
            alert("메뉴를 입력하세요.");
        }
    });

    // Function to save menu items to localStorage
    function saveMenuItems() {
        const menuItems = [];
        const dateSections = document.querySelectorAll('.date-section');
        dateSections.forEach(function(section) {
            const date = section.getAttribute('data-date');
            const items = section.querySelectorAll('.menu-item');
            const menuData = {
                date: date,
                items: []
            };
            items.forEach(function(item) {
                menuData.items.push(item.textContent);
            });
            menuItems.push(menuData);
        });
        localStorage.setItem('menuItems', JSON.stringify(menuItems));
    }

    // Function to load menu items from localStorage
    function loadMenuItems() {
        const savedMenuItems = localStorage.getItem('menuItems');
        if (savedMenuItems) {
            const menuItems = JSON.parse(savedMenuItems);
            menuItems.forEach(function(menuData) {
                let dateSection = document.querySelector(`.date-section[data-date="${menuData.date}"]`);
                if (!dateSection) {
                    dateSection = document.createElement('div');
                    dateSection.classList.add('date-section');
                    dateSection.setAttribute('data-date', menuData.date);

                    const dateHeader = document.createElement('div');
                    dateHeader.classList.add('date-header');
                    dateHeader.textContent = menuData.date;

                    dateSection.appendChild(dateHeader);
                    menuList.appendChild(dateSection);
                }
                menuData.items.forEach(function(itemText) {
                    const newItem = document.createElement('div');
                    newItem.classList.add('menu-item');
                    newItem.textContent = itemText;
                    dateSection.appendChild(newItem);

                    // Extract calories and update chart
                    const calories = extractCalories(itemText);
                    updateChart(menuData.date, calories);
                });
            });
        }
    }

    // Function to extract calories from the menu item text
    function extractCalories(text) {
        const parts = text.split('-');
        if (parts.length > 1) {
            const calories = parseFloat(parts[1].trim());
            if (!isNaN(calories)) {
                return calories;
            }
        }
        return 0;
    }

    // 차트를 새 데이터로 업데이트하는 기능
    function updateChart(date, calories) {
        const index = caloriesChart.data.labels.indexOf(date);
        if (index !== -1) {
            caloriesChart.data.datasets[0].data[index] += calories;
        } else {
            caloriesChart.data.labels.push(date);
            caloriesChart.data.datasets[0].data.push(calories);
        }
        caloriesChart.update();
    }

    // 페이지 로드 시 저장된 메뉴 항목 로드
    loadMenuItems();
});
