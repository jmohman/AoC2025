export function printMap<T>(map:T[][], getCellTextRepresentation:(cellValue: T) => string) {

    for (let row = 0; row < map.length; row++) {
        for (let col = 0; col < map[row].length; col++) {
            process.stdout.write(getCellTextRepresentation(map[row][col]));
        }

        process.stdout.write("\n");
    }
}