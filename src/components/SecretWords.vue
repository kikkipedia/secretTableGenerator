<template>
    <div id="statistics">
        <div class="content">
            <vue-word-cloud
                style="
                    width: 100%;
                    height: 100%;
                    background-color: #f0f0f0;
                    border-radius: 20px;"
                :words="words"

            />
        </div>
        Word cloud för artwork1
    </div>
</template>

<script setup lang="ts">
// @ts-expect-error - there are no type defs for this plugin
import VueWordCloud from 'vuewordcloud';

import { onMounted, ref } from 'vue';
import { getWords } from '@/db';

type word = {
    text: string;
    weight: number;
}

const words = ref<word[]>([])

const setWeight = () => { //counts word frequency
    const uniqueWords = Array.from(new Set(words.value.map(a => a.text)))
        .map(text => {
            return {
                text: text,
                weight: words.value.filter(a => a.text === text).length
            }
        })
    words.value = uniqueWords
}

onMounted(async () => {
    const result = await getWords('artwork1');
    
    //for each word in the result, push it to the words array
    if (result) {
        const data = result.words
        data.forEach((wordObj: string) => {
            words.value.push({ text: wordObj, weight: 0 })
        })
        setWeight()
    }
})

</script>

<style scoped>
#statistics {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: black;
    color: white;
    margin: 20px;
    border-radius: 20px;
}
.content {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 60vh;
    background-color: #f0f0f0;
    margin: 20px;
    border-radius: 20px;
    width: 75%;
}
</style>