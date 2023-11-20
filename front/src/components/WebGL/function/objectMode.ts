import Item from '../class/Item';
import data from '../interface/gameData';

function createItem() {
    const x = Math.random() * data.canvasRef!.clientWidth;
    const y = Math.random() * data.canvasRef!.clientHeight;
    const radius = 3;
    const newItem = new Item(x, y, radius);
    data.items.push(newItem);
}
