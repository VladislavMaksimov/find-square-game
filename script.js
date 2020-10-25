const initialTime = 25;

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

const randomize = (first, last) => {
    return first + Math.floor(Math.random() * (last - first));
}

const setTime = () => {
    const timerNum = document.getElementsByClassName('timer-num')[0];
    timerNum.textContent = gameData.time;
}

const getColorComponent = (component) => {
    return component / 100 * 2 * (gameData.level + 10);
}

const getUnusualColor = (r, g, b) => {
    const newR = getColorComponent(r);
    const newG = getColorComponent(g);
    const newB = getColorComponent(b);
    return `rgb(${newR}, ${newG}, ${newB})`
}

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

const deserializeProgress = () => {
    const progress = JSON.parse(localStorage.getItem('progress'));

    gameData.level = progress.level;
    gameData.sideLength = progress.sideLength;
    gameData.unusualBlockIndex = progress.unusualBlockIndex;
    gameData.usualColor = progress.usualColor;
    gameData.unusualColor = progress.unusualColor;

    gameData.time = localStorage.getItem('time');
}

const renderLevel = () => {
    const gameField = document.getElementsByClassName('game-field')[0];
    const levelNum = document.getElementsByClassName('level-num')[0];
    const blocksCount = gameData.sideLength * gameData.sideLength;

    clear(gameField);
    levelNum.textContent = gameData.level;

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

const finishGame = () => {
    localStorage.clear();
    gameData.level = 0;
    gameData.time = initialTime;

    const levelNum = document.getElementsByClassName('level-num')[0];
    const timerNum = document.getElementsByClassName('timer-num')[0];
    clear(levelNum);
    timerNum.textContent = initialTime;

    const gameField = document.getElementsByClassName('game-field')[0];
    clear(gameField);
    gameField.style.gridTemplateColumns = '1fr';
    gameField.style.gridTemplateRows = '1fr';

    const startButton = document.createElement('div');
    startButton.className = 'start-button';
    startButton.textContent = 'START';
    startButton.addEventListener('click', start.bind(this, startButton));
    gameField.appendChild(startButton);
}

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

const loadGame = () => {
    deserializeProgress();
    setTime();
    startTimer();
    renderLevel();
}

const start = (startButton) => {
    startButton.remove();
    startTimer();
    createGameData();
}

window.addEventListener('load', () => {
    if (localStorage.getItem('progress') !== null)
        loadGame();
    const startButton = document.getElementsByClassName('start-button')[0];
    startButton.addEventListener('click', start.bind(this, startButton));
    const timerNum = document.getElementsByClassName('timer-num')[0];
    timerNum.textContent = initialTime;
})