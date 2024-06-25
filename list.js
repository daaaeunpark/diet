const input = document.getElementById('text-input');
const button = document.getElementById('clickIcon');
const contentBody = document.querySelector('.content-body');

function loadTodoList() {
    const todoList = localStorage.getItem('todoList');
    if (todoList) {
        contentBody.innerHTML = todoList;
    }
}

loadTodoList();

function updateLocalStorage() {
    localStorage.setItem('todoList', contentBody.innerHTML);
}

// 휴지통 아이콘 클릭 시 해당 투두 아이템을 삭제하는 함수
function deleteToDo(event) {
    const removeIcon = event.target.closest('.dellIcon');
    if (removeIcon) {
        const todoItem = removeIcon.closest('.content-body__section');
        todoItem.remove();
        updateLocalStorage();
    }
}

// 투두 아이템을 추가하는 함수
function inputText() {
    const bodySection = document.createElement('div');
    const viewText = document.createElement('div');
    const dellIcon = document.createElement('button');
    const span = document.createElement('span');
    const i = document.createElement('i');
    const text = input.value;

    if (text.trim() === '') return;

    bodySection.className = 'content-body__section';
    viewText.className = 'viewText';
    dellIcon.className = 'dellIcon';

    contentBody.appendChild(bodySection);
    bodySection.appendChild(viewText);
    bodySection.appendChild(dellIcon);

    span.className = 'toDoList';
    span.textContent = text;
    i.className = 'ri-delete-bin-line';

    viewText.appendChild(span);
    dellIcon.appendChild(i);

    input.value = '';

    updateLocalStorage();
}

// '추가' 버튼 클릭 시 이벤트 리스너
button.addEventListener('click', inputText);

// 입력 필드에서 Enter 키 입력 시 이벤트 리스너
input.addEventListener('keydown', (event) => {
    if (event.keyCode === 13) {
        inputText();
    }
});

// 휴지통 아이콘 클릭 시 이벤트 리스너 (이벤트 위임)
contentBody.addEventListener('click', deleteToDo);
