function monthlyPayment(time, amount, interest) {
  interest = interest / 1200;
  let p = (amount * interest) / (1 - Math.pow(1 / (1 + interest), time));
  p = p.toFixed(2);
  return p;
}

function retrieveLoanTermLength() {
  let months = $("#js-length").val();
  let lengthType = $("#term-unit-selection").val();
  if (lengthType === "Years") {
    months = months * 12;
  }
  return months;
}

function showMonthlyPayment(length, value, interest) {
  let payment = monthlyPayment(length, value, interest);
  $("#js-calculated-payment").text("$" + payment);
  $("#js-principal").text("$" + parseFloat(value));
  return payment;
}

function showInterestPaid(length, value, interest) {
  let payment = monthlyPayment(length, value, interest);
  let interestPaid = payment * length - value;
  $("#js-interest-paid").text("$" + parseFloat(interestPaid).toFixed(2));
  return parseFloat(interestPaid).toFixed(2);
}

// function showTotalCost(length, value, interest) {
//   let payment = monthlyPayment(length, value, interest);
//   let interestPaid = payment * length - value;
//   let totalCost = (parseFloat(value) + parseFloat(interestPaid))
//     .toFixed(2)
//     .toString();
//   $("#js-total-cost").text("$" + totalCost);
//   return totalCost;
// }

function showCalculation() {
  $("#invalid-input").hide();
  $("#js-calculator").submit(function (e) {
    e.preventDefault();
    let loanLength = retrieveLoanTermLength();
    let loanValue = $("#js-loan-value").val();
    let loanInterest = $("#js-interest").val();
    if (loanValue === "" || loanInterest === "") {
      $("#invalid-input").show();
    } else {
      $("#invalid-input").hide();
      showInterestPaid(loanLength, loanValue, loanInterest);
      showMonthlyPayment(loanLength, loanValue, loanInterest);
      //   showTotalCost(loanLength, loanValue, loanInterest);
      updateChart();
    }
  });
}

function advancedView() {
  $("#js-advanced-content").hide();
  $("#js-advanced").on("click", function () {
    if ($("#js-advanced-toggle").hasClass("fa-chevron-up")) {
      $("#js-advanced-content").slideUp();
      $("#js-advanced-toggle")
        .removeClass("fa-chevron-up")
        .addClass("fa-chevron-down");
    } else {
      $("#js-advanced-toggle")
        .removeClass("fa-chevron-down")
        .addClass("fa-chevron-up");
      $("#js-advanced-content").slideDown();
      createChart();
    }
  });
}

function updateChart() {
  if ($("#myChart").hasClass("chartjs-render-monitor")) {
    createChart();
  } else {
    console.log("No Chart Created");
  }
}

function createChart() {
  $("#myChart").text("");
  let loanLength = retrieveLoanTermLength();
  let loanValue = $("#js-loan-value").val();
  let loanInterest = $("#js-interest").val();
  populateAmoritizationTable(loanLength, loanValue, loanInterest);
  var chartInsertion = document.getElementById("myChart").getContext("2d");
  var paymentChart = new Chart(chartInsertion, {
    type: "doughnut",
    data: {
      labels: ["Principal", "Interest"],
      datasets: [
        {
          label: "Payments",
          data: [
            loanValue,
            showInterestPaid(loanLength, loanValue, loanInterest),
          ],
          backgroundColor: ["#f7b167d2", "#f4845f"],
          borderColor: ["#f7b267", "#f7b267"],
          borderWidth: 2,
        },
      ],
    },
    options: {},
  });
}

function populateAmoritizationTable(length, value, interest) {
  if ($("#js-advanced-table-body").text.length > 0) {
    $("#js-advanced-table-body").text("");
  }
  let totalInterest = 0;
  let balance = value;
  let date = new Date();
  let month = date.getMonth();
  let year = date.getFullYear();
  let dateString = month.toString() + "/" + year.toString();
  let payment = monthlyPayment(length, value, interest);
  for (let i = 0; i < length; i++) {
    let body = $("#js-advanced-table-body");
    let tr = document.createElement("tr");
    let payDate = document.createElement("td");
    let payAmt = document.createElement("td");
    let principal = document.createElement("td");
    let interest = document.createElement("td");
    let total = document.createElement("td");
    let remaining = document.createElement("td");
    payDate.textContent = dateString;
    payAmt.className = "hide";
    total.className = "hide";
    payAmt.textContent = payment.toString();
    remaining.textContent = balance;
    balance = (balance - payment).toFixed(2);
    tr.append(payDate, payAmt, principal, interest, total, balance);
    body.append(tr);
  }
}

$(advancedView);
$(showCalculation);
