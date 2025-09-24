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

      <!--top date-->
<div class="top-date">December 12 - 2024</div>

    <!--system warning-->
      <div class="shake-div" v-if="warning">
        <div class="window">
          <div class="title-bar">
            <button aria-label="Close" class="close"></button>
            <h1 class="title">Warning</h1>
            <button aria-label="Close" class="close"></button>
          </div>
          <div class="window-pane">
            Var god fyll i samtliga fält
          </div>
        </div>
      </div>
      <!--image-->
      <div class="place-ready shake-div" v-if="img_url">
        <img :src="img_url" class="image"/>
      </div>
      <!-- first screen -->
      <div v-if="!loader && !warning && !img_url" >
        <div id="logo" class=""></div>
        <div id="instruction">Fyll i ett adjektiv per konstverk och klicka på Play</div>
      </div>
      <!-- loader -->  
      <div v-else-if="loader" style="text-align: center;">
        <div class="loader"></div>
      </div> 
          </div>
      </div>
    <div class="divider-1"></div>

    <div class="art-input-screen">
      <form @submit.prevent="calculate">
    <div class="art-input">
        <!--bind to ref-->
        <input type="text" id="response1" name="response1" placeholder="1" required minlength="3" maxlength="12" size="20" v-model="response1" :disabled="isSubmitted" />
    </div>
    <div class="divider-2"></div>
    <div class="art-input">
        <input type="text" id="response2" name="response2" placeholder="2" required minlength="3" maxlength="12" size="20" v-model="response2" :disabled="isSubmitted" />
    </div>
    <div class="divider-2"></div>
    <div class="art-input">
        <input type="text" id="response3" name="response3" placeholder="3" required minlength="3" maxlength="12" size="20" v-model="response3" :disabled="isSubmitted" />
    </div>
    <div class="divider-2"></div>
    <div class="art-input">
        <input type="text" id="response4" name="response4" placeholder="4" required minlength="3" maxlength="12" size="20" v-model="response4" :disabled="isSubmitted" />
    </div>
    <div class="divider-2"></div>
    <div class="art-input">
        <input type="text" id="response5" name="response5" placeholder="5" required minlength="3" maxlength="12" size="20" v-model="response5" :disabled="isSubmitted" />
    </div>
    </form>
    </div>
    <div id="calculate" @click="calculate"></div>
  </div>
</template>

<script setup lang="ts">
import { getSymbolNumber, randomiseTable, saveWords } from '@/db';
import { useTableStore } from '@/stores/store';
import { onMounted, ref } from 'vue'

    type Artwork = [
        string,
        string,
        string,
        string,
        string
    ];

    const response1 = ref('');
    const response2 = ref('');
    const response3 = ref('');
    const response4 = ref('');
    const response5 = ref('');
    const snowflakeCount = 30;
    const warning = ref(false);
    const loader = ref(false);
    const images: Record<string, { default: string }> = import.meta.glob('/src/assets/*.png', { eager: true });
    const img_url = ref('');
    const isSubmitted = ref(false); 

    const store = useTableStore();
   

  const calculate = async () => {
    if(img_url.value !== '') {
      //dont calculate if image is already shown
      return;
    }
    //check so all fields are filled
    if (!response1.value || !response2.value || !response3.value || !response4.value || !response5.value) {
      warning.value = true;
      return;
    }
    else {
      warning.value = false;
    }
    isSubmitted.value = true;
    //make an array of artworks
    const responses: string[] = [response1.value, response2.value, response3.value, response4.value, response5.value];
    //save to database
    await saveWords(responses);
    //start loader
    loader.value = true;
    /*
    //randomize table from database
    const response = await randomiseTable();
    //set table in store after 5 seconds
    await new Promise<void>((resolve) => {
      setTimeout(() => {
        store.setTable(response);
        resolve(); // Resolving without any arguments
      }, 5000);
    });
    //get corresponding image
    const image = getImage(response);
    if (image) {
      img_url.value = image; 
      loader.value = false;
    } else {
      console.warn('Image not found for:', response);
      img_url.value = ''; 
    }*/
   const myNumber = await getSymbolNumber();
   const image = `/src/assets/symbol${myNumber}.png`;
    img_url.value = image;
    loader.value = false;
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
.container {
    align-items: center;
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
  position: relative;
  animation: l9-0 2s infinite;
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
  display: flex;
  justify-content: center;
  /* align-items: center; */
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
  max-height: 55%;
  opacity:0.6;
  align-self: center;
}

.place-ready {
  text-align: center;
  display: flex;
  justify-content: center;
  height: 100%;
  object-fit: contain;
}

/* General styling for placeholder text */
input::placeholder,
textarea::placeholder {
  color: #6c757d; /* Adjust the color to make it more visible */
  opacity: 1;     /* Ensure full opacity */
}

/* Specific styling for mobile devices */
@media screen and (max-width: 768px) {
  input::placeholder,
  textarea::placeholder {
    color: #343a40; /* A darker color for mobile */

  }
}

</style>