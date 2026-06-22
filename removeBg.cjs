const { Jimp } = require('jimp');

async function removeBackground() {
    try {
        console.log("Loading image...");
        const image = await Jimp.read('public/fountain-pen-white.png');
        const width = image.bitmap.width;
        const height = image.bitmap.height;
        const data = image.bitmap.data;

        // Helper to get index
        const getIdx = (x, y) => (y * width + x) * 4;

        // Flood fill queue
        const queue = [[0, 0], [width - 1, 0], [0, height - 1], [width - 1, height - 1]];
        const tolerance = 240; // Tolerance for near-white noise in background

        // To keep track of visited pixels to avoid infinite loop
        const visited = new Uint8Array(width * height);

        console.log("Flood filling background to transparent...");
        let head = 0;
        while (head < queue.length) {
            const [x, y] = queue[head++];
            
            if (x < 0 || x >= width || y < 0 || y >= height) continue;
            
            const vIdx = y * width + x;
            if (visited[vIdx]) continue;
            visited[vIdx] = 1;

            const idx = getIdx(x, y);
            const r = data[idx];
            const g = data[idx + 1];
            const b = data[idx + 2];

            if (r >= tolerance && g >= tolerance && b >= tolerance) {
                // Make transparent
                data[idx + 3] = 0;

                // Add neighbors to queue
                queue.push([x + 1, y]);
                queue.push([x - 1, y]);
                queue.push([x, y + 1]);
                queue.push([x, y - 1]);
            }
        }

        console.log("Saving transparent image...");
        image.write('public/fountain-pen-transparent.png');
        console.log("Success!");
    } catch (e) {
        console.error("Error:", e);
    }
}

removeBackground();
