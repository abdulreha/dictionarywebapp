const input = document.querySelector('input');
const btn = document.querySelector('button');
const dictionary = document.querySelector('.dictionary-app');

async function dictionaryFn(word) {
    try {
        const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
        if (!response.ok) {
            throw new Error('Word not found');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching data:', error.message);
        return null;
    }
}

btn.addEventListener('click', fetchAndCreateCard);

async function fetchAndCreateCard() {
    const word = input.value.trim(); // Trim whitespace
    if (!word) {
        dictionary.innerHTML = `<p>Please enter a word to search.</p>`;
        return;
    }

    dictionary.innerHTML = `<p>Loading...</p>`; // Add a loading message
    const data = await dictionaryFn(word);

    if (!data || data.title === "No Definitions Found") {
        dictionary.innerHTML = `<p>Sorry, no definitions found for "${word}".</p>`;
        return;
    }

    // Extract phonetics and audio (handle cases with no data)
    const phonetic = data[0]?.phonetic || 'N/A';
    const audio = data[0]?.phonetics?.[0]?.audio || '';
    const definition = data[0]?.meanings?.[0]?.definitions?.[0]?.definition || 'N/A';
    const example = data[0]?.meanings?.[0]?.definitions?.[0]?.example || 'N/A';
    const partOfSpeechArray = data[0]?.meanings?.map(meaning => meaning.partOfSpeech).join(', ') || 'N/A';

    dictionary.innerHTML = `
        <div class="card">
            <div class="property">
                <span>Word:</span>
                <span>${data[0].word}</span>
            </div>
            <div class="property">
                <span>Phonetics:</span>
                <span>${phonetic}</span>
            </div>
            <div class="property">
                <span>
                ${audio ? `<audio controls src="${audio}"></audio>` : 'No audio available'}
                </span>
            </div>
            <div class="property">
                <span>Definition:</span>
                <span>${definition}</span>
            </div>
            <div class="property">
                <span>Example:</span>
                <span>${example}</span>
            </div>
            <div class="property">
                <span>Parts of Speech:</span>
                <span>${partOfSpeechArray}</span>
            </div>
        </div>`;
}
