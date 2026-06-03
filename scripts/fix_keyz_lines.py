with open('C:/Users/m3615/samosbor_game/app.js', 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_keyz = """        if (e.code === 'KeyZ') {
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
"""

del lines[2890:2901]
lines.insert(2890, new_keyz)

with open('C:/Users/m3615/samosbor_game/app.js', 'w', encoding='utf-8') as f:
    f.writelines(lines)
