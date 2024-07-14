let data;
let customers;
let transactions;

getData();
async function getData() {
  let res = await fetch("js/db.json");
  data = await res.json();
  customers = data.customers;
  transactions = data.transactions;
  displayData(transactions);
}
function displayData(data) {
  let temp = "";
  let name;
  data.forEach((element) => {
    customers.forEach((el) => {
      if (element.customer_id == el.id) {
        name = el.name;
      }
    });
    temp += `<tr>
                    <td>${element.id}</td>
                    <td>${name}</td>
                    <td>${element.date}</td>
                    <td>${element.amount}</td>
                  </tr>`;
  });

  document.getElementById("myData").innerHTML = temp;
  let remainCustomers = [];
  data.forEach((element) => {
    customers.forEach((el) => {
      if (element.customer_id == el.id) {
        remainCustomers.push(el.name);
      }
    });
  });
  displayGraph(data, remainCustomers);
}
// Display Graph
function displayGraph(data, remainCustomers) {
  // Number of Days
  let days = [];
  data.forEach((element) => {
    days.push(element.date);
  });
  let uniqueDays = days.filter((item, index) => days.indexOf(item) === index);
  console.log(uniqueDays);
  // Customers
  const xValues = remainCustomers.filter(
    (item, index) => remainCustomers.indexOf(item) === index
  );
  // IDs
  let customerIds = [];
  data.forEach((element) => {
    customerIds.push(element.customer_id);
  });
  let uniqueIds = customerIds.filter(
    (item, index) => customerIds.indexOf(item) === index
  );
  console.log(uniqueIds);

  // Amount
  let amount = [];
  uniqueIds.forEach((element) => {
    let x = 0;
    data.forEach((el) => {
      if (element == el.customer_id) {
        x += el.amount;
      }
    });
    amount.push(x / uniqueDays.length);
    x = 0;
  });

  const yValues = amount;
  let sortedAmount = yValues.slice().sort((a, b) => a - b);
  let minAmount = sortedAmount[0] - 100;
  let maxAmount = sortedAmount.pop() + 100;
  
  new Chart("myChart", {
    type: "line",
    data: {
      labels: xValues,
      datasets: [
        {
          fill: false,
          lineTension: 0,
          backgroundColor: "rgba(0,0,255,1.0)",
          borderColor: "rgba(0,0,255,0.1)",
          data: yValues,
        },
      ],
    },
    options: {
      legend: { display: false },
      scales: {
        yAxes: [{ ticks: { min: minAmount, max: maxAmount } }],
      },

      title: {
        display: true,
        text: "Total Transaction Amount Per Day",
      },
    },
  });
}

// Search
let searchInput = document.getElementById("searchInput");
searchInput.addEventListener("keyup", () => {
  let searchVal = searchInput.value;
  if (searchVal.length > 0) {
    let newCustomer = [];
    customers.forEach((element) => {
      if (element.name.toLowerCase().startsWith(searchVal.toLowerCase())) {
        newCustomer.push(element);
      }
    });
    newData(newCustomer, searchVal);
  } else {
    displayData(transactions);
  }
});

function newData(newCustomer, searchVal) {
  console.log(searchVal);
  let newTransactions = [];
  transactions.forEach((element) => {
    newCustomer.forEach((el) => {
      if (element.customer_id == el.id) {
        newTransactions.push(element);
      }
    });
    if (element.amount.toString().startsWith(searchVal)) {
      newTransactions.push(element);
    }
  });
  console.log(newTransactions);
  displayData(newTransactions);
}
