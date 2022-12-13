import { computed, Ref, ref } from "vue"
import { Cell } from "./cell";

const map: Ref<Cell[]> = ref([]);

const selectedCell: Ref<Cell | null> = ref(null);
const undoStack: Ref<Cell[]> = ref([]);

export const useMap = () => {
	const resetMap = () => {
		selectedCell.value = null;
		undoStack.value = [];
		map.value = [];
		for (let x = 1; x <= 7; x++)
			for (let y = 1; y <= 7; y++)
				if ((x > 2 && x < 6) || (y > 2 && y < 6))
					map.value.push({
						isTaken: true,
						x, y
					});

		const emptyCell = map.value.find(cell => cell.x === 4 && cell.y === 4)!;
		emptyCell.isTaken = false;
	}

	const isUndoStackEmpty = () => undoStack.value.length === 0;
	const undo = () => {
		const actions = [{...undoStack.value.pop()}, {...undoStack.value.pop()}, {...undoStack.value.pop()}];
		actions.forEach(action => {
			const toUpdate = map.value.find(node => node.x == action.x && node.y == action.y)!;
			toUpdate.isTaken = !action.isTaken;
		});
	}

	const isLost = computed(() => {
		const takenNodes = map.value.filter(x => x.isTaken);

		for(let i = 0;i < takenNodes.length;i++) {
			const rightCell = map.value.filter(node => takenNodes[i].x + 1 === node.x && takenNodes[i].y === node.y && node.isTaken);
			if(rightCell.length === 1 && map.value.filter(node => rightCell[0].x + 1 === node.x && rightCell[0].y === node.y && !node.isTaken).length === 1)
				return false;
			const leftCell = map.value.filter(node => takenNodes[i].x - 1 === node.x && takenNodes[i].y === node.y && node.isTaken);
			if(leftCell.length === 1 && map.value.filter(node => leftCell[0].x - 1 === node.x && leftCell[0].y === node.y && !node.isTaken).length === 1)
				return false;
			const topCell = map.value.filter(node => takenNodes[i].y - 1 === node.y && takenNodes[i].x === node.x && node.isTaken);
			if(topCell.length === 1 && map.value.filter(node => topCell[0].y - 1 === node.y && topCell[0].x === node.x && !node.isTaken).length === 1)
				return false;
			const bottomCell = map.value.filter(node => takenNodes[i].y + 1 === node.y && takenNodes[i].x === node.x && node.isTaken);
			if(bottomCell.length === 1 && map.value.filter(node => bottomCell[0].y + 1 === node.y && bottomCell[0].x === node.x && !node.isTaken).length === 1)
				return false;
		}
		return true;

	});

	const isWon = computed(() => map.value.filter(x => x.isTaken == true).length === 1);

	const handleClickCell = (x: number, y: number) => {
		const cell = map.value.find(node => node.x == x && node.y == y)!;
		if (cell.isTaken)
			selectedCell.value = cell;
		else if (selectedCell.value) {
			//  Check if focused cell has common axis with empty space
			const xAxis = selectedCell.value.x === x;
			const yAxis = selectedCell.value.y === y;
			if (!xAxis && !yAxis)
				return;

			const xDiff = (selectedCell.value.x - x);
			const yDiff = (selectedCell.value.y - y);
			const diff = Math.sqrt(xDiff * xDiff + yDiff * yDiff);
			if (diff !== 2)
				return;

			let cellToFree: (Cell | null) = null;

			if (xAxis) {
				const removeTargetY = y < selectedCell.value.y ? y + 1 : y - 1;
				cellToFree = map.value.find(node => node.x == x && node.y == removeTargetY)!;
			} else {
				const removeTargetX = x < selectedCell.value.x ? x + 1 : x - 1;
				cellToFree = map.value.find(node => node.y == y && node.x == removeTargetX)!;
			}
			if (!cellToFree.isTaken)
				return;

			
			cellToFree!.isTaken = false;
			cell.isTaken = true;
			selectedCell.value.isTaken = false;

			undoStack.value.push({...cellToFree});
			undoStack.value.push({...cell});
			undoStack.value.push({...selectedCell.value});


			selectedCell.value = null;
		}
	}

	const focusedCell = computed(() => selectedCell.value);

	const isCellSelected = (x: number, y: number) => focusedCell.value?.x == x && focusedCell.value.y == y;
	const isCellTaken = (x: number, y: number) => map.value.find(node => node.x == x && node.y == y)?.isTaken;

	return {
		resetMap,
		isLost,
		isWon,
		focusedCell,
		handleClickCell,
		isCellTaken,
		isCellSelected,
		undo,
		isUndoStackEmpty
	}
}