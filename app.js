/**
 * САМОСБОР: ЛИКВИДАТОР 1324 - 3D FPS Игровой движок
 */

// --- НАСТРОЙКИ ИГРЫ ---
const START_FLOOR = 1324;
const END_FLOOR = 1;
const MAX_HEALTH = 100;
const MAX_WATER = 100;
const MAX_AMMO = 24;
const MAX_FILTER = 100;

// Глобальные переменные света
let doorLights = {};
let playerFlashlight = null;
let warningBeacons = [];
let warningLights = [];

// --- РАЗНООБРАЗИЕ ГЕЙМПЛЕЯ: НОВЫЕ ПЕРЕМЕННЫЕ ---
let hallwayCrawlerMesh = null;
let crawlerHealth = 2;
let deadLiquidatorMesh = null;
let deadLiquidatorSearched = false;
let ghostMesh = null;
let activeHackChannel = 'A';
let targetFrequencies = { A: 0, B: 0, C: 0 };
let hackSuccessCallback = null;
let hackActive = false;
let lastBuiltFloor = null;

const LORE_NOTES = [
    {
        id: 0,
        title: "Грязный листок бумаги (Этаж ~1200)",
        content: "Блок 1290. Семнадцатый день после блокировки сектора. \n\nВентиляция гудит как бешеная, оттуда постоянно пахнет сырым, гниющим мясом и химикатами. Сосед снизу вчера пропал. Его жена говорит, что слышала скрежет за гермодверью посреди ночи, будто кто-то когтями пытался подковырнуть стальной уплотнитель. \n\nВода в кранах уже неделю идет бурая. Кажется, фильтры на водозаборе забились останками. Ликвидаторы не приходят. Нам говорят сидеть по квартирам. Где же чертово солнце? Существует ли оно вообще, или бетон - это всё, что есть в этом мире?"
    },
    {
        id: 1,
        title: "Рапорт командира группы (Этаж ~1100)",
        content: "РАПОРТ. Ликвидатор мл. сержант Соболев. Группа «Бета-6». \n\nНам приказали зачистить блок 1105 после локального прорыва самосбора. Всё шло по инструкции, заливали коридор реагентами. Но в торцевом коридоре мы наткнулись на квартиру №42. Гермодверь была заблокирована изнутри. Оттуда кричали дети, умоляли открыть. \n\nНо датчики показывали критический уровень заражения за дверью. Самосборная слизь уже пробивалась через стыки. Приказ штаба был однозначным: консервация блока. Мы заварили дверь автогеном снаружи. Дети кричали еще минут десять, пока мы работали. Я до сих пор слышу этот звук, когда закрываю глаза. Прости нас, Хрущ."
    },
    {
        id: 2,
        title: "Памятка ГО и ЧС (Этаж ~1000)",
        content: "ПАМЯТКА ЖИЛЬЦУ ГИГАХРУЩЕВКИ ПРИ НАЧАЛЕ САМОСБОРА: \n\n1. При первых звуках сирены немедленно прекратите любые перемещения по лестничным маршам.\n2. Войдите в ближайшее жилое помещение или шлюзовую зону.\n3. Герметично закройте гермодверь. Затяните вентили ручного прижима до упора.\n4. Наденьте средства индивидуальной защиты (противогаз ГП-9 или аналог).\n5. Не приближайтесь к вентиляционным шахтам и дверным проемам.\n6. Игнорируйте любые звуки, голоса родственников или коллег, доносящиеся снаружи во время активной фазы.\n7. Ожидайте прибытия Ликвидаторов для проведения дезинфекции."
    },
    {
        id: 3,
        title: "Дневник ребенка (Этаж ~900)",
        content: "12 марта. \n\nМама забрала мои цветные карандаши, потому что я нарисовал небо. Я помню его! Оно было такое... синее-синее, и сверху висел огромный теплый круг, который светил и грел. Мама заплакала, порвала рисунок и ударила меня по рукам. Она сказала, что небо - это опасный бред сумасшедших, и если кто-то из Комитета услышит мои сказки, нас всех отправят на нижние технические этажи в переработку на концентрат. \n\nОна говорит, что кроме Хрущевки ничего нет. Только бетон вверх, вниз и во все стороны. Но я знаю, что она врет. Папа ушел искать выход полгода назад и не вернулся. Я найду его."
    },
    {
        id: 4,
        title: "Агитационная листовка (Этаж ~800)",
        content: "ГРАЖДАНЕ ГИГАХРУЩЕВКИ! \n\nКомитет Общественного Спасения напоминает: \n- Вся бесконечная структура Хрущевки — единственный оплот человечества. \n- За пределами бетонных стен царит первородный хаос и пустота.\n- Труд ликвидатора — священен. Отдавая жизнь за герметизацию прорывов, ликвидатор обретает вечный покой в сердцах выживших.\n- Любые слухи о «выходе» наружу — это диверсия агентов хаоса, направленная на подрыв дисциплины. \n\nСОХРАНЯЙТЕ БДИТЕЛЬНОСТЬ! ДОКЛАДЫВАЙТЕ О ПОДОЗРИТЕЛЬНОЙ АКТИВНОСТИ В БЛИЖАЙШИЙ ПОСТ ЛИКВИДАТОРОВ."
    },
    {
        id: 5,
        title: "Кровавый клочок блокнота (Этаж ~700)",
        content: "Если ты читаешь это... беги... \n\nЯ пробил шахту кабельного коллектора на 700 этаже. Комитет врет нам веками! Нет никакого хаоса снаружи. Стены Хруща — это лишь оболочка. Я видел... Я видел небо! Оно действительно синее, и там пахнет травой, а не хлоркой и горелой плотью. \n\nНо они следят за нами. Самосбор — это не природное бедствие. Они запускают его сами через вентиляцию каждый раз, когда население этажа начинает догадываться о правде. Это зачистка! \nЕсли начнется Самосбор, не прячься. Стой на месте в коридоре. Прими его. Нас травят газом, вызывающим галлюцинации и сон, но это единственный способ сорвать датчики слежения и... [залито старой темной кровью]"
    }
];

// --- ГЛОБАЛЬНОЕ СОСТОЯНИЕ ИГРЫ ---
let state = {
    floor: START_FLOOR,
    spawnFloor: START_FLOOR,
    health: MAX_HEALTH,
    water: MAX_WATER,
    ammo: MAX_AMMO,
    filter: MAX_FILTER,
    maskOn: false,
    notesCollected: [false, false, false, false, false, false],
    notesCount: 0,
    
    // Статусы Самосбора
    samosborStatus: 'normal', 
    samosborTimeLeft: 100, 
    samosborCountdown: 20, 
    samosborActiveDuration: 30, 
    
    // Двери на этаже (теперь 6 дверей)
    floorsData: {},
    get doors() {
        if (!this.floorsData) {
            this.floorsData = {};
        }
        if (!this.floorsData[this.floor]) {
            getOrGenerateFloorDoors(this.floor);
        }
        return this.floorsData[this.floor].doors;
    },
    set doors(val) {
        if (!this.floorsData) {
            this.floorsData = {};
        }
        this.floorsData[this.floor] = { doors: val };
    },
    focusedDoorIndex: null, // Дверь в перекрестии прицела
    focusedStairsDoor: false, // Гермозатвор на лестнице в перекрестии
    
    // Местоположение игрока
    location: 'hallway', // 'hallway', 'room', 'transition'
    samosborSafe: false, 
    searchProgress: 0,
    isSearching: false,
    
    // Лестничный монстр
    stairsMonsterActive: false,
    stairsMonsterTimeLeft: 0,
    
    audioInit: false,
    bottleWater: 100,
    
    // Новые механики взлома и бега
    stamina: 100,
    hasHackerTool: false,
    batteries: 0,
    stairsDoors: {},
    keyBindings: {},
    floorEvent: null
};

// --- ФИЗИКА И ПОЛОЖЕНИЕ ИГРОКА (3D FPS) ---
let playerPos = new THREE.Vector3(0, 0, 0);
let playerYaw = 0; // Вращение по горизонтали
let playerPitch = 0; // Вращение по вертикали
let keys = {}; // Зажатые клавиши

// --- НАСТРОЙКИ КЛАВИАТУРЫ И УПРАВЛЕНИЯ ---
const DEFAULT_KEY_BINDINGS = {
    'MoveForward': 'KeyW',
    'MoveBackward': 'KeyS',
    'MoveLeft': 'KeyA',
    'MoveRight': 'KeyD',
    'Sprint': 'ShiftLeft',
    'Interact': 'KeyR',
    'Flashlight': 'KeyF',
    'Listen': 'KeyE',
    'GasMask': 'KeyT',
    'Water': 'KeyQ',
    'Bag': 'KeyG',
    'Search': 'KeyZ',
    'HackerTool': 'KeyB',
    'Pause': 'Escape'
};

const ACTION_LABELS = {
    'MoveForward': 'Движение вперед',
    'MoveBackward': 'Движение назад',
    'MoveLeft': 'Движение влево',
    'MoveRight': 'Движение вправо',
    'Sprint': 'Бег (Ускорение)',
    'Interact': 'Взаимодействие / Дверь',
    'Flashlight': 'Фонарик Вкл/Выкл',
    'Listen': 'Слушать у гермодвери',
    'GasMask': 'Надеть/снять противогаз',
    'Water': 'Сделать глоток воды',
    'Bag': 'Открыть сумку (Записки)',
    'Search': 'Обыскать комнату',
    'HackerTool': 'Применить взломщик',
    'Pause': 'Пауза (Меню)'
};

function loadKeyBindings() {
    try {
        const saved = localStorage.getItem('samosbor_keybindings');
        if (saved) {
            state.keyBindings = JSON.parse(saved);
            for (let k in DEFAULT_KEY_BINDINGS) {
                if (!state.keyBindings[k]) {
                    state.keyBindings[k] = DEFAULT_KEY_BINDINGS[k];
                }
            }
            return;
        }
    } catch (e) {
        console.warn("Failed to load keybindings:", e);
    }
    state.keyBindings = Object.assign({}, DEFAULT_KEY_BINDINGS);
}

function saveKeyBindings() {
    try {
        localStorage.setItem('samosbor_keybindings', JSON.stringify(state.keyBindings));
    } catch (e) {
        console.error("Failed to save keybindings:", e);
    }
}

// --- УПРАВЛЕНИЕ ЛЕСТНИЧНЫМИ ДВЕРЯМИ ---
function getOrGenerateStairsDoor(floorNum) {
    if (!state.stairsDoors) {
        state.stairsDoors = {};
    }
    if (state.stairsDoors[floorNum] !== undefined) {
        return state.stairsDoors[floorNum];
    }
    if (floorNum === START_FLOOR) {
        state.stairsDoors[floorNum] = { opened: true };
    } else if (floorNum === 1) {
        state.stairsDoors[floorNum] = { opened: false };
    } else {
        // Если у игрока ещё нет взломщика гермодверей, затворы не могут быть закрытыми
        if (!state.hasHackerTool) {
            state.stairsDoors[floorNum] = { opened: true };
        } else {
            // 40% chance of being closed (needs hacker tool)
            state.stairsDoors[floorNum] = { opened: Math.random() >= 0.4 };
        }
    }
    return state.stairsDoors[floorNum];
}
let pointerLocked = false;
let footstepTimeAccumulator = 0; // Накопитель времени для звуков шагов
const playerSpeed = 4.0;
const sensitivity = 0.0025;

// Мобильное управление движением (флаги виртуального D-pad)
let mvUp = false, mvDown = false, mvLeft = false, mvRight = false;
let touchStartX = 0, touchStartY = 0;

// --- ТРЁХМЕРНАЯ ГРАФИКА (THREE.JS ENGINE) ---
let renderer, scene, camera, raycaster;
let floorMesh, ceilingMesh, leftWallMesh, rightWallMesh, backWallMesh, frontWallMesh;
let doorPivots = []; // Створки дверей в 3D
let ceilingPipes = [];
let ceilingLights = [];
let warningBeacon, warningLight;
let roomMeshes = [];
let transitionMeshes = [];
let stairsMonsterMesh = null;
let staircaseMeshes = [];
let proceduralTextures = {};

// Координаты дверей на этаже: 3 слева (X = -3), 3 справа (X = 3)
const DOOR_LAYOUT = [
    { x: -3.0, z: -10, rot: Math.PI / 2 },
    { x: -3.0, z: -22, rot: Math.PI / 2 },
    { x: -3.0, z: -34, rot: Math.PI / 2 },
    { x: 3.0, z: -10, rot: -Math.PI / 2 },
    { x: 3.0, z: -22, rot: -Math.PI / 2 },
    { x: 3.0, z: -34, rot: -Math.PI / 2 }
];

function init3D() {
    const holder = document.getElementById('canvas-holder');
    if (!holder) return;
    
    holder.innerHTML = '';
    
    // 1. WebGL рендерер
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(holder.clientWidth, holder.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    holder.appendChild(renderer.domElement);
    
    // 2. Сцена и камера
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x060709);
    scene.fog = new THREE.FogExp2(0x060709, 0.06);
    
    camera = new THREE.PerspectiveCamera(65, holder.clientWidth / holder.clientHeight, 0.1, 100);
    camera.rotation.order = 'YXZ'; // Важно для FPS вращения!
    
    raycaster = new THREE.Raycaster();
    
    // 3. Создаем текстуры
    generateProceduralTextures();
    
    // 4. Строим сцену
    build3DScene();
    
    // Добавляем фонарик игрока (включен по умолчанию)
    playerFlashlight = new THREE.SpotLight(0xffffee, 2.5, 25, Math.PI / 3.5, 0.6, 1);
    playerFlashlight.position.set(0, 0, 0);
    playerFlashlight.target.position.set(0, 0, -1);
    playerFlashlight.castShadow = true;
    playerFlashlight.shadow.mapSize.width = 512;
    playerFlashlight.shadow.mapSize.height = 512;
    playerFlashlight.shadow.bias = -0.001;
    camera.add(playerFlashlight);
    camera.add(playerFlashlight.target);
    
    // Procedural First-Person Pistol Model
    const pistolGroup = new THREE.Group();
    pistolGroup.name = "pistol";
    const pistolMetal = new THREE.MeshStandardMaterial({ color: 0x22252a, roughness: 0.5, metalness: 0.8 });
    const pistolGrip = new THREE.MeshStandardMaterial({ color: 0x111215, roughness: 0.8 });
    const laserSightMat = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    
    // Slide/Barrel
    const slideGeo = new THREE.BoxGeometry(0.04, 0.05, 0.22);
    const slide = new THREE.Mesh(slideGeo, pistolMetal);
    pistolGroup.add(slide);
    
    // Grip
    const gripGeo = new THREE.BoxGeometry(0.035, 0.11, 0.045);
    const grip = new THREE.Mesh(gripGeo, pistolGrip);
    grip.position.set(0, -0.065, 0.045);
    grip.rotation.x = 0.25;
    pistolGroup.add(grip);
    
    // Trigger guard
    const guardGeo = new THREE.BoxGeometry(0.015, 0.03, 0.05);
    const guard = new THREE.Mesh(guardGeo, pistolMetal);
    guard.position.set(0, -0.035, -0.02);
    pistolGroup.add(guard);

    // Laser module
    const laserGeo = new THREE.CylinderGeometry(0.007, 0.007, 0.07, 8);
    const laser = new THREE.Mesh(laserGeo, pistolMetal);
    laser.rotation.x = Math.PI / 2;
    laser.position.set(0, -0.022, -0.05);
    pistolGroup.add(laser);

    const lensGeo = new THREE.CylinderGeometry(0.004, 0.004, 0.002, 8);
    const lens = new THREE.Mesh(lensGeo, laserSightMat);
    lens.rotation.x = Math.PI / 2;
    lens.position.set(0, -0.022, -0.086);
    pistolGroup.add(lens);
    
    pistolGroup.position.set(0.18, -0.16, -0.32);
    pistolGroup.rotation.y = -Math.PI / 20;
    pistolGroup.rotation.x = Math.PI / 80;
    camera.add(pistolGroup);
    
    scene.add(camera);
    
    // 5. Запуск цикла
    animate3D();
}

function generateProceduralTextures() {
    const createNoiseTexture = (baseColor, noiseColor, scale = 1, isConcrete = false) => {
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 256;
        const ctx = canvas.getContext('2d');
        
        ctx.fillStyle = baseColor;
        ctx.fillRect(0, 0, 256, 256);
        
        ctx.fillStyle = noiseColor;
        for (let i = 0; i < 6000; i++) {
            const size = Math.random() * 2 + 1;
            const x = Math.random() * 256;
            const y = Math.random() * 256;
            ctx.globalAlpha = Math.random() * 0.18;
            ctx.fillRect(x, y, size, size);
        }
        
        if (isConcrete) {
            ctx.fillStyle = 'rgba(74, 52, 32, 0.15)';
            for (let i = 0; i < 18; i++) {
                ctx.beginPath();
                ctx.arc(Math.random() * 256, Math.random() * 256, Math.random() * 60 + 20, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.strokeStyle = 'rgba(10, 10, 10, 0.4)';
            ctx.lineWidth = 1;
            for (let i = 0; i < 4; i++) {
                ctx.beginPath();
                ctx.moveTo(Math.random() * 256, Math.random() * 256);
                ctx.lineTo(Math.random() * 256, Math.random() * 256);
                ctx.stroke();
            }
        }
        
        ctx.globalAlpha = 1.0;
        const tex = new THREE.CanvasTexture(canvas);
        tex.wrapS = THREE.RepeatWrapping;
        tex.wrapT = THREE.RepeatWrapping;
        tex.repeat.set(scale, scale);
        return tex;
    };
    
    const createDoorTexture = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 512;
        const ctx = canvas.getContext('2d');
        
        ctx.fillStyle = '#2d333b';
        ctx.fillRect(0, 0, 256, 512);
        
        ctx.fillStyle = '#5c2d13';
        for (let i = 0; i < 2000; i++) {
            ctx.globalAlpha = Math.random() * 0.2;
            ctx.fillRect(Math.random() * 256, Math.random() * 512, Math.random() * 4 + 1, Math.random() * 4 + 1);
        }
        
        ctx.strokeStyle = '#111417';
        ctx.lineWidth = 4;
        ctx.strokeRect(10, 10, 236, 492);
        ctx.strokeRect(20, 20, 216, 230);
        ctx.strokeRect(20, 262, 216, 230);
        
        // Вентиль штурвала
        ctx.strokeStyle = '#4a5463';
        ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.arc(128, 256, 42, 0, Math.PI * 2);
        ctx.stroke();
        
        ctx.fillStyle = '#111316';
        ctx.beginPath();
        ctx.arc(128, 256, 16, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = '#4a5463';
        ctx.fillRect(124, 202, 8, 108);
        ctx.fillRect(74, 252, 108, 8);
        
        ctx.globalAlpha = 1.0;
        return new THREE.CanvasTexture(canvas);
    };

    const createWallpaperTexture = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 128;
        canvas.height = 128;
        const ctx = canvas.getContext('2d');
        
        ctx.fillStyle = '#261e16';
        ctx.fillRect(0, 0, 128, 128);
        
        ctx.strokeStyle = '#181109';
        ctx.lineWidth = 2;
        for (let x = 16; x < 128; x += 32) {
            ctx.beginPath();
            ctx.moveTo(x, 0); ctx.lineTo(x, 128);
            ctx.stroke();
        }
        ctx.globalAlpha = 0.25;
        ctx.strokeStyle = '#e6b800';
        ctx.lineWidth = 1;
        for (let y = 0; y < 128; y += 16) {
            for (let x = 0; x < 128; x += 16) {
                ctx.beginPath();
                ctx.moveTo(x, y + 8);
                ctx.lineTo(x + 8, y);
                ctx.lineTo(x + 16, y + 8);
                ctx.lineTo(x + 8, y + 16);
                ctx.closePath();
                ctx.stroke();
            }
        }
        ctx.globalAlpha = 1.0;
        const tex = new THREE.CanvasTexture(canvas);
        tex.wrapS = THREE.RepeatWrapping;
        tex.wrapT = THREE.RepeatWrapping;
        tex.repeat.set(4, 4);
        return tex;
    };
    
    const createStairsDoorTexture = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 512;
        const ctx = canvas.getContext('2d');
        
        ctx.fillStyle = '#1c2024';
        ctx.fillRect(0, 0, 256, 512);
        
        ctx.fillStyle = '#4a2f1b';
        for (let i = 0; i < 1500; i++) {
            ctx.globalAlpha = Math.random() * 0.15;
            ctx.fillRect(Math.random() * 256, Math.random() * 512, Math.random() * 5 + 1, Math.random() * 5 + 1);
        }
        ctx.globalAlpha = 1.0;
        
        ctx.strokeStyle = '#0e1013';
        ctx.lineWidth = 6;
        ctx.strokeRect(6, 6, 244, 500);
        ctx.beginPath();
        ctx.moveTo(6, 256);
        ctx.lineTo(250, 256);
        ctx.stroke();
        
        ctx.strokeStyle = '#2d333b';
        ctx.lineWidth = 4;
        ctx.strokeRect(16, 16, 224, 230);
        ctx.strokeRect(16, 266, 224, 230);
        
        ctx.beginPath();
        ctx.moveTo(20, 20); ctx.lineTo(236, 242);
        ctx.moveTo(236, 20); ctx.lineTo(20, 242);
        ctx.moveTo(20, 270); ctx.lineTo(236, 492);
        ctx.moveTo(236, 270); ctx.lineTo(20, 492);
        ctx.stroke();
        
        ctx.fillStyle = '#ffcc00';
        ctx.globalAlpha = 0.4;
        ctx.fillRect(6, 6, 20, 500);
        ctx.fillRect(230, 6, 20, 500);
        ctx.fillStyle = '#000000';
        for (let y = 10; y < 512; y += 30) {
            ctx.beginPath();
            ctx.moveTo(6, y);
            ctx.lineTo(26, y + 20);
            ctx.lineTo(26, y + 30);
            ctx.lineTo(6, y + 10);
            ctx.closePath();
            ctx.fill();
            
            ctx.beginPath();
            ctx.moveTo(230, y);
            ctx.lineTo(250, y + 20);
            ctx.lineTo(250, y + 30);
            ctx.lineTo(230, y + 10);
            ctx.closePath();
            ctx.fill();
        }
        ctx.globalAlpha = 1.0;
        
        return new THREE.CanvasTexture(canvas);
    };

    proceduralTextures.concrete = createNoiseTexture('#424750', '#1c1f24', 3, true);
    proceduralTextures.ceiling = createNoiseTexture('#25282e', '#090a0c', 4, false);
    proceduralTextures.rust = createNoiseTexture('#4a3325', '#160e0a', 1, false);
    proceduralTextures.door = createDoorTexture();
    proceduralTextures.wallpaper = createWallpaperTexture();
    proceduralTextures.stairsDoor = createStairsDoorTexture();

    // Procedural Normal Map generator from Canvas texture image data
    const createNormalMap = (srcCanvas, strength = 1.0) => {
        const width = srcCanvas.width;
        const height = srcCanvas.height;
        const ctxSrc = srcCanvas.getContext('2d');
        const imgData = ctxSrc.getImageData(0, 0, width, height);
        const data = imgData.data;

        const normalCanvas = document.createElement('canvas');
        normalCanvas.width = width;
        normalCanvas.height = height;
        const ctxDst = normalCanvas.getContext('2d');
        const dstData = ctxDst.createImageData(width, height);
        const dst = dstData.data;

        const getPixelIntensity = (x, y) => {
            const px = (x + width) % width;
            const py = (y + height) % height;
            const idx = (py * width + px) * 4;
            return (data[idx] + data[idx+1] + data[idx+2]) / 3;
        };

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const idx = (y * width + x) * 4;
                const hL = getPixelIntensity(x - 1, y);
                const hR = getPixelIntensity(x + 1, y);
                const hD = getPixelIntensity(x, y - 1);
                const hU = getPixelIntensity(x, y + 1);
                const dx = (hR - hL) / 255.0 * strength;
                const dy = (hU - hD) / 255.0 * strength;
                const len = Math.sqrt(dx * dx + dy * dy + 1.0);
                const nx = -dx / len;
                const ny = -dy / len;
                const nz = 1.0 / len;
                dst[idx]   = Math.floor((nx * 0.5 + 0.5) * 255);
                dst[idx+1] = Math.floor((ny * 0.5 + 0.5) * 255);
                dst[idx+2] = Math.floor((nz * 0.5 + 0.5) * 255);
                dst[idx+3] = 255;
            }
        }
        ctxDst.putImageData(dstData, 0, 0);
        return normalCanvas;
    };

    // Generating Normal/Bump Map CanvasTextures to add realistic 3D depth under PointLights/Flashlight
    proceduralTextures.concreteNormal = new THREE.CanvasTexture(createNormalMap(proceduralTextures.concrete.image, 3.5));
    proceduralTextures.concreteNormal.wrapS = THREE.RepeatWrapping;
    proceduralTextures.concreteNormal.wrapT = THREE.RepeatWrapping;
    proceduralTextures.concreteNormal.repeat.copy(proceduralTextures.concrete.repeat);

    proceduralTextures.ceilingNormal = new THREE.CanvasTexture(createNormalMap(proceduralTextures.ceiling.image, 2.5));
    proceduralTextures.ceilingNormal.wrapS = THREE.RepeatWrapping;
    proceduralTextures.ceilingNormal.wrapT = THREE.RepeatWrapping;
    proceduralTextures.ceilingNormal.repeat.copy(proceduralTextures.ceiling.repeat);

    proceduralTextures.rustNormal = new THREE.CanvasTexture(createNormalMap(proceduralTextures.rust.image, 2.5));
    proceduralTextures.rustNormal.wrapS = THREE.RepeatWrapping;
    proceduralTextures.rustNormal.wrapT = THREE.RepeatWrapping;
    proceduralTextures.rustNormal.repeat.copy(proceduralTextures.rust.repeat);

    proceduralTextures.doorNormal = new THREE.CanvasTexture(createNormalMap(proceduralTextures.door.image, 4.0));

    proceduralTextures.wallpaperNormal = new THREE.CanvasTexture(createNormalMap(proceduralTextures.wallpaper.image, 2.5));
    proceduralTextures.wallpaperNormal.wrapS = THREE.RepeatWrapping;
    proceduralTextures.wallpaperNormal.wrapT = THREE.RepeatWrapping;
    proceduralTextures.wallpaperNormal.repeat.copy(proceduralTextures.wallpaper.repeat);
    
    proceduralTextures.stairsDoorNormal = new THREE.CanvasTexture(createNormalMap(proceduralTextures.stairsDoor.image, 4.0));
}

function build3DScene() {
    // Удаление старых объектов
    if (hallwayCrawlerMesh) { scene.remove(hallwayCrawlerMesh); }
    if (deadLiquidatorMesh) { scene.remove(deadLiquidatorMesh); }
    if (ghostMesh) { scene.remove(ghostMesh); }
    
    doorPivots.forEach(m => scene.remove(m));
    doorPivots = [];
    ceilingPipes.forEach(m => scene.remove(m));
    ceilingPipes = [];
    ceilingLights.forEach(m => scene.remove(m));
    ceilingLights = [];
    roomMeshes.forEach(m => scene.remove(m));
    roomMeshes = [];
    transitionMeshes.forEach(m => scene.remove(m));
    transitionMeshes = [];
    staircaseMeshes.forEach(m => scene.remove(m));
    staircaseMeshes = [];
    if (stairsMonsterMesh) scene.remove(stairsMonsterMesh);
    stairsMonsterMesh = null;
    
    warningBeacons = [];
    warningLights = [];
    doorLights = {};
    
    if (floorMesh) { scene.remove(floorMesh); floorMesh = null; }
    if (ceilingMesh) { scene.remove(ceilingMesh); ceilingMesh = null; }
    if (leftWallMesh) { scene.remove(leftWallMesh); leftWallMesh = null; }
    if (rightWallMesh) { scene.remove(rightWallMesh); rightWallMesh = null; }
    if (backWallMesh) { scene.remove(backWallMesh); backWallMesh = null; }
    if (warningBeacon) { scene.remove(warningBeacon); warningBeacon = null; }
    
    // Мы всегда рендерим вертикальный мир (коридоры и комнаты), так как он бесшовный
    scene.fog.color.setHex(0x060709);
    scene.fog.density = 0.06;
    
    // Генерируем текущий этаж, 2 выше и 2 ниже
    for (let i = 2; i >= -2; i--) {
        const floorNum = state.floor + i;
        const baseY = i * 5.0;
        buildFloor(floorNum, baseY);
    }
    
    // Выбор события этажа при переходе
    const isNewFloor = (state.floor !== lastBuiltFloor);
    if (isNewFloor) {
        lastBuiltFloor = state.floor;
        state.floorEvent = null;
        deadLiquidatorSearched = false;
        
        // Удаляем тварь при смене этажа
        if (hallwayCrawlerMesh) {
            scene.remove(hallwayCrawlerMesh);
            hallwayCrawlerMesh = null;
        }
        
        // Спавн ползающей твари с шансом 22% (если не спавн и не 1-й этаж)
        if (Math.random() < 0.22 && state.floor < START_FLOOR && state.floor > 1) {
            spawnHallwayCrawler(-38.0, 0.0);
        }
        
        // Случайные события с шансом 45%
        if (state.floor < START_FLOOR && state.floor > 1 && Math.random() < 0.45) {
            const evRand = Math.random();
            if (evRand < 0.25) {
                state.floorEvent = 'flicker';
                logToConsole("Свет на этом этаже нестабилен. Энергосеть перегружена.", "warn");
            } else if (evRand < 0.50) {
                state.floorEvent = 'gas_leak';
                logToConsole("ВНИМАНИЕ: Слышно шипение труб. В коридоре утечка газа Самосбора!", "danger");
            } else if (evRand < 0.75) {
                state.floorEvent = 'corpse';
                logToConsole("На полу впереди лежит неподвижное тело ликвидатора...", "sys");
            } else {
                state.floorEvent = 'ghost';
                logToConsole("Леденящий сквозняк... В глубине коридора промелькнул силуэт.", "sys");
            }
        }
    }
    
    // Единый фоновый свет
    const ambLight = new THREE.AmbientLight(0xffffff, 0.12);
    scene.add(ambLight);
    roomMeshes.push(ambLight);
    
    // Отрисовка объектов событий текущего этажа
    if (state.floorEvent === 'corpse') {
        spawnDeadLiquidatorMesh();
    } else if (state.floorEvent === 'ghost') {
        spawnGhostMesh();
    }
    
    // Если тварь активна, добавляем её обратно на сцену
    if (hallwayCrawlerMesh) {
        scene.add(hallwayCrawlerMesh);
    }
    
    // Спавн 3D Лестничного монстра (если активен)
    if (state.stairsMonsterActive) {
        spawn3DMonster();
    }
}


function createDetailedCabinet(dirX) {
    const group = new THREE.Group();
    const woodMat = new THREE.MeshStandardMaterial({ color: 0x3d2314, roughness: 0.9 });
    const glassMat = new THREE.MeshStandardMaterial({ color: 0x88ccff, transparent: true, opacity: 0.5, roughness: 0.1 });
    const handleMat = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, roughness: 0.4, metalness: 0.8 });
    
    const base = new THREE.Mesh(new THREE.BoxGeometry(1.8, 1.5, 0.8), woodMat);
    base.position.y = 0.75;
    base.receiveShadow = true; // Optimized shadows
    group.add(base);
    
    const top = new THREE.Mesh(new THREE.BoxGeometry(1.7, 2.0, 0.7), woodMat);
    top.position.y = 2.5;
    top.receiveShadow = true; // Optimized shadows
    group.add(top);
    
    const glass = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1.8, 0.05), glassMat);
    glass.position.set(-0.36 * dirX, 2.5, 0); 
    group.add(glass);
    
    return group;
}

function createDetailedTable() {
    const group = new THREE.Group();
    const woodMat = new THREE.MeshStandardMaterial({ color: 0x5e3a21, roughness: 0.8 });
    
    const top = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.1, 1.0), woodMat);
    top.position.y = 0.95;
    top.receiveShadow = true; // Optimized shadows
    group.add(top);
    
    const legGeo = new THREE.BoxGeometry(0.1, 0.9, 0.1);
    const positions = [
        [-0.7, -0.4], [0.7, -0.4], [-0.7, 0.4], [0.7, 0.4]
    ];
    positions.forEach(pos => {
        const leg = new THREE.Mesh(legGeo, woodMat);
        leg.position.set(pos[0], 0.45, pos[1]);
        leg.receiveShadow = true; // Optimized shadows
        group.add(leg);
    });
    
    return group;
}

function createDetailedPanel(dirX) {
    const group = new THREE.Group();
    const metalMat = new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.7 });
    const screenMat = new THREE.MeshBasicMaterial({ color: 0x0044aa });
    const buttonRed = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const buttonGreen = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    
    const base = new THREE.Mesh(new THREE.BoxGeometry(0.6, 1.0, 1.5), metalMat);
    base.position.y = 0.5;
    base.receiveShadow = true; // Optimized shadows
    group.add(base);
    
    const deck = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.8, 1.5), metalMat);
    deck.position.set(-0.15 * dirX, 1.2, 0);
    deck.rotation.z = (Math.PI / 6) * dirX;
    deck.receiveShadow = true; // Optimized shadows
    group.add(deck);
    
    const screen = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.5, 0.8), screenMat);
    screen.position.set(-0.46 * dirX, 1.35, 0);
    screen.rotation.z = (Math.PI / 6) * dirX;
    group.add(screen);
    
    return group;
}

function buildFloor(floorNum, baseY) {

    const wallMat = new THREE.MeshStandardMaterial({ 
        map: proceduralTextures.concrete, 
        normalMap: proceduralTextures.concreteNormal, 
        roughness: 0.8,
        metalness: 0.05
    });
    const floorMat = new THREE.MeshStandardMaterial({ 
        map: proceduralTextures.concrete, 
        normalMap: proceduralTextures.concreteNormal, 
        roughness: 0.9
    });
    const ceilingMat = new THREE.MeshStandardMaterial({ 
        map: proceduralTextures.ceiling, 
        normalMap: proceduralTextures.ceilingNormal, 
        roughness: 0.95
    });
    
    // 1. Пол и потолок коридора (BoxGeometry для устранения засветов)
    const floorGeo = new THREE.BoxGeometry(6, 0.2, 42);
    const fMesh = new THREE.Mesh(floorGeo, floorMat);
    fMesh.position.set(0, baseY - 0.1, -21);
    fMesh.receiveShadow = true;
    scene.add(fMesh);
    roomMeshes.push(fMesh);
    
    const ceilingGeo = new THREE.BoxGeometry(6, 0.2, 42);
    const cMesh = new THREE.Mesh(ceilingGeo, ceilingMat);
    cMesh.position.set(0, baseY + 5.0 + 0.1, -21);
    cMesh.receiveShadow = true;
    scene.add(cMesh);
    roomMeshes.push(cMesh);
    
    // 2. Сегментированные толстые стены коридора
    const segments = [
        { zStart: 0, zEnd: -9.4 },
        { zStart: -10.6, zEnd: -21.4 },
        { zStart: -22.6, zEnd: -33.4 },
        { zStart: -34.6, zEnd: -42.0 }
    ];
    
    const buildWallSide = (xPos) => {
        const wallGroup = new THREE.Group();
        segments.forEach(seg => {
            const len = Math.abs(seg.zStart - seg.zEnd);
            const zCenter = (seg.zStart + seg.zEnd) / 2;
            const mesh = new THREE.Mesh(new THREE.BoxGeometry(0.2, 5.0, len), wallMat);
            mesh.position.set(0, 2.5, zCenter);
            mesh.receiveShadow = true;
            mesh.castShadow = true;
            wallGroup.add(mesh);
        });
        [-10, -22, -34].forEach(zDoor => {
            const meshTop = new THREE.Mesh(new THREE.BoxGeometry(0.2, 2.4, 1.2), wallMat);
            meshTop.position.set(0, 3.8, zDoor);
            meshTop.receiveShadow = true;
            meshTop.castShadow = true;
            wallGroup.add(meshTop);
        });
        wallGroup.position.set(xPos, baseY, 0);
        wallGroup.rotation.y = 0;
        scene.add(wallGroup);
        roomMeshes.push(wallGroup);
        return wallGroup;
    };
    
    leftWallMesh = buildWallSide(-3.1);
    rightWallMesh = buildWallSide(3.1);
    
    // Задняя стена коридора
    const backWall = new THREE.Mesh(new THREE.BoxGeometry(6, 5, 0.2), wallMat);
    backWall.position.set(0, baseY + 2.5, 0.1);
    backWall.receiveShadow = true;
    backWall.castShadow = true;
    scene.add(backWall);
    roomMeshes.push(backWall);
    
    // Перегородка с лестничным проемом на Z = -42
    const stairsHoleWallL = new THREE.Mesh(new THREE.BoxGeometry(1.5, 5, 0.2), wallMat);
    stairsHoleWallL.position.set(-2.25, baseY + 2.5, -42);
    stairsHoleWallL.receiveShadow = true;
    stairsHoleWallL.castShadow = true;
    scene.add(stairsHoleWallL);
    staircaseMeshes.push(stairsHoleWallL);
    
    const stairsHoleWallR = new THREE.Mesh(new THREE.BoxGeometry(1.5, 5, 0.2), wallMat);
    stairsHoleWallR.position.set(2.25, baseY + 2.5, -42);
    stairsHoleWallR.receiveShadow = true;
    stairsHoleWallR.castShadow = true;
    scene.add(stairsHoleWallR);
    staircaseMeshes.push(stairsHoleWallR);
    
    // 3. Физическая П-образная лестница вниз (к baseY - 5.0)
    const stepWidth = 1.5;
    const stepHeight = 0.3125;
    const stepDepth = 0.625;
    const stepsCount = 8;
    
    // Левый пролет (вниз от baseY до Y = baseY - 2.5)
    for (let i = 0; i < stepsCount; i++) {
        const stepGeo = new THREE.BoxGeometry(stepWidth, stepHeight, stepDepth);
        const step = new THREE.Mesh(stepGeo, wallMat);
        step.position.set(-0.75, baseY - stepHeight * i - stepHeight / 2, -42.0 - stepDepth * i - stepDepth / 2);
        step.receiveShadow = true;
        scene.add(step);
        staircaseMeshes.push(step);
    }
    
    // Разворотная площадка на Y = baseY - 2.5
    const landing = new THREE.Mesh(new THREE.BoxGeometry(3.0, 0.2, 2.5), wallMat);
    landing.position.set(0, baseY - 2.5 - 0.1, -48.25);
    landing.receiveShadow = true;
    landing.castShadow = true;
    scene.add(landing);
    staircaseMeshes.push(landing);
    
    // Правый пролет (вниз от Y = baseY - 2.5 до Y = baseY - 5.0)
    for (let i = 0; i < stepsCount; i++) {
        const stepGeo = new THREE.BoxGeometry(stepWidth, stepHeight, stepDepth);
        const step = new THREE.Mesh(stepGeo, wallMat);
        step.position.set(0.75, baseY - 2.5 - stepHeight * i - stepHeight / 2, -47.0 + stepDepth * i + stepDepth / 2);
        step.receiveShadow = true;
        scene.add(step);
        staircaseMeshes.push(step);
    }
    
    // Разделитель между пролетами
    const partition = new THREE.Mesh(new THREE.BoxGeometry(0.1, 3.5, 5.0), wallMat);
    partition.position.set(0, baseY - 1.25, -44.5);
    partition.receiveShadow = true;
    partition.castShadow = true;
    scene.add(partition);
    staircaseMeshes.push(partition);
    
    // Стены лестничного колодца
    const shaftL = new THREE.Mesh(new THREE.BoxGeometry(0.2, 5.0, 7.5), wallMat);
    shaftL.position.set(-1.6, baseY - 2.5, -45.75);
    shaftL.receiveShadow = true;
    shaftL.castShadow = true;
    scene.add(shaftL);
    staircaseMeshes.push(shaftL);
    
    const shaftR = new THREE.Mesh(new THREE.BoxGeometry(0.2, 5.0, 7.5), wallMat);
    shaftR.position.set(1.6, baseY - 2.5, -45.75);
    shaftR.receiveShadow = true;
    shaftR.castShadow = true;
    scene.add(shaftR);
    staircaseMeshes.push(shaftR);
    
    const shaftB = new THREE.Mesh(new THREE.BoxGeometry(3.2, 5.0, 0.2), wallMat);
    shaftB.position.set(0, baseY - 2.5, -49.6);
    shaftB.receiveShadow = true;
    shaftB.castShadow = true;
    scene.add(shaftB);
    staircaseMeshes.push(shaftB);
    
    // Stairs blast doors at Z = -47.0
    const sdState = getOrGenerateStairsDoor(floorNum);
    const sdGroup = new THREE.Group();
    sdGroup.name = `stairsDoor_${floorNum}`;
    sdGroup.position.set(0, baseY - 2.5, -47.0);
    
    const sdPanelMat = new THREE.MeshStandardMaterial({
        map: proceduralTextures.stairsDoor,
        normalMap: proceduralTextures.stairsDoorNormal,
        roughness: 0.6,
        metalness: 0.8
    });
    
    const sdLeftMesh = new THREE.Mesh(new THREE.BoxGeometry(1.5, 5.0, 0.15), sdPanelMat);
    sdLeftMesh.name = "left_panel";
    sdLeftMesh.receiveShadow = true;
    sdLeftMesh.castShadow = true;
    sdGroup.add(sdLeftMesh);
    
    const sdRightMesh = new THREE.Mesh(new THREE.BoxGeometry(1.5, 5.0, 0.15), sdPanelMat);
    sdRightMesh.name = "right_panel";
    sdRightMesh.receiveShadow = true;
    sdRightMesh.castShadow = true;
    sdGroup.add(sdRightMesh);
    
    if (sdState.opened) {
        sdLeftMesh.position.set(-2.25, 2.5, 0); // slid open
        sdRightMesh.position.set(2.25, 2.5, 0);
    } else {
        sdLeftMesh.position.set(-0.75, 2.5, 0); // closed
        sdRightMesh.position.set(0.75, 2.5, 0);
    }
    
    // Door Frame details (outlines)
    const frameMat = new THREE.MeshStandardMaterial({
        map: proceduralTextures.rust,
        normalMap: proceduralTextures.rustNormal,
        roughness: 0.5,
        metalness: 0.8
    });
    const sdFrameTop = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.3, 0.3), frameMat);
    sdFrameTop.position.set(0, 4.85, 0);
    sdGroup.add(sdFrameTop);
    
    const sdFrameL = new THREE.Mesh(new THREE.BoxGeometry(0.3, 5.0, 0.3), frameMat);
    sdFrameL.position.set(-1.65, 2.5, 0);
    sdGroup.add(sdFrameL);
    
    const sdFrameR = new THREE.Mesh(new THREE.BoxGeometry(0.3, 5.0, 0.3), frameMat);
    sdFrameR.position.set(1.65, 2.5, 0);
    sdGroup.add(sdFrameR);
    
    scene.add(sdGroup);
    staircaseMeshes.push(sdGroup);
    
    // 4. Потолочные трубы
    const pipeMat = new THREE.MeshStandardMaterial({ 
        map: proceduralTextures.rust, 
        normalMap: proceduralTextures.rustNormal, 
        metalness: 0.8, 
        roughness: 0.3 
    });
    const pipeGeo = new THREE.CylinderGeometry(0.12, 0.12, 42, 8);
    
    const pipeL = new THREE.Mesh(pipeGeo, pipeMat);
    pipeL.rotation.x = Math.PI / 2;
    pipeL.position.set(-2.2, baseY + 4.4, -21);
    scene.add(pipeL);
    ceilingPipes.push(pipeL);
    
    const pipeR = new THREE.Mesh(pipeGeo, pipeMat);
    pipeR.rotation.x = Math.PI / 2;
    pipeR.position.set(2.2, baseY + 4.4, -21);
    scene.add(pipeR);
    ceilingPipes.push(pipeR);
    
    // 5. Освещение (PointLight тени ОТКЛЮЧЕНЫ во избежание лагов)
    const lightGeo = new THREE.BoxGeometry(0.8, 0.1, 1.4);
    const lightEmissiveMat = new THREE.MeshBasicMaterial({ color: 0xccffcc });
    const zLights = [-2, -10, -22, -34, -44];
    zLights.forEach(z => {
        const lamp = new THREE.Mesh(lightGeo, lightEmissiveMat);
        lamp.position.set(0, baseY + 4.95, z);
        scene.add(lamp);
        ceilingLights.push(lamp);
        
        if (Math.abs(floorNum - state.floor) <= 1) {
            const pl = new THREE.PointLight(0xd5ffd0, 0.65, 16);
            pl.position.set(0, baseY + 4.5, z);
            pl.castShadow = false;
            scene.add(pl);
            ceilingLights.push(pl);
        }
    });
    
    // Сигнальный маяк Самосбора на Z = -38
    const beacon = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.3, 8), new THREE.MeshBasicMaterial({ color: 0x440000 }));
    beacon.position.set(0, baseY + 4.8, -38);
    scene.add(beacon);
    warningBeacons.push(beacon);
    
    if (Math.abs(floorNum - state.floor) <= 1) {
        const wl = new THREE.PointLight(0xff0000, 0, 15);
        wl.position.set(0, baseY + 4.4, -38);
        wl.castShadow = false;
        scene.add(wl);
        warningLights.push(wl);
    }
    
    // 6. Двери и интерьеры комнат
    const doorGeo = new THREE.BoxGeometry(1.2, 2.6, 0.1);
    const doorMat = new THREE.MeshStandardMaterial({ 
        map: proceduralTextures.door, 
        normalMap: proceduralTextures.doorNormal, 
        roughness: 0.5 
    });
    const roomWallMat = new THREE.MeshStandardMaterial({ 
        map: proceduralTextures.wallpaper, 
        normalMap: proceduralTextures.wallpaperNormal, 
        roughness: 0.8, 
        side: THREE.DoubleSide 
    });
    const roomFloorMat = new THREE.MeshStandardMaterial({ 
        map: proceduralTextures.concrete, 
        normalMap: proceduralTextures.concreteNormal, 
        roughness: 0.9, 
        side: THREE.DoubleSide 
    });
    const transWallMat = new THREE.MeshStandardMaterial({ 
        map: proceduralTextures.rust, 
        normalMap: proceduralTextures.rustNormal, 
        roughness: 0.7, 
        side: THREE.DoubleSide 
    });
    const roomCeilMat = new THREE.MeshStandardMaterial({ 
        map: proceduralTextures.ceiling, 
        normalMap: proceduralTextures.ceilingNormal, 
        roughness: 0.95, 
        side: THREE.DoubleSide 
    });
    
    const floorDoors = getOrGenerateFloorDoors(floorNum);
    
    DOOR_LAYOUT.forEach((layout, idx) => {
        const doorObj = floorDoors[idx];
        
        const doorPivot = new THREE.Group();
        // Размещаем петлю двери сбоку проема для правильной стыковки и анимации
        const zPivot = layout.x < 0 ? layout.z + 0.6 : layout.z - 0.6;
        doorPivot.position.set(layout.x, baseY + 1.3, zPivot);
        doorPivot.rotation.y = layout.rot;
        doorPivot.userData = { floor: floorNum, doorIndex: idx };
        
        const doorMesh = new THREE.Mesh(doorGeo, doorMat);
        doorMesh.name = `door_${idx}`;
        doorMesh.position.set(0.6, 0, 0); // Смещение от петли
        doorMesh.userData = { doorIndex: idx };
        doorMesh.castShadow = true;
        doorMesh.receiveShadow = true;
        doorPivot.add(doorMesh);
        
        if (doorObj && doorObj.opened) {
            doorPivot.rotation.y = layout.rot + Math.PI / 2;
        }
        
        scene.add(doorPivot);
        doorPivots.push(doorPivot);
        
        if (doorObj) {
            const roomGroup = new THREE.Group();
            const isLeft = layout.x < 0;
            const dirX = isLeft ? -1 : 1;
            
            if (doorObj.type === 'apartment') {
                // Сдвиг комнат глубже наружу, чтобы предотвратить пересечения со стенами коридора
                const roomCenterX = layout.x + (3.7 * dirX);
                const roomCenterZ = layout.z;
                const wallOffsetX = layout.x + (0.3 * dirX);
                const backWallX = layout.x + (7.1 * dirX);
                
                const rFloor = new THREE.Mesh(new THREE.BoxGeometry(7.0, 0.1, 7.0), roomFloorMat);
                rFloor.position.set(roomCenterX, baseY - 0.05, roomCenterZ);
                rFloor.receiveShadow = true;
                roomGroup.add(rFloor);
                
                const rCeil = new THREE.Mesh(new THREE.BoxGeometry(7.0, 0.1, 7.0), roomCeilMat);
                rCeil.position.set(roomCenterX, baseY + 5.0 + 0.05, roomCenterZ);
                rCeil.receiveShadow = true;
                roomGroup.add(rCeil);
                
                const rBackWall = new THREE.Mesh(new THREE.BoxGeometry(0.2, 5.0, 7.0), roomWallMat);
                rBackWall.position.set(backWallX, baseY + 2.5, roomCenterZ);
                rBackWall.castShadow = true;
                rBackWall.receiveShadow = true;
                roomGroup.add(rBackWall);
                
                const rSideWall1 = new THREE.Mesh(new THREE.BoxGeometry(7.0, 5.0, 0.2), roomWallMat);
                rSideWall1.position.set(roomCenterX, baseY + 2.5, roomCenterZ - 3.5 - 0.1);
                rSideWall1.castShadow = true;
                rSideWall1.receiveShadow = true;
                roomGroup.add(rSideWall1);
                
                const rSideWall2 = new THREE.Mesh(new THREE.BoxGeometry(7.0, 5.0, 0.2), roomWallMat);
                rSideWall2.position.set(roomCenterX, baseY + 2.5, roomCenterZ + 3.5 + 0.1);
                rSideWall2.castShadow = true;
                rSideWall2.receiveShadow = true;
                roomGroup.add(rSideWall2);
                
                const rFrontWall1 = new THREE.Mesh(new THREE.BoxGeometry(0.2, 5.0, 2.9), roomWallMat);
                rFrontWall1.position.set(wallOffsetX, baseY + 2.5, roomCenterZ - 2.05);
                rFrontWall1.castShadow = true;
                rFrontWall1.receiveShadow = true;
                roomGroup.add(rFrontWall1);
                
                const rFrontWall2 = new THREE.Mesh(new THREE.BoxGeometry(0.2, 5.0, 2.9), roomWallMat);
                rFrontWall2.position.set(wallOffsetX, baseY + 2.5, roomCenterZ + 2.05);
                rFrontWall2.castShadow = true;
                rFrontWall2.receiveShadow = true;
                roomGroup.add(rFrontWall2);
                
                const rFrontWallTop = new THREE.Mesh(new THREE.BoxGeometry(0.2, 2.4, 1.2), roomWallMat);
                rFrontWallTop.position.set(wallOffsetX, baseY + 3.8, roomCenterZ);
                rFrontWallTop.castShadow = true;
                rFrontWallTop.receiveShadow = true;
                roomGroup.add(rFrontWallTop);
                
                const cab = createDetailedCabinet(dirX);
                cab.position.set(layout.x + (5.5 * dirX), baseY, roomCenterZ - 2.0);
                roomGroup.add(cab);
                
                const table = createDetailedTable();
                table.position.set(roomCenterX, baseY, roomCenterZ);
                roomGroup.add(table);
                
                if (Math.abs(floorNum - state.floor) <= 1) {
                    const roomLight = new THREE.PointLight(0xffeedd, doorObj.opened ? 0.3 : 0, 8);
                    roomLight.position.set(roomCenterX, baseY + 4, roomCenterZ);
                    roomLight.castShadow = false;
                    roomGroup.add(roomLight);
                    doorLights[floorNum + '_' + idx] = roomLight;
                }
                
            } else if (doorObj.type === 'transition') {
                const roomCenterX = layout.x + (2.7 * dirX);
                const roomCenterZ = layout.z;
                const wallOffsetX = layout.x + (0.3 * dirX);
                const backWallX = layout.x + (5.1 * dirX);
                
                const rFloor = new THREE.Mesh(new THREE.BoxGeometry(5.0, 0.1, 5.0), transWallMat);
                rFloor.position.set(roomCenterX, baseY - 0.05, roomCenterZ);
                rFloor.receiveShadow = true;
                roomGroup.add(rFloor);
                
                const rCeil = new THREE.Mesh(new THREE.BoxGeometry(5.0, 0.1, 5.0), transWallMat);
                rCeil.position.set(roomCenterX, baseY + 5.0 + 0.05, roomCenterZ);
                rCeil.receiveShadow = true;
                roomGroup.add(rCeil);
                
                const rBackWall = new THREE.Mesh(new THREE.BoxGeometry(0.2, 5.0, 5.0), transWallMat);
                rBackWall.position.set(layout.x + (5.0 * dirX) + (0.1 * dirX), baseY + 2.5, roomCenterZ);
                rBackWall.castShadow = true;
                rBackWall.receiveShadow = true;
                roomGroup.add(rBackWall);
                
                const rSideWall1 = new THREE.Mesh(new THREE.BoxGeometry(5.0, 5.0, 0.2), transWallMat);
                rSideWall1.position.set(roomCenterX, baseY + 2.5, roomCenterZ - 2.5 - 0.1);
                rSideWall1.castShadow = true;
                rSideWall1.receiveShadow = true;
                roomGroup.add(rSideWall1);
                
                const rSideWall2 = new THREE.Mesh(new THREE.BoxGeometry(5.0, 5.0, 0.2), transWallMat);
                rSideWall2.position.set(roomCenterX, baseY + 2.5, roomCenterZ + 2.5 + 0.1);
                rSideWall2.castShadow = true;
                rSideWall2.receiveShadow = true;
                roomGroup.add(rSideWall2);
                
                const rFrontWall1 = new THREE.Mesh(new THREE.BoxGeometry(0.2, 5.0, 1.9), transWallMat);
                rFrontWall1.position.set(wallOffsetX, baseY + 2.5, roomCenterZ - 1.55);
                rFrontWall1.castShadow = true;
                rFrontWall1.receiveShadow = true;
                roomGroup.add(rFrontWall1);
                
                const rFrontWall2 = new THREE.Mesh(new THREE.BoxGeometry(0.2, 5.0, 1.9), transWallMat);
                rFrontWall2.position.set(wallOffsetX, baseY + 2.5, roomCenterZ + 1.55);
                rFrontWall2.castShadow = true;
                rFrontWall2.receiveShadow = true;
                roomGroup.add(rFrontWall2);
                
                const rFrontWallTop = new THREE.Mesh(new THREE.BoxGeometry(0.2, 2.4, 1.2), transWallMat);
                rFrontWallTop.position.set(wallOffsetX, baseY + 3.8, roomCenterZ);
                rFrontWallTop.castShadow = true;
                rFrontWallTop.receiveShadow = true;
                roomGroup.add(rFrontWallTop);
                
                const panel = createDetailedPanel(dirX);
                panel.position.set(layout.x + (4.5 * dirX), baseY, roomCenterZ);
                roomGroup.add(panel);
                
                if (Math.abs(floorNum - state.floor) <= 1) {
                    const transLight = new THREE.PointLight(0x00aaff, doorObj.opened ? 0.5 : 0, 6);
                    transLight.position.set(roomCenterX, baseY + 4, roomCenterZ);
                    transLight.castShadow = (floorNum === state.floor);
                    roomGroup.add(transLight);
                    doorLights[floorNum + '_' + idx] = transLight;
                }
                
            } else {
                const blankWall = new THREE.Mesh(new THREE.BoxGeometry(0.2, 5.0, 1.2), wallMat);
                blankWall.position.set(layout.x + (0.5 * dirX), baseY + 2.5, layout.z);
                blankWall.castShadow = true;
                blankWall.receiveShadow = true;
                roomGroup.add(blankWall);
            }
            
            scene.add(roomGroup);
            roomMeshes.push(roomGroup);
        }
    });
}

function spawn3DMonster() {
    if (stairsMonsterMesh) scene.remove(stairsMonsterMesh);
    
    stairsMonsterMesh = new THREE.Group();
    // Ставим монстра на верхнюю часть лестницы
    stairsMonsterMesh.position.set(-0.75, 0, -42.0);
    
    const bodyMat = new THREE.MeshBasicMaterial({ color: 0x050505 });
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0xff0033 });
    
    const bodyGeo = new THREE.SphereGeometry(1.1, 16, 16);
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    stairsMonsterMesh.add(body);
    
    const limbGeo = new THREE.CylinderGeometry(0.1, 0.03, 3.0, 6);
    for (let i = 0; i < 8; i++) {
        const limb = new THREE.Mesh(limbGeo, bodyMat);
        limb.rotation.x = Math.random() * Math.PI * 2;
        limb.rotation.y = Math.random() * Math.PI * 2;
        limb.rotation.z = Math.random() * Math.PI * 2;
        limb.translateY(1.5);
        stairsMonsterMesh.add(limb);
    }
    
    const eyeGeo = new THREE.SphereGeometry(0.08, 8, 8);
    const eyePositions = [
        [0.4, 0.5, 1.0], [-0.5, 0.3, 1.0], [0.1, 0.7, 0.9],
        [-0.2, 0.6, 1.1], [0.3, 0.2, 1.1]
    ];
    
    eyePositions.forEach(pos => {
        const eye = new THREE.Mesh(eyeGeo, eyeMat);
        eye.position.set(pos[0], pos[1], pos[2]);
        stairsMonsterMesh.add(eye);
    });
    
    scene.add(stairsMonsterMesh);
}

// --- СОЗДАНИЕ И СПАВН ТВАРЕЙ И АНОМАЛИЙ ---
function createCrawlerMesh() {
    const group = new THREE.Group();
    group.name = "crawler";
    
    // Тело: темная слизистая биомасса
    const bodyMat = new THREE.MeshStandardMaterial({
        color: 0x181216,
        roughness: 0.9,
        metalness: 0.1
    });
    
    const body = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.22, 0.7), bodyMat);
    body.position.y = 0.11;
    body.receiveShadow = true;
    body.castShadow = true;
    group.add(body);
    
    // Голова
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.18, 8, 8), bodyMat);
    head.position.set(0, 0.16, -0.35);
    group.add(head);
    
    // Красные светящиеся глаза
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const leftEye = new THREE.Mesh(new THREE.SphereGeometry(0.04, 4, 4), eyeMat);
    leftEye.position.set(-0.07, 0.20, -0.5);
    group.add(leftEye);
    
    const rightEye = new THREE.Mesh(new THREE.SphereGeometry(0.04, 4, 4), eyeMat);
    rightEye.position.set(0.07, 0.20, -0.5);
    group.add(rightEye);
    
    // 6 шевелящихся ножек
    for (let i = 0; i < 6; i++) {
        const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.35), bodyMat);
        const side = (i % 2 === 0) ? -1 : 1;
        const zOffset = -0.2 + Math.floor(i / 2) * 0.2;
        leg.rotation.z = side * Math.PI / 4;
        leg.rotation.y = -side * Math.PI / 8;
        leg.position.set(side * 0.3, 0.08, zOffset);
        group.add(leg);
    }
    
    return group;
}

function spawnHallwayCrawler(zPos, xPos = 0) {
    if (hallwayCrawlerMesh) {
        scene.remove(hallwayCrawlerMesh);
        hallwayCrawlerMesh = null;
    }
    
    crawlerHealth = 2;
    hallwayCrawlerMesh = createCrawlerMesh();
    hallwayCrawlerMesh.position.set(xPos, 0, zPos);
    scene.add(hallwayCrawlerMesh);
    
    logToConsole("Вы слышите жуткий, шуршащий звук когтей по бетону откуда-то впереди...", "warn");
    playScaryScreechSound();
}

function playScaryScreechSound() {
    initAudio();
    if (!audioCtx) return;
    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.linearRampToValueAtTime(750, now + 0.15);
    osc.frequency.exponentialRampToValueAtTime(110, now + 0.4);
    
    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(now);
    osc.stop(now + 0.5);
}

function playSoundDamage() {
    initAudio();
    if (!audioCtx) return;
    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(160, now);
    osc.frequency.linearRampToValueAtTime(70, now + 0.25);
    
    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(now);
    osc.stop(now + 0.35);
}

function playSoundSwitch() {
    initAudio();
    if (!audioCtx) return;
    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.setValueAtTime(300, now + 0.05);
    
    gain.gain.setValueAtTime(0.015, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(now);
    osc.stop(now + 0.15);
}

function spawnDeadLiquidatorMesh() {
    if (deadLiquidatorMesh) {
        scene.remove(deadLiquidatorMesh);
        deadLiquidatorMesh = null;
    }
    
    deadLiquidatorMesh = new THREE.Group();
    deadLiquidatorMesh.name = "dead_liquidator";
    deadLiquidatorMesh.position.set(0, 0.08, -18.0);
    
    // Оранжевый защитный костюм
    const suitMat = new THREE.MeshStandardMaterial({ color: 0xd35400, roughness: 0.9 });
    const bootMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.8 });
    const metalMat = new THREE.MeshStandardMaterial({ color: 0x7f8c8d, metalness: 0.8, roughness: 0.3 });
    
    const body = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.15, 1.2), suitMat);
    body.receiveShadow = true;
    body.castShadow = true;
    deadLiquidatorMesh.add(body);
    
    // Шлем
    const helmet = new THREE.Mesh(new THREE.SphereGeometry(0.16, 8, 8), metalMat);
    helmet.position.set(0, 0.08, -0.75);
    deadLiquidatorMesh.add(helmet);
    
    // Сапоги
    const leftBoot = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.15, 0.22), bootMat);
    leftBoot.position.set(-0.16, 0, 0.7);
    deadLiquidatorMesh.add(leftBoot);
    
    const rightBoot = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.15, 0.22), bootMat);
    rightBoot.position.set(0.16, 0, 0.7);
    deadLiquidatorMesh.add(rightBoot);
    
    scene.add(deadLiquidatorMesh);
}

function spawnGhostMesh() {
    if (ghostMesh) {
        scene.remove(ghostMesh);
        ghostMesh = null;
    }
    
    ghostMesh = new THREE.Group();
    ghostMesh.name = "ghost";
    ghostMesh.position.set(0, 1.2, -28.0);
    
    const ghostMat = new THREE.MeshBasicMaterial({ 
        color: 0x88d8ff, 
        transparent: true, 
        opacity: 0.25,
        wireframe: true 
    });
    
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.32, 12, 12), ghostMat);
    ghostMesh.add(head);
    
    const body = new THREE.Mesh(new THREE.ConeGeometry(0.35, 1.4, 12, 1, true), ghostMat);
    body.position.y = -0.7;
    body.rotation.x = Math.PI;
    ghostMesh.add(body);
    
    scene.add(ghostMesh);
}

// Цикл рендеринга и управления в 3D (FPS сглаживание)
let animFrameId = null;
let lastTime = performance.now();

function animate3D() {
    animFrameId = requestAnimationFrame(animate3D);
    
    const time = performance.now();
    const deltaTime = Math.min((time - lastTime) * 0.001, 0.1); // Лимит на лаг в 100мс
    lastTime = time;
    
    if (isGamePaused) {
        if (renderer && scene && camera) {
            renderer.render(scene, camera);
        }
        return;
    }
    
    // 1. ОБРАБОТКА ДВИЖЕНИЯ ИГРОКА (WASD)
    if (state.location !== 'room' || !state.isSearching) {
        handleFPSMovement(deltaTime);
    }
    
    // 2. ОБНОВЛЕНИЕ КАМЕРЫ (ПОЛОЖЕНИЕ И РОТАЦИЯ)
    camera.rotation.set(0, 0, 0);
    camera.rotation.y = playerYaw;
    camera.rotation.x = playerPitch;
    
    // Встряска камеры от Самосбора
    let shakeX = 0, shakeY = 0;
    if (state.samosborStatus === 'warning') {
        shakeX = (Math.random() - 0.5) * 0.02;
        shakeY = (Math.random() - 0.5) * 0.02;
    } else if (state.samosborStatus === 'active') {
        shakeX = (Math.random() - 0.5) * 0.06;
        shakeY = (Math.random() - 0.5) * 0.06;
    }
    
    // Камера располагается на высоте глаз (1.8 от уровня ног игрока)
    camera.position.set(playerPos.x + shakeX, playerPos.y + 1.8 + shakeY, playerPos.z);
    
    // 3. РЕЙКАСТИНГ (ПОИСК ДВЕРЕЙ В ЦЕНТРЕ ЭКРАНА)
    if (state.location === 'hallway' && !state.stairsMonsterActive) {
        performInteractionRaycast();
    }
    
    // 4. ДВИЖЕНИЕ МОНСТРА НА ЛЕСТНИЦЕ
    if (state.stairsMonsterActive && stairsMonsterMesh) {
        // Тряска чудовища
        stairsMonsterMesh.position.x += (Math.random() - 0.5) * 0.05;
        // Движение к камере игрока
        stairsMonsterMesh.position.z -= 1.8 * deltaTime;
        stairsMonsterMesh.position.y = getStepsY(stairsMonsterMesh.position.x, stairsMonsterMesh.position.y, stairsMonsterMesh.position.z);
        
        // Если монстр подошел слишком близко (к Z координате игрока) - смерть
        if (stairsMonsterMesh.position.z <= playerPos.z + 2.0) {
            triggerGameOver("stairs_monster");
        }
    }
    
    // 5. АНИМАЦИЯ АВАРИЙНОЙ ЛАМПЫ САМОСБОРА
    if (warningLights.length > 0) {
        const timeSec = time * 0.001;
        if (state.samosborStatus === 'warning') {
            const pulse = (Math.sin(timeSec * 7) + 1) * 0.5;
            warningLights.forEach(wl => {
                wl.intensity = pulse * 1.5;
                wl.color.setHex(0xffaa00);
            });
            warningBeacons.forEach(wb => {
                wb.material.color.setHex(pulse > 0.5 ? 0xffaa00 : 0x442200);
            });
        } else if (state.samosborStatus === 'active') {
            const flash = (Math.floor(timeSec * 8) % 2 === 0) ? 1 : 0;
            warningLights.forEach(wl => {
                wl.intensity = flash * 3.0;
                wl.color.setHex(0xff0000);
            });
            warningBeacons.forEach(wb => {
                wb.material.color.setHex(flash === 1 ? 0xff0000 : 0x550000);
            });
            
            scene.fog.color.setHex(0x180522);
            renderer.setClearColor(0x180522);
        } else {
            warningLights.forEach(wl => {
                wl.intensity = 0;
            });
            warningBeacons.forEach(wb => {
                wb.material.color.setHex(0x330000);
            });
            if (scene.fog.color.getHex() !== 0x060709) {
                scene.fog.color.setHex(0x060709);
                renderer.setClearColor(0x060709);
            }
        }
    }
    
    // Эффект мерцания света при событии flicker
    if (state.floorEvent === 'flicker' && !isGamePaused) {
        const time = Date.now();
        const flicker = Math.sin(time * 0.05) * Math.cos(time * 0.02);
        const lightsOff = flicker > 0.35 || (Math.random() < 0.08 && (time % 500 < 100));
        
        ceilingLights.forEach(light => {
            light.intensity = lightsOff ? 0 : 1.2;
        });
    }
    
    // Плавное парение призрака
    if (ghostMesh && !isGamePaused) {
        ghostMesh.position.y = 1.2 + Math.sin(Date.now() * 0.003) * 0.12;
    }
    
    // Движение и атака ползающей твари в коридоре
    if (hallwayCrawlerMesh && !isGamePaused) {
        const targetZ = state.location === 'hallway' ? playerPos.z : 0.0;
        const targetX = state.location === 'hallway' ? playerPos.x : 0.0;
        
        const dx = targetX - hallwayCrawlerMesh.position.x;
        const dz = targetZ - hallwayCrawlerMesh.position.z;
        const dist = Math.sqrt(dx * dx + dz * dz);
        
        if (dist > 0.5) {
            const speed = 0.04;
            hallwayCrawlerMesh.position.x += (dx / dist) * speed;
            hallwayCrawlerMesh.position.z += (dz / dist) * speed;
            
            // Анимация шевеления лапок
            const t = Date.now() * 0.015;
            hallwayCrawlerMesh.children.forEach(child => {
                if (child.geometry && child.geometry.type === "CylinderGeometry") {
                    child.rotation.x = Math.sin(t) * 0.25;
                }
            });
        }
        
        // Атака при приближении к игроку
        const distToPlayer = playerPos.distanceTo(hallwayCrawlerMesh.position);
        if (distToPlayer < 1.3) {
            logToConsole("ТВАРЬ НАПАЛА НА ВАС! Своими жвалами она прокусила вам скафандр!", "danger");
            state.health = Math.max(0, state.health - 25);
            playSoundDamage();
            scene.remove(hallwayCrawlerMesh);
            hallwayCrawlerMesh = null;
            
            if (state.health <= 0) {
                triggerGameOver("stairs_monster");
            }
            updateHUD();
        }
    }

    // Рендер кадра
    if (renderer && scene && camera) {
        renderer.render(scene, camera);
    }
}

// Управление физическим движением игрока (координатная сетка с коллизиями)
function handleFPSMovement(deltaTime) {
    if (state.stairsMonsterActive || hackActive) return; // Locked when monster attacks or hacking
    
    const prevX = playerPos.x;
    const prevZ = playerPos.z;
    
    const moveVector = new THREE.Vector3();
    
    // Get custom keybindings
    const bindFwd = state.keyBindings['MoveForward'] || 'KeyW';
    const bindBwd = state.keyBindings['MoveBackward'] || 'KeyS';
    const bindLft = state.keyBindings['MoveLeft'] || 'KeyA';
    const bindRgt = state.keyBindings['MoveRight'] || 'KeyD';
    const bindSprint = state.keyBindings['Sprint'] || 'ShiftLeft';
    
    // Считываем WASD / Стрелки клавиатуры или виртуальные кнопки D-pad
    if (keys[bindFwd] || keys['ArrowUp'] || mvUp) moveVector.z -= 1;
    if (keys[bindBwd] || keys['ArrowDown'] || mvDown) moveVector.z += 1;
    if (keys[bindLft] || keys['ArrowLeft'] || mvLeft) moveVector.x -= 1;
    if (keys[bindRgt] || keys['ArrowRight'] || mvRight) moveVector.x += 1;
    
    let currentSpeed = playerSpeed;
    let isSprinting = keys[bindSprint] || keys['ShiftLeft'] || keys['ShiftRight'];
    
    if (isSprinting && moveVector.lengthSq() > 0 && state.stamina > 0) {
        currentSpeed = 6.5;
        state.stamina = Math.max(0, state.stamina - 30 * deltaTime);
    } else {
        if (moveVector.lengthSq() > 0) {
            state.stamina = Math.min(100, state.stamina + 15 * deltaTime);
        } else {
            state.stamina = Math.min(100, state.stamina + 25 * deltaTime);
        }
    }
    
    if (moveVector.lengthSq() > 0) {
        // Переводим вектор движения относительно взгляда игрока (yaw)
        moveVector.normalize();
        moveVector.applyAxisAngle(new THREE.Vector3(0, 1, 0), playerYaw);
        
        // Умножаем на скорость
        const finalSpeed = window._customSpeed || currentSpeed;
        moveVector.multiplyScalar(finalSpeed * deltaTime);
        
        // Новые предлагаемые координаты
        const nextX = playerPos.x + moveVector.x;
        const nextZ = playerPos.z + moveVector.z;
        
        // Обработка границ и коллизий (Бесшовный мир)
        // 1. Коридор и Лестница
        if (nextZ < -42) {
            // Лестничная шахта
            let allowed = false;
            
            // Проверка границ в лестничной шахте
            if (nextZ >= -49.5) {
                if (nextZ >= -47.0) {
                    // Коридоры лестниц
                    if (playerPos.x < 0) {
                        // Левая лестница
                        if (nextX >= -1.4 && nextX <= -0.1) {
                            allowed = true;
                        }
                    } else {
                        // Правая лестница
                        if (nextX >= 0.1 && nextX <= 1.4) {
                            allowed = true;
                        }
                    }
                } else {
                    // Разворотная площадка
                    if (nextX >= -1.4 && nextX <= 1.4) {
                        allowed = true;
                    }
                }
            }
            
            if (allowed) {
                // Stairs doors collision check at Z = -47.0
                const sdState = getOrGenerateStairsDoor(state.floor);
                let finalNextZ = nextZ;
                if (!sdState.opened) {
                    if (playerPos.z >= -47.0 && nextZ < -47.0) {
                        finalNextZ = -46.95;
                    } else if (playerPos.z < -47.0 && nextZ >= -47.0) {
                        finalNextZ = -47.05;
                    }
                }
                
                playerPos.x = nextX;
                playerPos.z = finalNextZ;
                
                // Вычисляем высоту
                playerPos.y = getStepsY(playerPos.x, playerPos.y, playerPos.z);
                
                // Смена этажей по высоте Y
                if (playerPos.y < -4.7) {
                    state.floor = state.floor - 1;
                    playerPos.y += 5.0;
                    
                    if (state.floor < END_FLOOR) { // Allow floor 1
                        triggerGameOver("ending_2");
                        return;
                    }
                    
                    if (Math.random() < 0.1 && !state.stairsMonsterActive) {
                        triggerStairsMonster();
                    } else {
                        logToConsole(`Вы спустились на этаж ${state.floor}.`, "sys");
                    }
                    
                    build3DScene();
                    updateHUD();
                } else if (playerPos.y > 4.7) {
                    if (state.floor >= state.spawnFloor) {
                        // Clamp floor ascension
                        playerPos.y = 4.7;
                        logToConsole("Верхние этажи заблокированы гермозатвором. Прохода нет.", "warn");
                    } else {
                        state.floor = state.floor + 1;
                        playerPos.y -= 5.0;
                        
                        logToConsole(`Вы поднялись на этаж ${state.floor}.`, "sys");
                        
                        build3DScene();
                        updateHUD();
                    }
                }
                
                if (state.location !== 'hallway') {
                    state.location = 'hallway';
                    updateHUD();
                }
            }
        } else if (nextZ > 0.5) {
            // Задний тупик
            playerPos.z = 0.5;
        } else {
            // КОРИДОР И КОМНАТЫ (Z от 0 до -42) — AABB Collision System
            playerPos.y = 0; // На этаже
            
            // Build AABB colliders for walls and doors
            const colliders = [];
            const PR = 0.3; // Player radius
            
            // Corridor walls (left and right) — segments between doors
            // Left wall
            colliders.push({ minX: -3.2, maxX: -2.9, minZ: -9.4, maxZ: 0.0 });
            colliders.push({ minX: -3.2, maxX: -2.9, minZ: -21.4, maxZ: -10.6 });
            colliders.push({ minX: -3.2, maxX: -2.9, minZ: -33.4, maxZ: -22.6 });
            colliders.push({ minX: -3.2, maxX: -2.9, minZ: -42.0, maxZ: -34.6 });
            // Right wall
            colliders.push({ minX: 2.9, maxX: 3.2, minZ: -9.4, maxZ: 0.0 });
            colliders.push({ minX: 2.9, maxX: 3.2, minZ: -21.4, maxZ: -10.6 });
            colliders.push({ minX: 2.9, maxX: 3.2, minZ: -33.4, maxZ: -22.6 });
            colliders.push({ minX: 2.9, maxX: 3.2, minZ: -42.0, maxZ: -34.6 });
            // Back wall (spawn end)
            colliders.push({ minX: -3.2, maxX: 3.2, minZ: 0.0, maxZ: 0.3 });
            
            // Door and room colliders
            DOOR_LAYOUT.forEach((layout, idx) => {
                const doorObj = state.doors[idx];
                if (!doorObj) return;
                
                const isLeft = layout.x < 0;
                
                // Closed door or empty slot — block the doorway
                if (!doorObj.opened || doorObj.type === 'empty') {
                    if (isLeft) {
                        colliders.push({ minX: -3.2, maxX: -2.9, minZ: layout.z - 0.6, maxZ: layout.z + 0.6 });
                    } else {
                        colliders.push({ minX: 2.9, maxX: 3.2, minZ: layout.z - 0.6, maxZ: layout.z + 0.6 });
                    }
                }
                
                // Room walls (if door exists and is not empty)
                if (doorObj.type !== 'empty') {
                    const roomWidth = doorObj.type === 'apartment' ? 3.5 : (doorObj.type === 'monster' ? 4.0 : 2.5);
                    const roomDepth = doorObj.type === 'apartment' ? 7.0 : 5.0;
                    const dirX = isLeft ? -1 : 1;
                    
                    const backWallX = layout.x + roomDepth * dirX;
                    const zMin = layout.z - roomWidth;
                    const zMax = layout.z + roomWidth;
                    
                    // Back wall of room
                    colliders.push({ minX: backWallX - 0.15, maxX: backWallX + 0.15, minZ: zMin, maxZ: zMax });
                    
                    // Side walls of room
                    colliders.push({ minX: Math.min(layout.x, backWallX), maxX: Math.max(layout.x, backWallX), minZ: zMin - 0.15, maxZ: zMin + 0.15 });
                    colliders.push({ minX: Math.min(layout.x, backWallX), maxX: Math.max(layout.x, backWallX), minZ: zMax - 0.15, maxZ: zMax + 0.15 });
                    
                    // Front wall segments (around doorway)
                    const frontDoorHalf = 0.6;
                    if (isLeft) {
                        colliders.push({ minX: -3.2, maxX: -2.9, minZ: zMin, maxZ: layout.z - frontDoorHalf });
                        colliders.push({ minX: -3.2, maxX: -2.9, minZ: layout.z + frontDoorHalf, maxZ: zMax });
                    } else {
                        colliders.push({ minX: 2.9, maxX: 3.2, minZ: zMin, maxZ: layout.z - frontDoorHalf });
                        colliders.push({ minX: 2.9, maxX: 3.2, minZ: layout.z + frontDoorHalf, maxZ: zMax });
                    }
                    
                    // Furniture colliders inside rooms
                    if (doorObj.type === 'apartment') {
                        const cabX = layout.x + 5.5 * dirX;
                        const cabZ = layout.z - 2.0;
                        colliders.push({ minX: cabX - 1.0, maxX: cabX + 1.0, minZ: cabZ - 0.5, maxZ: cabZ + 0.5 });
                        
                        const tableX = layout.x + 3.7 * dirX;
                        const tableZ = layout.z;
                        colliders.push({ minX: tableX - 0.9, maxX: tableX + 0.9, minZ: tableZ - 0.6, maxZ: tableZ + 0.6 });
                    } else if (doorObj.type === 'transition') {
                        const panelX = layout.x + 4.5 * dirX;
                        colliders.push({ minX: panelX - 0.4, maxX: panelX + 0.4, minZ: layout.z - 0.8, maxZ: layout.z + 0.8 });
                    }
                }
            });
            
            // AABB vs circle collision check
            function checkAABBCollision(px, pz, radius) {
                for (const box of colliders) {
                    const closestX = Math.max(box.minX, Math.min(px, box.maxX));
                    const closestZ = Math.max(box.minZ, Math.min(pz, box.maxZ));
                    const distX = px - closestX;
                    const distZ = pz - closestZ;
                    if ((distX * distX + distZ * distZ) < (radius * radius)) {
                        return true;
                    }
                }
                return false;
            }
            
            // Try X movement independently
            if (!checkAABBCollision(nextX, playerPos.z, PR)) {
                playerPos.x = nextX;
            }
            // Try Z movement independently
            if (!checkAABBCollision(playerPos.x, nextZ, PR)) {
                playerPos.z = nextZ;
            }
            
            // Determine location (hallway vs room)
            let insideRoomIdx = -1;
            DOOR_LAYOUT.forEach((layout, idx) => {
                const doorObj = state.doors[idx];
                if (!doorObj || doorObj.type === 'empty') return;
                
                const isLeft = layout.x < 0;
                const roomWidth = doorObj.type === 'apartment' ? 3.5 : (doorObj.type === 'monster' ? 4.0 : 2.5);
                const roomDepth = doorObj.type === 'apartment' ? 7.0 : 5.0;
                const dirX = isLeft ? -1 : 1;
                const backWallX = layout.x + roomDepth * dirX;
                
                const pxInRoom = isLeft ? 
                    (playerPos.x <= layout.x && playerPos.x >= backWallX) :
                    (playerPos.x >= layout.x && playerPos.x <= backWallX);
                const pzInRoom = (playerPos.z >= layout.z - roomWidth && playerPos.z <= layout.z + roomWidth);
                
                if (pxInRoom && pzInRoom) {
                    insideRoomIdx = idx;
                }
            });
            
            if (insideRoomIdx >= 0) {
                const newLoc = state.doors[insideRoomIdx].type === 'apartment' ? 'room' : 
                               (state.doors[insideRoomIdx].type === 'transition' ? 'transition' : 'room');
                if (state.location !== newLoc || state.focusedDoorIndex !== insideRoomIdx) {
                    const oldLoc = state.location;
                    state.location = newLoc;
                    state.focusedDoorIndex = insideRoomIdx;
                    updateHUD();
                    
                    // Выводим описание атмосферы при входе в новую комнату
                    if (newLoc === 'room' && oldLoc === 'hallway') {
                        const door = state.doors[insideRoomIdx];
                        if (door.roomType === 'armory') {
                            logToConsole(`Вы вошли в ${door.name}. На стене висит знак Ликвидаторов. Под ногами рассыпаны гильзы.`, "sys");
                        } else if (door.roomType === 'contaminated') {
                            logToConsole(`Вы вошли в ${door.name}. Воздух здесь едкий и желтоватый. Счетчик Гейгера тихо потрескивает! (Фильтр тратится быстрее)`, "danger");
                        } else if (door.roomType === 'nest') {
                            logToConsole(`Вы вошли в ${door.name}. В углу копошится склизкая биомасса. Старайтесь не шуметь!`, "warn");
                        } else {
                            logToConsole(`Вы вошли в квартиру. Вокруг обычная серая обстановка советской квартиры-хрущевки.`, "sys");
                        }
                    }
                }
            } else {
                if (state.location !== 'hallway') {
                    state.location = 'hallway';
                    state.focusedDoorIndex = null;
                    updateHUD();
                }
            }
        }
        
        state.water = Math.max(0, state.water - 0.002); // Slower water consumption when moving
        
        // Footstep sound system: trigger steps at walking rate if actually moved
        const distMoved = Math.sqrt((playerPos.x - prevX) * (playerPos.x - prevX) + (playerPos.z - prevZ) * (playerPos.z - prevZ));
        if (distMoved > 0.01) {
            footstepTimeAccumulator += deltaTime;
            const finalSpd = window._customSpeed || currentSpeed;
            const stepInterval = Math.max(0.2, 1.5 / finalSpd);
            if (footstepTimeAccumulator >= stepInterval) {
                playSoundStep();
                footstepTimeAccumulator = 0;
            }
        } else {
            footstepTimeAccumulator = 0;
        }
    }
}

function getStepsY(x, y, z) {
    if (z >= -42) return 0;
    const stairsProgress = Math.max(0, Math.min(1.0, (-42.0 - z) / 5.0));
    if (z < -47) {
        if (y < 0) {
            return -2.5;
        } else {
            return 2.5;
        }
    }
    if (x < 0) {
        if (y < 1.25) {
            return -2.5 * stairsProgress;
        } else {
            return 5.0 - 2.5 * stairsProgress;
        }
    } else {
        if (y < -1.25) {
            return -5.0 + 2.5 * stairsProgress;
        } else {
            return 2.5 * stairsProgress;
        }
    }
}

let lastFocusedDoorIndex = undefined;
let lastFocusedStairsDoor = false;
let lastFocusedCorpse = false;

// Рейкаст в центр экрана для фокусировки объекта
function performInteractionRaycast(force = false) {
    // Проецируем луч прямо по центру камеры
    raycaster.setFromCamera(new THREE.Vector2(0, 0), camera);
    
    // Собираем дочерние меши из дверных пивотов для пересечения
    const meshArray = [];
    doorPivots.forEach(pivot => {
        if (pivot.userData && pivot.userData.floor === state.floor) {
            pivot.children.forEach(child => meshArray.push(child));
        }
    });
    
    // Add current stairs door meshes of the floor
    const sdGroup = scene.getObjectByName(`stairsDoor_${state.floor}`);
    if (sdGroup) {
        sdGroup.children.forEach(child => {
            if (child.name === 'left_panel' || child.name === 'right_panel') {
                meshArray.push(child);
            }
        });
    }
    
    // Добавляем части тела ликвидатора
    if (deadLiquidatorMesh && !deadLiquidatorSearched) {
        deadLiquidatorMesh.children.forEach(child => meshArray.push(child));
    }
    
    // Добавляем части призрака
    if (ghostMesh) {
        ghostMesh.children.forEach(child => {
            meshArray.push(child);
            if (child.children) {
                child.children.forEach(gc => meshArray.push(gc));
            }
        });
    }
    
    const intersects = raycaster.intersectObjects(meshArray, true);
    
    let hitDoorIdx = null;
    let hitStairsDoor = false;
    let hitCorpse = false;
    
    if (intersects.length > 0) {
        const hitObj = intersects[0].object;
        const dist = intersects[0].distance;
        
        // 1. Если это призрак и расстояние < 12.0
        if (ghostMesh && (hitObj === ghostMesh || (hitObj.parent && (hitObj.parent === ghostMesh || hitObj.parent.parent === ghostMesh)) || ghostMesh.getObjectById(hitObj.id)) && dist < 12.0) {
            if (playerFlashlight && playerFlashlight.intensity > 0) {
                logToConsole("Призрак закричал от боли и растаял в луче света вашего фонаря!", "sys");
                playScaryScreechSound();
                scene.remove(ghostMesh);
                ghostMesh = null;
            } else {
                if (!window.ghostWhispered) {
                    window.ghostWhispered = true;
                    const creepyLogs = [
                        "Призрак шепчет: 'Здесь нет выхода... только бесконечные этажи...'",
                        "Призрак шепчет: 'Они видят тебя... они всегда видят...'",
                        "Призрак шепчет: 'Остановись... прими Самосбор...'",
                        "Призрак шепчет: 'Ликвидатор 1324... твоя смена окончена...'"
                    ];
                    logToConsole(creepyLogs[Math.floor(Math.random() * creepyLogs.length)], "danger");
                    playSoundScaryWhisper();
                }
            }
        }
        
        // 2. Если это тело ликвидатора и расстояние < 3.5
        else if (deadLiquidatorMesh && (hitObj === deadLiquidatorMesh || (hitObj.parent && hitObj.parent === deadLiquidatorMesh) || deadLiquidatorMesh.getObjectById(hitObj.id)) && dist < 3.5) {
            hitCorpse = true;
        }
        
        // 3. Если это створка затвора на лестнице и расстояние < 4.0
        else if ((hitObj.name === 'left_panel' || hitObj.name === 'right_panel') && dist < 4.0) {
            hitStairsDoor = true;
        }
        
        // 4. Если это квартирная дверь и расстояние < 3.5
        else if (hitObj.name.startsWith('door_') && dist < 3.5) {
            hitDoorIdx = hitObj.userData.doorIndex;
        }
    }
    
    // Обновляем состояние
    state.focusedDoorIndex = hitDoorIdx;
    state.focusedStairsDoor = hitStairsDoor;
    state.focusedCorpse = hitCorpse;
    
    // Обновляем UI
    updateFocusedObjectUI(force);
}

// Обновление UI фокусировки объекта
function updateFocusedObjectUI(force = false) {
    if (!force && 
        state.focusedDoorIndex === lastFocusedDoorIndex && 
        state.focusedStairsDoor === lastFocusedStairsDoor && 
        state.focusedCorpse === lastFocusedCorpse) {
        return;
    }
    
    lastFocusedDoorIndex = state.focusedDoorIndex;
    lastFocusedStairsDoor = state.focusedStairsDoor;
    lastFocusedCorpse = state.focusedCorpse;
    
    const title = document.getElementById('focused-object-name');
    const desc = document.getElementById('focused-object-state');
    const btnListen = document.getElementById('btn-listen');
    const btnOpen = document.getElementById('btn-open-door');
    
    if (!title || !desc || !btnListen || !btnOpen) return;
    
    if (state.focusedCorpse) {
        title.innerText = "ТЕЛО ЛИКВИДАТОРА";
        desc.innerText = "Погибший ликвидатор в форме. Обыскать подсумки (клавиша R).";
        btnOpen.removeAttribute('disabled');
        btnOpen.classList.remove('btn-disabled');
        btnOpen.innerText = "Обыскать тело";
        btnListen.setAttribute('disabled', 'true');
        btnListen.classList.add('btn-disabled');
        return;
    }
    
    if (state.focusedStairsDoor) {
        const sdState = getOrGenerateStairsDoor(state.floor);
        title.innerText = "ГЕРМОЗАТВОР ЛЕСТНИЦЫ";
        if (state.floor === 1) {
            desc.innerText = "Заблокировано центральной системой ГИГАХРУЩА.";
            btnOpen.removeAttribute('disabled');
            btnOpen.classList.remove('btn-disabled');
            btnOpen.innerText = "Попробовать взломать";
        } else if (sdState.opened) {
            desc.innerText = "Затвор открыт. Проход на лестницу свободен.";
            btnOpen.removeAttribute('disabled');
            btnOpen.classList.remove('btn-disabled');
            btnOpen.innerText = "Закрыть затвор";
        } else {
            desc.innerText = "Массивный гермозатвор заперт! Нажмите B для взлома.";
            btnOpen.removeAttribute('disabled');
            btnOpen.classList.remove('btn-disabled');
            btnOpen.innerText = "Взломать затвор";
        }
        btnListen.setAttribute('disabled', 'true');
        btnListen.classList.add('btn-disabled');
        return;
    }
    
    if (state.focusedDoorIndex !== null) {
        const door = state.doors[state.focusedDoorIndex];
        title.innerText = door.name.toUpperCase();
        
        if (door.opened) {
            desc.innerText = "Дверь открыта. Вы можете зайти внутрь (пройдите WASD).";
            btnListen.setAttribute('disabled', 'true');
            btnListen.classList.add('btn-disabled');
            btnOpen.removeAttribute('disabled');
            btnOpen.classList.remove('btn-disabled');
            btnOpen.innerText = "Закрыть дверь";
        } else {
            desc.innerText = "Гермодверь закрыта. Подойдите вплотную.";
            btnListen.removeAttribute('disabled');
            btnListen.classList.remove('btn-disabled');
            btnOpen.removeAttribute('disabled');
            btnOpen.classList.remove('btn-disabled');
            btnOpen.innerText = "Открыть дверь";
        }
    } else {
        title.innerText = "ОБЪЕКТ НЕ ВЫБРАН";
        desc.innerText = "Подойдите к двери или объекту взаимодействия";
        btnListen.setAttribute('disabled', 'true');
        btnListen.classList.add('btn-disabled');
        btnOpen.setAttribute('disabled', 'true');
        btnOpen.classList.add('btn-disabled');
        btnOpen.innerText = "Взаимодействовать";
    }
}

// Звук страшного шепота призрака
function playSoundScaryWhisper() {
    initAudio();
    if (!audioCtx) return;
    const now = audioCtx.currentTime;
    const osc1 = audioCtx.createOscillator();
    const osc2 = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(80, now);
    osc1.frequency.linearRampToValueAtTime(140, now + 1.2);
    
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(150, now);
    osc2.frequency.linearRampToValueAtTime(70, now + 1.5);
    
    gain.gain.setValueAtTime(0.04, now);
    gain.gain.linearRampToValueAtTime(0.04, now + 1.0);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.5);
    
    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(audioCtx.destination);
    
    osc1.start(now);
    osc1.stop(now + 1.5);
    osc2.start(now);
    osc2.stop(now + 1.5);
}

// --- МИНИ-ИГРА И ВЗЛОМ ГЕРМОЗАТВОРОВ ---
function startHackPuzzle(onSuccess) {
    hackActive = true;
    hackSuccessCallback = onSuccess;
    activeHackChannel = 'A';
    
    // Рандомизируем целевые частоты трех каналов от 15.0 до 95.0 MHz
    targetFrequencies.A = (Math.random() * 80 + 15).toFixed(1);
    targetFrequencies.B = (Math.random() * 80 + 15).toFixed(1);
    targetFrequencies.C = (Math.random() * 80 + 15).toFixed(1);
    
    document.getElementById('hack-target-a').innerText = `${targetFrequencies.A} MHz`;
    document.getElementById('hack-target-b').innerText = `${targetFrequencies.B} MHz`;
    document.getElementById('hack-target-c').innerText = `${targetFrequencies.C} MHz`;
    
    // Сбрасываем цвета кнопок каналов (красные)
    document.getElementById('hack-chan-a').style.color = '#ff3333';
    document.getElementById('hack-chan-b').style.color = '#ff3333';
    document.getElementById('hack-chan-c').style.color = '#ff3333';
    
    document.getElementById('hack-target-a').style.textDecoration = 'none';
    document.getElementById('hack-target-b').style.textDecoration = 'none';
    document.getElementById('hack-target-c').style.textDecoration = 'none';
    
    document.getElementById('hack-modal').classList.remove('modal-hidden');
    if (document.pointerLockElement) {
        document.exitPointerLock();
    }
    
    // Сбрасываем слайдер частоты
    const slider = document.getElementById('hack-tuner-slider');
    slider.value = 500;
    
    updateHackSliderTuner();
}

function updateHackSliderTuner() {
    const slider = document.getElementById('hack-tuner-slider');
    const freqVal = (parseFloat(slider.value) / 10).toFixed(1);
    document.getElementById('hack-current-freq').innerText = `${freqVal} MHz`;
    
    const targetVal = parseFloat(targetFrequencies[activeHackChannel]);
    const diff = Math.abs(parseFloat(freqVal) - targetVal);
    
    const strengthLabel = document.getElementById('hack-signal-strength');
    if (diff < 1.5) {
        strengthLabel.innerText = "СИГНАЛ: ВЫРАВНИВАНИЕ (КЛИКНИТЕ СОЕДИНЕНИЕ)";
        strengthLabel.style.color = '#00ff66';
    } else if (diff < 5.0) {
        strengthLabel.innerText = "СИГНАЛ: СЛАБЫЙ (ШУМ)";
        strengthLabel.style.color = '#ffcc00';
    } else if (diff < 12.0) {
        strengthLabel.innerText = "СИГНАЛ: ПОМЕХИ";
        strengthLabel.style.color = '#ffaa00';
    } else {
        strengthLabel.innerText = "СИГНАЛ: РАССОГЛАСОВАНИЕ";
        strengthLabel.style.color = '#ff3333';
    }
    
    playTuningBeep(diff);
}

function playTuningBeep(diff) {
    initAudio();
    if (!audioCtx) return;
    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    let pitch = 150;
    if (diff < 1.5) pitch = 880;
    else if (diff < 5.0) pitch = 440;
    else if (diff < 12.0) pitch = 260;
    
    osc.frequency.setValueAtTime(pitch, now);
    
    let volume = 0.008;
    if (diff < 1.5) volume = 0.04;
    else if (diff < 5.0) volume = 0.02;
    else if (diff < 12.0) volume = 0.015;
    
    gain.gain.setValueAtTime(volume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(now);
    osc.stop(now + 0.1);
}

function submitHackTuning() {
    const slider = document.getElementById('hack-tuner-slider');
    const freqVal = parseFloat(slider.value) / 10;
    const targetVal = parseFloat(targetFrequencies[activeHackChannel]);
    const diff = Math.abs(freqVal - targetVal);
    
    if (diff <= 1.5) {
        // Успешный захват канала
        const chanEl = document.getElementById(`hack-chan-${activeHackChannel.toLowerCase()}`);
        chanEl.style.color = '#00ff66';
        document.getElementById(`hack-target-${activeHackChannel.toLowerCase()}`).innerText = "LOCKED";
        
        // Звук фиксации
        initAudio();
        if (audioCtx) {
            const now = audioCtx.currentTime;
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.frequency.setValueAtTime(1200, now);
            gain.gain.setValueAtTime(0.1, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start(now);
            osc.stop(now + 0.35);
        }
        
        logToConsole(`Дешифратор: Канал ${activeHackChannel} зафиксирован!`, "loot");
        
        if (activeHackChannel === 'A') {
            activeHackChannel = 'B';
        } else if (activeHackChannel === 'B') {
            activeHackChannel = 'C';
        } else {
            // Все 3 канала взломаны!
            document.getElementById('hack-modal').classList.add('modal-hidden');
            hackActive = false;
            
            if (hackSuccessCallback) {
                hackSuccessCallback();
            }
        }
    } else {
        // Звуковой сигнал об ошибке
        initAudio();
        if (audioCtx) {
            const now = audioCtx.currentTime;
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(100, now);
            gain.gain.setValueAtTime(0.15, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start(now);
            osc.stop(now + 0.45);
        }
        logToConsole("Дешифратор: Сбой связи! Ошибка согласования фазы сигнала.", "danger");
    }
}

// --- ИСПОЛЬЗОВАНИЕ ВЗЛОМЩИКА ---
function useHackerTool() {
    if (!state.focusedStairsDoor && Math.abs(playerPos.z - (-47.0)) > 2.5) {
        logToConsole("Подойдите ближе к лестничному гермозатвору.", "warn");
        return;
    }
    
    initAudio();
    
    // Last Floor check
    if (state.floor === 1) {
        logToConsole("Взломщик: Ошибка доступа. Затвор заблокирован центральной системой ГИГАХРУЩА. Это устройство здесь бесполезно!", "danger");
        
        // Trigger ending sequence after 3 seconds
        disableAllControls(true);
        setTimeout(() => {
            if (state.notesCount === 6) {
                triggerGameOver("ending_1");
            } else {
                triggerGameOver("ending_2");
            }
        }, 3000);
        return;
    }
    
    // Check if player has hacker tool
    if (!state.hasHackerTool) {
        logToConsole("У вас нет взломщика гермодверей! Обыщите квартиры, чтобы найти его.", "warn");
        return;
    }
    
    // Check battery
    if (state.batteries <= 0) {
        logToConsole("Батарея взломщика разряжена! Найдите батарейки в квартирах.", "warn");
        return;
    }
    
    // Запускаем взлом-дешифратор!
    startHackPuzzle(() => {
        // Успешный исход
        const sdState = getOrGenerateStairsDoor(state.floor);
        sdState.opened = !sdState.opened;
        
        // Воспроизводим звук движения двери после обхода
        setTimeout(() => {
            playSoundDoor(!sdState.opened);
        }, 300);
        
        logToConsole(`Затвор дешифрован! Механизмы пришли в движение: затвор ${sdState.opened ? 'открывается' : 'закрывается'}...`, "action");
        
        // Анимация в 3D
        const sdGroup = scene.getObjectByName(`stairsDoor_${state.floor}`);
        if (sdGroup) {
            const left = sdGroup.getObjectByName("left_panel");
            const right = sdGroup.getObjectByName("right_panel");
            if (left && right) {
                let t = 0;
                const startL = left.position.x;
                const startR = right.position.x;
                const targetL = sdState.opened ? -2.25 : -0.75;
                const targetR = sdState.opened ? 2.25 : 0.75;
                
                const anim = setInterval(() => {
                    t += 0.05;
                    if (t >= 1.0) {
                        left.position.x = targetL;
                        right.position.x = targetR;
                        clearInterval(anim);
                    } else {
                        left.position.x = startL + (targetL - startL) * t;
                        right.position.x = startR + (targetR - startR) * t;
                    }
                }, 30);
            }
        }
        
        updateFocusedObjectUI(true);
        updateHUD();
    });
    
    // Тратим батарейку на запуск
    state.batteries--;
    updateInventoryUI();
}

function updateInventoryUI() {
    const bagHacker = document.getElementById('bag-hacker-tool');
    const bagBatteries = document.getElementById('bag-batteries');
    if (bagHacker) {
        bagHacker.innerText = state.hasHackerTool ? "ЕСТЬ" : "НЕТ";
        bagHacker.style.color = state.hasHackerTool ? "var(--glow-green)" : "var(--glow-red)";
    }
    if (bagBatteries) {
        bagBatteries.innerText = `${state.batteries} шт`;
    }
}

// --- ПАУЗА И РЕБИНД ---
let isGamePaused = false;
function togglePauseGame(pause = !isGamePaused) {
    const splash = document.getElementById('splash-screen');
    const goScreen = document.getElementById('gameover-screen');
    if (splash.classList.contains('screen-active') || goScreen.classList.contains('screen-active')) {
        return;
    }
    
    isGamePaused = pause;
    const pauseScreen = document.getElementById('pause-screen');
    if (isGamePaused) {
        pauseScreen.className = 'panel screen-active modal-backdrop';
        if (document.pointerLockElement) {
            document.exitPointerLock();
        }
        Object.keys(keys).forEach(k => keys[k] = false);
    } else {
        pauseScreen.className = 'panel screen-inactive modal-backdrop';
        const canvasHolder = document.getElementById('canvas-holder');
        if (canvasHolder && !state.isSearching) {
            canvasHolder.requestPointerLock();
        }
    }
}

let rebindingAction = null;
function populateRebindList() {
    const list = document.getElementById('rebind-list');
    if (!list) return;
    list.innerHTML = '';
    
    for (let action in state.keyBindings) {
        const keyCode = state.keyBindings[action];
        const label = ACTION_LABELS[action] || action;
        
        const row = document.createElement('div');
        row.className = 'rebind-row';
        row.innerHTML = `
            <span class="rebind-label">${label}</span>
            <button class="rebind-btn" data-action="${action}">${keyCode}</button>
        `;
        list.appendChild(row);
    }
    
    const buttons = list.querySelectorAll('.rebind-btn');
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            if (rebindingAction) return;
            rebindingAction = btn.getAttribute('data-action');
            btn.innerText = 'Нажмите клавишу...';
            btn.classList.add('waiting');
        });
    });
}

// --- ПОДТВЕРЖДЕНИЕ ВЗАИМОДЕЙСТВИЯ (КЛИК / КЛАВИШИ) ---
function interactWithFocused() {
    if (state.focusedCorpse) {
        searchDeadLiquidator();
        return;
    }
    if (state.focusedStairsDoor) {
        useHackerTool();
        return;
    }
    if (state.location === 'hallway') {
        if (state.focusedDoorIndex !== null) {
            const door = state.doors[state.focusedDoorIndex];
            if (!door.opened) {
                openDoor();
            } else {
                closeDoor();
            }
        }
    } else if (state.location === 'room') {
        // В комнате - обыскиваем мебель по динамическим координатам
        const doorIdx = state.focusedDoorIndex;
        if (doorIdx !== null && doorIdx >= 0) {
            const layout = DOOR_LAYOUT[doorIdx];
            const dirX = layout.x < 0 ? -1 : 1;
            const cabPos = new THREE.Vector3(layout.x + (5.5 * dirX), 0, layout.z - 2.0);
            const tablePos = new THREE.Vector3(layout.x + (3.7 * dirX), 0, layout.z);
            
            if (playerPos.distanceTo(cabPos) < 3.5 || playerPos.distanceTo(tablePos) < 3.0) {
                searchRoom();
            } else {
                logToConsole("Подойдите к серванту или столу вплотную, чтобы обыскать их.", "warn");
            }
        } else {
            searchRoom();
        }
    }
}

function listenToFocused() {
    if (state.location === 'hallway' && state.focusedDoorIndex !== null) {
        listenToDoor();
    }
}


// --- ДЕЙСТВИЯ СУРВИВАЛА И ДВЕРЕЙ ---

function listenToDoor() {
    if (state.focusedDoorIndex === null || state.location !== 'hallway' || state.stairsMonsterActive) return;
    initAudio();
    
    const door = state.doors[state.focusedDoorIndex];
    const ind = document.getElementById('listening-indicator');
    const subtext = document.getElementById('listening-subtext');
    
    ind.className = '';
    disableAllControls(true);
    
    logToConsole(`Ликвидатор прислонился к двери ${door.name} и слушает...`, "action");
    
    const barNodes = document.querySelectorAll('.bar');
    let tickCount = 0;
    
    if (door.type === 'monster') {
        playSoundMonsterHiss();
        subtext.innerText = "Скрежет, глухое утробное шипение!";
        subtext.style.color = '#ff3333';
    } else if (door.type === 'transition') {
        subtext.innerText = "Свист воздуха, далекий гул вентиляции";
        subtext.style.color = '#00e5ff';
        if (audioCtx) {
            const now = audioCtx.currentTime;
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(300, now);
            osc.frequency.linearRampToValueAtTime(150, now + 1.5);
            gain.gain.setValueAtTime(0.01, now);
            gain.gain.linearRampToValueAtTime(0.05, now + 0.3);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 1.4);
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start(now);
            osc.stop(now + 1.5);
        }
    } else {
        subtext.innerText = "Только тяжелое эхо пустых комнат";
        subtext.style.color = '#00ff66';
    }
    
    const waveInterval = setInterval(() => {
        tickCount++;
        barNodes.forEach(bar => {
            let h = 2;
            if (door.type === 'monster') {
                h = Math.random() * 26 + 4;
            } else if (door.type === 'transition') {
                h = Math.sin(tickCount + Math.random()) * 8 + 10;
            } else {
                h = Math.random() * 4 + 2;
            }
            bar.style.height = `${h}px`;
        });
        
        if (tickCount >= 15) {
            clearInterval(waveInterval);
            ind.className = 'overlay-hidden';
            disableAllControls(false);
            updateHUD();
        }
    }, 100);
}

function openDoor() {
    if (state.focusedDoorIndex === null || state.location !== 'hallway' || state.stairsMonsterActive) return;
    initAudio();
    
    const door = state.doors[state.focusedDoorIndex];
    
    if (door.type === 'empty') {
        logToConsole("Ручка не поддается. Гермозатвор заклинен намертво ржавчиной.", "warn");
        return;
    }
    
    door.opened = true;
    
    // Включаем свет в комнате (меняем интенсивность вместо visible для избежания лагов шейдеров)
    if (doorLights && doorLights[state.floor + '_' + state.focusedDoorIndex]) {
        doorLights[state.floor + '_' + state.focusedDoorIndex].intensity = door.type === 'transition' ? 0.5 : 0.3;
    }
    
    // Анимация в 3D (открытие створки вокруг петель)
    const pivot = doorPivots.find(p => p.userData && p.userData.floor === state.floor && p.userData.doorIndex === state.focusedDoorIndex);
    if (pivot) {
        let angle = 0;
        const layout = DOOR_LAYOUT[state.focusedDoorIndex];
        const doorAnim = setInterval(() => {
            angle += 0.08;
            pivot.rotation.y = layout.rot + angle;
            if (angle >= Math.PI / 2) {
                clearInterval(doorAnim);
                pivot.rotation.y = layout.rot + Math.PI / 2;
            }
        }, 20);
    }
    
    playSoundDoor(false);
    logToConsole(`С лязгом замков дверь ${door.name} открылась наружу.`, "action");
    
    if (door.type === 'monster') {
        // Скример смерти
        disableAllControls(true);
        document.getElementById('jumpscare-overlay').className = '';
        playSoundMonsterHiss();
        
        if (audioCtx) {
            const now = audioCtx.currentTime;
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(80, now);
            osc.frequency.linearRampToValueAtTime(120, now + 0.8);
            gain.gain.setValueAtTime(0.9, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.9);
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start(now);
            osc.stop(now + 1.0);
        }
        
        setTimeout(() => {
            document.getElementById('jumpscare-overlay').className = 'overlay-hidden';
            triggerGameOver("opened_monster");
        }, 1200);
    }
    
    updateHUD();
    updateFocusedObjectUI(true);
}

function closeDoor() {
    if (state.focusedDoorIndex === null) return;
    const door = state.doors[state.focusedDoorIndex];
    if (!door || !door.opened) return;
    
    door.opened = false;
    playSoundDoor();
    
    // Animate door visual
    const pivot = doorPivots.find(p => p.userData.doorIndex === state.focusedDoorIndex && p.userData.floor === state.floor);
    if (pivot) {
        const layout = DOOR_LAYOUT[state.focusedDoorIndex];
        let angle = pivot.rotation.y;
        const targetAngle = layout.rot;
        const anim = setInterval(() => {
            angle -= 0.1;
            if (angle <= targetAngle) {
                pivot.rotation.y = targetAngle;
                clearInterval(anim);
            } else {
                pivot.rotation.y = angle;
            }
        }, 16);
    }
    
    // Turn off light
    const lKey = state.floor + '_' + state.focusedDoorIndex;
    if (doorLights[lKey]) {
        doorLights[lKey].intensity = 0;
    }
    
    logToConsole(`Вы заперли дверь ${door.name}.`, "sys");
    updateFocusedObjectUI(true);
}

function searchRoom() {
    if (state.location !== 'room') return;
    // Найти дверь для обыска
    let doorIdx = state.focusedDoorIndex;
    if (doorIdx === null) {
        // Ищем первую открытую квартиру
        doorIdx = state.doors.findIndex(d => d.type === 'apartment' && d.opened);
        if (doorIdx === -1) return;
    }
    const door = state.doors[doorIdx];
    if (!door || door.searched) return;
    
    initAudio();
    state.isSearching = true;
    disableAllControls(true);
    
    const roomOverlay = document.getElementById('room-overlay');
    const progressBar = document.getElementById('room-search-progress');
    const title = document.getElementById('room-title');
    const status = document.getElementById('room-status-text');
    
    title.innerText = "ОБЫСК МЕБЕЛИ";
    status.innerText = "Проверяем полки, перетряхиваем барахло...";
    roomOverlay.className = '';
    
    let progress = 0;
    
    let searchSoundInterval = setInterval(() => {
        if (!audioCtx) return;
        const now = audioCtx.currentTime;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(80 + Math.random()*45, now);
        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.15);
    }, 180);
    
    const progressInterval = setInterval(() => {
        progress += 5;
        progressBar.style.width = `${progress}%`;
        
        if (progress >= 100) {
            clearInterval(progressInterval);
            clearInterval(searchSoundInterval);
            
            roomOverlay.className = 'overlay-hidden';
            door.searched = true;
            state.isSearching = false;
            disableAllControls(false);
            
            // Проверяем событие Гнезда Твари
            if (door.roomType === 'nest' && Math.random() < 0.50) {
                logToConsole("УЖАСНЫЙ ШОРОХ! Из шевелящейся слизи в углу на вас бросилась тварь!", "danger");
                state.health = Math.max(0, state.health - 20);
                playSoundDamage();
                if (state.health <= 0) {
                    triggerGameOver("stairs_monster");
                    return;
                }
                // Спавним тварь в коридоре перед этой дверью
                const layout = DOOR_LAYOUT[doorIdx];
                spawnHallwayCrawler(layout.z, layout.x < 0 ? -2.5 : 2.5);
            } else {
                distributeLoot();
            }
            updateHUD();
        }
    }, 85);
}

function searchDeadLiquidator() {
    if (!deadLiquidatorMesh || deadLiquidatorSearched) return;
    
    initAudio();
    state.isSearching = true;
    disableAllControls(true);
    
    const roomOverlay = document.getElementById('room-overlay');
    const progressBar = document.getElementById('room-search-progress');
    const title = document.getElementById('room-title');
    const status = document.getElementById('room-status-text');
    
    title.innerText = "ОБЫСК ТЕЛА ЛИКВИДАТОРА";
    status.innerText = "Осматриваем разгрузочный жилет, ищем полезное снаряжение...";
    roomOverlay.className = '';
    
    let progress = 0;
    
    let searchSoundInterval = setInterval(() => {
        if (!audioCtx) return;
        const now = audioCtx.currentTime;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(60 + Math.random()*30, now);
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.12);
    }, 200);
    
    const progressInterval = setInterval(() => {
        progress += 5;
        progressBar.style.width = `${progress}%`;
        
        if (progress >= 100) {
            clearInterval(progressInterval);
            clearInterval(searchSoundInterval);
            
            roomOverlay.className = 'overlay-hidden';
            deadLiquidatorSearched = true;
            state.isSearching = false;
            disableAllControls(false);
            
            // Награда за обыск тела
            state.batteries += 1;
            state.ammo = Math.min(MAX_AMMO, state.ammo + 8);
            state.filter = Math.min(MAX_FILTER, state.filter + 40);
            
            logToConsole("[НАХОДКА] Вы нашли батарейку, патроны (+8) и фильтр противогаза (+40%) на теле ликвидатора.", "loot");
            playSoundLoot();
            
            // Удаляем визуальное тело со сцены
            if (deadLiquidatorMesh) {
                scene.remove(deadLiquidatorMesh);
                deadLiquidatorMesh = null;
            }
            
            state.focusedCorpse = false;
            updateFocusedObjectUI(true);
            updateHUD();
        }
    }, 70);
}

function distributeLoot() {
    const rand = Math.random();
    const doorIdx = state.focusedDoorIndex;
    const door = doorIdx !== null ? state.doors[doorIdx] : null;
    const isArmory = door && door.roomType === 'armory';
    const isContaminated = door && door.roomType === 'contaminated';
    
    if (state.floor >= 700 && state.notesCount < LORE_NOTES.length) {
        const nextNoteId = state.notesCount;
        // Записки не спавнятся на складах Ликвидаторов
        if (rand < 0.35 && !isArmory) {
            state.notesCollected[nextNoteId] = true;
            state.notesCount++;
            
            const tab = document.getElementById(`note-tab-${nextNoteId}`);
            if (tab) {
                tab.classList.remove('btn-note-locked');
                tab.innerText = LORE_NOTES[nextNoteId].title;
            }
            
            logToConsole(`[НАХОДКА] Найдена старая записка: "${LORE_NOTES[nextNoteId].title}"!`, "loot");
            playSoundLoot();
            openNotesModal(nextNoteId);
            return;
        }
    }
    
    // Взломщик гермодверей - повышенный шанс на складе или в зараженной зоне
    const toolChance = isArmory ? 0.35 : (isContaminated ? 0.40 : 0.20);
    if (!state.hasHackerTool && Math.random() < toolChance) {
        state.hasHackerTool = true;
        logToConsole("[НАХОДКА] Вы нашли ВЗЛОМЩИК ГЕРМОДВЕРЕЙ! Теперь вы можете открывать лестничные затворы.", "loot");
        playSoundLoot();
        updateInventoryUI();
        return;
    }
    
    // Батарейки - повышенный шанс
    const batChance = isArmory ? 0.45 : (isContaminated ? 0.50 : 0.28);
    if (Math.random() < batChance) {
        state.batteries++;
        logToConsole(`[НАХОДКА] Найдена батарейка для взломщика (+1 шт., всего: ${state.batteries}).`, "loot");
        playSoundLoot();
        updateInventoryUI();
        return;
    }
    
    if (rand < 0.3) {
        state.bottleWater = Math.min(100, state.bottleWater + 50);
        logToConsole("Найдена фляга чистой синтезированной воды (+50% запаса).", "loot");
        playSoundLoot();
    } else if (rand < 0.6 || isArmory) {
        // Оружейная всегда дает патроны, если не выпала батарейка
        const count = isArmory ? 16 : 8;
        state.ammo = Math.min(MAX_AMMO, state.ammo + count);
        logToConsole(`Найдены пистолетные патроны (+${count} шт.).`, "loot");
        playSoundLoot();
    } else if (rand < 0.85) {
        state.filter = Math.min(MAX_FILTER, state.filter + 50);
        logToConsole("Найден новый патрон фильтра для противогаза (+50% заряда).", "loot");
        playSoundLoot();
    } else {
        logToConsole("Вы обыскали углы, но нашли лишь серую бетонную пыль.", "warn");
    }
}

function lockRoom() {
    if (state.location !== 'room') return;
    initAudio();
    
    state.samosborSafe = !state.samosborSafe;
    playSoundDoor(true);
    
    if (state.samosborSafe) {
        logToConsole("Вы закрутили ручной прижим гермодвери изнутри. Теперь комната герметична.", "action");
    } else {
        logToConsole("Затвор двери открыт. Комната больше не защищает от внешней среды.", "warn");
    }
    
    // Визуально закрываем или открываем дверь комнаты на этаже
    const door = state.doors[state.focusedDoorIndex];
    if (door) {
        door.opened = !state.samosborSafe;
    }
    
    // Animate the door visually instead of rebuilding entire scene
    const pivot = doorPivots.find(p => p.userData && p.userData.floor === state.floor && p.userData.doorIndex === state.focusedDoorIndex);
    if (pivot) {
        const layout = DOOR_LAYOUT[state.focusedDoorIndex];
        if (state.samosborSafe) {
            // Close door animation
            let angle = pivot.rotation.y;
            const targetAngle = layout.rot;
            const anim = setInterval(() => {
                angle -= 0.1;
                if (angle <= targetAngle) {
                    pivot.rotation.y = targetAngle;
                    clearInterval(anim);
                } else {
                    pivot.rotation.y = angle;
                }
            }, 16);
        } else {
            // Open door animation
            let angle = 0;
            const doorAnim = setInterval(() => {
                angle += 0.08;
                pivot.rotation.y = layout.rot + angle;
                if (angle >= Math.PI / 2) {
                    clearInterval(doorAnim);
                    pivot.rotation.y = layout.rot + Math.PI / 2;
                }
            }, 20);
        }
    }
    
    updateHUD();
}

function exitRoom() {
    if (state.location !== 'room' && state.location !== 'transition') return;
    initAudio();
    
    const exitFromIdx = state.focusedDoorIndex !== null ? state.focusedDoorIndex : 0;
    
    state.samosborSafe = false;
    state.location = 'hallway';
    
    playSoundDoor(false);
    logToConsole("Вы вышли обратно в бетонный коридор сектора.", "action");
    
    // Возвращаем игрока в коридор вплотную к той двери, из которой он вышел
    const layout = DOOR_LAYOUT[exitFromIdx];
    // Ставим игрока чуть спереди двери
    const spawnOffset = (layout.x < 0) ? 1.0 : -1.0;
    playerPos.set(layout.x + spawnOffset, 0, layout.z);
    playerYaw = (layout.x < 0) ? Math.PI/2 : -Math.PI/2; // смотрим поперек на коридор
    playerPitch = 0;
    
    // Убеждаемся, что дверь открыта при выходе
    const door = state.doors[exitFromIdx];
    if (door) {
        door.opened = true;
    }
    
    // Визуально открываем дверь в 3D при выходе
    const pivot = doorPivots.find(p => p.userData && p.userData.floor === state.floor && p.userData.doorIndex === exitFromIdx);
    if (pivot) {
        pivot.rotation.y = layout.rot + Math.PI / 2;
    }
    
    updateHUD();
}

// Физический спуск по лестнице (когда игрок дошел до низа)
function triggerFloorDescent() {
    if (state.stairsMonsterActive) return;
    initAudio();
    
    disableAllControls(true);
    
    // Спускаемся на этаж
    state.floor--;
    
    // Проигрываем звук затвора и шагов
    playSoundDoor(true);
    
    // Показываем экран перехода
    const overlay = document.getElementById('descent-transition-overlay');
    const overlayText = document.getElementById('transition-floor-num');
    overlayText.innerText = `ЭТАЖ ${state.floor}`;
    overlay.className = '';
    
    setTimeout(() => {
        
        if (state.floor < END_FLOOR) {
            overlay.className = 'overlay-hidden';
            triggerGameOver("ending_2");
            return;
        }
        
        // Шанс встретить чудовище на лестнице (10%)
        if (Math.random() < 0.1) {
            overlay.className = 'overlay-hidden';
            triggerStairsMonster();
            updateHUD();
        } else {
            // Генерируем 6 дверей по шансам пользователя
            generateDoorsForFloor();
            build3DScene();
            
            // Сбросываем позицию игрока на старт нового этажа
            playerPos.set(0, 0, -1.0);
            playerYaw = 0;
            playerPitch = 0;
            
            logToConsole(`Вы спустились на этаж ${state.floor}.`, "sys");
            
            updateHUD();
            
            setTimeout(() => {
                overlay.className = 'overlay-hidden';
                disableAllControls(false);
            }, 300);
        }
    }, 1200);
}

// Генерация 6 дверей по шансам пользователя
function getOrGenerateFloorDoors(floorNum) {
    if (!state.floorsData) {
        state.floorsData = {};
    }
    if (state.floorsData[floorNum]) {
        return state.floorsData[floorNum].doors;
    }
    
    let doors = [];
    doors.push({
        id: 0,
        type: 'apartment',
        name: `Квартира ${Math.floor(Math.random() * 800 + 100)}`,
        opened: false,
        searched: false
    });
    
    const hasTransition = Math.random() < 0.3;
    const hasMonster = Math.random() < 0.6;
    
    for (let i = 1; i <= 5; i++) {
        let type = 'empty';
        if (Math.random() < 0.3) {
            type = 'apartment';
        }
        doors.push({
            id: i,
            type: type,
            name: `Дверь ${i + 1}`,
            opened: false,
            searched: false
        });
    }
    
    if (hasTransition) {
        const slots = [1, 2, 3, 4, 5].sort(() => Math.random() - 0.5);
        for (let s of slots) {
            if (doors[s].type === 'empty') {
                doors[s].type = 'transition';
                const sectors = ['А', 'Б', 'В', 'Г', 'Е'];
                doors[s].name = `Переход ${sectors[Math.floor(Math.random()*sectors.length)]}-${Math.floor(Math.random()*99+1)}`;
                break;
            }
        }
    }
    
    if (hasMonster) {
        const slots = [1, 2, 3, 4, 5].sort(() => Math.random() - 0.5);
        for (let s of slots) {
            if (doors[s].type === 'empty') {
                doors[s].type = 'monster';
                const locations = ['Склад', 'Архив', 'Компрессорная', 'Щитовая', 'Венткамера'];
                doors[s].name = locations[Math.floor(Math.random() * locations.length)];
                break;
            }
        }
    }
    
    doors.forEach((door, idx) => {
        if (door.type === 'apartment') {
            // Различные типы комнат для разнообразия геймплея
            const rTypeRand = Math.random();
            let rType = 'standard';
            let rName = `Квартира ${Math.floor(Math.random() * 800 + 100)}`;
            
            if (rTypeRand < 0.15) {
                rType = 'armory';
                rName = `Пост Ликвидаторов №${Math.floor(Math.random() * 90 + 10)}`;
            } else if (rTypeRand < 0.30) {
                rType = 'contaminated';
                rName = `Квартира ${Math.floor(Math.random() * 800 + 100)} (РАДИАЦИЯ)`;
            } else if (rTypeRand < 0.40) {
                rType = 'nest';
                rName = `Техническая секция ${Math.floor(Math.random() * 90 + 10)} (ГНЕЗДО)`;
            }
            
            door.roomType = rType;
            door.name = rName;
        } else if (door.type === 'empty') {
            door.name = `Секция ${Math.floor(Math.random() * 90 + 10)}`;
        }
    });
    
    state.floorsData[floorNum] = { doors: doors };
    return doors;
}

function generateDoorsForFloor() {
    if (state.floorsData) {
        delete state.floorsData[state.floor];
    }
    getOrGenerateFloorDoors(state.floor);
}

function enterTransition() {
    if (state.location !== 'transition') return;
    initAudio();
    
    state.water = Math.max(0, state.water - 4);
    
    const skipFloors = 20 + Math.floor(Math.random() * 60);
    state.floor = Math.max(1, state.floor - skipFloors);
    
    playSoundDoor(true);
    logToConsole(`Шлюз герметично захлопнулся сзади. Грохот гидравлики уносит вас вниз.`, "sys");
    
    const holder = document.getElementById('canvas-holder');
    holder.style.transition = "opacity 0.5s ease";
    holder.style.opacity = "0.0";
    
    setTimeout(() => {
        logToConsole(`Спуск завершен. Вы вышли на этаже ${state.floor}. Дверь заблокирована сзади.`, "sys");
        
        if (state.floor < END_FLOOR) {
            triggerGameOver("ending_2");
            return;
        }
        
        state.location = 'hallway';
        state.focusedDoorIndex = null;
        generateDoorsForFloor();
        build3DScene();
        
        // Ставим игрока в начало нового коридора
        playerPos.set(0, 0, -1.0);
        playerYaw = 0;
        playerPitch = 0;
        
        updateHUD();
        holder.style.opacity = "1";
    }, 1000);
}

function toggleGasMask() {
    initAudio();
    state.maskOn = !state.maskOn;
    
    playSoundMask();
    if (state.maskOn) {
        logToConsole("Надет противогаз. Обзор ограничен, слышно ваше тяжелое дыхание.", "action");
        if (audioCtx) {
            const now = audioCtx.currentTime;
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            const filter = audioCtx.createBiquadFilter();
            filter.type = 'bandpass';
            filter.frequency.value = 250;
            osc.type = 'sine';
            osc.frequency.value = 80;
            gain.gain.setValueAtTime(0.01, now);
            gain.gain.linearRampToValueAtTime(0.12, now + 0.15);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
            osc.connect(filter);
            filter.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start(now);
            osc.stop(now + 0.7);
        }
    } else {
        logToConsole("Противогаз снят.", "action");
    }
    updateHUD();
}

function drinkWater() {
    initAudio();
    if (state.water >= MAX_WATER) {
        logToConsole("Вы не хотите пить.", "warn");
        return;
    }
    
    if (state.bottleWater <= 0) {
        logToConsole("Ваша фляга пуста! Найдите воду в жилых комнатах.", "warn");
        return;
    }
    
    const drinkAmount = Math.min(25, 100 - state.water);
    const actualTaken = Math.min(drinkAmount, state.bottleWater);
    
    if (actualTaken <= 0) {
        logToConsole("Вы утолили жажду полностью.", "warn");
        return;
    }
    
    state.bottleWater -= actualTaken;
    state.water += actualTaken;
    
    playSoundDrink();
    logToConsole(`Сделан глоток воды. В бутылке осталось: ${Math.round(state.bottleWater)}% содержимого.`, "action");
    
    updateHUD();
}


// --- ЛЕСТНИЧНЫЙ МОНСТР (3D FIGHT) ---

function triggerStairsMonster() {
    state.stairsMonsterActive = true;
    state.stairsMonsterTimeLeft = 4;
    
    playSoundMonsterHiss();
    logToConsole("[УГРОЗА] ИЗ ТЕМНОТЫ ЛЕСТНИЧНОЙ ШАХТЫ НА ВАС КИДАЕТСЯ МНОГОНОГАЯ ТВАРЬ!", "danger");
    logToConsole("У вас есть 4 секунды, чтобы выстрелить из пистолета и спугнуть её!", "danger");
    
    document.getElementById('btn-descend').setAttribute('disabled', 'true');
    document.getElementById('btn-descend').classList.add('btn-disabled');
    
    disableDoors(true);
    
    // Блокируем игрока на лестничной площадке лицом к чудовищу
    playerPos.set(0, -2.5, -48.25); // на площадке
    playerYaw = 0; // смотрим вверх на лестницу
    playerPitch = 0.2;
    
    build3DScene();
}

function shootPistol() {
    initAudio();
    if (state.ammo <= 0) {
        logToConsole("Сухой щелчок бойка... Патронов нет!", "danger");
        return;
    }
    
    state.ammo--;
    playSoundShot();
    
    // Вспышка в Three.js
    if (scene) {
        const flashLight = new THREE.PointLight(0xfff0c0, 4.0, 30);
        flashLight.position.set(camera.position.x, camera.position.y, camera.position.z - 1.0);
        scene.add(flashLight);
        setTimeout(() => scene.remove(flashLight), 60);
    }
    
    logToConsole("Грохот выстрела раскатился по бетонному колодцу этажа!", "action");
    
    // Pistol 3D Recoil and Muzzle Flash animation
    const pistol = camera.getObjectByName("pistol");
    if (pistol) {
        // Kickback and rotate up
        pistol.position.z += 0.05;
        pistol.rotation.x -= 0.12;
        
        // Spawn 3D muzzle flash cylinder/cone
        const flashGeo = new THREE.CylinderGeometry(0.01, 0.04, 0.06, 8);
        const flashMat = new THREE.MeshBasicMaterial({ color: 0xffaa44 });
        const flash = new THREE.Mesh(flashGeo, flashMat);
        flash.rotation.x = Math.PI / 2;
        flash.position.set(0, 0.01, -0.16); // tip of muzzle
        pistol.add(flash);
        setTimeout(() => pistol.remove(flash), 60);
        
        let recoilTime = 0;
        const anim = setInterval(() => {
            recoilTime += 16;
            if (recoilTime >= 150) {
                // Restore origin
                pistol.position.set(0.18, -0.16, -0.32);
                pistol.rotation.set(Math.PI / 80, -Math.PI / 20, 0);
                clearInterval(anim);
            } else {
                const t = recoilTime / 150;
                pistol.position.z = -0.32 + 0.05 * (1 - t);
                pistol.rotation.x = Math.PI / 80 - 0.12 * (1 - t);
            }
        }, 16);
    }
    
    // Проверка попадания в ползающую тварь
    if (hallwayCrawlerMesh) {
        raycaster.setFromCamera(new THREE.Vector2(0, 0), camera);
        const intersects = raycaster.intersectObjects(hallwayCrawlerMesh.children, true);
        if (intersects.length > 0) {
            crawlerHealth -= 1;
            if (crawlerHealth <= 0) {
                logToConsole("Точный выстрел разорвал тварь! По коридору разлетелись брызги слизи.", "loot");
                scene.remove(hallwayCrawlerMesh);
                hallwayCrawlerMesh = null;
            } else {
                logToConsole("Пуля пробила хитиновый панцирь твари! Она яростно завизжала.", "warn");
                playScaryScreechSound();
            }
            updateHUD();
            return;
        }
    }
    
    if (state.stairsMonsterActive) {
        state.stairsMonsterActive = false;
        logToConsole("Тварь издала пронзительный визг и скрылась в вентиляционном канале.", "sys");
        
        document.getElementById('btn-descend').removeAttribute('disabled');
        document.getElementById('btn-descend').classList.remove('btn-disabled');
        disableDoors(false);
        
        if (stairsMonsterMesh) {
            scene.remove(stairsMonsterMesh);
            stairsMonsterMesh = null;
        }
        
        // Генерируем 6 дверей и сбрасываем игрока в начало
        generateDoorsForFloor();
        build3DScene();
        
        playerPos.set(0, 0, -1.0);
        playerYaw = 0;
        playerPitch = 0;
    } else {
        logToConsole("Вы выстрелили впустую в бетонные перекрытия.", "warn");
    }
    
    updateHUD();
}


// --- УПРАВЛЕНИЕ ДИАЛОГАМИ И МОДАЛКАМИ ---

function openNotesModal(autoSelectId = null) {
    const modal = document.getElementById('notes-modal');
    modal.classList.remove('modal-hidden');
    
    if (autoSelectId !== null) {
        selectNoteInModal(autoSelectId);
    } else {
        document.getElementById('note-content-area').innerHTML = `<p class="select-note-prompt">Выберите найденную записку в списке слева для чтения.</p>`;
    }
}

function closeNotesModal() {
    document.getElementById('notes-modal').classList.add('modal-hidden');
}

function toggleBag() {
    const modal = document.getElementById('notes-modal');
    if (modal) {
        if (modal.classList.contains('modal-hidden')) {
            openNotesModal();
        } else {
            closeNotesModal();
        }
    }
}

function selectNoteInModal(id) {
    if (!state.notesCollected[id]) return;
    
    for (let i = 0; i < LORE_NOTES.length; i++) {
        const tab = document.getElementById(`note-tab-${i}`);
        if (tab) tab.classList.remove('btn-note-selected');
    }
    
    document.getElementById(`note-tab-${id}`).classList.add('btn-note-selected');
    
    const area = document.getElementById('note-content-area');
    const note = LORE_NOTES[id];
    
    area.innerHTML = `
        <div class="blood-stain blood-stain-1"></div>
        <div class="blood-stain blood-stain-2"></div>
        <div class="blood-stain blood-stain-3"></div>
        <h3 style="margin-bottom:15px; color:#6b0a0a; font-weight:bold;">${note.title}</h3>
        <p style="white-space:pre-line;">${note.content}</p>
    `;
}


// --- КОНЦОВКИ И GAME OVER ---

function triggerGameOver(reason) {
    if (gameInterval) clearInterval(gameInterval);
    stopSoundSiren();
    
    state.location = 'hallway';
    state.stairsMonsterActive = false;
    
    const screen = document.getElementById('gameover-screen');
    const title = document.getElementById('gameover-title');
    const story = document.getElementById('gameover-story');
    const badge = document.getElementById('ending-badge');
    
    screen.className = 'panel screen-active';
    document.getElementById('main-interface').className = 'screen-inactive';
    
    let text = "";
    let badgeText = "Смерть";
    let badgeClass = "badge-red";
    
    switch (reason) {
        case "dehydration":
            title.innerText = "ЛИКВИДИРОВАН";
            title.style.color = "#ff3333";
            text = `<p>Ваш организм не выдержал чудовищного обезвоживания.</p>
                    <p>Вы упали на холодные бетонные ступени лестничного марша ${state.floor} этажа.</p>
                    <p>Никто не придет на помощь. Ваше тело останется здесь, пока очередной Самосбор не растворит его в бурую слизь.</p>`;
            break;
            
        case "stairs_monster":
            title.innerText = "РАСТЕРЗАН";
            title.style.color = "#ff3333";
            text = `<p>Вы не успели среагировать.</p>
                    <p>Тварь обрушилась на вас сверху, ломая кости грудной клетки.</p>
                    <p>Острые жвалы пробили визор противогаза. Последнее, что вы слышали — чавканье биомассы, пожирающей вашу плоть.</p>`;
            break;
            
        case "opened_monster":
            title.innerText = "ОБНУЛЕН";
            title.style.color = "#ff3333";
            text = `<p>Вы открыли дверь без предварительной проверки.</p>
                    <p>Хищная тварь Самосбора устроила гнездо прямо за порогом.</p>
                    <p>Как только затворы разошлись, многорукая биомасса втащила вас внутрь темного помещения. Вы даже не успели закричать.</p>`;
            break;
            
        case "samosbor":
            title.innerText = "РАСТВОРЕН";
            title.style.color = "#ff3333";
            text = `<p>Вы остались в коридоре во время активной фазы Самосбора.</p>
                    <p>Токсичный туман разъел резиновые прокладки шлема и кожу в считанные секунды.</p>
                    <p>Ваше сознание угасло, пока ваши ткани плавились, стекая в вентиляционные решетки.</p>`;
            break;
            
        case "samosbor_gas":
            title.innerText = "ЗАДОХНУЛСЯ";
            title.style.color = "#ff3333";
            text = `<p>Вы спрятались в комнате, но пренебрегли средствами защиты.</p>
                    <p>Токсичный газ Самосбора просочился под гермодверь.</p>
                    <p>Без противогаза ваши легкие наполнились едкими парами, вызвав мгновенный спазм и удушье.</p>`;
            break;
            
        case "ending_1":
            title.innerText = "ПРОБУЖДЕНИЕ";
            title.style.color = "#00ff66";
            badgeText = "Истинная концовка";
            badgeClass = "badge-green";
            text = `<p>Собрав все записки, вы поняли истинную природу Гигахрущевки.</p>
                    <p>Когда туман Самосбора хлынул в коридор, вы не побежали прятаться. Вы замерли на месте, раскинув руки, и закрыли глаза.</p>
                    <p>Мир вокруг задрожал, бетонные стены начали осыпаться пикселями. Фиолетовый туман обнял вас...</p>
                    <p>...И вдруг вы сделали резкий вдох. Свежий, теплый воздух наполнил легкие.</p>
                    <p>Вы открыли глаза. Вы лежали на мягкой постели. В окно светило ослепительное, настоящее СОЛНЦЕ, а за окном шелестели зеленые листья деревьев. Это был сон. Долгий кошмар, из которого можно было выбраться только перестав бояться.</p>`;
            break;
            
        case "ending_2":
            title.innerText = "БЕЗВЫХОДНОСТЬ";
            title.style.color = "#ff3333";
            badgeText = "Тупиковая концовка";
            badgeClass = "badge-red";
            text = `<p>Вы преодолели долгий путь и спустились на первый этаж.</p>
                    <p>Но прохода наружу нет. Тяжелые шлюзы герметично заварены многовековыми слоями ржавчины.</p>
                    <p>Сзади с грохотом захлопнулась дверь лестничного марша. Механизмы заклинило. Задвижки не двигаются.</p>
                    <p>В этот момент сирены взвыли на максимальной громкости. Начался мощнейший Самосбор. Укрытий нет. Двери заблокированы. Вы заперты в бетонном мешке первого этажа один на один со смертельным туманом. Это конец пути.</p>`;
            break;
    }
    
    badge.innerText = badgeText;
    badge.className = badgeClass;
    story.innerHTML = text;

    // Show collected notes at the end of the game for story endings
    const notesContainer = document.getElementById('gameover-notes-container');
    const notesList = document.getElementById('gameover-notes-list');
    if (notesContainer && notesList) {
        if (reason === 'ending_1' || reason === 'ending_2') {
            notesContainer.style.display = 'block';
            notesList.innerHTML = '';
            
            LORE_NOTES.forEach((note, index) => {
                const collected = state.notesCollected[index];
                const noteDiv = document.createElement('div');
                noteDiv.className = `gameover-note-item ${collected ? 'collected' : 'missing'}`;
                
                if (collected) {
                    noteDiv.innerHTML = `
                        <div class="gameover-note-title">[✓] ${note.title}</div>
                        <div class="gameover-note-content">${note.content}</div>
                    `;
                } else {
                    noteDiv.innerHTML = `
                        <div class="gameover-note-title">[✗] ЗАПИСКА ${index + 1} (НЕ НАЙДЕНА)</div>
                        <div class="gameover-note-content" style="font-style: italic; color: #888;">Вы упустили этот фрагмент истории на этажах Хрущевки. Обыскивайте комнаты на этажах выше 700, чтобы найти её.</div>
                    `;
                }
                notesList.appendChild(noteDiv);
            });
        } else {
            notesContainer.style.display = 'none';
        }
    }
}


// --- ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ И БЛОКИРОВКИ ---

function disableAllControls(disable) {
    const buttons = [
        'btn-mask', 'btn-drink', 'btn-bag',
        'btn-listen', 'btn-open-door',
        'btn-search-room', 'btn-lock-room', 'btn-exit-room',
        'btn-enter-transition', 'btn-cancel-transition'
    ];
    
    buttons.forEach(id => {
        const btn = document.getElementById(id);
        if (!btn) return;
        
        if (disable) {
            btn.setAttribute('disabled', 'true');
            btn.classList.add('btn-disabled');
        } else {
            if (id === 'btn-listen' || id === 'btn-open-door') {
                if (state.focusedDoorIndex === null || state.location !== 'hallway') return;
            }
            if (id === 'btn-search-room' && state.focusedDoorIndex !== null) {
                const activeDoor = state.doors[state.focusedDoorIndex];
                if (activeDoor && activeDoor.searched) return;
            }
            btn.removeAttribute('disabled');
            btn.classList.remove('btn-disabled');
        }
    });
}

function disableDoors(disable) {
    // В FPS режиме двери кликаются физически, поэтому кнопки дверей в HUD теперь чисто информативные
}

// --- СИСТЕМНЫЙ ЖУРНАЛ (ЛОГ) ---

function logToConsole(message, type = "sys") {
    const feed = document.getElementById('log-feed');
    if (!feed) return;
    
    const entry = document.createElement('div');
    entry.className = 'log-entry';
    
    const time = new Date();
    const timeStr = `${String(time.getHours()).padStart(2, '0')}:${String(time.getMinutes()).padStart(2, '0')}:${String(time.getSeconds()).padStart(2, '0')}`;
    
    let colorClass = '';
    let prefix = '';
    switch (type) {
        case 'sys':
            colorClass = 'log-sys';
            prefix = '[СИС]';
            break;
        case 'action':
            colorClass = 'log-action';
            prefix = '[ДЕЙСТ]';
            break;
        case 'warn':
            colorClass = 'log-warn';
            prefix = '[ВНИМАНИЕ]';
            break;
        case 'danger':
            colorClass = 'log-danger';
            prefix = '[ОПАСНОСТЬ]';
            break;
        case 'loot':
            colorClass = 'log-loot';
            prefix = '[НАХОДКА]';
            break;
        default:
            colorClass = 'log-sys';
            prefix = '[СИС]';
    }
    
    entry.innerHTML = `<span class="log-time">${timeStr}</span> <span class="${colorClass}">${prefix}</span> ${message}`;
    feed.appendChild(entry);
    feed.scrollTop = feed.scrollHeight;
    
    // Ограничиваем количество записей в логе
    while (feed.children.length > 100) {
        feed.removeChild(feed.firstChild);
    }
}


// --- ОБНОВЛЕНИЕ HUD (ИНТЕРФЕЙСА СОСТОЯНИЯ) ---

function updateHUD() {
    const hudFloor = document.getElementById('hud-floor');
    const hudHealth = document.getElementById('hud-health');
    const hudWater = document.getElementById('hud-water');
    const hudAmmo = document.getElementById('hud-ammo');
    const hudFilter = document.getElementById('hud-filter');
    const hudStamina = document.getElementById('hud-stamina');
    const bagNotes = document.getElementById('bag-notes-count');
    
    if (hudFloor) hudFloor.innerText = state.floor;
    if (hudHealth) hudHealth.innerText = Math.round(state.health) + '%';
    if (hudWater) hudWater.innerText = Math.round(state.water) + '%';
    if (hudAmmo) hudAmmo.innerText = state.ammo;
    if (hudFilter) hudFilter.innerText = Math.round(state.filter) + '%';
    if (hudStamina) hudStamina.innerText = Math.round(state.stamina) + '%';
    if (bagNotes) bagNotes.innerText = state.notesCount;
    
    // Цветовые индикаторы критических значений
    const healthContainer = document.getElementById('hud-health-container');
    const waterContainer = document.getElementById('hud-water-container');
    const ammoContainer = document.getElementById('hud-ammo-container');
    const filterContainer = document.getElementById('hud-filter-container');
    const staminaContainer = document.getElementById('hud-stamina-container');
    
    if (healthContainer) {
        healthContainer.className = 'hud-item ' + (state.health <= 30 ? 'glow-red animate-blink' : 'glow-green');
    }
    if (waterContainer) {
        waterContainer.className = 'hud-item ' + (state.water <= 20 ? 'glow-red animate-blink' : 'glow-blue');
    }
    if (ammoContainer) {
        ammoContainer.className = 'hud-item ' + (state.ammo <= 4 ? 'glow-red' : 'glow-yellow');
    }
    if (filterContainer) {
        filterContainer.className = 'hud-item ' + (state.filter <= 20 ? 'glow-red animate-blink' : 'glow-purple');
    }
    if (staminaContainer) {
        staminaContainer.className = 'hud-item ' + (state.stamina <= 20 ? 'glow-red animate-blink' : 'glow-orange');
    }
    
    // Обновляем маску противогаза визуально
    const maskOverlay = document.getElementById('gasmask-overlay');
    if (maskOverlay) {
        maskOverlay.className = state.maskOn ? '' : 'overlay-hidden';
    }
    
    // Обновляем вид панелей взаимодействия
    const roomActions = document.getElementById('room-actions-bar');
    const transActions = document.getElementById('transition-actions-bar');
    const focusedHud = document.querySelector('.focused-object-hud');
    
    if (roomActions) {
        roomActions.className = (state.location === 'room') ? '' : 'room-actions-hidden';
    }
    if (transActions) {
        transActions.className = (state.location === 'transition') ? '' : 'room-actions-hidden';
    }
    if (focusedHud) {
        focusedHud.style.display = (state.location === 'hallway') ? 'block' : 'none';
    }
    
    // Обновляем кнопку запирания двери в комнате
    const btnLockRoom = document.getElementById('btn-lock-room');
    if (btnLockRoom) {
        if (state.samosborSafe) {
            btnLockRoom.innerText = "Отпереть дверь";
            btnLockRoom.classList.remove('glow-green');
            btnLockRoom.classList.add('glow-red');
        } else {
            btnLockRoom.innerText = "Запереть дверь";
            btnLockRoom.classList.remove('glow-red');
            btnLockRoom.classList.add('glow-green');
        }
    }
    
    // Обновляем кнопку противогаза
    const btnMask = document.getElementById('btn-mask');
    if (btnMask) {
        btnMask.innerHTML = state.maskOn
            ? 'Снять противогаз'
            : 'Надеть противогаз';
    }
    
    updateInventoryUI();
}


// --- ГЛАВНЫЙ ИГРОВОЙ ЦИКЛ (TICK КАЖДУЮ СЕКУНДУ) ---

let gameInterval = null;

function startGameLoop() {
    // Очищаем предыдущий цикл, если он был
    if (gameInterval) clearInterval(gameInterval);
    
    gameInterval = setInterval(() => {
        // Пропускаем тик, если игра на паузе или завершена
        if (isGamePaused) return;
        const goScreen = document.getElementById('gameover-screen');
        if (goScreen && goScreen.classList.contains('screen-active')) return;
        
        // 1. РАСХОД ВОДЫ (ЕСТЕСТВЕННАЯ ДЕГИДРАТАЦИЯ)
        state.water = Math.max(0, state.water - 0.15); // медленнее (было 0.4)
        
        // 2. РАСХОД ФИЛЬТРА ПРОТИВОГАЗА / ЗАРАЖЕНИЕ В ЗАРАЖЕННОЙ КВАРТИРЕ И ПРИ УТЕЧКЕ
        const currentDoor = state.focusedDoorIndex !== null ? state.doors[state.focusedDoorIndex] : null;
        const isContaminated = (state.location === 'room' && currentDoor && currentDoor.roomType === 'contaminated');
        const isGasLeakHallway = (state.location === 'hallway' && state.floorEvent === 'gas_leak');
        
        if ((isContaminated || isGasLeakHallway) && !state.maskOn) {
            state.health = Math.max(0, state.health - (isContaminated ? 5 : 4));
            logToConsole(isContaminated ? "Вы вдыхаете зараженный воздух! Срочно наденьте противогаз (клавиша T)!" : "Вы задыхаетесь в коридоре с утечкой газа! Наденьте противогаз (клавиша T)!", "danger");
            playSoundDamage();
            if (state.health <= 0) {
                triggerGameOver("samosbor_gas");
                return;
            }
        }
        
        if (state.maskOn) {
            let decay = 0.6;
            if (isContaminated) decay = 1.8;
            else if (isGasLeakHallway) decay = 1.1;
            
            state.filter = Math.max(0, state.filter - decay);
            if (state.filter <= 0) {
                logToConsole("Фильтр противогаза полностью забился! Маска бесполезна!", "danger");
                state.maskOn = false;
                updateHUD();
            }
        }
        
        // 3. СМЕРТЬ ОТ ОБЕЗВОЖИВАНИЯ
        if (state.water <= 0) {
            state.health -= 2;
            if (state.health <= 0) {
                state.health = 0;
                triggerGameOver("dehydration");
                return;
            }
        }
        
        // 4. ТАЙМЕР САМОСБОРА
        if (state.samosborStatus === 'normal') {
            state.samosborTimeLeft -= 1;
            
            if (state.samosborTimeLeft <= 0) {
                // Переходим к предупреждению
                state.samosborStatus = 'warning';
                state.samosborCountdown = 20;
                logToConsole("[!] ВНИМАНИЕ: Датчики зафиксировали приближение волны Самосбора!", "danger");
                logToConsole("[!] До активной фазы: ~20 секунд. Найдите укрытие!", "danger");
                startSoundSiren();
                
                // Оверлей предупреждения
                const overlay = document.getElementById('samosbor-overlay');
                if (overlay) overlay.className = 'samosbor-warning';
            }
        } else if (state.samosborStatus === 'warning') {
            state.samosborCountdown -= 1;
            
            if (state.samosborCountdown <= 0) {
                // Активная фаза
                state.samosborStatus = 'active';
                state.samosborActiveDuration = 30;
                logToConsole("[!!!] САМОСБОР НАЧАЛСЯ! ТОКСИЧНЫЙ ТУМАН ЗАПОЛНЯЕТ СЕКТОРЫ!", "danger");
                
                const overlay = document.getElementById('samosbor-overlay');
                if (overlay) overlay.className = 'samosbor-active';
            }
        } else if (state.samosborStatus === 'active') {
            state.samosborActiveDuration -= 1;
            
            // Наносим урон, если игрок в коридоре без маски
            if (state.location === 'hallway') {
                if (!state.maskOn) {
                    state.health -= 15;
                    logToConsole("Токсичный туман разъедает ваши легкие!", "danger");
                } else {
                    state.health -= 2;
                    logToConsole("Противогаз защищает от газа, но химикаты разъедают костюм...", "warn");
                }
            } else if (state.location === 'room') {
                if (!state.samosborSafe) {
                    // Незаблокированная комната
                    if (!state.maskOn) {
                        state.health -= 8;
                        logToConsole("Газ проникает под дверь! Вы не заблокировали гермозатвор!", "danger");
                    } else {
                        state.health -= 1;
                    }
                } else {
                    // Заблокированная комната - безопасно
                    logToConsole("Гермозатвор держит. Вы слышите грохот за дверью.", "sys");
                }
            }
            
            // Проверяем смерть
            if (state.health <= 0) {
                state.health = 0;
                if (state.location === 'room' && !state.maskOn) {
                    triggerGameOver("samosbor_gas");
                } else {
                    triggerGameOver("samosbor");
                }
                return;
            }
            
            // Конец Самосбора
            if (state.samosborActiveDuration <= 0) {
                state.samosborStatus = 'normal';
                state.samosborTimeLeft = 60 + Math.floor(Math.random() * 60);
                logToConsole("Датчики показывают нормализацию среды. Самосбор завершился.", "sys");
                stopSoundSiren();
                
                const overlay = document.getElementById('samosbor-overlay');
                if (overlay) overlay.className = 'overlay-hidden';
            }
        }
        
        // 5. ТАЙМЕР МОНСТРА НА ЛЕСТНИЦЕ
        if (state.stairsMonsterActive) {
            state.stairsMonsterTimeLeft -= 1;
            if (state.stairsMonsterTimeLeft <= 0) {
                // Не успели выстрелить — смерть
                triggerGameOver("stairs_monster");
                return;
            }
        }
        
        updateHUD();
        
    }, 1000); // Каждую секунду
}


// --- ИНИЦИАЛИЗАЦИЯ И НАЗНАЧЕНИЕ СОБЫТИЙ ---

function restartGame() {
    isGamePaused = false;
    loadKeyBindings();
    
    state = {
        floor: START_FLOOR,
        spawnFloor: START_FLOOR,
        health: MAX_HEALTH,
        water: MAX_WATER,
        ammo: MAX_AMMO,
        filter: MAX_FILTER,
        maskOn: false,
        notesCollected: [false, false, false, false, false, false],
        notesCount: 0,
        samosborStatus: 'normal',
        samosborTimeLeft: 90 + Math.floor(Math.random() * 30),
        samosborCountdown: 20,
        samosborActiveDuration: 30,
        floorsData: {},
        get doors() {
            if (!this.floorsData) {
                this.floorsData = {};
            }
            if (!this.floorsData[this.floor]) {
                getOrGenerateFloorDoors(this.floor);
            }
            return this.floorsData[this.floor].doors;
        },
        set doors(val) {
            if (!this.floorsData) {
                this.floorsData = {};
            }
            this.floorsData[this.floor] = { doors: val };
        },
        focusedDoorIndex: null,
        focusedStairsDoor: false,
        location: 'hallway',
        samosborSafe: false,
        searchProgress: 0,
        isSearching: false,
        stairsMonsterActive: false,
        stairsMonsterTimeLeft: 0,
        audioInit: state.audioInit,
        bottleWater: 100,
        stamina: 100,
        hasHackerTool: false,
        batteries: 0,
        stairsDoors: {},
        keyBindings: state.keyBindings,
        floorEvent: null
    };
    
    // Сброс динамических событий и монстров
    hallwayCrawlerMesh = null;
    deadLiquidatorMesh = null;
    ghostMesh = null;
    deadLiquidatorSearched = false;
    hackActive = false;
    lastBuiltFloor = null;
    
    lastFocusedDoorIndex = undefined;
    lastFocusedStairsDoor = false;
    lastFocusedCorpse = false;
    window.ghostWhispered = false;
    
    // Запуск FPS положения ликвидатора
    playerPos.set(0, 0, -1.0); // Стоим в начале коридора
    playerYaw = 0; // Смотрим строго прямо по коридору
    playerPitch = 0;
    
    for (let i = 0; i < LORE_NOTES.length; i++) {
        const tab = document.getElementById(`note-tab-${i}`);
        if (tab) {
            tab.className = 'btn-note-item btn-note-locked';
            tab.innerText = `Записка ${i + 1}`;
        }
    }
    
    const feed = document.getElementById('log-feed');
    if (feed) feed.innerHTML = '';
    
    document.getElementById('gasmask-overlay').className = 'overlay-hidden';
    document.getElementById('samosbor-overlay').className = 'overlay-hidden';
    document.getElementById('jumpscare-overlay').className = 'overlay-hidden';
    document.getElementById('listening-indicator').className = 'overlay-hidden';
    document.getElementById('room-overlay').className = 'overlay-hidden';
    
    const container = document.getElementById('game-container');
    container.className = '';
    
    document.getElementById('gameover-screen').className = 'panel screen-inactive';
    document.getElementById('splash-screen').className = 'panel screen-inactive';
    document.getElementById('main-interface').className = '';
    
    logToConsole("Начало новой смены ликвидации. Спуск с 1324 этажа...", "sys");
    
    // Генерируем 6 дверей по шансам пользователя
    generateDoorsForFloor();
    
    // Инициализация 3D
    init3D();
    
    updateHUD();
    startGameLoop();
}

// --- АУДИОДВИЖОК (WEB AUDIO API SYNTHESIZER) ---
let audioCtx = null;
let bgmSource = null;
let isAudioInit = false;

let atmosphereOsc = null;
let atmosphereGain = null;
let alarmInterval = null;
let heartbeatInterval = null;

function initAudio() {
    if (state.audioInit) return;
    try {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        audioCtx = new AudioContextClass();
        state.audioInit = true;
        
        // Запуск фонового гула и пульса
        startAtmosphere();
        startHeartbeatLoop();
        logToConsole("Аудиосистема шлема ликвидатора инициализирована.", "sys");
    } catch (e) {
        console.error("Не удалось запустить Web Audio API: ", e);
    }
}

function startAtmosphere() {
    if (!audioCtx) return;
    try {
        atmosphereOsc = audioCtx.createOscillator();
        atmosphereGain = audioCtx.createGain();
        const filter = audioCtx.createBiquadFilter();
        
        atmosphereOsc.type = 'sawtooth';
        atmosphereOsc.frequency.value = 55; // Низкая нота Ля (A1)
        
        filter.type = 'lowpass';
        filter.frequency.value = 80;
        
        atmosphereGain.gain.value = 0.05;
        
        atmosphereOsc.connect(filter);
        filter.connect(atmosphereGain);
        atmosphereGain.connect(audioCtx.destination);
        
        atmosphereOsc.start();
    } catch (e) {
        console.error("Failed to start atmosphere sound:", e);
    }
}

function startHeartbeatLoop() {
    if (!audioCtx) return;
    heartbeatInterval = setInterval(() => {
        // Удары сердца: двойной тук
        playThump(60, 0.15);
        setTimeout(() => {
            playThump(55, 0.15);
        }, 250);
    }, 1200);
}

function playThump(freq, duration) {
    if (!audioCtx) return;
    try {
        const now = audioCtx.currentTime;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);
        osc.frequency.exponentialRampToValueAtTime(10, now + duration);
        
        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
        
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        
        osc.start(now);
        osc.stop(now + duration);
    } catch (e) {}
}

function playSoundMonsterHiss() {
    if (!audioCtx) return;
    try {
        const now = audioCtx.currentTime;
        const bufferSize = audioCtx.sampleRate * 1.5;
        const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }
        const noise = audioCtx.createBufferSource();
        noise.buffer = buffer;
        
        const filter = audioCtx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(1000, now);
        filter.frequency.exponentialRampToValueAtTime(120, now + 1.5);
        
        const gain = audioCtx.createGain();
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 1.5);
        
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(audioCtx.destination);
        
        noise.start(now);
        noise.stop(now + 1.5);
    } catch (e) {}
}

function playSoundDoor(isSlam = false) {
    if (!audioCtx) return;
    try {
        const now = audioCtx.currentTime;
        const duration = isSlam ? 0.6 : 1.2;
        
        // Шум трения гермозатвора
        const bufferSize = audioCtx.sampleRate * duration;
        const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }
        const noise = audioCtx.createBufferSource();
        noise.buffer = buffer;
        
        const filter = audioCtx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(isSlam ? 180 : 320, now);
        filter.Q.value = 2.0;
        
        const gain = audioCtx.createGain();
        gain.gain.setValueAtTime(isSlam ? 0.22 : 0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
        
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(audioCtx.destination);
        
        noise.start(now);
        noise.stop(now + duration);
        
        if (isSlam) {
            // Низкий удар при закрытии гермодвери
            const osc = audioCtx.createOscillator();
            const oscGain = audioCtx.createGain();

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(80, now);
            osc.frequency.linearRampToValueAtTime(20, now + 0.4);
            
            oscGain.gain.setValueAtTime(0.3, now);
            oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
            
            osc.connect(oscGain);
            oscGain.connect(audioCtx.destination);
            osc.start(now);
            osc.stop(now + 0.4);
        }
    } catch (e) {}
}



function playSoundLoot() {
    if (!audioCtx) return;
    try {
        const now = audioCtx.currentTime;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.setValueAtTime(880, now + 0.08);
        
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.linearRampToValueAtTime(0.08, now + 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
        
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        
        osc.start(now);
        osc.stop(now + 0.25);
    } catch (e) {}
}

function playSoundMask() {
    if (!audioCtx) return;
    try {
        const now = audioCtx.currentTime;
        const bufferSize = audioCtx.sampleRate * 0.8;
        const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }
        const noise = audioCtx.createBufferSource();
        noise.buffer = buffer;
        
        const filter = audioCtx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(200, now);
        filter.frequency.linearRampToValueAtTime(600, now + 0.4);
        filter.frequency.linearRampToValueAtTime(150, now + 0.8);
        
        const gain = audioCtx.createGain();
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
        
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(audioCtx.destination);
        
        noise.start(now);
        noise.stop(now + 0.8);
    } catch (e) {}
}

function playSoundDrink() {
    if (!audioCtx) return;
    try {
        const now = audioCtx.currentTime;
        for (let i = 0; i < 3; i++) {
            const time = now + i * 0.22;
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            
            osc.type = 'sine';
            osc.frequency.setValueAtTime(220, time);
            osc.frequency.exponentialRampToValueAtTime(120, time + 0.12);
            
            gain.gain.setValueAtTime(0.12, time);
            gain.gain.exponentialRampToValueAtTime(0.001, time + 0.12);
            
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            
            osc.start(time);
            osc.stop(time + 0.18);
        }
    } catch (e) {}
}

function playSoundShot() {
    if (!audioCtx) return;
    try {
        const now = audioCtx.currentTime;
        
        // Шум пороховых газов
        const bufferSize = audioCtx.sampleRate * 0.5;
        const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }
        const noise = audioCtx.createBufferSource();
        noise.buffer = buffer;
        
        const filter = audioCtx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 1200;
        
        const gain = audioCtx.createGain();
        gain.gain.setValueAtTime(0.8, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(audioCtx.destination);
        
        noise.start(now);
        noise.stop(now + 0.5);
        
        // Низкий хлопок выстрела
        const osc = audioCtx.createOscillator();
        const oscGain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(140, now);
        osc.frequency.linearRampToValueAtTime(30, now + 0.25);
        
        oscGain.gain.setValueAtTime(0.6, now);
        oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        
        osc.connect(oscGain);
        oscGain.connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.35);
    } catch (e) {}
}

function playSoundStep() {
    if (!audioCtx) return;
    try {
        const now = audioCtx.currentTime;
        const duration = 0.16;
        
        // Low frequency thump (boot impact)
        const osc = audioCtx.createOscillator();
        const oscGain = audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(90, now);
        osc.frequency.exponentialRampToValueAtTime(30, now + duration);
        oscGain.gain.setValueAtTime(0.12, now);
        oscGain.gain.exponentialRampToValueAtTime(0.001, now + duration);
        osc.connect(oscGain);
        oscGain.connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + duration);
        
        // High frequency friction (rubber on concrete)
        const bufferSize = audioCtx.sampleRate * 0.08;
        const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }
        const noise = audioCtx.createBufferSource();
        noise.buffer = buffer;
        
        const filter = audioCtx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(400, now);
        filter.Q.value = 1.0;
        
        const noiseGain = audioCtx.createGain();
        noiseGain.gain.setValueAtTime(0.015, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        
        noise.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(audioCtx.destination);
        
        noise.start(now);
        noise.stop(now + 0.08);
    } catch (e) {}
}

function startSoundSiren() {
    if (!audioCtx) return;
    try {
        stopSoundSiren();
        
        const sirenFunc = () => {
            if (!audioCtx || !state.samosborStatus || state.samosborStatus === 'normal') return;
            const now = audioCtx.currentTime;
            const osc1 = audioCtx.createOscillator();
            const osc2 = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();
            
            osc1.type = 'sawtooth';
            osc2.type = 'sine';
            
            osc1.frequency.setValueAtTime(280, now);
            osc1.frequency.linearRampToValueAtTime(380, now + 0.7);
            osc1.frequency.linearRampToValueAtTime(280, now + 1.4);
            
            osc2.frequency.setValueAtTime(285, now);
            osc2.frequency.linearRampToValueAtTime(385, now + 0.7);
            osc2.frequency.linearRampToValueAtTime(285, now + 1.4);
            
            gainNode.gain.setValueAtTime(0.01, now);
            gainNode.gain.linearRampToValueAtTime(0.12, now + 0.2);
            gainNode.gain.linearRampToValueAtTime(0.12, now + 1.2);
            gainNode.gain.exponentialRampToValueAtTime(0.001, now + 1.5);
            
            osc1.connect(gainNode);
            osc2.connect(gainNode);
            gainNode.connect(audioCtx.destination);
            
            osc1.start(now);
            osc2.start(now);
            osc1.stop(now + 1.5);
            osc2.stop(now + 1.5);
        };
        
        sirenFunc();
        alarmInterval = setInterval(sirenFunc, 1600);
    } catch (e) {}
}

function stopSoundSiren() {
    if (alarmInterval) {
        clearInterval(alarmInterval);
        alarmInterval = null;
    }
}

// --- ИНТЕГРАЦИЯ YANDEX GAMES SDK ---
let ysdk = null;

function initYandexSDK() {
    console.log("Initializing Yandex Games SDK...");
    const loadingBar = document.getElementById('loading-bar');
    const loadingText = document.getElementById('loading-text');
    const btnStart = document.getElementById('btn-start-game');
    
    // Плавная анимация загрузки (фейковая загрузка до 90% пока инициализируется SDK)
    let progress = 0;
    const progressInterval = setInterval(() => {
        if (progress < 90) {
            progress += 5 + Math.random() * 5;
            if (progress > 90) progress = 90;
            if (loadingBar) loadingBar.style.width = `${progress}%`;
        }
    }, 100);
    
    // Функция успешного завершения инициализации
    const completeInitialization = (modeText) => {
        clearInterval(progressInterval);
        if (loadingBar) loadingBar.style.width = '100%';
        if (loadingText) loadingText.innerText = modeText;
        
        setTimeout(() => {
            const container = document.getElementById('loading-bar-container');
            if (container) {
                container.style.transition = 'opacity 0.5s ease';
                container.style.opacity = '0';
                setTimeout(() => {
                    container.style.display = 'none';
                }, 500);
            }
            if (btnStart) {
                btnStart.removeAttribute('disabled');
                btnStart.classList.remove('btn-disabled');
            }
        }, 600);
    };

    // Таймаут безопасности 3 секунды
    let sdkTimeout = setTimeout(() => {
        console.warn("Yandex Games SDK load timed out. Running in Offline Demo Mode.");
        completeInitialization("РЕЖИМ: ОФФЛАЙН (ДЕМО)");
    }, 3000);

    if (typeof YaGames !== 'undefined') {
        YaGames.init()
            .then(initializedSdk => {
                clearTimeout(sdkTimeout);
                ysdk = initializedSdk;
                console.log("Yandex Games SDK successfully initialized.");
                
                // Сообщаем Yandex SDK, что игра готова к старту
                if (ysdk.features && ysdk.features.LoadingProgress) {
                    ysdk.features.LoadingProgress.ready();
                }
                
                completeInitialization("SDK ГОТОВ");
            })
            .catch(err => {
                clearTimeout(sdkTimeout);
                console.error("Yandex Games SDK init failed:", err);
                completeInitialization("РЕЖИМ: ДЕМО");
            });
    } else {
        clearTimeout(sdkTimeout);
        console.warn("YaGames global object is undefined. Running in Demo Mode.");
        completeInitialization("РЕЖИМ: ДЕМО");
    }
}

function showInterstitialAd() {}

document.addEventListener('DOMContentLoaded', () => {
    loadKeyBindings();
    initYandexSDK();
    
    document.getElementById('btn-start-game').addEventListener('click', () => {
        initAudio();
        restartGame();
    });
    
    // Start menu additional buttons
    document.getElementById('btn-open-rebind').addEventListener('click', () => {
        populateRebindList();
        document.getElementById('rebind-modal').classList.remove('modal-hidden');
    });
    
    document.getElementById('btn-open-about').addEventListener('click', () => {
        document.getElementById('about-modal').classList.remove('modal-hidden');
    });
    
    document.getElementById('about-close').addEventListener('click', () => {
        document.getElementById('about-modal').classList.add('modal-hidden');
    });
    
    document.getElementById('rebind-close').addEventListener('click', () => {
        document.getElementById('rebind-modal').classList.add('modal-hidden');
    });
    
    document.getElementById('btn-rebind-reset').addEventListener('click', () => {
        state.keyBindings = Object.assign({}, DEFAULT_KEY_BINDINGS);
        populateRebindList();
    });
    
    document.getElementById('btn-rebind-save').addEventListener('click', () => {
        saveKeyBindings();
        document.getElementById('rebind-modal').classList.add('modal-hidden');
        logToConsole("Настройки управления сохранены.", "sys");
    });
    
    // Pause menu buttons
    document.getElementById('btn-resume-game').addEventListener('click', () => {
        togglePauseGame(false);
    });
    
    document.getElementById('btn-pause-rebind').addEventListener('click', () => {
        populateRebindList();
        document.getElementById('rebind-modal').classList.remove('modal-hidden');
    });
    
    document.getElementById('btn-exit-menu').addEventListener('click', () => {
        togglePauseGame(false);
        if (gameInterval) clearInterval(gameInterval);
        stopSoundSiren();
        
        document.getElementById('main-interface').className = 'screen-inactive';
        document.getElementById('splash-screen').className = 'panel screen-active';
        
        const holder = document.getElementById('canvas-holder');
        if (holder) holder.innerHTML = '';
        
        isGamePaused = false;
    });
    
    document.getElementById('btn-restart').addEventListener('click', restartGame);
    document.getElementById('btn-mask').addEventListener('click', toggleGasMask);
    document.getElementById('btn-drink').addEventListener('click', drinkWater);
    document.getElementById('btn-bag').addEventListener('click', () => openNotesModal());
    
    document.getElementById('btn-listen').addEventListener('click', listenToFocused);
    document.getElementById('btn-open-door').addEventListener('click', interactWithFocused);
    
    document.getElementById('btn-search-room').addEventListener('click', searchRoom);
    document.getElementById('btn-lock-room').addEventListener('click', lockRoom);
    document.getElementById('btn-exit-room').addEventListener('click', exitRoom);
    
    document.getElementById('btn-enter-transition').addEventListener('click', enterTransition);
    document.getElementById('btn-cancel-transition').addEventListener('click', exitRoom);
    
    document.getElementById('modal-close').addEventListener('click', closeNotesModal);
    
    for (let i = 0; i < LORE_NOTES.length; i++) {
        document.getElementById(`note-tab-${i}`).addEventListener('click', () => selectNoteInModal(i));
    }
    
    // Hacking controls
    document.getElementById('hack-tuner-slider').addEventListener('input', updateHackSliderTuner);
    document.getElementById('btn-hack-submit').addEventListener('click', submitHackTuning);
    document.getElementById('btn-hack-cancel').addEventListener('click', () => {
        document.getElementById('hack-modal').classList.add('modal-hidden');
        hackActive = false;
        logToConsole("Взлом прерван игроком.", "warn");
    });
    
    // 3D FPS клавиатура и мышь оглядка
    window.addEventListener('keydown', (e) => {
        if (window.devConsoleOpen) return;
        
        if (hackActive) {
            const pauseKey = state.keyBindings['Pause'] || 'Escape';
            if (e.code === pauseKey) {
                e.preventDefault();
                document.getElementById('hack-modal').classList.add('modal-hidden');
                hackActive = false;
                logToConsole("Взлом прерван игроком.", "warn");
            }
            return;
        }
        
        // Intercept for rebinding
        if (rebindingAction) {
            e.preventDefault();
            e.stopPropagation();
            state.keyBindings[rebindingAction] = e.code;
            const btn = document.querySelector(`.rebind-btn[data-action="${rebindingAction}"]`);
            if (btn) {
                btn.innerText = e.code;
                btn.classList.remove('waiting');
            }
            rebindingAction = null;
            return;
        }
        
        keys[e.code] = true;
        
        // Pause key toggle
        const pauseKey = state.keyBindings['Pause'] || 'Escape';
        if (e.code === pauseKey) {
            e.preventDefault();
            togglePauseGame();
            return;
        }
        
        if (isGamePaused) return;
        
        // Быстрые клавиши взаимодействия
        const interactKey = state.keyBindings['Interact'] || 'KeyR';
        const searchKey = state.keyBindings['Search'] || 'KeyZ';
        const maskKey = state.keyBindings['GasMask'] || 'KeyT';
        const waterKey = state.keyBindings['Water'] || 'KeyQ';
        const bagKey = state.keyBindings['Bag'] || 'KeyG';
        const flashKey = state.keyBindings['Flashlight'] || 'KeyF';
        const listenKey = state.keyBindings['Listen'] || 'KeyE';
        const hackerKey = state.keyBindings['HackerTool'] || 'KeyB';
        
        if (e.code === interactKey) {
            if (state.location === 'hallway') {
                interactWithFocused();
            } else if (state.location === 'room') {
                lockRoom();
            }
        }
        if (e.code === searchKey) {
            if (state.location === 'room' && !state.isSearching) {
                const layout = DOOR_LAYOUT[state.focusedDoorIndex];
                if (layout) {
                    const dirX = layout.x < 0 ? -1 : 1;
                    const cabPos = new THREE.Vector3(layout.x + (5.5 * dirX), 0, layout.z - 2.0);
                    const tablePos = new THREE.Vector3(layout.x + (3.7 * dirX), 0, layout.z);
                    
                    if (playerPos.distanceTo(cabPos) < 3.5 || playerPos.distanceTo(tablePos) < 3.0) {
                        searchRoom();
                    } else {
                        logToConsole("Подойдите ближе к мебели.", "warn");
                    }
                }
            }
        }
        if (e.code === maskKey) {
            toggleGasMask();
        }
        if (e.code === waterKey) {
            drinkWater();
        }
        if (e.code === bagKey) {
            toggleBag();
        }
        if (e.code === flashKey) {
            toggleFlashlight();
        }
        if (e.code === listenKey) {
            listenToFocused();
        }
        if (e.code === hackerKey) {
            useHackerTool();
        }
    });
    
    window.addEventListener('keyup', (e) => {
        if (window.devConsoleOpen) return;
        keys[e.code] = false;
    });
    
    // Выстрел на левую кнопку мыши (ЛКМ) в 3D режиме
    window.addEventListener('mousedown', (e) => {
        if (window.devConsoleOpen || isGamePaused || hackActive) return;
        if (document.pointerLockElement === canvasHolder || pointerLocked) {
            if (e.button === 0 && !state.isSearching) {
                shootPistol();
            }
        }
    });
    
    // Pointer Lock для оглядывания мышей в 3D
    const canvasHolder = document.getElementById('canvas-holder');
    canvasHolder.addEventListener('click', () => {
        if (window.devConsoleOpen || isGamePaused || hackActive) return;
        if (!state.isSearching && state.location !== 'notes') {
            canvasHolder.requestPointerLock = canvasHolder.requestPointerLock || canvasHolder.mozRequestPointerLock;
            canvasHolder.requestPointerLock();
        }
    });
    
    document.addEventListener('pointerlockchange', () => {
        pointerLocked = (document.pointerLockElement === canvasHolder);
    });
    
    document.addEventListener('mousemove', (e) => {
        if (hackActive) return;
        if (pointerLocked && !isGamePaused) {
            playerYaw -= e.movementX * sensitivity;
            playerPitch -= e.movementY * sensitivity;
            playerPitch = Math.max(-Math.PI / 2.5, Math.min(Math.PI / 2.5, playerPitch));
        }
    });
    
    // Запасной огляд перетаскиванием мыши / свайпом (для мобилок и ПК без лока)
    let isDragging = false;
    canvasHolder.addEventListener('mousedown', (e) => {
        if (hackActive) return;
        if (!pointerLocked && !isGamePaused) isDragging = true;
    });
    window.addEventListener('mouseup', () => {
        isDragging = false;
    });
    canvasHolder.addEventListener('mousemove', (e) => {
        if (hackActive) return;
        if (isDragging && !pointerLocked && !isGamePaused) {
            playerYaw -= e.movementX * sensitivity * 1.5;
            playerPitch -= e.movementY * sensitivity * 1.5;
            playerPitch = Math.max(-Math.PI / 2.5, Math.min(Math.PI / 2.5, playerPitch));
        }
    });
    
    // Мобильные тач-свайпы для оглядки
    canvasHolder.addEventListener('touchstart', (e) => {
        if (isGamePaused || hackActive) return;
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    });
    canvasHolder.addEventListener('touchmove', (e) => {
        if (isGamePaused || hackActive) return;
        e.preventDefault();
        const dx = e.touches[0].clientX - touchStartX;
        const dy = e.touches[0].clientY - touchStartY;
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        
        playerYaw -= dx * 0.008;
        playerPitch -= dy * 0.008;
        playerPitch = Math.max(-Math.PI / 2.5, Math.min(Math.PI / 2.5, playerPitch));
    }, { passive: false });
    
    // Назначение кнопок виртуального D-pad движения
    const setupMobileMoveBtn = (id, flagSetter) => {
        const btn = document.getElementById(id);
        if (!btn) return;
        btn.addEventListener('touchstart', (e) => { e.preventDefault(); flagSetter(true); });
        btn.addEventListener('touchend', (e) => { e.preventDefault(); flagSetter(false); });
        // Для мышки
        btn.addEventListener('mousedown', () => flagSetter(true));
        btn.addEventListener('mouseup', () => flagSetter(false));
        btn.addEventListener('mouseleave', () => flagSetter(false));
    };
    
    setupMobileMoveBtn('btn-v-up', (val) => mvUp = val);
    setupMobileMoveBtn('btn-v-down', (val) => mvDown = val);
    setupMobileMoveBtn('btn-v-left', (val) => mvLeft = val);
    setupMobileMoveBtn('btn-v-right', (val) => mvRight = val);
    
    // Мобильные кнопки взаимодействий
    document.getElementById('btn-v-listen').addEventListener('click', listenToFocused);
    document.getElementById('btn-v-open').addEventListener('click', interactWithFocused);
    document.getElementById('btn-v-shoot').addEventListener('click', shootPistol);
    document.getElementById('btn-v-flash').addEventListener('click', toggleFlashlight);
});

function toggleFlashlight() {
    if (playerFlashlight) {
        playerFlashlight.intensity = playerFlashlight.intensity > 0 ? 0 : 2.5;
        playSoundSwitch();
    }
}

// Клик поstairs на Истинную концовку
const originalDescend = triggerFloorDescent;
document.getElementById('btn-descend').removeEventListener('click', triggerFloorDescent);
// В FPS режиме кнопка HUD "Спуститься на этаж ниже" активна только при собранных записках во время Самосбора для истинной концовки!
// В остальных случаях игрок должен идти на лестницу физически.
setInterval(() => {
    const btnDescend = document.getElementById('btn-descend');
    if (!btnDescend) return;
    
    if (state.notesCount === 6 && (state.samosborStatus === 'warning' || state.samosborStatus === 'active') && state.location === 'hallway') {
        btnDescend.innerHTML = 'Застыть на месте и ждать';
        btnDescend.className = "btn btn-action glow-blue animate-blink";
        btnDescend.removeAttribute('disabled');
        btnDescend.classList.remove('btn-disabled');
    } else {
        // Выключаем ее, так как идти надо ножками
        btnDescend.innerHTML = 'Идите на лестницу в конце коридора';
        btnDescend.className = "btn btn-action btn-disabled";
        btnDescend.setAttribute('disabled', 'true');
    }
}, 500);

document.getElementById('btn-descend').addEventListener('click', () => {
    if (state.notesCount === 6 && (state.samosborStatus === 'warning' || state.samosborStatus === 'active')) {
        disableAllControls(true);
        logToConsole("Вы закрыли глаза, расслабились и решили остаться на месте...", "danger");
        
        let tColor = new THREE.Color(0xffffff);
        let tFog = new THREE.FogExp2(0xffffff, 0.05);
        scene.fog = tFog;
        scene.background = tColor;
        renderer.setClearColor(0xffffff);
        
        let flashProgress = 0.05;
        const flashAnim = setInterval(() => {
            flashProgress += 0.05;
            scene.fog.density = flashProgress;
            if (flashProgress >= 1.0) {
                clearInterval(flashAnim);
                triggerGameOver("ending_1");
            }
        }, 100);
        
        if (audioCtx) {
            const now = audioCtx.currentTime;
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(220, now);
            osc.frequency.exponentialRampToValueAtTime(880, now + 2.5);
            gain.gain.setValueAtTime(0.01, now);
            gain.gain.linearRampToValueAtTime(0.4, now + 1.0);
            gain.gain.linearRampToValueAtTime(0.4, now + 2.0);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 2.9);
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start(now);
            osc.stop(now + 3.0);
        }
    }
});

// Адаптивное поведение при изменении размеров экрана
window.addEventListener('resize', () => {
    if (renderer && camera) {
        const holder = document.getElementById('canvas-holder');
        if (holder) {
            renderer.setSize(holder.clientWidth, holder.clientHeight);
            camera.aspect = holder.clientWidth / holder.clientHeight;
            camera.updateProjectionMatrix();
        }
    }
});

// === DEVELOPER CONSOLE ===
(function() {
    let devConsoleOpen = false;
    const devConsole = document.getElementById('dev-console');
    const devLog = document.getElementById('dev-console-log');
    const devInput = document.getElementById('dev-console-input');
    if (!devConsole || !devLog || !devInput) return;

    const cmdHistory = [];
    let historyIndex = -1;

    function devPrint(text, color) {
        const line = document.createElement('div');
        line.style.color = color || '#00ff00';
        line.style.whiteSpace = 'pre-wrap';
        line.textContent = text;
        devLog.appendChild(line);
        devLog.scrollTop = devLog.scrollHeight;
    }

    function toggleDevConsole() {
        devConsoleOpen = !devConsoleOpen;
        window.devConsoleOpen = devConsoleOpen;
        devConsole.style.display = devConsoleOpen ? 'block' : 'none';
        if (devConsoleOpen) {
            devInput.focus();
            if (document.pointerLockElement) {
                document.exitPointerLock();
            }
            // Clear keys to prevent walking/inputs stuck
            Object.keys(keys).forEach(k => keys[k] = false);
        }
    }

    // Ctrl+Shift+` (Backquote) to toggle
    window.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.shiftKey && (e.code === 'Backquote' || e.key === '~' || e.key === '`')) {
            e.preventDefault();
            e.stopPropagation();
            toggleDevConsole();
            return;
        }
        // Escape closes console
        if (e.code === 'Escape' && devConsoleOpen) {
            e.preventDefault();
            e.stopPropagation();
            toggleDevConsole();
            return;
        }
    }, true);

    // (Capture blockers removed to allow devInput events to pass normally)

    devInput.addEventListener('keydown', (e) => {
        e.stopPropagation();
        if (e.key === 'Enter' || e.code === 'Enter' || e.keyCode === 13) {
            const cmd = devInput.value.trim();
            if (cmd) {
                devPrint('> ' + cmd, '#88ff88');
                cmdHistory.unshift(cmd);
                historyIndex = -1;
                executeDevCommand(cmd);
            }
            devInput.value = '';
        }
        if (e.code === 'ArrowUp') {
            e.preventDefault();
            if (historyIndex < cmdHistory.length - 1) {
                historyIndex++;
                devInput.value = cmdHistory[historyIndex];
            }
        }
        if (e.code === 'ArrowDown') {
            e.preventDefault();
            if (historyIndex > 0) {
                historyIndex--;
                devInput.value = cmdHistory[historyIndex];
            } else {
                historyIndex = -1;
                devInput.value = '';
            }
        }
    });

    function executeDevCommand(raw) {
        const parts = raw.toLowerCase().split(/\s+/);
        const cmd = parts[0];
        const arg1 = parts[1];
        const arg2 = parts[2];

        switch(cmd) {
            case 'help':
                devPrint('=== SAMOSBOR DEV CONSOLE ===', '#ffff00');
                devPrint('tp <floor>        - Teleport to floor', '#cccccc');
                devPrint('god               - Toggle god mode (no damage)', '#cccccc');
                devPrint('heal              - Restore health to max', '#cccccc');
                devPrint('give ammo [n]     - Give ammo (default: max)', '#cccccc');
                devPrint('give water [n]    - Give water (default: max)', '#cccccc');
                devPrint('give filter [n]   - Give filter (default: max)', '#cccccc');
                devPrint('give notes        - Collect all lore notes', '#cccccc');
                devPrint('noclip            - Toggle noclip mode', '#cccccc');
                devPrint('speed <val>       - Set player speed (default 4)', '#cccccc');
                devPrint('samosbor          - Trigger samosbor warning', '#cccccc');
                devPrint('samosbor stop     - Stop samosbor', '#cccccc');
                devPrint('monster           - Spawn stairs monster', '#cccccc');
                devPrint('kill              - Kill player', '#cccccc');
                devPrint('pos               - Show player position', '#cccccc');
                devPrint('doors             - List doors on current floor', '#cccccc');
                devPrint('openall           - Open all doors on floor', '#cccccc');
                devPrint('rebuild           - Force rebuild 3D scene', '#cccccc');
                devPrint('clear             - Clear console', '#cccccc');
                break;

            case 'tp':
                if (arg1) {
                    const floor = parseInt(arg1);
                    if (!isNaN(floor) && floor >= 1 && floor <= 1324) {
                        state.floor = floor;
                        playerPos.set(0, 0, -1.0);
                        playerYaw = 0;
                        playerPitch = 0;
                        state.location = 'hallway';
                        state.focusedDoorIndex = null;
                        build3DScene();
                        updateHUD();
                        devPrint('Teleported to floor ' + floor, '#00ffff');
                    } else {
                        devPrint('Invalid floor. Range: 1-1324', '#ff4444');
                    }
                } else {
                    devPrint('Usage: tp <floor_number>', '#ff4444');
                }
                break;

            case 'god':
                window._godMode = !window._godMode;
                if (window._godMode) {
                    // Patch damage functions
                    window._origHealth = state.health;
                    Object.defineProperty(state, 'health', {
                        get: function() { return MAX_HEALTH; },
                        set: function(v) { },
                        configurable: true
                    });
                    devPrint('God mode ON', '#00ff00');
                } else {
                    Object.defineProperty(state, 'health', {
                        value: MAX_HEALTH,
                        writable: true,
                        configurable: true
                    });
                    devPrint('God mode OFF', '#ffaa00');
                }
                updateHUD();
                break;

            case 'heal':
                state.health = MAX_HEALTH;
                updateHUD();
                devPrint('Health restored to ' + MAX_HEALTH, '#00ff00');
                break;

            case 'give':
                if (arg1 === 'ammo') {
                    const n = arg2 ? parseInt(arg2) : MAX_AMMO;
                    state.ammo = Math.min(MAX_AMMO, isNaN(n) ? MAX_AMMO : n);
                    updateHUD();
                    devPrint('Ammo set to ' + state.ammo, '#ffff00');
                } else if (arg1 === 'water') {
                    const n = arg2 ? parseInt(arg2) : MAX_WATER;
                    state.water = Math.min(MAX_WATER, isNaN(n) ? MAX_WATER : n);
                    state.bottleWater = 100;
                    updateHUD();
                    devPrint('Water set to ' + state.water, '#4488ff');
                } else if (arg1 === 'filter') {
                    const n = arg2 ? parseInt(arg2) : MAX_FILTER;
                    state.filter = Math.min(MAX_FILTER, isNaN(n) ? MAX_FILTER : n);
                    updateHUD();
                    devPrint('Filter set to ' + state.filter, '#88ff88');
                } else if (arg1 === 'notes') {
                    for (let i = 0; i < LORE_NOTES.length; i++) {
                        state.notesCollected[i] = true;
                        const tab = document.getElementById('note-tab-' + i);
                        if (tab) {
                            tab.classList.remove('btn-note-locked');
                            tab.innerText = LORE_NOTES[i].title;
                        }
                    }
                    state.notesCount = LORE_NOTES.length;
                    updateHUD();
                    devPrint('All ' + LORE_NOTES.length + ' notes collected!', '#ffaa00');
                } else {
                    devPrint('Usage: give ammo|water|filter|notes [amount]', '#ff4444');
                }
                break;

            case 'noclip':
                window._noclip = !window._noclip;
                devPrint('Noclip ' + (window._noclip ? 'ON' : 'OFF'), window._noclip ? '#00ff00' : '#ffaa00');
                break;

            case 'speed':
                if (arg1) {
                    const s = parseFloat(arg1);
                    if (!isNaN(s) && s > 0 && s <= 50) {
                        // We need to modify the const, so we use a workaround
                        window._customSpeed = s;
                        devPrint('Speed set to ' + s + ' (applied next frame)', '#00ffff');
                    } else {
                        devPrint('Invalid speed. Range: 0.1-50', '#ff4444');
                    }
                } else {
                    devPrint('Current speed: ' + (window._customSpeed || playerSpeed), '#cccccc');
                }
                break;

            case 'samosbor':
                if (arg1 === 'stop') {
                    state.samosborStatus = 'normal';
                    state.samosborTimeLeft = 999;
                    updateHUD();
                    devPrint('Samosbor stopped', '#00ff00');
                } else {
                    state.samosborStatus = 'warning';
                    state.samosborCountdown = 20;
                    updateHUD();
                    devPrint('Samosbor WARNING triggered! 20s until active phase.', '#ff4444');
                }
                break;

            case 'monster':
                if (typeof triggerStairsMonster === 'function') {
                    triggerStairsMonster();
                    devPrint('Stairs monster spawned!', '#ff4444');
                } else {
                    devPrint('triggerStairsMonster not found', '#ff4444');
                }
                break;

            case 'kill':
                state.health = 0;
                if (typeof triggerGameOver === 'function') {
                    triggerGameOver('console_kill');
                }
                devPrint('Player killed.', '#ff0000');
                break;

            case 'pos':
                devPrint('Position: X=' + playerPos.x.toFixed(2) + ' Y=' + playerPos.y.toFixed(2) + ' Z=' + playerPos.z.toFixed(2), '#cccccc');
                devPrint('Yaw=' + playerYaw.toFixed(3) + ' Pitch=' + playerPitch.toFixed(3), '#cccccc');
                devPrint('Location: ' + state.location + ' | Floor: ' + state.floor, '#cccccc');
                break;

            case 'doors':
                if (state.doors) {
                    state.doors.forEach((d, i) => {
                        devPrint('[' + i + '] ' + d.name + ' | type=' + d.type + ' | opened=' + d.opened + ' | searched=' + d.searched, '#cccccc');
                    });
                }
                break;

            case 'openall':
                if (state.doors) {
                    state.doors.forEach((d, i) => {
                        if (d.type !== 'empty' && d.type !== 'monster') {
                            d.opened = true;
                        }
                    });
                    build3DScene();
                    updateHUD();
                    devPrint('All safe doors opened.', '#00ff00');
                }
                break;

            case 'rebuild':
                build3DScene();
                devPrint('Scene rebuilt.', '#00ffff');
                break;

            case 'clear':
                devLog.innerHTML = '';
                break;

            default:
                // Try eval as fallback for advanced debugging
                try {
                    const result = eval(raw);
                    if (result !== undefined) {
                        devPrint(String(result), '#aaaaaa');
                    }
                } catch(err) {
                    devPrint('Unknown command: ' + cmd + '. Type "help" for list.', '#ff4444');
                }
                break;
        }
    }

    devPrint('Developer Console initialized. Type "help" for commands.', '#888888');
})();

// Patch handleFPSMovement to support noclip and custom speed
const _origHandleFPS = handleFPSMovement;
handleFPSMovement = function(deltaTime) {
    if (hackActive) return;
    // Custom speed override
    if (window._customSpeed) {
        const savedSpeed = playerSpeed;
        // Temporarily override (playerSpeed is const, so we patch moveVector scaling)
        const origFunc = _origHandleFPS;
        
        // Simple noclip: skip collision, allow free movement
        if (window._noclip) {
            if (state.stairsMonsterActive) return;
            const moveVector = new THREE.Vector3();
            if (keys['KeyW'] || keys['ArrowUp'] || mvUp) moveVector.z -= 1;
            if (keys['KeyS'] || keys['ArrowDown'] || mvDown) moveVector.z += 1;
            if (keys['KeyA'] || keys['ArrowLeft'] || mvLeft) moveVector.x -= 1;
            if (keys['KeyD'] || keys['ArrowRight'] || mvRight) moveVector.x += 1;
            if (moveVector.lengthSq() > 0) {
                moveVector.normalize();
                moveVector.applyAxisAngle(new THREE.Vector3(0, 1, 0), playerYaw);
                moveVector.multiplyScalar((window._customSpeed || playerSpeed) * deltaTime);
                playerPos.x += moveVector.x;
                playerPos.z += moveVector.z;
            }
            return;
        }
        
        return origFunc(deltaTime);
    }
    
    if (window._noclip) {
        if (state.stairsMonsterActive) return;
        const moveVector = new THREE.Vector3();
        if (keys['KeyW'] || keys['ArrowUp'] || mvUp) moveVector.z -= 1;
        if (keys['KeyS'] || keys['ArrowDown'] || mvDown) moveVector.z += 1;
        if (keys['KeyA'] || keys['ArrowLeft'] || mvLeft) moveVector.x -= 1;
        if (keys['KeyD'] || keys['ArrowRight'] || mvRight) moveVector.x += 1;
        if (moveVector.lengthSq() > 0) {
            moveVector.normalize();
            moveVector.applyAxisAngle(new THREE.Vector3(0, 1, 0), playerYaw);
            moveVector.multiplyScalar(playerSpeed * deltaTime);
            playerPos.x += moveVector.x;
            playerPos.z += moveVector.z;
        }
        return;
    }
    
    return _origHandleFPS(deltaTime);
};
