const button= document.querySelector("#btn");
const colorText=document.getElementById('color-code');
const hexchar=[0,1,2,3,4,5,6,7,8,9,"A","B","C","D","E","F"];
button.addEventListener('click',function (){
    let hexColor="#";
    for(let i=0;i<6;i++){
        hexColor = hexColor+hexchar[getRandomNumber()];
        
    }
    document.body.style.backgroundColor=hexColor;
    colorText.innerHTML=hexColor;
    colorText.style.color=hexColor;

})
function getRandomNumber(){
    return Math.floor(Math.random()*hexchar.length);
}