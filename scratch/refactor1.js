const fs = require('fs');

let code = fs.readFileSync('C:/Users/m3615/samosbor_game/app.js', 'utf8');

// 1. Replace state.doors with state.floorsData
code = code.replace('doors: [],', 'floorsData: {},');

// 2. Replace generateDoorsForFloor
const genDoorsRegex = /function generateDoorsForFloor\(\) \{[\s\S]*?\}\s*(?=\n\/\/ --- РЕНДЕРИНГ)/;
const newGenDoors = `function getOrGenerateFloorDoors(floorNum) {
    if (state.floorsData[floorNum]) {
        return state.floorsData[floorNum].doors;
    }
    
    let doors = [];
    doors.push({
        id: 0,
        type: 'apartment',
        name: \`Квартира \${Math.floor(Math.random() * 800 + 100)}\`,
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
            name: \`Дверь \${i + 1}\`,
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
                doors[s].name = \`Переход \${sectors[Math.floor(Math.random()*sectors.length)]}-\${Math.floor(Math.random()*99+1)}\`;
                break;
            }
        }
    }
    
    if (hasMonster) {
        const slots = [1, 2, 3, 4, 5].sort(() => Math.random() - 0.5);
        for (let s of slots) {
            if (doors[s].type === 'empty') {
                doors[s].type = 'monster';
                doors[s].name = \`Дверь \${s + 1}\`;
                break;
            }
        }
    }
    
    state.floorsData[floorNum] = { doors: doors };
    return doors;
}
`;
code = code.replace(genDoorsRegex, newGenDoors);

// 3. Update build3DScene to use buildFloor
// It's a huge block, I'll extract it using string indices
const build3DStart = code.indexOf('function build3DScene() {');
const endOfBuild3D = code.indexOf('function animate3D() {', build3DStart);

let newBuild3D = `
function build3DScene() {
    // Очистка
    if (scene) {
        for (let i = scene.children.length - 1; i >= 0; i--) {
            const obj = scene.children[i];
            if (obj.type === 'Mesh' || obj.type === 'Group' || obj.type === 'PointLight') {
                scene.remove(obj);
            }
        }
    }
    roomMeshes = [];
    transitionMeshes = [];
    staircaseMeshes = [];
    ceilingPipes = [];
    ceilingLights = [];
    doorPivots = [];
    doorLights = [];
    
    scene.fog.color.setHex(0x060709);
    scene.fog.density = 0.06;
    
    // Генерируем текущий этаж, 2 выше и 2 ниже
    for (let i = 2; i >= -2; i--) {
        const floorNum = state.floor + i;
        const baseY = i * 5.0; // 5 метров высота между этажами
        buildFloor(floorNum, baseY);
    }
}
`;

fs.writeFileSync('C:/Users/m3615/samosbor_game/app.js.refactored1', code.substring(0, build3DStart) + newBuild3D + code.substring(endOfBuild3D));
`;
