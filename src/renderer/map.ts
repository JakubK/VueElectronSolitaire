import { computed, Ref, ref } from "vue"
import { Cell } from "./cell";

const map:Ref<Cell[]> = ref([]);

const selectedCell:Ref<Cell | null> = ref(null);

export const useMap = () => {
    const resetMap = () => {
        map.value = [];
        for(let x = 1; x <= 7;x++)
        {
            for(let y = 1;y <= 7;y++)
            {
                if((x > 2 && x < 6) || (y > 2 && y < 6))
                map.value.push({
                    isTaken: true,
                    x,y
                });
            }
        }

        const emptyCell = map.value.find(cell => cell.x === 4 && cell.y === 4)!;
        emptyCell.isTaken = false;
    }

    const isLost = computed(() => {
        const takenNodes = map.value.filter(x => x.isTaken);
        for(let i = 0;i < takenNodes.length;i++) {
            const foundXAdjacency = takenNodes.findIndex(node => node.x + 1 == takenNodes[i].x && node.y == takenNodes[i].y || node.x - 1 == takenNodes[i].x);
            if(foundXAdjacency)
                return false;
            const foundYAdjacency = takenNodes.findIndex(node => node.y + 1 == takenNodes[i].y && node.x == takenNodes[i].x || node.y - 1 == takenNodes[i].y);
            if(foundYAdjacency)
                return false;
        }
        return true;
    });

    const isWon = computed(() => map.value.filter(x => x.isTaken == true).length === 1);

    const handleClickCell = (x:number, y:number) => {
        const cell = map.value.find(node => node.x == x && node.y == y)!;
        if(cell.isTaken)
            selectedCell.value = cell;
        else if(selectedCell.value) {
            //  Check if focused cell has common axis with empty space
            const xAxis = selectedCell.value.x === x;
            const yAxis = selectedCell.value.y === y;
            if(!xAxis && !yAxis)
                return;
            
            const xDiff = (selectedCell.value.x - x);
            const yDiff = (selectedCell.value.y - y);
            const diff = Math.sqrt(xDiff*xDiff + yDiff*yDiff);
            if(diff !== 2)
                return;
            
            let cellToFree: (Cell|null) = null;

            if(xAxis) {
                const removeTargetY = y < selectedCell.value.y ? y + 1 : y - 1;
                cellToFree = map.value.find(node => node.x == x && node.y == removeTargetY)!;
            } else {
                const removeTargetX = x < selectedCell.value.x ? x + 1 : x - 1;
                cellToFree = map.value.find(node => node.y == y && node.x == removeTargetX)!;
            }
            if(!cellToFree.isTaken)
                return;
            cellToFree!.isTaken = false;
            cell.isTaken = true;
            selectedCell.value.isTaken = false;
            selectedCell.value = null;

            //  Unselect cell
            selectedCell.value = null;


            const takenNodes = map.value.filter(x => x.isTaken);
            console.log(takenNodes);
        }
    }

    const focusedCell = computed(() => selectedCell.value);

    const isCellSelected = (x: number, y:number) => focusedCell.value?.x == x && focusedCell.value.y == y;
    const isCellTaken = (x: number, y:number) => map.value.find(node => node.x == x && node.y == y)?.isTaken;

    return {
        resetMap,
        isLost,
        isWon,
        focusedCell,
        handleClickCell,
        isCellTaken,
        isCellSelected
    }
}