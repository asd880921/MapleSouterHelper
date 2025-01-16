// ==UserScript==
// @name         MaplescouterInput 工具
// @namespace    MaplescouterInput Tools
// @version      V1.1.0
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
    let allData = [getData(0), getData(1), getData(2)];
    
    const groupButtons = createFormButtons(
        allData.map(data => data?.[0])  //使用 map 獲取每個資料陣列的第一個元素
    );

    let count = 0;
    for (let button of groupButtons) {
        let index = count;
        button.saveButton.addEventListener('click', () => {
            const userConfirmed = window.confirm('確定要儲存資料？');
            if (userConfirmed) {
                const nameInput = document.querySelector('input[placeholder="검색"]'); //角色名稱欄位
                saveData(index, nameInput.value);
                allData[index] = getData(index); //更新資料
                refreshButtonState(button, allData[index]);  //刷新按鈕
                alert("成功儲存!");
            }
        });

        button.loadButton.addEventListener('click', () => {
            const userConfirmed = window.confirm('確定要載入資料？');
            if (userConfirmed) {
                loadForm(allData[index]);
            }
        });

        button.deleteButton.addEventListener('click', () => {
            const userConfirmed = window.confirm('確定要刪除資料？');
            if (userConfirmed) {
                localStorage.removeItem('mapleStoryInputList' + index);
                allData[index] = null; //清除資料
                refreshButtonState(button, null);  //刷新按鈕
            }
        });

        count++;
    }
}

//Button
function createButtonGroup(groupName, container, isEnabled) {
    // 創建一個分組容器
    var groupContainer = document.createElement('div');
    groupContainer.style.display = 'flex';
    groupContainer.style.alignItems = 'center';
    groupContainer.style.marginBottom = '10px'; // 每組間的間距
    groupContainer.style.gap = '10px'; // 按鈕間距
    groupContainer.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'; // 毛玻璃效果的背景透明度
    groupContainer.style.backdropFilter = 'blur(10px)'; // 背景模糊
    groupContainer.style.borderRadius = '10px'; // 圓角
    groupContainer.style.padding = '10px 15px'; // 內邊距
    groupContainer.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)'; // 陰影效果

    // 共用的按鈕樣式設置
    const buttonStyle = (button, color, isEnabled) => {
        button.style.color = '#fff'; // 按鈕文字白色
        button.style.fontSize = '14px';
        button.style.border = 'none'; // 去除邊框
        button.style.borderRadius = '8px'; // 圓角
        button.style.padding = '8px 16px'; // 內邊距
        button.style.cursor = isEnabled ? 'pointer' : 'not-allowed'; // 禁用時改為不可點擊樣式
        button.style.transition = 'transform 0.2s, box-shadow 0.2s'; // 加入過渡效果
        button.style.background = color; // 按鈕顏色
        if (!isEnabled) {
            button.style.opacity = '0.5'; // 禁用狀態下按鈕半透明
        }
    };

    // 儲存按鈕
    var saveButton = document.createElement('button');
    saveButton.textContent = '儲存';
    buttonStyle(saveButton, 'linear-gradient(to right, #2196f3, #64b5f6)', true);
    saveButton.onmouseover = () => (saveButton.style.transform = 'scale(1.1)');
    saveButton.onmouseout = () => (saveButton.style.transform = 'scale(1)');
    groupContainer.appendChild(saveButton);

    // 載入按鈕
    var loadButton = document.createElement('button');
    loadButton.textContent = '載入';
    buttonStyle(loadButton, 'linear-gradient(to right, #4caf50, #81c784)', isEnabled);
    loadButton.onmouseover = () => (loadButton.style.transform = 'scale(1.1)');
    loadButton.onmouseout = () => (loadButton.style.transform = 'scale(1)');
    groupContainer.appendChild(loadButton);

    // 刪除按鈕
    var deleteButton = document.createElement('button');
    deleteButton.textContent = 'X';
    buttonStyle(deleteButton, 'linear-gradient(to right, #ff5e5e, #fc7e7e)', isEnabled);
    deleteButton.onmouseover = () => (deleteButton.style.transform = 'scale(1.1)');
    deleteButton.onmouseout = () => (deleteButton.style.transform = 'scale(1)');
    groupContainer.appendChild(deleteButton);

    // 分組標題
    var label = document.createElement('span');
    label.textContent = groupName || "-";
    label.style.fontSize = '16px';
    label.style.fontWeight = 'bold';
    label.style.marginRight = '10px'; // 標題與按鈕的距離
    label.style.color = '#303030'; // 灰色標題
    groupContainer.appendChild(label);

    // 將分組添加到主容器
    container.appendChild(groupContainer);

    return { saveButton, loadButton, deleteButton, label };
}
function createFormButtons(names) {
    // 創建主容器
    var mainContainer = document.createElement('div');
    mainContainer.style.position = 'fixed';
    mainContainer.style.top = '130px';
    mainContainer.style.right = '50px'; // 整體容器靠右
    mainContainer.style.zIndex = '9999'; // 確保在最前面
    document.body.appendChild(mainContainer);

    // 動態創建多組按鈕
    const groups = [];
    names.forEach(name => {
        // 當名字為 null 時，載入按鈕為灰色且禁用
        const isEnabled = name != null;
        const group = createButtonGroup(name || "-", mainContainer, isEnabled);
        groups.push(group);
    });

    return groups;
}
function refreshButtonState(group, data) {
    const isEnabled = data != null;

    group.loadButton.style.cursor = isEnabled ? 'pointer' : 'not-allowed';
    group.loadButton.style.opacity = isEnabled ? '1' : '0.5';

    group.deleteButton.style.cursor = isEnabled ? 'pointer' : 'not-allowed';
    group.deleteButton.style.opacity = isEnabled ? '1' : '0.5';

    group.label.textContent = isEnabled ? data[0] : "-";
}

//Form function
function loadForm(datas) {
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
    const inputDatas = datas.slice(1); //Copy索引0以外的資料 (0是角色名稱, 不是Input資料)

    for (let data of inputDatas) {
        const currentInput = focusableElements[currentIndex]; //切換Input

        if (currentInput.type === 'checkbox') {
            currentInput.checked = data === 'true';
            continue;
        }
        else 
        {
            currentInput.focus(); //切換焦點
            currentInput.value = ""; //清空
            document.execCommand("insertText", false, data); //使用insertText輸入內容
        }
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

//Get Data (localStorage)
function getData(index) {
    const storedData = localStorage.getItem('mapleStoryInputList' + index); // 從 localStorage 取得資料
    if (storedData) {
        try {
            const values = JSON.parse(storedData); // 解析JSON字串
            return values; // 返回解析後的陣列
        } catch (e) {
            console.error(index + ', localStorage parse Exception : ', e);
            return null;
        }
    } else {
        console.log(index + ', localStorage is no data!');
        return null;
    }
}


//Set Data (localStorage)
function saveData(index, name) {
    //取得Input所有元素
    const focusableElements = Array.from(document.querySelectorAll('input[type="string"], input[type="number"]'));

    // 將名稱加入array的第0列
    const array = [name];

    // 取得每個input元素的值
    focusableElements.forEach(input => {
        array.push(input.value);
    });

    const valueJson = JSON.stringify(array); // 把array轉換為Json字串
    localStorage.setItem('mapleStoryInputList' + index, valueJson); // 儲存到 localStorage
}


