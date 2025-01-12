// ==UserScript==
// @name         MaplescouterInput 工具
// @namespace    MaplescouterInput
// @version      V1.0.0
// @description  
// @author       TheHon
// @match        https://maplescouter.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&maplescouter.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    main();
})();

function main() {
    const saveBtn = saveFormData_Button();
    saveBtn.addEventListener('click', () => saveData());
    
    const loadBtn = loadingFormData_Button();
    loadBtn.addEventListener('click', () => showDialogAndExecute());
}

//Create Button
function saveFormData_Button() {
    // 建立按鈕元素
    var button = document.createElement('button');
    button.textContent = '儲存表單資料';
    button.style.position = 'fixed';
    button.style.top = '50px';
    button.style.right = '50px';
    button.style.backgroundColor = 'rgba(0, 0, 0, 0.7)'; // 黑色半透明背景
    button.style.color = '#fff'; // 文字白色
    button.style.fontSize = '14px';
    button.style.border = 'none'; // 去除邊框
    button.style.borderRadius = '5px'; // 圓角
    button.style.padding = '10px 20px'; // 內編劇
    button.style.cursor = 'pointer'; // 滑鼠樣式
    document.body.appendChild(button);
    return button;
};
function loadingFormData_Button() {
    // 建立按鈕元素
    var button = document.createElement('button');
    button.textContent = '載入表單資料';
    button.style.position = 'fixed';
    button.style.top = '100px';
    button.style.right = '50px';
    button.style.backgroundColor = 'rgba(0, 0, 0, 0.7)'; // 黑色半透明背景
    button.style.color = '#fff'; // 文字白色
    button.style.fontSize = '14px';
    button.style.border = 'none'; // 去除邊框
    button.style.borderRadius = '5px'; // 圓角
    button.style.padding = '10px 20px'; // 內編劇
    button.style.cursor = 'pointer'; // 滑鼠樣式
    document.body.appendChild(button);
    return button;
};

//Form function
function showDialogAndExecute() {
    let datas = getData();
    if (datas == null) {
        alert('請先儲存表單資料!');
        return;
    }

    const userConfirmed = window.confirm('確定要載入表單資料嗎？');
    if (!userConfirmed) {
        return;
    }

    const targetInput = document.querySelector('input[placeholder="현재 레벨"]'); //第一個目標input (level欄位)
    const focusableElements = Array.from(document.querySelectorAll('input[type="string"], input[type="number"]'));

    if (!targetInput || !focusableElements) {
        alert('找不到指定的 input 元素!');
        return;
    }

    autoFormInput(targetInput, focusableElements, datas);
}
function autoFormInput(targetInput, focusableElements, datas) {
    //取得target的index位置 (從level欄位當第一個index)
    let currentIndex = focusableElements.indexOf(targetInput);
    for (let data of datas) {
        const currentInput = focusableElements[currentIndex]; //切換Input
        currentInput.focus(); //切換焦點
        currentInput.value = ""; //清空
        document.execCommand("insertText", false, data); //使用insertText輸入內容

        currentIndex++;
    }
}
function simulateTextInput(targetInput, text) {
    targetInput.focus();  // 聚焦到目標input元素
    targetInput.value = '';  // 清空原本的內容

    // 模擬逐字輸入
    for (let char of text) {
        targetInput.value += char;

        // 使用 InputEvent 模擬用戶輸入
        const inputEvent = new InputEvent('input', {
            bubbles: true,
            cancelable: true,
        });
        targetInput.dispatchEvent(inputEvent);  // 派發 input 事件

        // 可選：等待一段時間再輸入下一個字符，以模擬真實的打字過程
        // 這個方法會延遲輸入過程，可以模擬更真實的打字行為
        // (setTimeout 實際用在不需要即時反應的情況下)
    }

    // 在完成輸入後觸發 change 事件
    const changeEvent = new Event('change', { bubbles: true, cancelable: true });
    targetInput.dispatchEvent(changeEvent);  // 派發 change 事件，確保變更會被提交
}

//Get Data (cookie)
function getData() {
    const cookieName = 'mapleStoryInputList';
    const cookieMatch = document.cookie.match('(^| )' + cookieName + '=([^;]+)'); // 查找cookie是否存在
    
    if (cookieMatch) {
        const cookieValue = decodeURIComponent(cookieMatch[2]); // 解碼cookie值
        try {
            const values = JSON.parse(cookieValue); // 解析JSON字串
            return values; // 返回解析後的陣列
        } catch (e) {
            console.error('解析 cookie 時出錯:', e);
            return null;
        }
    } else {
        console.log('找不到指定的 cookie!');
        return null;
    }
}

//Set Data (cookie)
function saveData() {
    const inputValuesList = getInputValues(); //取得表單內容
    setValuesToCookie(inputValuesList); // 把結果存入 cookie
    alert("表單資料已儲存! (僅儲存30分鐘)");
}
function getInputValues() {
    const focusableElements = Array.from(document.querySelectorAll('input[type="string"], input[type="number"]'));
    const inputValues = focusableElements.map(input => input.value);
    return inputValues;
}
function setValuesToCookie(values) {
    const cookieName = 'mapleStoryInputList';
    const cookieValue = encodeURIComponent(JSON.stringify(values)); // 把陣列轉換為字串並編碼
    const expires = new Date();
    expires.setTime(expires.getTime() + (30 * 60 * 1000)); // 設置過期時間為30分鐘
    
    document.cookie = `${cookieName}=${cookieValue}; expires=${expires.toUTCString()}; path=/`; // 存儲到cookie
}

