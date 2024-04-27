<template>
  <pre class="vimeditor" :style="editorStyle" tabindex="1" @keypress="keyEvent">
    <div class="vimeditor__numbers">
      <div :style="'height: ' + LINE_HEIGHT + 'px'"
        :class="index == cursorPosition.row ? 'numbers__number-focus' : 'numbers__number'" :key="index"
        v-for="(number, index) in numbers">{{ number }}</div>
    </div>
    <div class="vimeditor__content">
      <div :style="'height: ' + LINE_HEIGHT + 'px'" :key="index" v-for="(line, index) in lines"
        :class="index == cursorPosition.row ? 'content__line-focus' : 'content__line'">{{ line }}</div>
      <div class="content__cursor" :style="cursorStyle">
      </div>
    </div>
    <div class="vimeditor__status-line">
      <div class="vimeditor__mode">{{ mode.toString() }}</div>
      <div class="vimeditor__file">{{ title }}</div>
    </div>
    <div class="vimeditor__commandline"></div>
    <div class="overlay"></div>
  </pre>
</template>

<script lang="ts" setup>
import { computed, ref, type Ref } from 'vue';

const LINE_HEIGHT = 18;
const CURSOR_WIDTH = 7.23;

export interface VimEditorProps {
  title?: string;
  height?: number;
}

interface CursorPosition {
  row: number;
  column: number;
}

enum Mode {
  Normal = "NORMAL",
  Insert = "INSERT",
  Visual = "VISUAL",
  Command = "COMMAND",
  Replace = "REPLACE"
}

const props = withDefaults(defineProps<VimEditorProps>(), {
  title: "exercise.txt", height: 10
});

const mode: Ref<Mode> = ref(Mode.Normal);

const cursorPosition: Ref<CursorPosition> = ref({ row: 0, column: 0 })
const numbers: Ref<number[]> = ref([]);
const lines = ref(["Line1 aonseuthaso haoeh uhhusnoeh usnaothusaotnhuasonuh", "Line2", "Line2", "Line2", "Line2", "Line2", "Line2", "Line2", "Line2"]);

const editorStyle = ref({
  height: (props.height + 2) * LINE_HEIGHT + 'px',
});

const cursorStyle = computed(() => {
  const row = cursorPosition.value.row;
  const column = cursorPosition.value.column;
  const line_len = lines.value[row].length;

  return {
    top: row * LINE_HEIGHT + 'px',
    left: ((column < line_len) ? column : line_len - 1) * CURSOR_WIDTH + 'px'
  }
});

const updateNumbers = () => {
  let numbersUpdated = [];
  const row = cursorPosition.value.row;

  for (let i = 0; i < lines.value.length; i++) {
    const number = (i === row) ? i + 1 : Math.abs(i - row);
    numbersUpdated.push(number);
  }

  numbers.value = numbersUpdated
}

updateNumbers();

const changeMode = (newMode: Mode) => {
  mode.value = newMode;
};

const cursorGoDown = () => {
  if (cursorPosition.value.row + 1 < lines.value.length) {
    cursorPosition.value.row += 1;
    updateNumbers();
  }
};
const cursorGoUp = () => {
  if (cursorPosition.value.row > 0) {
    cursorPosition.value.row -= 1;
    updateNumbers();
  }
};
const cursorGoLeft = () => {
  const line_len = lines.value[cursorPosition.value.row].length;

  if (cursorPosition.value.column > 0) {
    if (cursorPosition.value.column < line_len) {
      cursorPosition.value.column -= 1;
    } else {
      cursorPosition.value.column = line_len - 2;
    }
    updateNumbers()
  }
};
const cursorGoRight = () => {
  const line_len = lines.value[cursorPosition.value.row].length;

  if (cursorPosition.value.column + 1 < line_len) {
    cursorPosition.value.column += 1;
    updateNumbers()
  }
};

const keyEvent = (event: KeyboardEvent) => {
  event.preventDefault();
  const keyPressed = event.code;

  switch (keyPressed) {
    case 'KeyI':
      changeMode(Mode.Insert);
      break;
    case 'Escape':
      changeMode(Mode.Normal);
      break;
    case 'Period':
      changeMode(Mode.Command);
      break;
    default:
      handleEvents(keyPressed);
  }
}

const handleEvents = (keyCode: string) => {
  switch (mode.value) {
    case Mode.Normal:
      handleNormalEvents(keyCode);
      break
  }
};

const handleNormalEvents = (keyCode: string) => {
  switch (keyCode) {
    case 'KeyJ':
      cursorGoDown();
      break;
    case 'KeyK':
      cursorGoUp();
      break;
    case 'KeyH':
      cursorGoLeft();
      break;
    case 'KeyL':
      cursorGoRight();
      break;
  }
};
</script>

<style lang="css">
.vimeditor {
  position: relative;
  display: grid;
  grid-template-columns: 2.5rem 1fr;
  grid-template-rows: 1fr auto auto;
  grid-template-areas:
    "numbers content"
    "statusline statusline"
    "commandline commandline";

  column-gap: 0.75rem;
  row-gap: 0;
  padding: 0.25rem;

  font-size: 12px;
  color: white;
  background-color: #222;
}

.vimeditor .overlay {
  display: flex;

  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;

  align-items: center;
  justify-content: center;

  background-color: rgba(32, 31, 32, 0.90);
}

.vimeditor .overlay::before {
  content: "Cliquer pour démarrer";
  color: #fff;
  font-size: 2rem;
}

.vimeditor:focus .overlay {
  display: none;
}

.vimeditor__numbers {
  grid-area: numbers;
  display: flex;
  flex-direction: column;
  align-items: end;
  color: #777;
  user-select: none;
}

.numbers__number-focus {
  align-self: center;
  color: white;
}

.vimeditor__content {
  position: relative;
  grid-area: content;
  display: flex;
  flex-direction: column;
}

.numbers__number,
.numbers__number-focus,
.content__line,
.content__line-focus,
.vimeditor__status-line,
.vimeditor__commandline {
  line-height: 18px;
}

.content__line-focus {
  background-color: #2A2A2A;
}

.content__cursor {
  position: absolute;
  width: 7px;
  height: 18px;
  background-color: rgba(200, 200, 200, 0.5);
}

.vimeditor__status-line {
  grid-area: statusline;
  display: flex;
  height: 18px;
  gap: 1rem;
  background-color: #2A2A2A;
}

.vimeditor__commandline {
  grid-area: commandline;
  height: 18px;
}

.vimeditor__mode {
  font-weight: bold;
  padding-left: 0.5rem;
  width: 3rem;
}
</style>
