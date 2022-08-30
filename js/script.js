/**
 * => Author : Mosiur Rahman sumon
 * => Description : Color picker application with huge dom functionalities
 */
// Globals
let toastContainer = null;
const defaultColor = {
    red: 221,
    green: 222,
    blue: 238
};

const defaultPresetColors = [
	'#ffcdd2',
	'#f8bbd0',
	'#e1bee7',
	'#ff8a80',
	'#ff80ab',
	'#ea80fc',
	'#b39ddb',
	'#9fa8da',
	'#90caf9',
	'#b388ff',
	'#8c9eff',
	'#82b1ff',
	'#03a9f4',
	'#00bcd4',
	'#009688',
	'#80d8ff',
	'#84ffff',
	'#a7ffeb',
	'#c8e6c9',
	'#dcedc8',
	'#f0f4c3',
	'#b9f6ca',
	'#ccff90',
	'#ffcc80',
];

let cunstomColors = new Array(24);
const copiedSound = new Audio("sound/copied-sound.wav");
// => create onload handler
window.onload = () =>{
    main();
    updateColorCodeToDom(defaultColor);
    // invoke display preset color
    displayColorBoxs(document.getElementById("preset-colors"), defaultPresetColors);
    const cunstomColorsString = localStorage.getItem("custom-colors");
    if(cunstomColorsString){
        cunstomColors = JSON.parse(cunstomColorsString);
        displayColorBoxs(document.getElementById("custom-colors"), cunstomColors);
    };
    // const localImg = localStorage.getItem("recent-image");
    // if(localImg){
    //     console.log(localImg);
    //     document.getElementById("bg-preview").style.background = `url(${localImg})`;
    //     document.body.style.background = `url(${localImg})`;
    //     document.getElementById("bg-file-delete-btn").style.display = "inline";
    //     document.getElementById("bg-controller").style.display = "inline";
    // }

};

// main or boot function
function main(){
    // dom references
    const generaterandomcolorbtn = document.getElementById("generate-random-color");
    const colorModeHexInp = document.getElementById("input-hex");
    const colorSlaiderRed = document.getElementById("color-slider-red");
    const colorSlaiderGreen = document.getElementById("color-slider-green");
    const colorSlaiderBlue = document.getElementById("color-slider-blue");
    const copyToClipboardBtn = document.getElementById("copy-to-clipboard");
    const saveToCustomBtn = document.getElementById("save-to-custom");
    const presetColorParent = document.getElementById("preset-colors");
    const customColorParent = document.getElementById("custom-colors");
    const bgFileInputBtn = document.getElementById("bg-file-input-btn");
    const bgFileInput = document.getElementById("bg-file-input");
    const bgPreview = document.getElementById("bg-preview");
    const bgFileDeleteBtn = document.getElementById("bg-file-delete-btn");
    bgFileDeleteBtn.style.display = "none";
    const bgRighiController = document.getElementById("bg-controller");
    bgRighiController.style.display = "none";

 // // event listeners
 generaterandomcolorbtn.addEventListener("click", generaterandomcolorforbtn);
 colorModeHexInp.addEventListener("keyup", colorModeHexForInp);
 colorSlaiderRed.addEventListener("change", handleColerSlider(colorSlaiderRed, colorSlaiderGreen, colorSlaiderBlue));
 colorSlaiderGreen.addEventListener("change", handleColerSlider(colorSlaiderRed, colorSlaiderGreen, colorSlaiderBlue));
 colorSlaiderBlue.addEventListener("change", handleColerSlider(colorSlaiderRed, colorSlaiderGreen, colorSlaiderBlue));
 copyToClipboardBtn.addEventListener("click", forCopyToClipBoard);
 presetColorParent.addEventListener("click", presetColorChild);
 saveToCustomBtn.addEventListener("click", saveToCustomColor(customColorParent, colorModeHexInp));
 customColorParent.addEventListener("click", presetColorChild);
 bgFileInputBtn.addEventListener("click", function(){
    bgFileInput.click();
 });
 bgFileInput.addEventListener("change", funBgFileInput(bgPreview,bgFileDeleteBtn,bgRighiController));

 bgFileDeleteBtn.addEventListener("click", funBgFileDelete(bgPreview,bgFileDeleteBtn,bgFileInput,bgRighiController));
 document.getElementById("bg-size").addEventListener("change", changeBackgroundStatus);
 document.getElementById("bg-repeat").addEventListener("change", changeBackgroundStatus);
 document.getElementById("bg-position").addEventListener("change", changeBackgroundStatus);
 document.getElementById("bg-attachment").addEventListener("change", changeBackgroundStatus);

}

// event handlears
 function generaterandomcolorforbtn () {
    const color = generateColorDecimal();
   updateColorCodeToDom(color)
 }

function colorModeHexForInp(e){
    const hexcolor = e.target.value;
    if(hexcolor){
        this.value = hexcolor.toUpperCase();
        if(isHexValid(hexcolor)){
            const color = hexToDecimalColors(hexcolor)
            updateColorCodeToDom(color);
        }else{
            if(toastContainer !== null){
                toastContainer.remove();
                toastContainer = null;
                     }
            generateToastMessage("Invalid Input!")
        }
    }
}

function handleColerSlider(colorSlaiderRed, colorSlaiderGreen, colorSlaiderBlue){
    return function (){
        const color = {
            red: parseInt(colorSlaiderRed.value),
            green: parseInt(colorSlaiderGreen.value),
            blue: parseInt(colorSlaiderBlue.value),
        };
        updateColorCodeToDom(color);
    };
}

function forCopyToClipBoard(){
    const colorModeRadios = document.getElementsByName("color-mode");
    const mode = getCheckRadioValues(colorModeRadios);
    if(mode == null){
        throw new Error("Invalid Radio Input");
    }
    if(toastContainer !== null){
        toastContainer.remove();
        toastContainer = null;
             }
    if(mode == "hex"){
        const hexcolor = document.getElementById("input-hex").value;
        if(hexcolor && isHexValid(hexcolor)){
            navigator.clipboard.writeText(`#${hexcolor}`);
            generateToastMessage(`#${hexcolor} Copied`)
        }else{
            // alert("Invalid Hex Color")
            generateToastMessage("Invalid Hex Color")
        }
        
    }else{
        const rgbColor = document.getElementById("input-rgb").value;
        if(rgbColor){
            navigator.clipboard.writeText(rgbColor);
            generateToastMessage(`${rgbColor} Copied`)
        }else{
            // alert("Invalid RGB Color")
           
            generateToastMessage("Invalid RGB Color")
        }
        
    }
}

function presetColorChild(e){
    const child = e.target;
    if(child.className == "color-box"){
        navigator.clipboard.writeText(child.getAttribute("data-color"));
        copiedSound.volume = 0.3;
        copiedSound.play();
        if(toastContainer !== null){
            toastContainer.remove();
            toastContainer = null;
                 };
        generateToastMessage(`${child.getAttribute("data-color")} Copied`);
    }

}

function saveToCustomColor(customColorParent, inputHex){
    
    return function () {
        const color = `#${inputHex.value}`;
        if(cunstomColors.includes(color)){
            if(toastContainer !== null){
                toastContainer.remove();
                toastContainer = null;
                     };
            generateToastMessage("Already in your list!");
            return;
        }
        cunstomColors.unshift(color);
        if(cunstomColors.length > 24){
            cunstomColors = cunstomColors.slice(0, 24);
        }
        localStorage.setItem("custom-colors", JSON.stringify(cunstomColors));
        removeChildren(customColorParent);
        displayColorBoxs(customColorParent, cunstomColors);
        
    }
 }

 function funBgFileInput(bgPreview, bgFileDelBtn, bgController){
    return function(){
        const reader  = new FileReader();
        reader.addEventListener("load", function(){
            bgPreview.style.background = `url(${reader.result})`;
            document.body.style.background = `url(${reader.result})`;
            bgFileDelBtn.style.display = "inline";
            bgController.style.display = "inline";
            // localStorage.setItem("recent-image", reader.result);
        })
        reader.readAsDataURL(this.files[0]);
     };
 };

 function funBgFileDelete(bgPreview,bgFileDeleteBtn,bgFileInput,bgRighiController){
    return function(){
        bgPreview.style.background = "none";
        bgPreview.style.backgroundColor = "#DDDEEE";
        document.body.style.background = `none`;
        document.body.style.background = `#DDDEEE`;
        bgFileDeleteBtn.style.display = "none";
        bgFileInput.value = null;
        bgRighiController.style.display = "none";
        // localStorage.removeItem("recent-image");
        // localStorage.clear();
     };
 };
// dom functions
 /**
  * for toast message
  * @param {string} msg 
  */
 function generateToastMessage(msg){
    toastContainer = document.createElement("div");
     toastContainer.innerText = msg;
     toastContainer.className = "toast-message toast-message-slide-in";
     toastContainer.addEventListener("click", ()=>{
        toastContainer.classList.remove("toast-message-slide-in");
        toastContainer.classList.add("toast-message-slide-out");
 
         toastContainer.addEventListener("animationend", ()=>{
             toastContainer.remove();
             toastContainer = null;
         })
     })
     document.body.appendChild(toastContainer);
     setTimeout(()=>{
        const alert = document.querySelector('.toast-message');

        if(alert){
            alert.remove();
        }
    }, 3000);
 }

 /**
  * 
  * @param {Array} nodes
  * @returns {string | null} 
  */
 function getCheckRadioValues(nodes){
     let checkedValue = null;
     for(let i = 0; i < nodes.length; i++){
         if (nodes[i].checked){
             checkedValue = nodes[i].value;
             break;
         }
     }
     return checkedValue;
 }

  /**
  * update dom element with calculated color values
  * @param {object}  color
  */
 function updateColorCodeToDom(color){
    const hexcolor = genHexcol(color);
    const rgbcolor = genRgbCol(color);

    document.getElementById("color-display").style.backgroundColor = `#${hexcolor}`;
    document.getElementById("input-hex").value = hexcolor;
    document.getElementById("input-rgb").value =rgbcolor;
    document.getElementById("color-slider-red").value = color.red;
    document.getElementById("color-slider-red-label").innerText = color.red;
    document.getElementById("color-slider-green").value = color.green;
    document.getElementById("color-slider-green-label").innerText = color.green;
    document.getElementById("color-slider-blue").value = color.blue;
    document.getElementById("color-slider-blue-label").innerText = color.blue;
 }
/**
 * create div element with class name color box and attribute
 * @param {string} color
 * @returns {object}
 */
function generateColorBox(color){
    const div = document.createElement("div");
    div.className = "color-box";
    div.style.backgroundColor = color;
    div.setAttribute("data-color", color);
    return div;
}

/**
 * this function will create and append new boxs to its parent
 * @param {object} parent
 * @param {Array} colors
 */
function displayColorBoxs(parent, colors){
    colors.forEach(color =>{
        if(isHexValid(color.slice(1))){
        const colorBox = generateColorBox(color);
        parent.appendChild(colorBox);
        }
    })
}

/**
 * remove all children from parent
 * @param {object} parent
 */
function removeChildren(parent){
    let child = parent.lastElementChild;
    while(child){
        parent.removeChild(child);
        child = parent.lastElementChild;
    }
}

function changeBackgroundStatus(){
    document.body.style.backgroundSize = document.getElementById("bg-size").value;
    document.body.style.backgroundRepeat = document.getElementById("bg-repeat").value;
    document.body.style.backgroundPosition = document.getElementById("bg-position").value;
    document.body.style.backgroundAttachment = document.getElementById("bg-attachment").value;
}
// utils
/**
 * function 1 => generate three randon decimal number for red, green and blue
 * @returns {object}
 */
function generateColorDecimal(){
    const red = Math.floor(Math.random() *255);
    const green = Math.floor(Math.random() *255);
    const blue = Math.floor(Math.random() *255);
    return{
        red,
        green,
        blue
    };
}


/**
 * function 2 generate hex color code
 * @param {object} color 
 * @returns {string}
 */
function genHexcol({red, green, blue}){
    // const {red, green, blue} = generateColorDecimal();
    const getTowCode = (color) => {
        const hex = color.toString(16);
        return hex.length == 1 ? `0${hex}` : hex;
    }
    return `${getTowCode(red)}${getTowCode(green)}${getTowCode(blue)}`.toUpperCase();

}


/**
 * function 3 gemerate rgba color code
 * @param {object} color 
 * @returns {string}
 */
function genRgbCol({red, green, blue}){
    return `rgb(${red}, ${green}, ${blue})`;
}

/**
 *  convert hex color  to decimal color object 
 * @param {string} hex 
 * @returns {object}
 */
function hexToDecimalColors(hex){
    const red = parseInt(hex.slice(0, 2), 16);
    const green = parseInt(hex.slice(2, 4), 16);
    const blue = parseInt(hex.slice(4), 16);
    return {
        red,
        green,
        blue
    }
}


/**
 * for check hex code
 * @param {string} color 
 * @returns {boolean}
 */
function isHexValid(color){
    if(color.length !== 6)return false;

    return/^[0-9A-Fa-f]{6}$/i.test(color);
}
