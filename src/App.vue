<template>
  <v-app>
    <v-dialog
      v-model="dialog"
      activator="parent"
      width="auto"
    >
      <v-card style="max-width: 800px">
        <v-card-text style="font-size: 1.5em;">
          <h2>Actualichat</h2> Aquesta aplicació et proveeix d'un resum de les notícies de les últimes 24 hores. A més, si et queden preguntes sobre successos que hagin aparegut recentment als noticiaris, pots fer preguntes a la intel·ligència artificial, que coneix el contingut de tots els articles recents.
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" block @click="dialog = false">Tanca</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-app-bar color="#e74c3c">
      <template v-slot:prepend>
        <v-img :width="30" :height="30" src="@/assets/newspaper-svgrepo-com.svg"></v-img>
      </template>
      <v-toolbar-title>
        Actualichat
      </v-toolbar-title>
      <!--
      <v-select
        style="height: 40px; max-width: 200px;"
        label="Territori"
        :items="['Catalunya', 'Espanya', 'Global']"
        variant="outlined"
        density="compact"
      ></v-select>
      -->
    </v-app-bar>
    <v-main>
      <div id="chat-container">
        <div id="texts-container">
          <v-card
            v-for="(text, key) in state.textList"
            :key="key"
            :class="text.type"
            :text="text.text"
            :title="text.title"
          >
            <v-card-actions v-if="text.link">
              <v-btn
                variant="text"
                color="#e74c3c"
                :href="text.link"
                target="_blank"
              >
                Llegir meś
              </v-btn>
            </v-card-actions>
          </v-card>
          <Loading v-if="loading" />
        </div>
        <div id="typing-container">
          <v-textarea
            label="Pregunta qualsevol cosa..."
            variant="outlined"
            rows="2"
            append-inner-icon="mdi-send"
            v-model="inputText"
            @click:appendInner="send()">
            </v-textarea>
        </div>
      </div>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
  import {
    ref,
    onMounted,
    onBeforeMount,
    nextTick,
    getCurrentInstance,
    reactive
  } from 'vue'
  import {
    getSummary
  } from './api/get-summary';
  import {
    qa
  } from './api/qa';
  import Loading from './components/Loading.vue';

  // Variables
  const dialog = ref(true);
  const inputText = ref('');
  const loading = ref(false);
  const state: {
    textList: {
      type: 'bot'|'human';
      text: string;
      title?: string;
      link?: string;
    }[]
  } = reactive({
    textList: []
  });

  // Functions
  async function send() {
    const value = inputText.value;
    
    inputText.value = '';
    state.textList.push({
      type: 'human',
      text: value
    });
    nextTick(() => {
      scrollToBottom();
    });
    scrollToBottom();
    loading.value = true;
    const response = await qa(value);
    state.textList.push({
      type: 'bot',
      text: response.text,
      link: response.sourceDocuments[0].metadata.url
    });
    loading.value = false;
    nextTick(() => {
      typingAnimation();
      scrollToBottom();
    });
  }

  function typingAnimation() {
    const text = document.querySelector('#texts-container .v-card:last-child');
    text?.classList.add('typing');
    setTimeout(() => {
      text?.classList.remove('typing');
    }, (text?.textContent?.length) ? text.textContent.length * 100 : 1000);
  }

  function scrollToBottom() {
    const textsContainer = document.querySelector('#texts-container');
    textsContainer?.scrollTo(0, textsContainer.scrollHeight);
  }

  // Lifecycle hooks
  onBeforeMount(async () => {
    const summary = await getSummary('ca');
    state.textList.push({ type: 'bot', text: summary, title: 'Resum del dia' });
  });

  onMounted(() => {
    document.querySelector('#typing-container textarea')?.addEventListener("keydown", (event: any) => {
      if (event.which === 13 && !event.shiftKey) {
        if (!event.repeat) {
          send()
        }
        event.preventDefault(); // Prevents the addition of a new line in the text field
      }
    });
  })
</script>

<style>
  /* The typing effect */
  @keyframes typing {
    from { width: 0 }
    to { width: 100% }
  }

  /* The typewriter cursor effect */
  @keyframes blink-caret {
    from, to { border-color: transparent }
    50% { border-color: #e74c3c; }
  }
  body {
    overflow: hidden;
  }
  .v-toolbar .v-toolbar__prepend {
    margin-inline-start: 1.5em;
  }
  .v-toolbar .v-toolbar-title .v-toolbar-title__placeholder {
    color: white;
    font-size: 1.25em;
  }
  #chat-container {
    max-width: 1024px;
    margin: 1em auto;
    height: calc(100vh - 64px - 2em);
  }
  #chat-container .v-card .v-card-text {
    font-size: 1.5em;
    line-height: 1.5em;
  }
  #chat-container .v-card.bot.typing .v-card-text {
    overflow: hidden; /* Ensures the content is not revealed until the animation */
    border-right: .15em solid #e74c3c; /* The typwriter cursor */
    white-space: nowrap; /* Keeps the content on a single line */
    margin: 0 auto; /* Gives that scrolling effect as the typing happens */
    letter-spacing: .1em; /* Adjust as needed */
    animation:
      typing 2s steps(40, end),
      blink-caret .75s step-end infinite;
  }
  .v-card {
    margin-bottom: .5em;
  }
  .v-card.bot {
    background-color: #ecf0f1;
  }
  .v-card.human {
    background-color: #e74c3c;
    color: white;
    text-align: right;
  }
  #typing-container {
    height: 120px;
    padding-top: 1em;
  }
  #texts-container {
    height: calc(100% - 100px);
    overflow: scroll;
  }
</style>