const API = "http://localhost:5000/api";

let currentAccount = null;
let currentCustomer = null;

function login() {
    const account_no = document.getElementById("loginAccount").value;
    const pin = document.getElementById("loginPin").value;
    const message = document.getElementById("loginMessage");

    if (!account_no || !pin) {
        message.innerText = "Please enter account number and PIN.";
        return;
    }

    fetch(`${API}/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            account_no,
            pin
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.message && !data.account_no) {
            message.innerText = data.message;
            return;
        }

        currentAccount = data.account_no;
        currentCustomer = data.customer_id;

        document.getElementById("loginPage").classList.add("hidden");
        document.getElementById("dashboardPage").classList.remove("hidden");

        loadDashboard();
    })
    .catch(error => {
        console.error(error);
        message.innerText = "Cannot connect to backend server.";
    });
}

function loadDashboard() {
    fetch(`${API}/account/${currentAccount}`)
        .then(response => response.json())
        .then(data => {
            document.getElementById("customerName").innerText = data.name;
            document.getElementById("accountNumber").innerText = data.account_no;
            document.getElementById("accountType").innerText = data.account_type;
            document.getElementById("balance").innerText =
                Number(data.balance).toLocaleString("en-IN", {
                    minimumFractionDigits: 2
                });
            document.getElementById("branch").innerText =
                `${data.branch_name}, ${data.city}`;

            currentCustomer = data.customer_id;

            loadTransactions();
            loadLoans();
        })
        .catch(error => console.error(error));
}

function deposit() {
    const amount = document.getElementById("depositAmount").value;

    if (!amount || Number(amount) <= 0) {
        showMessage("Enter a valid deposit amount.");
        return;
    }

    fetch(`${API}/deposit`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            account_no: currentAccount,
            amount: Number(amount)
        })
    })
    .then(response => response.json())
    .then(data => {
        showMessage(data.message);

        if (data.message === "Money deposited successfully") {
            document.getElementById("depositAmount").value = "";
            loadDashboard();
        }
    })
    .catch(error => {
        console.error(error);
        showMessage("Deposit failed.");
    });
}

function withdraw() {
    const amount = document.getElementById("withdrawAmount").value;

    if (!amount || Number(amount) <= 0) {
        showMessage("Enter a valid withdrawal amount.");
        return;
    }

    fetch(`${API}/withdraw`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            account_no: currentAccount,
            amount: Number(amount)
        })
    })
    .then(response => response.json())
    .then(data => {
        showMessage(data.message);

        if (data.message === "Money withdrawn successfully") {
            document.getElementById("withdrawAmount").value = "";
            loadDashboard();
        }
    })
    .catch(error => {
        console.error(error);
        showMessage("Withdrawal failed.");
    });
}

function loadTransactions() {
    fetch(`${API}/transactions/${currentAccount}`)
        .then(response => response.json())
        .then(data => {
            const body = document.getElementById("transactionBody");
            body.innerHTML = "";

            if (data.length === 0) {
                body.innerHTML =
                    `<tr><td colspan="4">No transactions found</td></tr>`;
                return;
            }

            data.forEach(transaction => {
                body.innerHTML += `
                    <tr>
                        <td>${transaction.transaction_id}</td>
                        <td>${transaction.transaction_type}</td>
                        <td>₹${Number(transaction.amount).toLocaleString("en-IN")}</td>
                        <td>${formatDate(transaction.transaction_date)}</td>
                    </tr>
                `;
            });
        })
        .catch(error => console.error(error));
}

function loadLoans() {
    fetch(`${API}/loans/${currentCustomer}`)
        .then(response => response.json())
        .then(data => {
            const body = document.getElementById("loanBody");
            body.innerHTML = "";

            if (data.length === 0) {
                body.innerHTML =
                    `<tr><td colspan="5">No loans found</td></tr>`;
                return;
            }

            data.forEach(loan => {
                body.innerHTML += `
                    <tr>
                        <td>${loan.loan_id}</td>
                        <td>${loan.loan_type}</td>
                        <td>₹${Number(loan.amount).toLocaleString("en-IN")}</td>
                        <td>${loan.interest_rate}%</td>
                        <td>${loan.loan_status}</td>
                    </tr>
                `;
            });
        })
        .catch(error => console.error(error));
}

function formatDate(date) {
    if (!date) return "-";

    const d = new Date(date);
    return d.toLocaleDateString("en-IN");
}

function showMessage(message) {
    const element = document.getElementById("actionMessage");
    element.innerText = message;

    setTimeout(() => {
        element.innerText = "";
    }, 3000);
}

function logout() {
    currentAccount = null;
    currentCustomer = null;

    document.getElementById("dashboardPage").classList.add("hidden");
    document.getElementById("loginPage").classList.remove("hidden");

    document.getElementById("loginAccount").value = "";
    document.getElementById("loginPin").value = "";
    document.getElementById("loginMessage").innerText = "";
}