
const dropdowns = document.querySelectorAll('.dropdown select')
const currConversionURL1 = "https://hexarate.paikama.co/api/rates/latest/"
const currConversionURL2 = "?target="
const fromOption = document.querySelector("select.from")
const toOption = document.querySelector("select.to")
const flagURL1 = "https://flagsapi.com/"
const flagURL2 = "/flat/64.png"
let isPresent = false;

function getKeyFromValue(value) {
    for (const [key,currency] of Object.entries(codes)) {
        if (value == currency) {
            return key
        }
    }
    return "Value not found"
}

for (let select of dropdowns){
    console.log(select.options.length)
    for (const [key,curr] of Object.entries(codes)) {
        for (let i = 0; i < select.options.length; i++) {
            if (select[i].value === curr){
                isPresent = true;
                break;
            }
        }
        if (!isPresent) {
            let newOption = document.createElement('option');
            newOption.innerText = curr;
            newOption.value = curr;
            select.append(newOption);
        }
        isPresent=false;
    }

}

async function getExchangeRate(url, fromValue, toValue, enteredAmount, fromOption, toOption) {
    await fetch(url).then ((response) => {
        return response.json()
    })
    .then((data) => {
        let tempMsg = "1 " + fromValue + " = " + data.data.mid + " " + toValue;
        console.log(tempMsg)
        const message = document.querySelector(".msg")
        message.innerText = tempMsg
        let convertedAmount = parseFloat(data.data.mid) * parseFloat(enteredAmount)
        console.log(convertedAmount)
        const exchangeMessage = document.querySelector(".exchange-message")
        exchangeMessage.style.display = "block"
        exchangeMessage.innerText = enteredAmount + " " + getSelectInnerText(fromOption) + " converted to " + convertedAmount + " " + getSelectInnerText(toOption)
    })
    .catch((err) => {
        console.log(err)
    })
}
function getSelectInnerText(selectName) {
    return selectName.options[selectName.selectedIndex].innerText
}

function onClick() {
    let fromValue = getSelectInnerText(fromOption)
    let fromKey = getKeyFromValue(fromValue)
    console.log(fromKey);
    let toValue = getSelectInnerText(toOption)
    let toKey = getKeyFromValue(toValue)
    console.log(toKey)
    const URL = currConversionURL1 + fromKey + currConversionURL2 + toKey
    let amount = document.querySelector(".amount")
    getExchangeRate(URL, fromKey, toKey, amount.value, fromOption, toOption)

}

function updateFlag(selectedValue, imageElement) {
    let key = getKeyFromValue(selectedValue)
    let finalFlagUrl = flagURL1 + key.substring(0,2) + flagURL2
    console.log("Updated flag url:", finalFlagUrl)
    imageElement.src = finalFlagUrl
}

dropdowns.forEach(select => {
    select.addEventListener("change", () => {
        const exchangeMessage = document.querySelector(".exchange-message")
        exchangeMessage.style.display = "none";
        let selectedValue = getSelectInnerText(select)
        console.log("Selected value", selectedValue)
        const image = select.previousElementSibling;
        console.log(image.getAttribute('src'))
        updateFlag(selectedValue, image)
    })
})
