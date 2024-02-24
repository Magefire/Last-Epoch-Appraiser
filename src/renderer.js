const Text = document.getElementById('text');
Text.innerText = "No item selected";
window.bridge.connect(SetText);

function SetText(event,text){
    console.log(text);
    Text.innerText = text;
}