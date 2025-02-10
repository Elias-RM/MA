const stage1 = document.getElementById('stage1'); 
const stage2 = document.getElementById('stage2'); 
const stage3 = document.getElementById('stage3'); 

const openButton = document.getElementById('openButton'); 
const closedLetter = document.getElementById('closedLetter'); 

openButton.addEventListener('click', () => { 
    stage1.classList.add('hidden'); 
    stage2.classList.remove('hidden'); 
}); 

closedLetter.addEventListener('click', () => { 
    stage2.classList.add('hidden'); 
    stage3.classList.remove('hidden'); });

