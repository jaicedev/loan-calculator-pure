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
  $("#js-principal").text("$" + parseFloat(value).toFixed(2));
  return payment;
}

function showInterestPaid(length, value, interest) {
  let payment = monthlyPayment(length, value, interest);
  let interestPaid = payment * length - value;
  $("#js-interest-paid").text("$" + parseFloat(interestPaid).toFixed(2));
  return interestPaid;
}

function showTotalCost(length, value, interest) {
  let payment = monthlyPayment(length, value, interest);
  let interestPaid = payment * length - value;
  let totalCost = (parseFloat(value) + parseFloat(interestPaid))
    .toFixed(2)
    .toString();
  $("#js-total-cost").text("$" + totalCost);
}

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
      showTotalCost(loanLength, loanValue, loanInterest);
    }
  });
}

$(showCalculation);
