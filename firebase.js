// Firebase 초기화
const firebaseConfig = {
    apiKey: "AIzaSyA3mtsbzRjFlw669CaQQxs2YrauZBQ_RQw",
    authDomain: "tnwjd-7c488.firebaseapp.com",
    projectId: "tnwjd-7c488",
    storageBucket: "tnwjd-7c488.appspot.com",
    messagingSenderId: "57393202846",
    appId: "1:57393202846:web:838f28cdd9591a65d35d8f"
};

firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// DOM 요소 참조
const editableText = document.getElementById('editable-text');
const textInput = document.getElementById('text-input');
const updateButton = document.getElementById('update-button');

// 실시간으로 데이터 업데이트
database.ref('card1').on('value', (snapshot) => {
    const data = snapshot.val();
    if (data) {
        textInput.value = data.text;
    }
});

// 업데이트 버튼 이벤트 리스너 추가
updateButton.addEventListener('click', () => {
    const newText = textInput.value.trim();
    if (newText) {
        database.ref('card1').set({
            text: newText
        }).then(() => {
            textInput.value = '';
        }).catch((error) => {
            console.error('Error updating text:', error);
        });
    }
});
