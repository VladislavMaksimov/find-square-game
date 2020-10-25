const initialTime = 25;
let time = initialTime;
let level = 0;

const clear = (element) => {
    element.textContent = '';
}

const randomize = (first, last) => {
    return first + Math.floor(Math.random() * (last - first));
}

const getColorComponent = (component) => {
    return component / 100 * 2 * (level + 10);
}

const getRightColor = (r, g, b) => {
    const newR = getColorComponent(r);
    const newG = getColorComponent(g);
    const newB = getColorComponent(b);
    return `rgb(${newR}, ${newG}, ${newB})`
}

const renderLevel = () => {
    level++;
    const gameField = document.getElementsByClassName('game-field')[0];
    const levelNum = document.getElementsByClassName('level-num')[0];
    const sideLength = level >= 10 ? 10 : level + 1;
    const blocksCount = sideLength * sideLength;
    const rigthBlockIndex = randomize(0, blocksCount);
    const r = randomize(0,255);
    const g = randomize(0,255);
    const b = randomize(0,255);

    //serializeProgress();

    clear(gameField);
    levelNum.textContent = level;

    gameField.style.gridTemplateColumns = `repeat(${sideLength}, auto)`;
    gameField.style.gridTemplateRows = `repeat(${sideLength}, auto)`;

    for (let i = 0; i < blocksCount; i++) {
        const block = document.createElement('div');
        block.className = 'field-block';
        if (i === rigthBlockIndex) {
            block.addEventListener('click', renderLevel);
            block.style.backgroundColor = getRightColor(r, g, b);
        } else
            block.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
        gameField.appendChild(block);
    }

}

const finishGame = () => {
    level = 0;
    time = initialTime;

    const levelNum = document.getElementsByClassName('level-num')[0];
    const timerNum = document.getElementsByClassName('timer-num')[0];
    clear(levelNum);
    clear(timerNum);

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

const start = (startButton) => {
    startButton.remove();

    const delay = 1000;
    let timer = setTimeout(function tick(){
        const timerNum = document.getElementsByClassName('timer-num')[0];
        time--;
        timerNum.textContent = time;

        if (time > 0)
            timer = setTimeout(tick, delay);
        else
            finishGame();
    }, delay);

    renderLevel();
}

window.addEventListener('load', () => {
    const startButton = document.getElementsByClassName('start-button')[0];
    startButton.addEventListener('click', start.bind(this, startButton));
    const timerNum = document.getElementsByClassName('timer-num')[0];
    timerNum.textContent = initialTime;
})