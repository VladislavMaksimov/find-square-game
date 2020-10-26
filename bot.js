const isBlockUnusual = (checkedBlock, controlBlock1, controlBlock2) => {
    const checkedBlockColor = checkedBlock.style.backgroundColor;
    const controlBlock1Color = controlBlock1.style.backgroundColor;
    const controlBlock2Color = controlBlock2.style.backgroundColor;
    return checkedBlockColor !== controlBlock1Color && checkedBlockColor !== controlBlock2Color; 
}

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

const tryToPlay = () => {
    const blocks = document.getElementsByClassName('field-block');
    if (blocks.length > 3) {
        if (!findUnusualFromFirstThree(blocks[0], blocks[1], blocks[2]))
            for (let i = 3; i < blocks.length; i++)
                if(blocks[i].style.backgroundColor !== blocks[0].style.backgroundColor) {
                    blocks[i].click();
                    break;
                }
        setTimeout(tryToPlay, 1000);
    } else {
        const startButton = document.getElementsByClassName('start-button')[0];
        if (typeof startButton !== 'undefined') {
            const botButton = document.getElementsByClassName('bot-button')[0];
            botButton.classList.remove('playing');
            botButton.addEventListener('click', tryToStart);
            return;
        }
        else
            setTimeout(tryToPlay, 1000);
    }
}

const tryToStart = () => {
    const startButton = document.getElementsByClassName('start-button')[0];
    const blocks = document.getElementsByClassName('field-block');

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

const startBot = () => {
    const botButton = document.getElementsByClassName('bot-button')[0];
    botButton.classList.add('playing');
    botButton.removeEventListener('click', startBot);
    tryToStart();
}

window.addEventListener('load', () => {
    const botButton = document.getElementsByClassName('bot-button')[0];
    botButton.addEventListener('click', startBot);
});