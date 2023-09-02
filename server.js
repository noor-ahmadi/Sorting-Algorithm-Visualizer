const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

function bubbleSort(arr) {
  let steps = [];
  let n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        let temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
        steps.push({ data: [...arr], indices: [j, j + 1] });
      }
    }
  }
  return steps;
}

function quickSort(arr, start = 0, end = arr.length - 1, steps = []) {
  if (start >= end) {
    return steps;
  }

  let pivotIndex = partition(arr, start, end, steps);
  quickSort(arr, start, pivotIndex - 1, steps);
  quickSort(arr, pivotIndex + 1, end, steps);

  return steps;
}

function partition(arr, start, end, steps) {
  const pivotValue = arr[end];
  let pivotIndex = start;
  for (let i = start; i < end; i++) {
    if (arr[i] < pivotValue) {
      [arr[i], arr[pivotIndex]] = [arr[pivotIndex], arr[i]];
      steps.push({ data: [...arr], indices: [i, pivotIndex] });
      pivotIndex++;
    }
  }
  [arr[pivotIndex], arr[end]] = [arr[end], arr[pivotIndex]];
  steps.push({ data: [...arr], indices: [pivotIndex, end] });

  return pivotIndex;
}

function selectionSort(arr) {
  let steps = [];
  let n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    let min_idx = i;
    for (let j = i + 1; j < n; j++) {
      if (arr[j] < arr[min_idx]) {
        min_idx = j;
      }
    }
    let temp = arr[i];
    arr[i] = arr[min_idx];
    arr[min_idx] = temp;
    steps.push({ data: [...arr], indices: [i, min_idx] });
  }
  return steps;
}

function insertionSort(arr) {
  let steps = [];
  let n = arr.length;
  for (let i = 1; i < n; i++) {
    let key = arr[i];
    let j = i - 1;
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j = j - 1;
    }
    arr[j + 1] = key;
    steps.push({ data: [...arr], indices: [j + 1, i] });
  }
  return steps;
}

function cocktailShakerSort(arr) {
  let steps = [];
  let swapped = true;
  let start = 0;
  let end = arr.length;

  while (swapped) {
    swapped = false;

    for (let i = start; i < end - 1; i++) {
      if (arr[i] > arr[i + 1]) {
        [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
        steps.push({ data: [...arr], indices: [i, i + 1] });
        swapped = true;
      }
    }

    if (!swapped) {
      break;
    }

    swapped = false;
    end--;

    for (let i = end - 1; i >= start; i--) {
      if (arr[i] > arr[i + 1]) {
        [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
        steps.push({ data: [...arr], indices: [i, i + 1] });
        swapped = true;
      }
    }

    start++;
  }

  return steps;
}

function mergeSort(arr, start = 0, end = arr.length - 1, steps = []) {
  if (start < end) {
    const middle = Math.floor((start + end) / 2);
    mergeSort(arr, start, middle, steps);
    mergeSort(arr, middle + 1, end, steps);
    merge(arr, start, middle, end, steps);
  }
  return steps;
}

function merge(arr, start, middle, end, steps) {
  const left = arr.slice(start, middle + 1);
  const right = arr.slice(middle + 1, end + 1);

  let k = start;
  let i = 0;
  let j = 0;

  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) {
      arr[k] = left[i];
      i++;
    } else {
      arr[k] = right[j];
      j++;
    }
    k++;
    steps.push({ data: [...arr], indices: [k - 1] });
  }

  while (i < left.length) {
    arr[k] = left[i];
    i++;
    k++;
    steps.push({ data: [...arr], indices: [k - 1] });
  }

  while (j < right.length) {
    arr[k] = right[j];
    j++;
    k++;
    steps.push({ data: [...arr], indices: [k - 1] });
  }
}

function heapSort(arr) {
  let steps = [];
  let n = arr.length;

  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(arr, n, i, steps);
  }

  for (let i = n - 1; i > 0; i--) {
    [arr[0], arr[i]] = [arr[i], arr[0]];
    steps.push({ data: [...arr], indices: [0, i] });

    heapify(arr, i, 0, steps);
  }

  return steps;
}

function heapify(arr, n, i, steps) {
  let largest = i;
  let left = 2 * i + 1;
  let right = 2 * i + 2;

  if (left < n && arr[left] > arr[largest]) {
    largest = left;
  }

  if (right < n && arr[right] > arr[largest]) {
    largest = right;
  }

  if (largest !== i) {
    [arr[i], arr[largest]] = [arr[largest], arr[i]];
    steps.push({ data: [...arr], indices: [i, largest] });

    heapify(arr, n, largest, steps);
  }
}

function gnomeSort(arr) {
  let steps = [];
  let pos = 0;
  while (pos < arr.length) {
    if (pos === 0 || arr[pos] >= arr[pos - 1]) {
      pos++;
    } else {
      [arr[pos], arr[pos - 1]] = [arr[pos - 1], arr[pos]];
      steps.push({ data: [...arr], indices: [pos, pos - 1] });
      pos--;
    }
  }
  return steps;
}
function pancakeSort(arr) {
  let steps = [];
  for (let i = arr.length - 1; i >= 1; i--) {
    let max_idx = 0;
    for (let j = 1; j <= i; j++) {
      if (arr[j] > arr[max_idx]) {
        max_idx = j;
      }
    }
    if (max_idx !== i) {
      if (max_idx !== 0) {
        flip(arr, max_idx);
        steps.push({ data: [...arr], indices: [0, max_idx] });
      }
      flip(arr, i);
      steps.push({ data: [...arr], indices: [0, i] });
    }
  }
  return steps;
}

function flip(arr, k) {
  let start = 0;
  while (start < k) {
    [arr[start], arr[k]] = [arr[k], arr[start]];
    start++;
    k--;
  }
}

function radixSort(arr) {
  let steps = [];
  let maxNum = Math.max(...arr);
  let digitCount = Math.floor(Math.log10(maxNum)) + 1;

  for (let i = 0; i < digitCount; i++) {
    let digitBuckets = Array.from({ length: 10 }, () => []);
    for (let j = 0; j < arr.length; j++) {
      let digit = getDigit(arr[j], i);
      digitBuckets[digit].push(arr[j]);
    }
    arr = [].concat(...digitBuckets);
    steps.push({ data: [...arr] });
  }

  return steps;
}

function getDigit(num, place) {
  return Math.floor(Math.abs(num) / Math.pow(10, place)) % 10;
}

function combSort(arr) {
  let steps = [];
  let gap = arr.length;
  let shrink = 1.3;
  let sorted = false;

  while (!sorted) {
    gap = Math.floor(gap / shrink);
    if (gap <= 1) {
      gap = 1;
      sorted = true;
    }
    for (let i = 0; i + gap < arr.length; i++) {
      if (arr[i] > arr[i + gap]) {
        [arr[i], arr[i + gap]] = [arr[i + gap], arr[i]];
        steps.push({ data: [...arr], indices: [i, i + gap] });
        sorted = false;
      }
    }
  }

  return steps;
}

function timsort(arr) {
  const RUN = 32;
  let steps = [];
  let n = arr.length;

  for (let i = 0; i < n; i += RUN) {
    insertionSortForTim(arr, i, Math.min(i + 31, n - 1), steps);
  }

  for (let size = RUN; size < n; size = 2 * size) {
    for (let left = 0; left < n; left += 2 * size) {
      let mid = left + size - 1;
      let right = Math.min(left + 2 * size - 1, n - 1);
      mergeForTim(arr, left, mid, right, steps);
    }
  }

  return steps;
}

function insertionSortForTim(arr, left, right, steps) {
  for (let i = left + 1; i <= right; i++) {
    let key = arr[i];
    let j = i - 1;
    while (j >= left && arr[j] > key) {
      arr[j + 1] = arr[j];
      j--;
    }
    arr[j + 1] = key;
    steps.push({ data: [...arr], indices: [j + 1, i] });
  }
}

function mergeForTim(arr, l, m, r, steps) {
  const len1 = m - l + 1;
  const len2 = r - m;
  let left = new Array(len1);
  let right = new Array(len2);

  for (let x = 0; x < len1; x++) {
    left[x] = arr[l + x];
  }
  for (let x = 0; x < len2; x++) {
    right[x] = arr[m + 1 + x];
  }

  let i = 0;
  let j = 0;
  let k = l;

  while (i < len1 && j < len2) {
    if (left[i] <= right[j]) {
      arr[k] = left[i];
      i++;
    } else {
      arr[k] = right[j];
      j++;
    }
    k++;
    steps.push({ data: [...arr] });
  }

  while (i < len1) {
    arr[k] = left[i];
    k++;
    i++;
    steps.push({ data: [...arr] });
  }

  while (j < len2) {
    arr[k] = right[j];
    k++;
    j++;
    steps.push({ data: [...arr] });
  }
}

io.on("connection", (socket) => {
  socket.on("startSorting", ({ algorithm, data, totalDuration }) => {
    let steps = [];
    switch (algorithm) {
      case "bubbleSort":
        steps = bubbleSort([...data]);
        break;
      case "selectionSort":
        steps = selectionSort([...data]);
        break;
      case "quickSort":
        steps = quickSort([...data]);
        break;
      case "insertionSort":
        steps = insertionSort([...data]);
        break;
      case "mergeSort":
        steps = mergeSort([...data]);
        break;
      case "cocktailShakerSort":
        steps = cocktailShakerSort([...data]);
        break;
      case "heapSort":
        steps = heapSort([...data]);
        break;
      case "gnomeSort":
        steps = gnomeSort([...data]);
        break;
      case "pancakeSort":
        steps = pancakeSort([...data]);
        break;
      case "radixSort":
        steps = radixSort([...data]);
        break;
      case "combSort":
        steps = combSort([...data]);
        break;
      case "timsort":
        steps = timsort([...data]);
        break;
      default:
        break;
    }
    const delay = totalDuration / steps.length;
    steps.forEach((step, index) => {
      setTimeout(() => {
        socket.emit("sortingData", step, delay);
      }, index * delay);
    });
  });
});

server.listen(3000, () => {
  console.log("Server is running on port 3000");
});
