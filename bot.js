let state = {
    playing: false
};

const setPlaying = (playing) => {
    state.playing = playing;
}

const stopBot = () => {
    setPlaying(false)
}

// Сравнивает один блок с двумя контрольными
const isBlockUnusual = (checkedBlock, controlBlock1, controlBlock2) => {
    const checkedBlockColor = checkedBlock.style.backgroundColor;
    const controlBlock1Color = controlBlock1.style.backgroundColor;
    const controlBlock2Color = controlBlock2.style.backgroundColor;
    return checkedBlockColor !== controlBlock1Color && checkedBlockColor !== controlBlock2Color; 
}

// Ищет отличающийся по цвету блок среди трёх первых
const findUnusualFromFirstThree = (block0, block1, block2) => {
    if (isBlockUnusual(block0, block1, block2)) {
        block0.click();
        return true;
    }
    if (isBlockUnusual(block1, block0, block2)) {
        block1.click();
        return true;
    }
    if (isBlockUnusual(block2, block0, block1)) {
        block2.click();
        return true;
    }
    return false;
}

// Проходит уровни, если они отрендерены
const tryToPlay = () => {
    if (!state.playing) return;

    const blocks = document.getElementsByClassName('field-block');
    if (blocks.length > 3) {
        // Если среди трёх первых блоков нет нужного, то у них "обычный" цвет
        // и достаточно сравнить остальные с их цветом
        if (!findUnusualFromFirstThree(blocks[0], blocks[1], blocks[2]))
            for (let i = 3; i < blocks.length; i++)
                if(blocks[i].style.backgroundColor !== blocks[0].style.backgroundColor) {
                    blocks[i].click();
                    break;
                }
    }

    // Запускается каждую секунду
    setTimeout(tryToPlay, 1000);
}

// Запускает игру
const tryToStart = () => {
    setPlaying(true);

    const startButton = document.getElementsByClassName('start-button')[0];
    const blocks = document.getElementsByClassName('field-block');

    // Начинает играть только если блоки отрендерились, иначе нажимает на кнопку "старт"
    if (blocks.length > 0)
        tryToPlay();
    else {
        try {
            startButton.click();
        } finally {
            setTimeout(tryToStart, 1000);
        }
    }
}

const startBot = () => tryToStart();