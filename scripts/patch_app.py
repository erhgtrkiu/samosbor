import re
import sys

with open('../app.js', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Strip emojis and keybinds
content = content.replace('"🚪 Открыть дверь (R)"', '"Открыть дверь"')
content = content.replace('"🚪 Взаимодействовать"', '"Взаимодействовать"')
content = content.replace("'<span class=\"btn-icon\">🎭</span> Снять противогаз (T)'", "'Снять противогаз'")
content = content.replace("'<span class=\"btn-icon\">🎭</span> Надеть противогаз (T)'", "'Надеть противогаз'")
content = content.replace("`<span class=\"btn-icon\">✨</span> Застыть на месте и ждать`", "'Застыть на месте и ждать'")
content = content.replace("`<span class=\"btn-icon\">👣</span> Идите на лестницу в конце коридора`", "'Идите на лестницу в конце коридора'")

# 2. Detailed models generator functions
models_code = """
function createDetailedCabinet(dirX) {
    const group = new THREE.Group();
    const woodMat = new THREE.MeshStandardMaterial({ color: 0x3d2314, roughness: 0.9 });
    const glassMat = new THREE.MeshStandardMaterial({ color: 0x88ccff, transparent: true, opacity: 0.5, roughness: 0.1 });
    const handleMat = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, roughness: 0.4, metalness: 0.8 });
    
    const base = new THREE.Mesh(new THREE.BoxGeometry(1.8, 1.5, 0.8), woodMat);
    base.position.y = 0.75;
    base.castShadow = true; base.receiveShadow = true;
    group.add(base);
    
    const top = new THREE.Mesh(new THREE.BoxGeometry(1.7, 2.0, 0.7), woodMat);
    top.position.y = 2.5;
    top.castShadow = true; top.receiveShadow = true;
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
    top.castShadow = true; top.receiveShadow = true;
    group.add(top);
    
    const legGeo = new THREE.BoxGeometry(0.1, 0.9, 0.1);
    const positions = [
        [-0.7, -0.4], [0.7, -0.4], [-0.7, 0.4], [0.7, 0.4]
    ];
    positions.forEach(pos => {
        const leg = new THREE.Mesh(legGeo, woodMat);
        leg.position.set(pos[0], 0.45, pos[1]);
        leg.castShadow = true; leg.receiveShadow = true;
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
    base.castShadow = true; base.receiveShadow = true;
    group.add(base);
    
    const deck = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.8, 1.5), metalMat);
    deck.position.set(-0.15 * dirX, 1.2, 0);
    deck.rotation.z = (Math.PI / 6) * dirX;
    deck.castShadow = true; deck.receiveShadow = true;
    group.add(deck);
    
    const screen = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.5, 0.8), screenMat);
    screen.position.set(-0.46 * dirX, 1.35, 0);
    screen.rotation.z = (Math.PI / 6) * dirX;
    group.add(screen);
    
    return group;
}

function buildFloor(floorNum, baseY) {
"""

content = content.replace("function buildFloor(floorNum, baseY) {", models_code)

# 3. Optimize lights (Only instantiate lights if floor is within 1 level of player)
light_pattern1 = """        const pl = new THREE.PointLight(0xd5ffd0, 0.65, 16);
        pl.position.set(0, baseY + 4.5, z);
        pl.castShadow = false; // Отключено для производительности
        scene.add(pl);
        ceilingLights.push(pl);"""

light_replacement1 = """        if (Math.abs(floorNum - state.floor) <= 1) {
            const pl = new THREE.PointLight(0xd5ffd0, 0.65, 16);
            pl.position.set(0, baseY + 4.5, z);
            pl.castShadow = false;
            scene.add(pl);
            ceilingLights.push(pl);
        }"""
content = content.replace(light_pattern1, light_replacement1)

light_pattern2 = """    const wl = new THREE.PointLight(0xff0000, 0, 15);
    wl.position.set(0, baseY + 4.4, -38);
    wl.castShadow = false; // Отключено для производительности
    scene.add(wl);
    warningLights.push(wl);"""

light_replacement2 = """    if (Math.abs(floorNum - state.floor) <= 1) {
        const wl = new THREE.PointLight(0xff0000, 0, 15);
        wl.position.set(0, baseY + 4.4, -38);
        wl.castShadow = false;
        scene.add(wl);
        warningLights.push(wl);
    }"""
content = content.replace(light_pattern2, light_replacement2)

# 4. Integrate detailed models in buildFloor
old_cab_table = """                const cab = new THREE.Mesh(new THREE.BoxGeometry(1.8, 3.5, 0.8), new THREE.MeshStandardMaterial({ color: 0x3d2314, roughness: 0.9 }));
                cab.position.set(layout.x + (5.5 * dirX), baseY + 1.75, roomCenterZ - 2.0);
                cab.castShadow = true;
                cab.receiveShadow = true;
                roomGroup.add(cab);
                
                const table = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.0, 1.0), new THREE.MeshStandardMaterial({ color: 0x5e3a21, roughness: 0.8 }));
                table.position.set(roomCenterX, baseY + 0.5, roomCenterZ);
                table.castShadow = true;
                table.receiveShadow = true;
                roomGroup.add(table);"""

new_cab_table = """                const cab = createDetailedCabinet(dirX);
                cab.position.set(layout.x + (5.5 * dirX), baseY, roomCenterZ - 2.0);
                roomGroup.add(cab);
                
                const table = createDetailedTable();
                table.position.set(roomCenterX, baseY, roomCenterZ);
                roomGroup.add(table);"""
content = content.replace(old_cab_table, new_cab_table)

old_panel = """                const panel = new THREE.Mesh(new THREE.BoxGeometry(0.5, 1.5, 1.5), new THREE.MeshStandardMaterial({ color: 0x333333 }));
                panel.position.set(layout.x + (4.5 * dirX), baseY + 0.75, roomCenterZ);
                panel.castShadow = true;
                panel.receiveShadow = true;
                roomGroup.add(panel);"""

new_panel = """                const panel = createDetailedPanel(dirX);
                panel.position.set(layout.x + (4.5 * dirX), baseY, roomCenterZ);
                roomGroup.add(panel);"""
content = content.replace(old_panel, new_panel)

# Optimize room point lights
old_room_light = """                const roomLight = new THREE.PointLight(0xffeedd, 0.3, 8);
                roomLight.position.set(roomCenterX, baseY + 4, roomCenterZ);
                roomLight.visible = doorObj.opened;
                roomLight.castShadow = false; // Отключено во избежание лагов
                roomGroup.add(roomLight);
                doorLights[floorNum + '_' + idx] = roomLight;"""

new_room_light = """                if (Math.abs(floorNum - state.floor) <= 1) {
                    const roomLight = new THREE.PointLight(0xffeedd, doorObj.opened ? 0.3 : 0, 8);
                    roomLight.position.set(roomCenterX, baseY + 4, roomCenterZ);
                    roomLight.castShadow = false;
                    roomGroup.add(roomLight);
                    doorLights[floorNum + '_' + idx] = roomLight;
                }"""
content = content.replace(old_room_light, new_room_light)

old_trans_light = """                const transLight = new THREE.PointLight(0x00aaff, 0.5, 6);
                transLight.position.set(roomCenterX, baseY + 4, roomCenterZ);
                transLight.visible = doorObj.opened;
                transLight.castShadow = (floorNum === state.floor);
                roomGroup.add(transLight);
                doorLights[floorNum + '_' + idx] = transLight;"""

new_trans_light = """                if (Math.abs(floorNum - state.floor) <= 1) {
                    const transLight = new THREE.PointLight(0x00aaff, doorObj.opened ? 0.5 : 0, 6);
                    transLight.position.set(roomCenterX, baseY + 4, roomCenterZ);
                    transLight.castShadow = (floorNum === state.floor);
                    roomGroup.add(transLight);
                    doorLights[floorNum + '_' + idx] = transLight;
                }"""
content = content.replace(old_trans_light, new_trans_light)


# 5. Fix Room Physical Bounds (prevent clipping through side, back, and front walls away from door)
old_room_bounds = """                const corridorBoundary = isLeft ? -2.4 : 2.4;
                const doorBoundary = isLeft ? -3.0 : 3.0;
                const backWallX = isLeft ? layout.x - roomDepth : layout.x + roomDepth;
                
                if (doorObj.opened && inZDoorway) {
                    if (isLeft && nextX < corridorBoundary && nextX > doorBoundary) {
                        insideRoomIdx = idx;
                        playerPos.x = nextX;
                        playerPos.z = nextZ;
                    } else if (!isLeft && nextX > corridorBoundary && nextX < doorBoundary) {
                        insideRoomIdx = idx;
                        playerPos.x = nextX;
                        playerPos.z = nextZ;
                    }
                }
                
                if (doorObj.opened && inZRoom) {
                    if (isLeft && nextX <= doorBoundary && nextX >= backWallX + 0.5) {
                        let collision = false;
                        if (doorObj.type === 'apartment') {
                            const cabX = layout.x - 5.5;
                            const roomCenterZ = layout.z;
                            if (Math.abs(nextX - cabX) < 1.0 && Math.abs(nextZ - (roomCenterZ - 2.0)) < 0.5) collision = true;
                            
                            const tableX = layout.x - 3.5;
                            if (Math.abs(nextX - tableX) < 0.9 && Math.abs(nextZ - roomCenterZ) < 0.6) collision = true;
                        } else if (doorObj.type === 'transition') {
                            const panelX = layout.x - 4.5;
                            if (Math.abs(nextX - panelX) < 0.4 && Math.abs(nextZ - layout.z) < 0.8) collision = true;
                        }
                        
                        if (!collision) {
                            insideRoomIdx = idx;
                            playerPos.x = nextX;
                            playerPos.z = nextZ;
                        }
                    } else if (!isLeft && nextX >= doorBoundary && nextX <= backWallX - 0.5) {
                        let collision = false;
                        if (doorObj.type === 'apartment') {
                            const cabX = layout.x + 5.5;
                            const roomCenterZ = layout.z;
                            if (Math.abs(nextX - cabX) < 1.0 && Math.abs(nextZ - (roomCenterZ - 2.0)) < 0.5) collision = true;
                            
                            const tableX = layout.x + 3.5;
                            if (Math.abs(nextX - tableX) < 0.9 && Math.abs(nextZ - roomCenterZ) < 0.6) collision = true;
                        } else if (doorObj.type === 'transition') {
                            const panelX = layout.x + 4.5;
                            if (Math.abs(nextX - panelX) < 0.4 && Math.abs(nextZ - layout.z) < 0.8) collision = true;
                        }
                        
                        if (!collision) {
                            insideRoomIdx = idx;
                            playerPos.x = nextX;
                            playerPos.z = nextZ;
                        }
                    }
                }"""

new_room_bounds = """                const corridorBoundary = isLeft ? -2.4 : 2.4;
                const doorBoundary = isLeft ? -3.0 : 3.0;
                const backWallX = isLeft ? layout.x - roomDepth + 0.5 : layout.x + roomDepth - 0.5;
                const zMin = layout.z - roomWidth + 0.5;
                const zMax = layout.z + roomWidth - 0.5;
                
                if (doorObj.opened) {
                    // Check if player is transitioning through the doorway
                    if (inZDoorway) {
                        if (isLeft && nextX < corridorBoundary && nextX > doorBoundary) {
                            insideRoomIdx = idx;
                            playerPos.x = nextX;
                            playerPos.z = nextZ;
                        } else if (!isLeft && nextX > corridorBoundary && nextX < doorBoundary) {
                            insideRoomIdx = idx;
                            playerPos.x = nextX;
                            playerPos.z = nextZ;
                        }
                    }
                    
                    // Inside the room logic, strictly confined to the room bounding box
                    if (nextZ >= zMin && nextZ <= zMax) {
                        if (isLeft && nextX <= doorBoundary && nextX >= backWallX) {
                            let collision = false;
                            if (doorObj.type === 'apartment') {
                                const cabX = layout.x - 5.5;
                                if (Math.abs(nextX - cabX) < 1.0 && Math.abs(nextZ - (layout.z - 2.0)) < 0.5) collision = true;
                                const tableX = layout.x - 3.5;
                                if (Math.abs(nextX - tableX) < 0.9 && Math.abs(nextZ - layout.z) < 0.6) collision = true;
                            } else if (doorObj.type === 'transition') {
                                const panelX = layout.x - 4.5;
                                if (Math.abs(nextX - panelX) < 0.4 && Math.abs(nextZ - layout.z) < 0.8) collision = true;
                            }
                            
                            if (!collision) {
                                insideRoomIdx = idx;
                                playerPos.x = nextX;
                                playerPos.z = nextZ;
                            }
                        } else if (!isLeft && nextX >= doorBoundary && nextX <= backWallX) {
                            let collision = false;
                            if (doorObj.type === 'apartment') {
                                const cabX = layout.x + 5.5;
                                if (Math.abs(nextX - cabX) < 1.0 && Math.abs(nextZ - (layout.z - 2.0)) < 0.5) collision = true;
                                const tableX = layout.x + 3.5;
                                if (Math.abs(nextX - tableX) < 0.9 && Math.abs(nextZ - layout.z) < 0.6) collision = true;
                            } else if (doorObj.type === 'transition') {
                                const panelX = layout.x + 4.5;
                                if (Math.abs(nextX - panelX) < 0.4 && Math.abs(nextZ - layout.z) < 0.8) collision = true;
                            }
                            
                            if (!collision) {
                                insideRoomIdx = idx;
                                playerPos.x = nextX;
                                playerPos.z = nextZ;
                            }
                        }
                    }
                }"""
content = content.replace(old_room_bounds, new_room_bounds)

# 6. Dynamic coordinates for searching
old_interact = """    } else if (state.location === 'room') {
        const dist = playerPos.distanceTo(new THREE.Vector3(-2.4, 0, -2.6)); // TODO: dynamic coordinates
        if (dist < 3.0) {
            searchRoom();
        } else {
            logToConsole("Подойдите ближе к серванту или столу.", "warn");
        }
    } else if (state.location === 'transition') {"""

new_interact = """    } else if (state.location === 'room') {
        const layout = DOOR_LAYOUT[state.focusedDoorIndex];
        const dirX = layout.x < 0 ? -1 : 1;
        const cabPos = new THREE.Vector3(layout.x + (5.5 * dirX), 0, layout.z - 2.0);
        const tablePos = new THREE.Vector3(layout.x + (3.5 * dirX), 0, layout.z);
        
        if (playerPos.distanceTo(cabPos) < 3.0 || playerPos.distanceTo(tablePos) < 2.5) {
            searchRoom();
        } else {
            logToConsole("Подойдите ближе к мебели.", "warn");
        }
    } else if (state.location === 'transition') {"""
content = content.replace(old_interact, new_interact)

old_z_key = """    if (e.code === 'KeyZ' && state.location === 'room' && !state.isSearching) {
        if (playerPos.distanceTo(new THREE.Vector3(-2.4, 0, -2.6)) < 3.0) {
            searchRoom();
        } else {
            logToConsole("Слишком далеко от мебели.", "warn");
        }
    }"""

new_z_key = """    if (e.code === 'KeyZ' && state.location === 'room' && !state.isSearching) {
        const layout = DOOR_LAYOUT[state.focusedDoorIndex];
        const dirX = layout.x < 0 ? -1 : 1;
        const cabPos = new THREE.Vector3(layout.x + (5.5 * dirX), 0, layout.z - 2.0);
        const tablePos = new THREE.Vector3(layout.x + (3.5 * dirX), 0, layout.z);
        
        if (playerPos.distanceTo(cabPos) < 3.0 || playerPos.distanceTo(tablePos) < 2.5) {
            searchRoom();
        } else {
            logToConsole("Слишком далеко от мебели.", "warn");
        }
    }"""
content = content.replace(old_z_key, new_z_key)


# 7. Add closeDoor and update interactWithFocused / lockRoom / exitRoom
close_door_func = """function closeDoor() {
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
"""

content = content.replace("function searchRoom() {", close_door_func + "\nfunction searchRoom() {")

# Modify interactWithFocused to close door if opened
old_interact_door = """    if (state.location === 'hallway' && state.focusedDoorIndex !== null) {
        const door = state.doors[state.focusedDoorIndex];
        if (door.opened) return; // Уже открыта, можно просто зайти"""

new_interact_door = """    if (state.location === 'hallway' && state.focusedDoorIndex !== null) {
        const door = state.doors[state.focusedDoorIndex];
        if (door.opened) {
            closeDoor();
            return;
        }"""
content = content.replace(old_interact_door, new_interact_door)

# Modify lockRoom
old_lock_room = """function lockRoom() {
    initAudio();
    if (state.focusedDoorIndex === null) return;
    
    const door = state.doors[state.focusedDoorIndex];
    door.opened = false;
    
    playSoundDoor();
    logToConsole("Дверь заперта изнутри.", "action");
    
    // Перестраиваем чтобы дверь визуально закрылась
    build3DScene();
    
    const lockBtn = document.getElementById('btn-lock-room');
    if (lockBtn) {
        lockBtn.setAttribute('disabled', 'true');
        lockBtn.classList.add('btn-disabled');
        lockBtn.innerText = "Дверь заперта";
    }
}"""

new_lock_room = """function lockRoom() {
    initAudio();
    if (state.focusedDoorIndex === null) return;
    
    const door = state.doors[state.focusedDoorIndex];
    door.opened = false;
    
    playSoundDoor();
    logToConsole("Дверь заперта изнутри.", "action");
    
    // Визуальное закрытие без build3DScene
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
    
    const lockBtn = document.getElementById('btn-lock-room');
    if (lockBtn) {
        lockBtn.setAttribute('disabled', 'true');
        lockBtn.classList.add('btn-disabled');
        lockBtn.innerText = "Дверь заперта";
    }
}"""
content = content.replace(old_lock_room, new_lock_room)

# Modify exitRoom
old_exit_room = """function exitRoom() {
    initAudio();
    if (state.focusedDoorIndex === null) return;
    
    const door = state.doors[state.focusedDoorIndex];
    if (!door.opened) {
        door.opened = true;
        playSoundDoor();
        build3DScene(); // Обновить дверь
    }
    
    // Автоматически перемещаем игрока в коридор
    const layout = DOOR_LAYOUT[state.focusedDoorIndex];
    const isLeft = layout.x < 0;
    
    playerPos.set(isLeft ? -1.5 : 1.5, 0, layout.z);
    playerYaw = isLeft ? Math.PI / 2 : -Math.PI / 2;
    camera.rotation.y = 0;
    
    state.location = 'hallway';
    state.focusedDoorIndex = null;
    
    updateHUD();
    logToConsole("Вы вышли в коридор.", "action");
}"""

new_exit_room = """function exitRoom() {
    initAudio();
    if (state.focusedDoorIndex === null) return;
    
    const door = state.doors[state.focusedDoorIndex];
    if (!door.opened) {
        door.opened = true;
        playSoundDoor();
        
        const pivot = doorPivots.find(p => p.userData.doorIndex === state.focusedDoorIndex && p.userData.floor === state.floor);
        if (pivot) {
            const layout = DOOR_LAYOUT[state.focusedDoorIndex];
            let angle = pivot.rotation.y;
            const targetAngle = layout.rot + Math.PI / 2;
            const anim = setInterval(() => {
                angle += 0.1;
                if (angle >= targetAngle) {
                    pivot.rotation.y = targetAngle;
                    clearInterval(anim);
                } else {
                    pivot.rotation.y = angle;
                }
            }, 16);
        }
    }
    
    const layout = DOOR_LAYOUT[state.focusedDoorIndex];
    const isLeft = layout.x < 0;
    
    playerPos.set(isLeft ? -1.5 : 1.5, 0, layout.z);
    playerYaw = isLeft ? Math.PI / 2 : -Math.PI / 2;
    camera.rotation.y = 0;
    
    state.location = 'hallway';
    state.focusedDoorIndex = null;
    
    updateHUD();
    logToConsole("Вы вышли в коридор.", "action");
}"""
content = content.replace(old_exit_room, new_exit_room)

with open('../app.js', 'w', encoding='utf-8') as f:
    f.write(content)
print("app.js patched successfully.")
