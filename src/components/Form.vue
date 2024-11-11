<template>
    <div id="main-window">
        <div id="title">LIR + JUL + AI</div>
        <div id="instruction">Fyll i ett adjektiv per konstverk och klicka på Play</div>
    </div>
    <div class="divider-1"></div>
    <div class="art-input-screen">
    <div class="art-input-start">
        <!--bind to ref-->
        <input type="text" id="artwork1" name="artwork1" placeholder="konstverk #1" required minlength="4" maxlength="12" size="20" v-model="artwork1"/>
    </div>
    <div class="art-input">
        <input type="text" id="artwork2" name="artwork2" placeholder="konstverk #2" required minlength="4" maxlength="12" size="20" v-model="artwork2"/>
    </div>
    <div class="art-input">
        <input type="text" id="artwork3" name="artwork3" placeholder="konstverk #3" required minlength="4" maxlength="12" size="20" v-model="artwork3"/>
    </div>
    <div class="art-input">
        <input type="text" id="artwork4" name="artwork4" placeholder="konstverk #4" required minlength="4" maxlength="12" size="20" v-model="artwork4"/>
    </div>
    <div class="art-input-end">
        <input type="text" id="artwork5" name="artwork5" placeholder="konstverk #5" required minlength="4" maxlength="12" size="20" v-model="artwork5"/>
    </div>
    </div>
    <div id="calculate" @click="calculate"></div>

</template>

<script setup lang="ts">
import { saveWords } from '@/db';
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

  const calculate = async () => {
    //make an array of artworks
    const artwork: Artwork = [artwork1.value, artwork2.value, artwork3.value, artwork4.value, artwork5.value];
    //save to odatabase
    const response = await saveWords(artwork);
    console.log(response);
  };


</script>

<style scoped>
#calculate {
    cursor: pointer;
}
</style>