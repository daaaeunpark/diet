document.addEventListener('DOMContentLoaded', function() {
    const addButton = document.getElementById('dinnerAddButton');
    const menuInput = document.getElementById('dinnerMenuInput');
    const menuList = document.getElementById('dinnerMenuList');

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

            saveMenuItems();
            updateChart();
        } else {
            alert("메뉴를 입력하세요.");
        }
    });

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

        localStorage.setItem('dinnerMenuItems', JSON.stringify(menuItems));
    }

    function loadMenuItems() {
        const savedMenuItems = localStorage.getItem('dinnerMenuItems');
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
                });
            });
        }
    }

    function updateChart() {
        const savedMenuItems = localStorage.getItem('dinnerMenuItems');
        const chartData = [];
        const chartLabels = [];

        if (savedMenuItems) {
            const menuItems = JSON.parse(savedMenuItems);
            menuItems.forEach(function(menuData) {
                const totalCalories = menuData.items.reduce((total, item) => {
                    const calories = parseInt(item.split('-')[1]);
                    return total + (isNaN(calories) ? 0 : calories);
                }, 0);
                chartData.push(totalCalories);
                chartLabels.push(menuData.date);
            });
        }

        const ctx = document.getElementById('dinnerCaloriesChart').getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: chartLabels,
                datasets: [{
                    label: '섭취 칼로리',
                    data: chartData,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1,
                    fill: false
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    loadMenuItems();
    updateChart();
});
