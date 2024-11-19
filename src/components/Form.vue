<template>
  <div id="main">
    <div id="scratches">  </div>
    <div id="main-window">
        <div id="snow">
            <span
      v-for="n in snowflakeCount"
      :key="n"
      class="snowflake"
    >*</span>
    <!--system.css warning-->
    <div class="shake-div" v-if="warning">
    <div class="window">
  <div class="title-bar">
    <button aria-label="Close" class="close"></button>
    <h1 class="title">Warning</h1>
    <!-- <button aria-label="Resize" class="resize"></button> -->
    <button aria-label="Close" class="close"></button>
  </div>
  <div class="window-pane">
    Var god fyll i samtliga fält
  </div>
</div>
</div>
<div class="place-ready" v-if="img_url">
  <img :src="img_url" class="image"/>
</div>
      <div v-if="!loader && !warning" >
        <div id="title" class="">LIR <span class="blink_me">+</span> JUL</div>
        <div id="instruction">Fyll i ett adjektiv per konstverk och klicka på Play</div>
      </div>
      
      <div v-else-if="loader" style="text-align: center;">
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
  </div>
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
    const snowflakeCount = 30;
    const warning = ref(false);
    const loader = ref(false);
    const images: Record<string, { default: string }> = import.meta.glob('/src/assets/*.png', { eager: true });
    const img_url = ref('');

    const store = useTableStore();
   

  const calculate = async () => {
    //check so all fields are filled
    if (!artwork1.value || !artwork2.value || !artwork3.value || !artwork4.value || !artwork5.value) {
      warning.value = true;
      return;
    }
    else {
      warning.value = false;
    }
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
    //get corresponding image
    const image = getImage(response);
    if (image) {
      img_url.value = image; 
    } else {
      console.warn('Image not found for:', response);
      img_url.value = ''; 
    }
  };

  const getImage = (table: string): string | undefined => {
  return images[`/src/assets/${table}.png`]?.default; // Ensure correct key format
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
    margin-top: 10vh;
  width: fit-content;
  font-size: 17px;
  font-family: "departure-mono", sans-serif !important;
  line-height: 1.4;
  font-weight: bold;
  background: 
    linear-gradient(#000 0 0) left ,
    linear-gradient(#000 0 0) right;
  background-repeat: no-repeat; 
  border-right: 5px solid #0000;
  border-left: 5px solid #0000;
  background-origin: border-box;
  position: absolute;
  animation: l9-0 2s infinite;
  margin-left:17vw;
  opacity:0.5;
  color:black;
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
  height: 30vh; /* Adjust based on the section you want to cover */
  width: 100%;
  background: transparent; /* Background color, optional */
}

.snowflake {
  position: absolute;
  top: -10px; /* Start above the container */
  font-size: 14px;
  color: rgba(0,0,0,0.4);
  animation: fall linear infinite;
}

/* Keyframes for falling effect */
@keyframes fall {
  0% {
    transform: translateY(-0px);
    opacity: 0.6;
  }

  10% {
    opacity: 0.1;
  }
  15% {
    opacity: 0.5;
  }
  20% {
    opacity: 0.1;
  }
  25% {
    opacity: 0.4;
  }
  30% {
    opacity: 0.1;
  }
  35% {
    opacity: 0.3;
  }
 40% {
    opacity: 0.1;
  }
 45% {
    opacity: 0.4;
  }
  50% {
    opacity: 0.1;
  }
 55% {
    opacity: 0.3;
  }
 
  100% {
    transform: translateY(30vh); /* Move down the full height */
    opacity: 0;
  }
}

.window {
  background-color: transparent;
  min-width: 100px;
  height: 70%;
  margin-top: 30px;
  opacity: 0.5;
  border-color:rgba(0, 0, 0, 0.6);
  color: black;
}

.window-pane {
  height: 100%;
  margin-top: 20px;
  color: black;
  font-size: 0.8rem;
  padding: 10px;
}

.close {
  background-color:rgb(200,200,200);
   background: linear-gradient(rgb(230,250,230), rgb(140,160,140));
   opacity: 0.6;
}


.title {
  background-color:rgb(200,200,200);
  background: linear-gradient(rgb(230,250,230), rgb(140,160,140));
  font-size: 1rem;
  color: black
}

.shake-div {
  width: 100%;
  text-align:center;
  animation: blinker 1s linear infinite;
}

@keyframes blinker {
  25% {
    opacity: 0.5;
  }
  50% {
    opacity: 0;
  }
  75% {
    opacity: 0.5;
  }
}

.image {
  width: 100%;
  height: 100%;
}
</style>