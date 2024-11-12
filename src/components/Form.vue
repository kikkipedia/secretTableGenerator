<template>
    <div id="main-window">
        <div id="snow">
 <marquee direction="down" scrolldelay="98">*</marquee>
<marquee direction="down" scrolldelay="76">*</marquee>
<marquee direction="down" scrolldelay="61">*</marquee>
<marquee direction="down" scrolldelay="138">*</marquee>
<marquee direction="down" scrolldelay="86">*</marquee>
<marquee direction="down" scrolldelay="127">*</marquee>
<marquee direction="down" scrolldelay="82">*</marquee>
<marquee direction="down" scrolldelay="112">*</marquee>
<marquee direction="down" scrolldelay="119">*</marquee>
<marquee direction="down" scrolldelay="99">*</marquee>
<marquee direction="down" scrolldelay="75">*</marquee>
<marquee direction="down" scrolldelay="89">*</marquee>
<marquee direction="down" scrolldelay="76">*</marquee>
<marquee direction="down" scrolldelay="111">*</marquee>
<marquee direction="down" scrolldelay="136">*</marquee>
<marquee direction="down" scrolldelay="96">*</marquee>
<marquee direction="down" scrolldelay="136">*</marquee>
<marquee direction="down" scrolldelay="119">*</marquee>
<marquee direction="down" scrolldelay="83">*</marquee>
<marquee direction="down" scrolldelay="124">*</marquee>
<marquee direction="down" scrolldelay="130">*</marquee>
<marquee direction="down" scrolldelay="78">*</marquee>
<marquee direction="down" scrolldelay="76">*</marquee>
<marquee direction="down" scrolldelay="75">*</marquee>
<marquee direction="down" scrolldelay="98">*</marquee>
<marquee direction="down" scrolldelay="105">*</marquee>
<marquee direction="down" scrolldelay="112">*</marquee>
<marquee direction="down" scrolldelay="67">*</marquee>
<marquee direction="down" scrolldelay="87">*</marquee>
<marquee direction="down" scrolldelay="89">*</marquee>
</div>
<div v-if="!loader">
    <div id="title" class="">LIR <span class="blink_me">+</span> JUL</div>
    <div id="instruction">Fyll i ett adjektiv per konstverk och klicka på Play</div>
</div>
<div v-else>
    <div class="loader"></div>
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
import { ref } from 'vue'

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

  const calculate = async () => {
    //make an array of artworks
    const artwork: Artwork = [artwork1.value, artwork2.value, artwork3.value, artwork4.value, artwork5.value];
    //save to odatabase
    await saveWords(artwork);
    //start loader

    //randomize table from database
    const response = await randomiseTable();
    //set table in store
    store.setTable(response);
  };


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
</style>