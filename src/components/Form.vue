<template>
    <div id="main-window">
        <div id="snow">
            <span
      v-for="n in snowflakeCount"
      :key="n"
      class="snowflake"
    >*</span>
            <div v-if="!loader">
                <div id="title" class="">LIR <span class="blink_me">+</span> JUL</div>
                <div id="instruction">Fyll i ett adjektiv per konstverk och klicka på Play</div>
            </div>
        
            <div v-else>
                <div class="loader"></div>
            </div>  
        </div>
    </div>
    <div class="divider-1"></div>
    <div class="art-input-screen">
    <div class="art-input">
        <!--bind to ref-->
        <input type="text" id="artwork1" name="artwork1" placeholder="konstverk #1" required minlength="4" maxlength="12" size="20" v-model="artwork1"/>
    </div>
    <div class="divider-2"></div>
    <div class="art-input">
        <input type="text" id="artwork2" name="artwork2" placeholder="konstverk #2" required minlength="4" maxlength="12" size="20" v-model="artwork2"/>
    </div>
    <div class="divider-2"></div>
    <div class="art-input">
        <input type="text" id="artwork3" name="artwork3" placeholder="konstverk #3" required minlength="4" maxlength="12" size="20" v-model="artwork3"/>
    </div>
    <div class="divider-2"></div>
    <div class="art-input">
        <input type="text" id="artwork4" name="artwork4" placeholder="konstverk #4" required minlength="4" maxlength="12" size="20" v-model="artwork4"/>
    </div>
    <div class="divider-2"></div>
    <div class="art-input">
        <input type="text" id="artwork5" name="artwork5" placeholder="konstverk #5" required minlength="4" maxlength="12" size="20" v-model="artwork5"/>
    </div>
    </div>
    <div id="calculate" @click="calculate"></div>

</template>

<script setup lang="ts">
import { randomiseTable, saveWords } from '@/db';
import { useTableStore } from '@/stores/store';
import { onMounted, ref } from 'vue'


    type Artwork = [
        string,
        string,
        string,
        string,
        string
    ];

    const artwork1 = ref('');
    const artwork2 = ref('');
    const artwork3 = ref('');
    const artwork4 = ref('');
    const artwork5 = ref('');

    const loader = ref(false);
    const store = useTableStore();
    const snowflakeCount = 70;

  const calculate = async () => {
    //make an array of artworks
    const artwork: Artwork = [artwork1.value, artwork2.value, artwork3.value, artwork4.value, artwork5.value];
    //save to database
    await saveWords(artwork);
    //start loader
    loader.value = true;
    //randomize table from database
    const response = await randomiseTable();
    //set table in store
    store.setTable(response);
  };

  const getImage = (table: string) => {
    return new URL(`@/assets/${table}.png`, import.meta.url).href;
  };

onMounted(() => {
    //start snow
    const snowflakes = document.querySelectorAll('.snowflake');
    // Apply random positioning and animation delays for each snowflake
    snowflakes.forEach((flake) => {
        const flakeElement = flake as HTMLElement;
        flakeElement.style.left = `${Math.random() * 100}vw`; // Random horizontal position
        flakeElement.style.animationDuration = `${Math.random() * 3 + 4}s`; // Duration between 2s and 5s
        flakeElement.style.animationDelay = `${Math.random() * 15}s`; // Delay up to 5s
      });
});
</script>

<style scoped>
#calculate {
    cursor: pointer;
}

/* HTML: <div class="loader"></div> */
.loader {
    margin-top: 100px;
  width: fit-content;
  font-size: 17px;
  font-family: monospace;
  line-height: 1.4;
  font-weight: bold;
  background: 
    linear-gradient(#000 0 0) left ,
    linear-gradient(#000 0 0) right;
  background-repeat: no-repeat; 
  border-right: 5px solid #0000;
  border-left: 5px solid #0000;
  background-origin: border-box;
  position: relative;
  animation: l9-0 2s infinite;
}
.loader::before {
  content:"Beräknar...";
}
.loader::after {
  content: "";
  position: absolute;
  top: 100%;
  left: 0;
  width: 22px;
  height: 60px;
  background: 
   linear-gradient(90deg,#000 4px,#0000 0 calc(100% - 4px),#000 0) bottom            /22px 20px,
   linear-gradient(90deg,red  4px,#0000 0 calc(100% - 4px),red  0) bottom 10px left 0/22px 6px,
   linear-gradient(#000 0 0) bottom 3px left 0  /22px 8px,
   linear-gradient(#000 0 0) bottom 0   left 50%/8px  16px;
 background-repeat: no-repeat;
 animation: l9-1 2s infinite;
}
@keyframes l9-0{
  0%,25%    {background-size: 50% 100%}
  25.1%,75% {background-size: 0 0,50% 100%}
  75.1%,100%{background-size: 0 0,0 0}
}
@keyframes l9-1{
  25%   { background-position:bottom, bottom 54px left 0,bottom 3px left 0,bottom 0 left 50%;left:0}
  25.1% { background-position:bottom, bottom 10px left 0,bottom 3px left 0,bottom 0 left 50%;left:0}
  50%   { background-position:bottom, bottom 10px left 0,bottom 3px left 0,bottom 0 left 50%;left:calc(100% - 22px)}
  75%   { background-position:bottom, bottom 54px left 0,bottom 3px left 0,bottom 0 left 50%;left:calc(100% - 22px)}
  75.1% { background-position:bottom, bottom 10px left 0,bottom 3px left 0,bottom 0 left 50%;left:calc(100% - 22px)}
}

#snow {
  position: relative;
  overflow: hidden;
  height: 40vh; /* Adjust based on the section you want to cover */
  width: 100%;
  background: transparent; /* Background color, optional */
}

.snowflake {
  position: absolute;
  top: -10px; /* Start above the container */
  font-size: 14px;
  color: rgba(0,0,0,0.2);
  animation: fall linear infinite;
}

/* Keyframes for falling effect */
@keyframes fall {
  0% {
    transform: translateY(-100px);
    opacity: 0.5;
  }
  100% {
    transform: translateY(100vh); /* Move down the full height */
    opacity: 0;
  }
}

</style>