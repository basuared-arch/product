document.addEventListener('DOMContentLoaded', () => {
    // 테마 전환 로직 추가
    const themeToggle = document.getElementById('theme-toggle');
    const darkIcon = document.getElementById('theme-toggle-dark-icon');
    const lightIcon = document.getElementById('theme-toggle-light-icon');
    const html = document.documentElement;

    function updateIcons() {
        if (html.classList.contains('dark')) {
            darkIcon.classList.add('hidden');
            lightIcon.classList.remove('hidden');
        } else {
            darkIcon.classList.remove('hidden');
            lightIcon.classList.add('hidden');
        }
    }

    // 저장된 테마 불러오기
    if (localStorage.getItem('theme') === 'dark' || 
        (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        html.classList.add('dark');
    }
    updateIcons();

    themeToggle.addEventListener('click', () => {
        if (html.classList.contains('dark')) {
            html.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        } else {
            html.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        }
        updateIcons();
    });

    const generateBtn = document.getElementById('generate-btn');
    const numbersContainer = document.getElementById('numbers-container');
    const historySection = document.getElementById('history-section');
    const historyList = document.getElementById('history-list');

    let currentDraw = null; 
    let drawCount = 0; 

    function getBallColorClass(number) {
        if (number <= 10) return 'color-yellow';
        if (number <= 20) return 'color-blue';
        if (number <= 30) return 'color-red';
        if (number <= 40) return 'color-gray';
        return 'color-green';
    }

    function generateLottoNumbers() {
        const numbers = new Set();
        while (numbers.size < 7) { 
            const randomNum = Math.floor(Math.random() * 45) + 1;
            numbers.add(randomNum);
        }
        const numbersArray = Array.from(numbers);
        const mainNumbers = numbersArray.slice(0, 6).sort((a, b) => a - b);
        const bonusNumber = numbersArray[6];
        return { mainNumbers, bonusNumber };
    }

    function addDrawToHistory(drawData, round) {
        historySection.classList.remove('hidden');
        
        const historyRow = document.createElement('div');
        historyRow.className = 'flex items-center justify-between bg-gray-50 dark:bg-gray-800 p-3 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm';
        
        const roundTag = document.createElement('span');
        roundTag.className = 'text-sm font-bold text-indigo-500 dark:text-indigo-400 w-12 shrink-0';
        roundTag.textContent = `${round}회차`;
        
        const ballsContainer = document.createElement('div');
        ballsContainer.className = 'flex items-center gap-1 sm:gap-2 flex-1 justify-center';
        
        const itemsToRender = [...drawData.mainNumbers, '+', drawData.bonusNumber];
        
        itemsToRender.forEach(item => {
            if (item === '+') {
                const plusSign = document.createElement('span');
                plusSign.className = 'text-gray-400 dark:text-gray-500 font-bold text-xs sm:text-sm mx-0.5 sm:mx-1 shrink-0';
                plusSign.textContent = '+';
                ballsContainer.appendChild(plusSign);
            } else {
                const ball = document.createElement('div');
                const colorClass = getBallColorClass(item);
                ball.className = `ball ${colorClass} w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold text-white shrink-0`;
                ball.style.animation = 'none';
                ball.style.opacity = '1';
                
                const textSpan = document.createElement('span');
                textSpan.textContent = item;
                ball.appendChild(textSpan);
                ballsContainer.appendChild(ball);
            }
        });

        historyRow.appendChild(roundTag);
        historyRow.appendChild(ballsContainer);
        historyList.prepend(historyRow);
    }

    generateBtn.addEventListener('click', () => {
        if (currentDraw) {
            addDrawToHistory(currentDraw, drawCount);
        }

        numbersContainer.innerHTML = '';
        generateBtn.disabled = true;
        generateBtn.classList.add('opacity-75', 'cursor-not-allowed');
        generateBtn.textContent = '추첨 중...';

        drawCount++;
        currentDraw = generateLottoNumbers();
        const itemsToRender = [...currentDraw.mainNumbers, '+', currentDraw.bonusNumber];

        itemsToRender.forEach((item, index) => {
            setTimeout(() => {
                if (item === '+') {
                    const plusSign = document.createElement('div');
                    plusSign.className = 'text-gray-400 dark:text-gray-500 font-bold text-lg min-[380px]:text-xl sm:text-2xl md:text-3xl mx-1 sm:mx-2 shrink-0 opacity-0';
                    plusSign.style.animation = 'popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards';
                    plusSign.textContent = '+';
                    numbersContainer.appendChild(plusSign);
                } else {
                    const ball = document.createElement('div');
                    const colorClass = getBallColorClass(item);
                    ball.className = `ball ${colorClass} w-8 h-8 min-[380px]:w-10 min-[380px]:h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center text-xs min-[380px]:text-base sm:text-xl md:text-2xl font-bold text-white shrink-0`;
                    const textSpan = document.createElement('span');
                    textSpan.textContent = item;
                    ball.appendChild(textSpan);
                    numbersContainer.appendChild(ball);
                }

                if (index === itemsToRender.length - 1) {
                    setTimeout(() => {
                        generateBtn.disabled = false;
                        generateBtn.classList.remove('opacity-75', 'cursor-not-allowed');
                        generateBtn.innerHTML = '다시 추첨하기 🔄';
                    }, 300);
                }
            }, index * 150);
        });
    });
});
