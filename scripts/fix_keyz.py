import re

with open('C:/Users/m3615/samosbor_game/app.js', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Remove the incorrectly injected KeyZ block from playSoundDoor
bad_injection = """            if (e.code === 'KeyZ') {
            if (state.location === 'room' && !state.isSearching) {
                const layout = DOOR_LAYOUT[state.focusedDoorIndex];
                if (layout) {
                    const dirX = layout.x < 0 ? -1 : 1;
                    const cabPos = new THREE.Vector3(layout.x + (5.5 * dirX), 0, layout.z - 2.0);
                    const tablePos = new THREE.Vector3(layout.x + (3.7 * dirX), 0, layout.z);
                    
                    if (playerPos.distanceTo(cabPos) < 3.5 || playerPos.distanceTo(tablePos) < 3.0) {
                        searchRoom();
                    } else {
                        logToConsole("Подойдите ближе к столу или шкафу, чтобы искать лут.", "warn");
                    }
                }
            }
        }"""

if bad_injection in content:
    content = content.replace(bad_injection, "")
    print("Removed bad injection from playSoundDoor")

# 2. Find and replace the old KeyZ listener at the bottom
old_keyz = """        if (e.code === 'KeyZ') {
            if (state.location === 'room') {
                const distCabinet = playerPos.distanceTo(new THREE.Vector3(-2.4, 0, -2.6));
                const distTable = playerPos.distanceTo(new THREE.Vector3(0, 0, -1.2));
                if (distCabinet < 2.0 || distTable < 2.0) {
                    searchRoom();
                } else {
                    logToConsole("Подойдите ближе к столу или шкафу, чтобы искать лут.", "warn");
                }
            }
        }"""

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
                        logToConsole("Подойдите ближе к столу или шкафу, чтобы искать лут.", "warn");
                    }
                }
            }
        }"""

if old_keyz in content:
    content = content.replace(old_keyz, new_keyz)
    print("Replaced old KeyZ block successfully.")
else:
    print("WARNING: Old KeyZ block not found. Trying regex...")
    import re
    match = re.search(r"if\s*\(e\.code\s*===\s*'KeyZ'\)\s*\{[\s\S]*?logToConsole\(\"Подойдите ближе.*?warn\"\);\s*\}\s*\}\s*\}", content)
    if match:
        content = content.replace(match.group(0), new_keyz)
        print("Replaced KeyZ via regex!")

with open('C:/Users/m3615/samosbor_game/app.js', 'w', encoding='utf-8') as f:
    f.write(content)
