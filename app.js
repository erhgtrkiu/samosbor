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
    doors: [],
    focusedDoorIndex: null, // Дверь в перекрестии прицела
    
    // Местоположение игрока
    location: 'hallway', // 'hallway', 'room', 'transition'
    samosborSafe: false, 
    searchProgress: 0,
    isSearching: false,
    
    // Лестничный монстр
    stairsMonsterActive: false,
    stairsMonsterTimeLeft: 0,
    
    audioInit: false,
    bottleWater: 100
};

// --- ФИЗИКА И ПОЛОЖЕНИЕ ИГРОКА (3D FPS) ---
let playerPos = new THREE.Vector3(0, 0, 0);
let playerYaw = 0; // Вращение по горизонтали
let playerPitch = 0; // Вращение по вертикали
let keys = {}; // Зажатые клавиши
let pointerLocked = false;
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
    
    proceduralTextures.concrete = createNoiseTexture('#424750', '#1c1f24', 3, true);
    proceduralTextures.ceiling = createNoiseTexture('#25282e', '#090a0c', 4, false);
    proceduralTextures.rust = createNoiseTexture('#4a3325', '#160e0a', 1, false);
    proceduralTextures.door = createDoorTexture();
    proceduralTextures.wallpaper = createWallpaperTexture();
}

function build3DScene() {
    // Удаление старых объектов
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
    
    if (floorMesh) scene.remove(floorMesh);
    if (ceilingMesh) scene.remove(ceilingMesh);
    if (leftWallMesh) scene.remove(leftWallMesh);
    if (rightWallMesh) scene.remove(rightWallMesh);
    if (backWallMesh) scene.remove(backWallMesh);
    if (warningBeacon) scene.remove(warningBeacon);
    
    const wallMat = new THREE.MeshStandardMaterial({ map: proceduralTextures.concrete, roughness: 0.9 });
    
    if (state.location === 'hallway') {
        scene.fog.color.setHex(0x060709);
        scene.fog.density = 0.06;
        
        // 1. Пол и потолок коридора (X: -3 до 3, Z: 0 до -42)
        const floorGeo = new THREE.PlaneGeometry(6, 42);
        const floorMat = new THREE.MeshStandardMaterial({ map: proceduralTextures.concrete, roughness: 0.95 });
        floorMesh = new THREE.Mesh(floorGeo, floorMat);
        floorMesh.rotation.x = -Math.PI / 2;
        floorMesh.position.set(0, 0, -21);
        scene.add(floorMesh);
        
        const ceilingGeo = new THREE.PlaneGeometry(6, 42);
        const ceilingMat = new THREE.MeshStandardMaterial({ map: proceduralTextures.ceiling, roughness: 0.95 });
        ceilingMesh = new THREE.Mesh(ceilingGeo, ceilingMat);
        ceilingMesh.rotation.x = Math.PI / 2;
        ceilingMesh.position.set(0, 5, -21);
        scene.add(ceilingMesh);
        
        // 2. Стены коридора
        const wallGeo = new THREE.PlaneGeometry(42, 5);
        
        leftWallMesh = new THREE.Mesh(wallGeo, wallMat);
        leftWallMesh.rotation.y = Math.PI / 2;
        leftWallMesh.position.set(-3.0, 2.5, -21);
        scene.add(leftWallMesh);
        
        rightWallMesh = new THREE.Mesh(wallGeo, wallMat);
        rightWallMesh.rotation.y = -Math.PI / 2;
        rightWallMesh.position.set(3.0, 2.5, -21);
        scene.add(rightWallMesh);
        
        // Перегородка с лестничным проемом на Z = -42
        // Ограничиваем стены по бокам лестницы
        const stairsHoleWallL = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 5), wallMat);
        stairsHoleWallL.position.set(-2.25, 2.5, -42);
        scene.add(stairsHoleWallL);
        staircaseMeshes.push(stairsHoleWallL);
        
        const stairsHoleWallR = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 5), wallMat);
        stairsHoleWallR.position.set(2.25, 2.5, -42);
        scene.add(stairsHoleWallR);
        staircaseMeshes.push(stairsHoleWallR);
        
        // 3. ФИЗИЧЕСКИЕ СТУПЕНИ ЛЕСТНИЦЫ (Z = -42 до Z = -54, спускаются от Y = 0 до Y = -5)
        const stepWidth = 3.0;
        const stepHeight = 0.33; // 15 ступеней * 0.33 = ~5 метров высоты
        const stepDepth = 0.8;
        const stepsCount = 15;
        
        for (let i = 0; i < stepsCount; i++) {
            const stepGeo = new THREE.BoxGeometry(stepWidth, stepHeight, stepDepth);
            const step = new THREE.Mesh(stepGeo, wallMat);
            // Спускаем вниз
            step.position.set(0, -stepHeight * i, -42.4 - stepDepth * i);
            scene.add(step);
            staircaseMeshes.push(step);
        }
        
        // Нижняя лестничная площадка (landing) Z = -54 до -57
        const landingGeo = new THREE.BoxGeometry(3.0, 0.2, 3.5);
        const landing = new THREE.Mesh(landingGeo, wallMat);
        landing.position.set(0, -5.0, -56.0);
        scene.add(landing);
        staircaseMeshes.push(landing);
        
        // Стены лестничного колодца
        const shaftGeoSide = new THREE.PlaneGeometry(16, 12);
        
        const shaftLeft = new THREE.Mesh(shaftGeoSide, wallMat);
        shaftLeft.rotation.y = Math.PI / 2;
        shaftLeft.position.set(-1.5, -1.0, -50);
        scene.add(shaftLeft);
        staircaseMeshes.push(shaftLeft);
        
        const shaftRight = new THREE.Mesh(shaftGeoSide, wallMat);
        shaftRight.rotation.y = -Math.PI / 2;
        shaftRight.position.set(1.5, -1.0, -50);
        scene.add(shaftRight);
        staircaseMeshes.push(shaftRight);
        
        const shaftBack = new THREE.Mesh(new THREE.PlaneGeometry(3, 12), wallMat);
        shaftBack.position.set(0, -1.0, -58.0);
        scene.add(shaftBack);
        staircaseMeshes.push(shaftBack);
        
        // 4. Потолочные трубы
        const pipeMat = new THREE.MeshStandardMaterial({ map: proceduralTextures.rust, metalness: 0.8, roughness: 0.3 });
        const pipeGeo = new THREE.CylinderGeometry(0.12, 0.12, 42, 8);
        
        const pipeL = new THREE.Mesh(pipeGeo, pipeMat);
        pipeL.rotation.x = Math.PI / 2;
        pipeL.position.set(-2.2, 4.4, -21);
        scene.add(pipeL);
        ceilingPipes.push(pipeL);
        
        const pipeR = new THREE.Mesh(pipeGeo, pipeMat);
        pipeR.rotation.x = Math.PI / 2;
        pipeR.position.set(2.2, 4.4, -21);
        scene.add(pipeR);
        ceilingPipes.push(pipeR);
        
        // 5. Освещение коридора
        const lightGeo = new THREE.BoxGeometry(0.8, 0.1, 1.4);
        const lightEmissiveMat = new THREE.MeshBasicMaterial({ color: 0xccffcc });
        
        const zLights = [-10, -22, -34];
        zLights.forEach(z => {
            const lamp = new THREE.Mesh(lightGeo, lightEmissiveMat);
            lamp.position.set(0, 4.95, z);
            scene.add(lamp);
            ceilingLights.push(lamp);
            
            const pl = new THREE.PointLight(0xd5ffd0, 0.65, 16);
            pl.position.set(0, 4.5, z);
            scene.add(pl);
            ceilingLights.push(pl);
        });
        
        // Сигнальный маяк Самосбора на Z = -38
        warningBeacon = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.3, 8), new THREE.MeshBasicMaterial({ color: 0x440000 }));
        warningBeacon.position.set(0, 4.8, -38);
        scene.add(warningBeacon);
        
        warningLight = new THREE.PointLight(0xff0000, 0, 15);
        warningLight.position.set(0, 4.4, -38);
        scene.add(warningLight);
        
        // 6. РЕНДЕР 6 ДВЕРЕЙ (3 слева, 3 справа)
        const doorGeo = new THREE.BoxGeometry(1.2, 2.6, 0.1);
        const doorMat = new THREE.MeshStandardMaterial({ map: proceduralTextures.door, roughness: 0.6 });
        
        DOOR_LAYOUT.forEach((layout, idx) => {
            const doorPivot = new THREE.Group();
            doorPivot.position.set(layout.x, 1.3, layout.z);
            doorPivot.rotation.y = layout.rot; // Изначально направлены поперек коридора
            
            const doorMesh = new THREE.Mesh(doorGeo, doorMat);
            doorMesh.name = `door_${idx}`;
            // Устанавливаем петлю сбоку
            // Если петля с края, сдвигаем по локальной оси X на 0.6
            doorMesh.position.set(0.6, 0, 0);
            
            // Навешиваем на сетку метаданные для рейкаста
            doorMesh.userData = { doorIndex: idx };
            
            doorPivot.add(doorMesh);
            
            // Устанавливаем створку в открытое положение, если открыто в игре
            if (state.doors[idx] && state.doors[idx].opened) {
                // Вращаем вовнутрь (в сторону стены)
                doorPivot.rotation.y = layout.rot + Math.PI / 2;
            }
            
            scene.add(doorPivot);
            doorPivots.push(doorPivot);
        });
        
        // Непрямой свет
        const ambLight = new THREE.AmbientLight(0xffffff, 0.08);
        scene.add(ambLight);
        
        // Спавн 3D Лестничного монстра (если он активен)
        if (state.stairsMonsterActive) {
            spawn3DMonster();
        }
        
    } else if (state.location === 'room') {
        scene.fog.color.setHex(0x0b0a08);
        scene.fog.density = 0.06;
        
        // Квартира жильцов (Куб 7х7)
        const wallMat = new THREE.MeshStandardMaterial({ map: proceduralTextures.wallpaper, roughness: 0.85 });
        const floorMat = new THREE.MeshStandardMaterial({ map: proceduralTextures.concrete, roughness: 0.95 });
        
        const floor = new THREE.Mesh(new THREE.PlaneGeometry(7, 7), floorMat);
        floor.rotation.x = -Math.PI / 2;
        scene.add(floor);
        roomMeshes.push(floor);
        
        const ceiling = new THREE.Mesh(new THREE.PlaneGeometry(7, 7), floorMat);
        ceiling.rotation.x = Math.PI / 2;
        ceiling.position.y = 4.2;
        scene.add(ceiling);
        roomMeshes.push(ceiling);
        
        // Стены
        const wallGeo = new THREE.PlaneGeometry(7, 4.2);
        
        const wallBack = new THREE.Mesh(wallGeo, wallMat);
        wallBack.position.set(0, 2.1, -3.5);
        scene.add(wallBack);
        roomMeshes.push(wallBack);
        
        // Передняя стена с дверью выхода
        const wallFront = new THREE.Mesh(wallGeo, wallMat);
        wallFront.rotation.y = Math.PI;
        wallFront.position.set(0, 2.1, 3.5);
        scene.add(wallFront);
        roomMeshes.push(wallFront);
        
        const wallLeft = new THREE.Mesh(wallGeo, wallMat);
        wallLeft.rotation.y = Math.PI / 2;
        wallLeft.position.set(-3.5, 2.1, 0);
        scene.add(wallLeft);
        roomMeshes.push(wallLeft);
        
        const wallRight = new THREE.Mesh(wallGeo, wallMat);
        wallRight.rotation.y = -Math.PI / 2;
        wallRight.position.set(3.5, 2.1, 0);
        scene.add(wallRight);
        roomMeshes.push(wallRight);
        
        // Мебель
        const woodMat = new THREE.MeshStandardMaterial({ color: 0x4a3325, roughness: 0.7 });
        const sofaMat = new THREE.MeshStandardMaterial({ color: 0x6e1b1b, roughness: 0.9 });
        
        const cabinet = new THREE.Mesh(new THREE.BoxGeometry(2.0, 3.0, 0.8), woodMat);
        cabinet.name = "cabinet";
        cabinet.position.set(-2.4, 1.5, -2.6);
        scene.add(cabinet);
        roomMeshes.push(cabinet);
        
        const sofa = new THREE.Mesh(new THREE.BoxGeometry(3.0, 0.8, 1.1), sofaMat);
        sofa.position.set(2.4, 0.4, 0);
        sofa.rotation.y = Math.PI / 2;
        scene.add(sofa);
        roomMeshes.push(sofa);
        
        const table = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.8, 1.0), woodMat);
        table.name = "table";
        table.position.set(0, 0.4, -1.2);
        scene.add(table);
        roomMeshes.push(table);
        
        // Внутренний гермозатвор выхода
        const exitDoor = new THREE.Mesh(new THREE.BoxGeometry(1.2, 2.6, 0.15), new THREE.MeshStandardMaterial({ map: proceduralTextures.door, roughness: 0.6 }));
        exitDoor.position.set(0, 1.3, 3.48);
        scene.add(exitDoor);
        roomMeshes.push(exitDoor);
        
        // Люстра
        const roomLight = new THREE.PointLight(0xffdfae, 0.75, 18);
        roomLight.position.set(0, 3.7, 0);
        scene.add(roomLight);
        roomMeshes.push(roomLight);
        
        const chandelier = new THREE.Mesh(new THREE.ConeGeometry(0.25, 0.35, 6), new THREE.MeshBasicMaterial({ color: 0x222222 }));
        chandelier.position.set(0, 4.0, 0);
        scene.add(chandelier);
        roomMeshes.push(chandelier);
        
        const ambLight = new THREE.AmbientLight(0xffffff, 0.05);
        scene.add(ambLight);
        roomMeshes.push(ambLight);
        
    } else if (state.location === 'transition') {
        scene.fog.color.setHex(0x0a1014);
        scene.fog.density = 0.08;
        
        // Шлюз перехода уровней
        const wallMat = new THREE.MeshStandardMaterial({ color: 0x1f262b, roughness: 0.75 });
        const floorMat = new THREE.MeshStandardMaterial({ map: proceduralTextures.concrete, roughness: 0.95 });
        
        const floor = new THREE.Mesh(new THREE.PlaneGeometry(5, 5), floorMat);
        floor.rotation.x = -Math.PI / 2;
        scene.add(floor);
        transitionMeshes.push(floor);
        
        const ceiling = new THREE.Mesh(new THREE.PlaneGeometry(5, 5), wallMat);
        ceiling.rotation.x = Math.PI / 2;
        ceiling.position.y = 4.0;
        scene.add(ceiling);
        transitionMeshes.push(ceiling);
        
        const wallGeo = new THREE.PlaneGeometry(5, 4);
        
        const wallBack = new THREE.Mesh(wallGeo, wallMat);
        wallBack.position.set(0, 2, -2.5);
        scene.add(wallBack);
        transitionMeshes.push(wallBack);
        
        const wallLeft = new THREE.Mesh(wallGeo, wallMat);
        wallLeft.rotation.y = Math.PI / 2;
        wallLeft.position.set(-2.5, 2, 0);
        scene.add(wallLeft);
        transitionMeshes.push(wallLeft);
        
        const wallRight = new THREE.Mesh(wallGeo, wallMat);
        wallRight.rotation.y = -Math.PI / 2;
        wallRight.position.set(2.5, 2, 0);
        scene.add(wallRight);
        transitionMeshes.push(wallRight);
        
        // Шлюзовой затвор впереди
        const gate = new THREE.Mesh(new THREE.BoxGeometry(2.0, 3.0, 0.2), new THREE.MeshStandardMaterial({ map: proceduralTextures.rust, metalness: 0.8, roughness: 0.5 }));
        gate.position.set(0, 1.5, -2.4);
        scene.add(gate);
        transitionMeshes.push(gate);
        
        const transLight = new THREE.PointLight(0x00e5ff, 0.85, 15);
        transLight.position.set(0, 3.5, 0);
        scene.add(transLight);
        transitionMeshes.push(transLight);
        
        const ambLight = new THREE.AmbientLight(0xffffff, 0.05);
        scene.add(ambLight);
        transitionMeshes.push(ambLight);
    }
}

function spawn3DMonster() {
    if (stairsMonsterMesh) scene.remove(stairsMonsterMesh);
    
    stairsMonsterMesh = new THREE.Group();
    // Ставим монстра на лестничную площадку
    stairsMonsterMesh.position.set(0, -3.2, -50.0);
    
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

// Цикл рендеринга и управления в 3D (FPS сглаживание)
let animFrameId = null;
let lastTime = performance.now();

function animate3D() {
    animFrameId = requestAnimationFrame(animate3D);
    
    const time = performance.now();
    const deltaTime = Math.min((time - lastTime) * 0.001, 0.1); // Лимит на лаг в 100мс
    lastTime = time;
    
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
    } else {
        // Если мы не в коридоре, сбрасываем фокус
        state.focusedDoorIndex = null;
        updateFocusedObjectUI();
    }
    
    // 4. ДВИЖЕНИЕ МОНСТРА НА ЛЕСТНИЦЕ
    if (state.stairsMonsterActive && stairsMonsterMesh) {
        // Тряска чудовища
        stairsMonsterMesh.position.x += (Math.random() - 0.5) * 0.05;
        // Движение к камере игрока
        stairsMonsterMesh.position.z += 1.8 * deltaTime;
        
        // Если монстр подошел слишком близко (к Z координате игрока) - смерть
        if (stairsMonsterMesh.position.z >= playerPos.z - 2.0) {
            triggerGameOver("stairs_monster");
        }
    }
    
    // 5. АНИМАЦИЯ АВАРИЙНОЙ ЛАМПЫ САМОСБОРА
    if (warningLight && warningBeacon) {
        const timeSec = time * 0.001;
        if (state.samosborStatus === 'warning') {
            const pulse = (Math.sin(timeSec * 7) + 1) * 0.5;
            warningLight.intensity = pulse * 1.5;
            warningLight.color.setHex(0xffaa00);
            warningBeacon.material.color.setHex(pulse > 0.5 ? 0xffaa00 : 0x442200);
        } else if (state.samosborStatus === 'active') {
            const flash = (Math.floor(timeSec * 8) % 2 === 0) ? 1 : 0;
            warningLight.intensity = flash * 3.0;
            warningLight.color.setHex(0xff0000);
            warningBeacon.material.color.setHex(flash === 1 ? 0xff0000 : 0x550000);
            
            scene.fog.color.setHex(0x180522);
            renderer.setClearColor(0x180522);
        } else {
            warningLight.intensity = 0;
            warningBeacon.material.color.setHex(0x330000);
            if (scene.fog.color.getHex() !== 0x060709) {
                scene.fog.color.setHex(0x060709);
                renderer.setClearColor(0x060709);
            }
        }
    }
    
    // Рендер кадра
    if (renderer && scene && camera) {
        renderer.render(scene, camera);
    }
}

// Управление физическим движением игрока (координатная сетка с коллизиями)
function handleFPSMovement(deltaTime) {
    if (state.stairsMonsterActive) return; // Locked when monster attacks on stairs
    
    const moveVector = new THREE.Vector3();
    
    // Считываем WASD / Стрелки клавиатуры или виртуальные кнопки D-pad
    if (keys['KeyW'] || keys['ArrowUp'] || mvUp) moveVector.z -= 1;
    if (keys['KeyS'] || keys['ArrowDown'] || mvDown) moveVector.z += 1;
    if (keys['KeyA'] || keys['ArrowLeft'] || mvLeft) moveVector.x -= 1;
    if (keys['KeyD'] || keys['ArrowRight'] || mvRight) moveVector.x += 1;
    
    if (moveVector.lengthSq() > 0) {
        // Переводим вектор движения относительно взгляда игрока (yaw)
        moveVector.normalize();
        moveVector.applyAxisAngle(new THREE.Vector3(0, 1, 0), playerYaw);
        
        // Умножаем на скорость
        moveVector.multiplyScalar(playerSpeed * deltaTime);
        
        // Новые предлагаемые координаты
        const nextX = playerPos.x + moveVector.x;
        const nextZ = playerPos.z + moveVector.z;
        
        // Обработка границ и коллизий
        if (state.location === 'hallway') {
            // КОРИДОР (Z от 0 до -42)
            if (nextZ >= -42 && nextZ <= 0.5) {
                // Коллизия стен по оси X
                // Стены находятся на X = -3 и X = 3. Коридор проходим в диапазоне X: [-2.4, 2.4]
                if (nextX >= -2.4 && nextX <= 2.4) {
                    playerPos.x = nextX;
                } else {
                    // Проверяем, упирается ли игрок в открытую дверь для перехода в комнату
                    checkDoorTriggers(nextX, nextZ);
                }
                playerPos.z = nextZ;
                playerPos.y = 0; // На полу коридора
            } 
            // ЛЕСТНИЦА (Z от -42 до -56)
            else if (nextZ < -42 && nextZ >= -56.5) {
                // Ограничиваем ширину лестницы (ширина 3.0, проходимо в X: [-1.3, 1.3])
                if (nextX >= -1.3 && nextX <= 1.3) {
                    playerPos.x = nextX;
                }
                playerPos.z = nextZ;
                
                // Вычисление плавной высоты спуска по ступеням
                // Ступени с Z = -42 до -54 (всего 12 метров). Спад Y идет от 0 до -5.
                const stairsProgress = Math.max(0, Math.min(12, -42.0 - playerPos.z));
                playerPos.y = -(stairsProgress / 12) * 5.0;
                
                // Проверка перехода на следующий уровень на лестничной площадке
                if (playerPos.z <= -55.0 && playerPos.y <= -4.5) {
                    triggerFloorDescent();
                }
            } 
            // Задний тупик Z > 0
            else if (nextZ > 0.5) {
                playerPos.z = 0.5;
            }
        } else if (state.location === 'room') {
            // ВНУТРИ ЖИЛОЙ КОМНАТЫ (размеры 7х7)
            // Координаты X: [-3.1, 3.1], Z: [-3.1, 3.1]
            if (nextX >= -3.1 && nextX <= 3.1) {
                // Коллизия с сервантом (слева сзади X < -1.4, Z < -1.8)
                if (!(nextX < -1.5 && nextZ < -1.8)) {
                    playerPos.x = nextX;
                }
            }
            if (nextZ >= -3.1 && nextZ <= 3.6) {
                // Коллизия с сервантом и столом
                if (!(playerPos.x < -1.5 && nextZ < -1.8) && !(playerPos.x > -0.8 && playerPos.x < 0.8 && nextZ < -0.6 && nextZ > -1.8)) {
                    playerPos.z = nextZ;
                }
            }
            
            // Если игрок вплотную подходит к выходной двери (Z > 3.4), то выходим в коридор
            if (playerPos.z >= 3.45) {
                exitRoom();
            }
        } else if (state.location === 'transition') {
            // ВНУТРИ ТЕХНИЧЕСКОГО ШЛЮЗА (размеры 5х5)
            // X: [-2.1, 2.1], Z: [-2.1, 2.1]
            if (nextX >= -2.1 && nextX <= 2.1) {
                playerPos.x = nextX;
            }
            if (nextZ >= -2.1 && nextZ <= 2.1) {
                playerPos.z = nextZ;
            }
            
            // Если игрок уходит назад (Z > 2.1), то возвращается в коридор
            if (playerPos.z >= 2.1) {
                exitRoom();
            }
        }
        
        // Тратим микроскопическое количество воды на шаги
        state.water = Math.max(0, state.water - 0.005);
    }
}

// Проверка входа в открытую дверь при движении в стену
function checkDoorTriggers(x, z) {
    // Определяем, возле какой двери по Z находится игрок
    let doorIdx = -1;
    if (Math.abs(z - (-10)) < 1.2) doorIdx = 0;
    else if (Math.abs(z - (-22)) < 1.2) doorIdx = 1;
    else if (Math.abs(z - (-34)) < 1.2) doorIdx = 2;
    
    // Если игрок жмется вправо, индексы смещаются на 3-5
    if (x > 2.4 && doorIdx !== -1) {
        doorIdx += 3;
    }
    
    if (doorIdx !== -1) {
        const door = state.doors[doorIdx];
        // Если дверь открыта, переходим внутрь комнаты
        if (door && door.opened) {
            disableAllControls(true);
            
            // Эффект входа (затемнение)
            const holder = document.getElementById('canvas-holder');
            holder.style.transition = "opacity 0.2s ease";
            holder.style.opacity = "0.0";
            
            setTimeout(() => {
                state.focusedDoorIndex = null;
                state.location = (door.type === 'apartment') ? 'room' : 'transition';
                
                // Перенастраиваем 3D мир
                build3DScene();
                
                // Устанавливаем игрока внутри комнаты возле входа
                playerPos.set(0, 0, 2.8); // перед выходной дверью
                playerYaw = Math.PI; // смотрим на выходную дверь
                playerPitch = 0;
                
                logToConsole(door.type === 'apartment' ? "Вы вошли в жилую квартиру." : "Вы вошли в тамбур перехода уровней.", "sys");
                
                updateHUD();
                holder.style.opacity = "1";
                disableAllControls(false);
            }, 250);
        }
    }
}

// Рейкаст в центр экрана для фокусировки объекта
function performInteractionRaycast() {
    // Проецируем луч прямо по центру камеры
    raycaster.setFromCamera(new THREE.Vector2(0, 0), camera);
    
    // Собираем дочерние меши из дверных пивотов для пересечения
    const meshArray = [];
    doorPivots.forEach(pivot => {
        pivot.children.forEach(child => meshArray.push(child));
    });
    
    const intersects = raycaster.intersectObjects(meshArray, true);
    
    if (intersects.length > 0) {
        const hitObj = intersects[0].object;
        const dist = intersects[0].distance;
        
        // Если это дверь и расстояние < 3.5 единиц
        if (hitObj.name.startsWith('door_') && dist < 3.5) {
            const doorIdx = hitObj.userData.doorIndex;
            state.focusedDoorIndex = doorIdx;
            updateFocusedObjectUI();
            return;
        }
    }
    
    // Если луч ничего не задел
    state.focusedDoorIndex = null;
    updateFocusedObjectUI();
}

// Обновление интерфейса при фокусировке объекта в прицеле
function updateFocusedObjectUI() {
    const title = document.getElementById('focused-object-name');
    const desc = document.getElementById('focused-object-state');
    const btnListen = document.getElementById('btn-listen');
    const btnOpen = document.getElementById('btn-open-door');
    
    if (state.focusedDoorIndex !== null) {
        const door = state.doors[state.focusedDoorIndex];
        title.innerText = door.name.toUpperCase();
        
        if (door.opened) {
            desc.innerText = "Дверь открыта. Вы можете зайти внутрь (пройдите WASD).";
            btnListen.setAttribute('disabled', 'true');
            btnListen.classList.add('btn-disabled');
            btnOpen.setAttribute('disabled', 'true');
            btnOpen.classList.add('btn-disabled');
        } else {
            desc.innerText = "Гермодверь закрыта. Подойдите вплотную.";
            
            // Включаем кнопки действий
            btnListen.removeAttribute('disabled');
            btnListen.classList.remove('btn-disabled');
            btnOpen.removeAttribute('disabled');
            btnOpen.classList.remove('btn-disabled');
            btnOpen.innerText = "🚪 Открыть дверь (F)";
        }
    } else {
        title.innerText = "ОБЪЕКТ НЕ ВЫБРАН";
        desc.innerText = "Подойдите к двери или объекту взаимодействия";
        btnListen.setAttribute('disabled', 'true');
        btnListen.classList.add('btn-disabled');
        btnOpen.setAttribute('disabled', 'true');
        btnOpen.classList.add('btn-disabled');
        btnOpen.innerText = "🚪 Взаимодействовать";
    }
}


// --- ПОДТВЕРЖДЕНИЕ ВЗАИМОДЕЙСТВИЯ (КЛИК / КЛАВИШИ) ---

function interactWithFocused() {
    if (state.location === 'hallway') {
        if (state.focusedDoorIndex !== null) {
            const door = state.doors[state.focusedDoorIndex];
            if (!door.opened) {
                openDoor();
            }
        }
    } else if (state.location === 'room') {
        // В комнате - обыскиваем, если смотрим на сервант или стол
        const distCabinet = playerPos.distanceTo(new THREE.Vector3(-2.4, 0, -2.6));
        const distTable = playerPos.distanceTo(new THREE.Vector3(0, 0, -1.2));
        
        if (distCabinet < 2.0 || distTable < 2.0) {
            searchRoom();
        } else {
            logToConsole("Подойдите к серванту или столу вплотную, чтобы обыскать их.", "warn");
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
    
    // Анимация в 3D (открытие створки вокруг петель)
    if (doorPivots[state.focusedDoorIndex]) {
        let angle = 0;
        const pivot = doorPivots[state.focusedDoorIndex];
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
}

function searchRoom() {
    if (state.location !== 'room' || state.focusedDoorIndex === null) return;
    const door = state.doors[state.focusedDoorIndex];
    if (door.searched) return;
    
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
            
            distributeLoot();
            updateHUD();
        }
    }, 85);
}

function distributeLoot() {
    const rand = Math.random();
    
    if (state.floor >= 700 && state.notesCount < LORE_NOTES.length) {
        const nextNoteId = state.notesCount;
        if (rand < 0.5) {
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
    
    if (rand < 0.3) {
        state.bottleWater = Math.min(100, state.bottleWater + 50);
        logToConsole("Найдена фляга чистой синтезированной воды (+50% запаса).", "loot");
        playSoundLoot();
    } else if (rand < 0.6) {
        state.ammo = Math.min(MAX_AMMO, state.ammo + 8);
        logToConsole("Найден магазин с пистолетными патронами (+8 патронов).", "loot");
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
    updateHUD();
    build3DScene();
}

function exitRoom() {
    if (state.location !== 'room' && state.location !== 'transition') return;
    initAudio();
    
    const exitFromIdx = state.focusedDoorIndex !== null ? state.focusedDoorIndex : 0;
    
    state.samosborSafe = false;
    state.location = 'hallway';
    
    playSoundDoor(false);
    logToConsole("Вы вышли обратно в бетонный коридор сектора.", "action");
    
    build3DScene();
    
    // Возвращаем игрока в коридор вплотную к той двери, из которой он вышел
    const layout = DOOR_LAYOUT[exitFromIdx];
    // Ставим игрока чуть спереди двери
    const spawnOffset = (layout.x < 0) ? 0.8 : -0.8;
    playerPos.set(layout.x + spawnOffset, 0, layout.z);
    playerYaw = (layout.x < 0) ? Math.PI/2 : -Math.PI/2; // смотрим поперек на коридор
    playerPitch = 0;
    
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
        // Каждые 15 этажей показываем рекламу
        if ((START_FLOOR - state.floor) % 15 === 0) {
            showInterstitialAd();
        }
        
        if (state.floor <= END_FLOOR) {
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
            
            // Сбрасываем позицию игрока на старт нового этажа
            playerPos.set(0, 0, 0);
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
function generateDoorsForFloor() {
    // Правило 1: Квартира 100% (хотя бы одна) в слоте 0
    state.doors = [];
    state.doors.push({
        id: 0,
        type: 'apartment',
        name: `Квартира ${Math.floor(Math.random() * 800 + 100)}`,
        opened: false,
        searched: false
    });
    
    // Проверяем шансы для всего этажа
    const hasTransition = Math.random() < 0.3; // 30% на переход на этаже
    const hasMonster = Math.random() < 0.6; // 60% на монстра на этаже
    
    // Создаем оставшиеся 5 дверей
    for (let i = 1; i <= 5; i++) {
        let type = 'empty'; // По умолчанию запертая
        
        // Шанс на вторую и последующие жилые комнаты: 30%
        if (Math.random() < 0.3) {
            type = 'apartment';
        }
        
        state.doors.push({
            id: i,
            type: type,
            name: `Дверь ${i + 1}`,
            opened: false,
            searched: false
        });
    }
    
    // Если на этаже должен быть переход, заменяем одну случайную пустую/нежилую дверь
    if (hasTransition) {
        const slots = [1, 2, 3, 4, 5].sort(() => Math.random() - 0.5);
        for (let s of slots) {
            if (state.doors[s].type === 'empty') {
                state.doors[s].type = 'transition';
                const sectors = ['А', 'Б', 'В', 'Г', 'Е'];
                state.doors[s].name = `Переход ${sectors[Math.floor(Math.random()*sectors.length)]}-${Math.floor(Math.random()*99+1)}`;
                break;
            }
        }
    }
    
    // Если на этаже должен быть монстр, заменяем одну случайную свободную пустую дверь
    if (hasMonster) {
        const slots = [1, 2, 3, 4, 5].sort(() => Math.random() - 0.5);
        for (let s of slots) {
            if (state.doors[s].type === 'empty') {
                state.doors[s].type = 'monster';
                const locations = ['Склад', 'Архив', 'Компрессорная', 'Щитовая', 'Венткамера'];
                state.doors[s].name = locations[Math.floor(Math.random() * locations.length)];
                break;
            }
        }
    }
    
    // Оформляем имена для оставшихся жилых комнат и запертых дверей
    state.doors.forEach((door, idx) => {
        if (door.type === 'apartment' && idx > 0) {
            door.name = `Квартира ${Math.floor(Math.random() * 800 + 100)}`;
        } else if (door.type === 'empty') {
            door.name = `Секция ${Math.floor(Math.random() * 90 + 10)}`;
        }
    });
}

function enterTransition() {
    if (state.location !== 'transition') return;
    initAudio();
    
    state.water = Math.max(0, state.water - 4);
    
    const skipFloors = 20 + Math.floor(Math.random() * 60);
    state.floor = Math.max(1, state.floor - skipFloors);
    
    playSoundDoor(true);
    logToConsole(`Шлюз герметично захлопнулся сзади. Грохот гидравлики уносит вас вниз.`, "sys");
    
    showInterstitialAd();
    
    const holder = document.getElementById('canvas-holder');
    holder.style.transition = "opacity 0.5s ease";
    holder.style.opacity = "0.0";
    
    setTimeout(() => {
        logToConsole(`Спуск завершен. Вы вышли на этаже ${state.floor}. Дверь заблокирована сзади.`, "sys");
        
        if (state.floor <= END_FLOOR) {
            triggerGameOver("ending_2");
            return;
        }
        
        state.location = 'hallway';
        state.focusedDoorIndex = null;
        generateDoorsForFloor();
        build3DScene();
        
        // Ставим игрока в начало нового коридора
        playerPos.set(0, 0, 0);
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
    playerPos.set(0, -5.0, -56.0); // на площадке
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
        
        playerPos.set(0, 0, 0);
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
}


// --- ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ И БЛОКИРОВКИ ---

function disableAllControls(disable) {
    const buttons = [
        'btn-mask', 'btn-drink', 'btn-bag',
        'btn-listen', 'btn-open-door',
        'btn-search-room', 'btn-lock-room', 'btn-exit-room',
        'btn-enter-transition', 'btn-cancel-transition', 'btn-rewarded-ad'
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


// --- ИНИЦИАЛИЗАЦИЯ И НАЗНАЧЕНИЕ СОБЫТИЙ ---

function restartGame() {
    state = {
        floor: START_FLOOR,
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
        doors: [],
        focusedDoorIndex: null,
        location: 'hallway',
        samosborSafe: false,
        searchProgress: 0,
        isSearching: false,
        stairsMonsterActive: false,
        stairsMonsterTimeLeft: 0,
        audioInit: state.audioInit,
        bottleWater: 100
    };
    
    // Запуск FPS положения ликвидатора
    playerPos.set(0, 0, 0.5); // Стоим в начале коридора
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

function showInterstitialAd() {
    if (ysdk) {
        console.log("Requesting Interstitial Ad...");
        ysdk.adv.showFullscreenAdv({
            callbacks: {
                onOpen: () => {
                    console.log('Interstitial ad opened.');
                },
                onClose: (wasShown) => {
                    console.log('Interstitial ad closed. wasShown:', wasShown);
                },
                onError: (err) => {
                    console.error('Error showing Interstitial Ad:', err);
                }
            }
        });
    } else {
        console.log("Interstitial Ad skipped: SDK not initialized (offline mode).");
    }
}

function showRewardedVideoAd() {
    if (ysdk) {
        console.log("Requesting Rewarded Video Ad...");
        ysdk.adv.showRewardedVideo({
            callbacks: {
                onOpen: () => {
                    console.log('Rewarded Video Ad opened.');
                },
                onRewarded: () => {
                    console.log('Rewarded Video Ad rewarded.');
                    state.ammo = Math.min(MAX_AMMO, state.ammo + 6);
                    logToConsole("Вы посмотрели рекламу и получили +6 патронов!", "loot");
                    updateHUD();
                },
                onClose: () => {
                    console.log('Rewarded Video Ad closed.');
                },
                onError: (err) => {
                    console.error('Error showing Rewarded Video Ad:', err);
                    logToConsole("Не удалось загрузить рекламу. Попробуйте позже.", "warn");
                }
            }
        });
    } else {
        console.log("Rewarded Video Ad clicked in offline/demo mode.");
        state.ammo = Math.min(MAX_AMMO, state.ammo + 6);
        logToConsole("Получено +6 патронов (Режим отладки рекламы)!", "loot");
        updateHUD();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initYandexSDK();
    
    document.getElementById('btn-start-game').addEventListener('click', () => {
        initAudio();
        restartGame();
    });
    
    document.getElementById('btn-restart').addEventListener('click', restartGame);
    document.getElementById('btn-mask').addEventListener('click', toggleGasMask);
    document.getElementById('btn-drink').addEventListener('click', drinkWater);
    document.getElementById('btn-bag').addEventListener('click', () => openNotesModal());
    document.getElementById('btn-rewarded-ad').addEventListener('click', showRewardedVideoAd);
    
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
    
    // 3D FPS клавиатура и мышь оглядка
    window.addEventListener('keydown', (e) => {
        keys[e.code] = true;
        
        // Быстрые клавиши взаимодействия
        if (e.code === 'KeyF') {
            interactWithFocused();
        }
        if (e.code === 'KeyE') {
            listenToFocused();
        }
        if (e.code === 'Space') {
            e.preventDefault();
            shootPistol();
        }
    });
    
    window.addEventListener('keyup', (e) => {
        keys[e.code] = false;
    });
    
    // Pointer Lock для оглядывания мышей в 3D
    const canvasHolder = document.getElementById('canvas-holder');
    canvasHolder.addEventListener('click', () => {
        if (!state.isSearching && state.location !== 'notes') {
            canvasHolder.requestPointerLock = canvasHolder.requestPointerLock || canvasHolder.mozRequestPointerLock;
            canvasHolder.requestPointerLock();
        }
    });
    
    document.addEventListener('pointerlockchange', () => {
        pointerLocked = (document.pointerLockElement === canvasHolder);
    });
    
    document.addEventListener('mousemove', (e) => {
        if (pointerLocked) {
            playerYaw -= e.movementX * sensitivity;
            playerPitch -= e.movementY * sensitivity;
            playerPitch = Math.max(-Math.PI / 2.5, Math.min(Math.PI / 2.5, playerPitch));
        }
    });
    
    // Запасной огляд перетаскиванием мыши / свайпом (для мобилок и ПК без лока)
    let isDragging = false;
    canvasHolder.addEventListener('mousedown', (e) => {
        if (!pointerLocked) isDragging = true;
    });
    window.addEventListener('mouseup', () => {
        isDragging = false;
    });
    canvasHolder.addEventListener('mousemove', (e) => {
        if (isDragging && !pointerLocked) {
            playerYaw -= e.movementX * sensitivity * 1.5;
            playerPitch -= e.movementY * sensitivity * 1.5;
            playerPitch = Math.max(-Math.PI / 2.5, Math.min(Math.PI / 2.5, playerPitch));
        }
    });
    
    // Мобильные тач-свайпы для оглядки
    canvasHolder.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    });
    canvasHolder.addEventListener('touchmove', (e) => {
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
    
    // Определение типа девайса для скрытия/показа мобильного оверлея
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const mobileUI = document.getElementById('mobile-controls-container');
    if (isMobile) {
        mobileUI.style.display = 'block';
        document.getElementById('fps-instructions').style.display = 'none';
    } else {
        mobileUI.style.display = 'none';
    }
});

// Клик поstairs на Истинную концовку
const originalDescend = triggerFloorDescent;
document.getElementById('btn-descend').removeEventListener('click', triggerFloorDescent);
// В FPS режиме кнопка HUD "Спуститься на этаж ниже" активна только при собранных записках во время Самосбора для истинной концовки!
// В остальных случаях игрок должен идти на лестницу физически.
setInterval(() => {
    const btnDescend = document.getElementById('btn-descend');
    if (!btnDescend) return;
    
    if (state.notesCount === 6 && (state.samosborStatus === 'warning' || state.samosborStatus === 'active') && state.location === 'hallway') {
        btnDescend.innerHTML = `<span class="btn-icon">✨</span> Застыть на месте и ждать`;
        btnDescend.className = "btn btn-action glow-blue animate-blink";
        btnDescend.removeAttribute('disabled');
        btnDescend.classList.remove('btn-disabled');
    } else {
        // Выключаем ее, так как идти надо ножками
        btnDescend.innerHTML = `<span class="btn-icon">👣</span> Идите на лестницу в конце коридора`;
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
