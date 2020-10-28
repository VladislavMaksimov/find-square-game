// Общее время игры
const initialTime = 25;

// Текущее состояние игры
const gameData = {
    level: 0,
    time: initialTime,
    sideLength: '',
    usualColor: '',
    unusualColor: '',
    unusualBlockIndex: ''
}

const clear = (element) => {
    element.textContent = '';
}

// Получает случайное значение между first и last
const randomize = (first, last) => {
    return first + Math.floor(Math.random() * (last - first));
}

// Рендерит текущее время
const setTime = () => {
    const timerNum = document.getElementsByClassName('timer-num')[0];
    timerNum.textContent = gameData.time;
}

// Получает r, g или b компонент "необычного" цвета по компоненту обычного
const getColorComponent = (component) => {
    const additionalValue = gameData.level < 35 ? gameData.level : 35;
    return component / 100 * 2 * (additionalValue + 10);
}

// Получает "необычный" цвет по обычному
const getUnusualColor = (r, g, b) => {
    const newR = getColorComponent(r);
    const newG = getColorComponent(g);
    const newB = getColorComponent(b);
    return `rgb(${newR}, ${newG}, ${newB})`
}

// Сериализует текущее состояние игры в json и сохраняет его в localStorage
const serializeProgress = () => {
    const progress = {
        level: gameData.level,
        sideLength: gameData.sideLength,
        unusualBlockIndex: gameData.unusualBlockIndex,
        usualColor: gameData.usualColor,
        unusualColor: gameData.unusualColor
    };
    localStorage.setItem('progress', JSON.stringify(progress));
}

// Десериализует текущее состояние игры из json'a из localStorage
const deserializeProgress = () => {
    const progress = JSON.parse(localStorage.getItem('progress'));

    gameData.level = progress.level;
    gameData.sideLength = progress.sideLength;
    gameData.unusualBlockIndex = progress.unusualBlockIndex;
    gameData.usualColor = progress.usualColor;
    gameData.unusualColor = progress.unusualColor;

    gameData.time = localStorage.getItem('time');
}

// Рендерит новый уровень
const renderLevel = () => {
    const gameField = document.getElementsByClassName('game-field')[0];
    const levelNum = document.getElementsByClassName('level-num')[0];
    const blocksCount = gameData.sideLength * gameData.sideLength;

    // Удаляет старые блоки
    clear(gameField);
    // Рендерит номер уровня
    levelNum.textContent = gameData.level;

    // Меняет количество блоков
    gameField.style.gridTemplateColumns = `repeat(${gameData.sideLength}, auto)`;
    gameField.style.gridTemplateRows = `repeat(${gameData.sideLength}, auto)`;

    for (let i = 0; i < blocksCount; i++) {
        const block = document.createElement('div');
        block.className = 'field-block';
        if (i === gameData.unusualBlockIndex) {
            block.addEventListener('click', createGameData);
            block.style.backgroundColor = gameData.unusualColor;
        } else
            block.style.backgroundColor = gameData.usualColor;
        gameField.appendChild(block);
    }

}

// Получает текущее состояние игры
const createGameData = () => {
    const level = gameData.level + 1;
    const sideLength = level >= 10 ? 10 : level + 1;
    const blocksCount = sideLength * sideLength;
    const unusualBlockIndex = randomize(0, blocksCount);
    const r = randomize(0,255);
    const g = randomize(0,255);
    const b = randomize(0,255);
    const usualColor = `rgb(${r}, ${g}, ${b})`;
    const unusualColor = getUnusualColor(r, g, b);

    gameData.level = level;
    gameData.sideLength = sideLength;
    gameData.unusualBlockIndex = unusualBlockIndex;
    gameData.usualColor = usualColor;
    gameData.unusualColor = unusualColor;

    serializeProgress();
    renderLevel();
}

// Завершает игру
const finishGame = () => {
    // Останавливает бота и делает кнопку бота кликабельной
    stopBot();
    const botButton = document.getElementsByClassName('bot-button')[0];
    botButton.classList.remove('playing');
    botButton.addEventListener('click', useBot);

    alert(`Игра окончена! Уровней пройдено: ${gameData.level - 1}.`);

    // Очищает данные
    localStorage.clear();
    gameData.level = 0;
    gameData.time = initialTime;

    // Очищает игровое поле
    const gameField = document.getElementsByClassName('game-field')[0];
    clear(gameField);
    gameField.style.gridTemplateColumns = '1fr';
    gameField.style.gridTemplateRows = '1fr';

    // Рендерит исходное состояние игры
    const levelNum = document.getElementsByClassName('level-num')[0];
    const timerNum = document.getElementsByClassName('timer-num')[0];
    clear(levelNum);
    timerNum.textContent = initialTime;

    const startButton = document.createElement('div');
    startButton.className = 'start-button';
    startButton.textContent = 'START';
    startButton.addEventListener('click', start.bind(this, startButton));
    gameField.appendChild(startButton);
}

// Запускает таймер
const startTimer = () => {
    const delay = 1000;
    let timer = setTimeout(function tick(){
        gameData.time--;
        setTime();
        localStorage.setItem('time', gameData.time);

        if (gameData.time > 0)
            timer = setTimeout(tick, delay);
        else
            finishGame();
    }, delay);
}

// Запускает бота
const useBot = () => {
    const botButton = document.getElementsByClassName('bot-button')[0];
    botButton.classList.add('playing');
    botButton.removeEventListener('click', useBot);
    startBot();
}

// Десериализует и рендерит данные из localStorage, запускает работу таймера
const loadGame = () => {
    deserializeProgress();
    setTime();
    startTimer();
    renderLevel();
}

// Начинает игру
const start = (startButton) => {
    startButton.remove();
    startTimer();
    createGameData();
}

window.addEventListener('load', () => {
    const botButton = document.getElementsByClassName('bot-button')[0];
    botButton.addEventListener('click', useBot);

    // Если в localStorage что-то есть, загружает состояние игры из него
    // иначе рендерит начальное состояние игры
    if (localStorage.getItem('progress') !== null)
        loadGame();
    else {
        const gameField = document.getElementsByClassName('game-field')[0];
        const timerNum = document.getElementsByClassName('timer-num')[0];

        const startButton = document.createElement('button');
        startButton.className = 'start-button';
        startButton.textContent = 'START';
        startButton.addEventListener('click', start.bind(this, startButton));
        gameField.appendChild(startButton);
        
        timerNum.textContent = initialTime;
    }
})