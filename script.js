const transactionsUl = document.querySelector('#transactions')
const incomeDisplay = document.querySelector('#money-plus')
const expenseDisplay = document.querySelector('#money-minus')
const balanceDisplay = document.querySelector('#balance')
const form = document.querySelector('#form')
const inputTransactionName = document.querySelector('#text')
const inputTransactionAmount = document.querySelector('#amount')
const monthDisplay = document.querySelector('#month')
const yearDisplay = document.querySelector('#year i')
let selectedYear = new Date().getFullYear()
let monthsNames = [
    { id: 0, month: "Jan", monthEng: "Jan" },
    { id: 1, month: "Fev", monthEng: "Fev" },
    { id: 2, month: "Mar", monthEng: "Mar" },
    { id: 3, month: "Abr", monthEng: "Apr" },
    { id: 4, month: "Mai", monthEng: "May" },
    { id: 5, month: "Jun", monthEng: "Jun" },
    { id: 6, month: "Jul", monthEng: "Jul" },
    { id: 7, month: "Ago", monthEng: "Aug" },
    { id: 8, month: "Set", monthEng: "Sep" },
    { id: 9, month: "Oct", monthEng: "Oct" },
    { id: 10, month: "Nov", monthEng: "Nov" },
    { id: 11, month: "Dez", monthEng: "Dez" }
]
let selectedMonth = null

const localStorageTransactions = JSON.parse(localStorage
    .getItem('transactions'))
let transactions = localStorage
    .getItem('transactions') !== null ? localStorageTransactions : []

const removeTransaction = ID => {    
    transactions = transactions.filter(transaction => transaction.id !== ID)
    updateLocalStorage()
    init()
}

const checkTransactionOfSelectedDate = transaction => {
    const transactionDate = new Date(transaction.date)
    const fullyear = transactionDate.getFullYear();
    const month = transactionDate.getMonth();
    
    if(selectedMonth && selectedMonth == month && selectedYear == fullyear)
        addTransactionIntoDOM(transaction)
}

const addTransactionIntoDOM = ({ amount, name, id, date }) => {
    const operator = amount < 0 ? '-' : '+'
    const CSSClass = amount < 0 ? 'minus' : 'plus'
    const amountWithoutOperator = Math.abs(amount)
    const li = document.createElement('li')

    li.classList.add(CSSClass)
    li.innerHTML = `${name}<span>${operator} R$ ${amountWithoutOperator}</span>
        <button class="delete-btn" onClick="removeTransaction(${id})">x</button>`
    transactionsUl.prepend(li)
}

const getExpenses = transactionsAmounts => Math.abs(transactionsAmounts
    .filter(value => value < 0)
    .reduce((accumulator, value) => accumulator + value, 0))
    .toFixed(2)

const getIncome = transactionsAmounts => transactionsAmounts
    .filter(value => value > 0)
    .reduce((accumulator, value) => accumulator + value, 0)
    .toFixed(2)

const getTotal = transactionsAmounts => transactionsAmounts
    .reduce((accumulator, transaction) => accumulator + transaction, 0)
    .toFixed(2)

const updateBalanceValues = () => {    
    const transactionsAmounts = transactions.map(({ amount }) => amount)
    const total = getTotal(transactionsAmounts)
    const income = getIncome(transactionsAmounts)
    const expense = getExpenses(transactionsAmounts)

    balanceDisplay.textContent = `R$ ${total}`
    incomeDisplay.textContent = `R$ ${income}`
    expenseDisplay.textContent = `R$ ${expense}`
}

const bindClickYear = () => {
    document.querySelector('#year').onclick = event => {
        const targetClickLeft = event.target.classList.contains('fa-angle-left')
        const targetClickRight = event.target.classList.contains('fa-angle-right')

        if (targetClickLeft) selectedYear--
        else if (targetClickRight) selectedYear++
        document.querySelector('#years').innerHTML = selectedYear
        console.log(`ano atual: ${selectedYear}`);
        init()
    }
}

const init = () => {
    transactionsUl.innerHTML = ''
    if (transactions) transactions.forEach(checkTransactionOfSelectedDate)
    updateBalanceValues()
    bindClickYear()
}
init()

const updateLocalStorage = () => {
    localStorage.setItem('transactions', JSON.stringify(transactions))
}

const generateID = () => Math.round(Math.random() * 1000)

const generateDate = () => new Date().toString();

const addToTransactionArray = (transactionName, transactionAmount) => {
    transactions.push({
        id: generateID(),
        name: transactionName,
        amount: Number(transactionAmount),
        date: generateDate()
    })
}

const cleanInputs = () => {
    inputTransactionAmount.value = ''
    inputTransactionName.value = ''
    inputTransactionName.focus()
}

const handleFormSubmit = event => {
    event.preventDefault()

    const transactionName = inputTransactionName.value.trim()
    const transactionAmount = inputTransactionAmount.value.trim()
    const isSomeInputEmpty = transactionName === '' || transactionAmount === ''

    if (isSomeInputEmpty){
        alert('Preencha todos os campos')
        return
    }

    addToTransactionArray(transactionName, transactionAmount)
    init()
    updateLocalStorage()
    cleanInputs()
}

form.onsubmit = event => handleFormSubmit(event)

const insertSelectableYearIntoDOM = () => {
    const yearDiv = document.createElement('div')
    yearDiv.classList.add('select-year')
    yearDiv.setAttribute('id', 'years')
    yearDiv.innerHTML = selectedYear
    yearDisplay.after(yearDiv)
}
insertSelectableYearIntoDOM()
const insertSelectableMonthIntoDOM = ({ id, month, monthEng }) => {
    const monthDiv = document.createElement('div')
    monthDiv.classList.add('months')
    monthDiv.setAttribute('id', monthEng)
    monthDiv.setAttribute('onClick', 'selectDate('+id+')')
    month = month.toUpperCase()
    monthDiv.innerHTML = month
    monthDisplay.append(monthDiv)
}

monthsNames.forEach(insertSelectableMonthIntoDOM)

const selectDate = ID => {
    const monthIndex = monthsNames.filter(monthsName => { if (ID === monthsName.id) return monthsName })
    const monthToSelect = monthIndex[0].monthEng
    console.log(`mês atual: ${monthToSelect}`);

    document.querySelectorAll('.months').forEach(monthClass => {
        monthClass.classList.remove('selected')
    })
    document.querySelector('#'+monthToSelect).classList.add('selected')
    selectedMonth = ID
    init()
}

const selectDateOnStart = () => {
    document.querySelectorAll('.months').forEach(monthClass => {
        if(monthClass.id === monthsNames[new Date().getMonth()].monthEng){
            monthClass.classList.add('selected')
            monthClass.click()
            return
        }
    })
}
selectDateOnStart()
