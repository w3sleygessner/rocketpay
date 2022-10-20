import "./css/index.css"
import IMask from "imask"

const ccBgColor01 = document.querySelector("#cc-bg-01")
const ccBgColor02 = document.querySelector("#cc-bg-02")

// const ccSection = document.querySelector(".cc")
const cc_img = document.querySelector("#cc-icon")

function setCardType(type) {
  const colors = {
    visa: ["#fdbb0a", "#1a1f71", "green"],
    mastercard: ["#EB001B", "fdbb0a", "blue"],
    default: ["purple", "black"],
  }

  cc_img.setAttribute("src", `cc-${type}.svg`)

  ccBgColor01.setAttribute("fill", colors[type][0])
  ccBgColor02.setAttribute("fill", colors[type][1])
  // ccSection.style.backgroundColor = colors[type][2]
}

const securityCode = document.querySelector("#security-code")
const securityCodePattern = {
  mask: "000",
}

const securityCodeMasked = IMask(securityCode, securityCodePattern)

const expirationDate = document.querySelector("#expiration-date")
const expirationDatePattern = {
  mask: "MM{/}YY",
  blocks: {
    MM: {
      mask: IMask.MaskedRange,
      from: 1,
      to: 12,
    },

    YY: {
      mask: IMask.MaskedRange,
      from: String(new Date().getFullYear()).slice(2),
      to: String(new Date().getFullYear() + 10).slice(2),
    },
  },
}
const expirationDateMasked = IMask(expirationDate, expirationDatePattern)

const cardNumber = document.querySelector("#card-number")
const cardNumberPattern = {
  mask: [
    {
      mask: "0000 0000 0000 0000",
      regex: /(^5[1-5]\d{0,2}|^22[2-9]\d|^2[3-7]\d{0,2})\d{0,12}/,
      cardtype: "mastercard",
    },

    {
      mask: "0000 0000 0000 0000",
      regex: /^4\d{0,15}/,
      cardtype: "visa",
    },
    {
      mask: "0000 0000 0000 0000",
      cardtype: "default",
    },
  ],

  dispatch: function (appended, dynamicMasked) {
    const number = (dynamicMasked.value + appended).replace(/\D/g, "")
    const foundMask = dynamicMasked.compiledMasks.find(({ regex }) => {
      return number.match(regex)
    })

    setCardType(foundMask.cardtype)
    return foundMask
  },
}

const formElement = document.querySelector("form")
formElement.addEventListener("submit", (event) => {
  event.preventDefault()

  alert("Cartão adicionado com sucesso!")
})

const cardHolderInput = document.querySelector("#card-holder")
cardHolderInput.addEventListener("input", (event) => {
  const cardHolder = document.querySelector(".cc-holder .value")

  cardHolder.innerText =
    cardHolderInput.value.length === 0
      ? "FULANO DA SILVA"
      : cardHolderInput.value
})
const cardNumberMasked = IMask(cardNumber, cardNumberPattern)

cardNumberMasked.on("accept", () => {
  updateCardNumber(cardNumberMasked.value)
})

function updateCardNumber(number) {
  const cardNumberElement = document.querySelector(".cc-info .cc-number")
  cardNumberElement.innerText =
    number.length === 0 ? "1234 5678 9012 3456" : number
}

securityCodeMasked.on("accept", () => {
  updatedSecurityCode(securityCodeMasked.value)
})

function updatedSecurityCode(code) {
  const securityCodeElement = document.querySelector(".cc-security .value")

  securityCodeElement.innerText = code.length === 0 ? "123" : code
}

expirationDateMasked.on("accept", () => {
  updateExpirationDate(expirationDateMasked.value)
})

function updateExpirationDate(date) {
  const expirationDateElement = document.querySelector(".cc-expiration .value")

  expirationDateElement.innerText = date.length === 0 ? "02/32" : date
}
