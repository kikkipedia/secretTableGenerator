<template>
    <div id="statistics">
        <div class="content" v-for="art, index in artworks" :key="index">
            <vue-word-cloud
                style="
                    width: 100%;
                    height: 100%;
                    background-color: #f0f0f0;
                    border-radius: 20px;"
                :words="art"
                :spacing= 0.7
            />
        </div>

    </div>
</template>

<script setup lang="ts">
// @ts-expect-error - there are no type defs for this plugin
import VueWordCloud from 'vuewordcloud';

import { onMounted, ref } from 'vue';
import { getWords } from '@/db';

interface word {
    text: string;
    weight: number;
    color?: string; // For color later?
}

const words = ref<word[]>([]); // Temporary array 
const artworks = ref<word[][]>([]); 

const setWeight = () => { 
    // Count word frequency for the current artwork's words
    const uniqueWords = Array.from(new Set(words.value.map(a => a.text)))
        .map(text => {
            return {
                text: text,
                weight: words.value.filter(a => a.text === text).length,
            };
        });
    artworks.value.push(uniqueWords);
};

onMounted(async () => {
    const artworkNames = ['artwork1', 'artwork2', 'artwork3', 'artwork4', 'artwork5'];

    for (const artwork of artworkNames) {
        // Clear words for the current artwork
        words.value = [];

        // Fetch words for the current artwork
        const result = await getWords(artwork);
        if (result) {
            const data = result.words;
            data.forEach((wordObj: string) => {
                words.value.push({ text: wordObj, weight: 0 });
            });
        }
        setWeight();
    }
});

</script>

<style scoped>
#statistics {
    display: block;
    justify-content: center;
    align-items: center;
    background-color: black;
    color: white;
    margin: 20px;
    border-radius: 20px;
}
.content {
    display: block;
    justify-content: center;
    align-items: center;
    height: 60vh;
    background-color: #f0f0f0;
    margin: 20px;
    border-radius: 20px;
    width: 75%;
    padding: 30px
}
</style>