<template>
    <div id="statistics">
        <div class="content" v-for="art, index in artworks" :key="index">
            <vue-word-cloud
                style="
                    width: 100%;
                    height: 100%;
                    background-color: #222;
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

//random christmas colors
//const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ff8000', '#ff0080', '#80ff00', '#00ff80', '#8000ff', '#0080ff', '#ff8080', '#80ff80', '#8080ff', '#ff80ff', '#80ffff', '#80ff80']
const colors = ['#ffd700', "#ffdf73", "#d9d9d9", "#c0c0c0", "#b08d57", "#cd7f32", "#8b4513"]
const setWeight = () => { 
    // Count word frequency for the current artwork's words
    const uniqueWords = Array.from(new Set(words.value.map(a => a.text)))
        .map(text => {
            return {
                text: text,
                weight: words.value.filter(a => a.text === text).length
            };
        });
    
    // Sort by weight to determine ranking
    uniqueWords.sort((a, b) => b.weight - a.weight);
    
    // Assign colors based on frequency rank
    const totalWords = uniqueWords.length;
    uniqueWords.forEach((word, index) => {
        // Map index to color array (0 = highest frequency = gold, last = lowest = bronze)
        const colorIndex = Math.floor((index / (totalWords - 1)) * (colors.length - 1));
        word.color = colors[colorIndex];
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
    background-color: #111;
    margin: 20px;
    border-radius: 20px;
    width: 75%;
    padding: 30px
}
</style>