function load_defaults() {
  document.getElementById("dt").value = new Date().toISOString().split("T")[0];
  document.getElementById("incomeSwitch").checked = true;
  document.getElementById("trans_id").value = "New";
  
  Promise.all([loadCateg("1"), loadCateg("2"), loadCateg("3")]).then(() => {
    console.log("Default categories loaded.");
  });

  document.getElementById("trans_descr").value = "";
  document.getElementById("trans_amount").value = "";
  document.getElementById("total_insome").innerHTML =
    "<strong>Total Income:</strong> €0";
  document.getElementById("total_expenses").innerHTML =
    "<strong>Total Expenses:</strong> €0";
  document.getElementById("total_balance").innerHTML =
    "<strong>Balance:</strong> €0";
}

function load_defaults_pedia_anazitisis() {
  document.getElementById("dt_from").value = new Date()
    .toISOString()
    .split("T")[0];
  document.getElementById("dt_to").value = new Date()
    .toISOString()
    .split("T")[0];
  getAllTransDataIntoTable();
}

function incomeSwichChange() {
  Promise.all([loadCateg("1"), loadCateg("2"), loadCateg("3")]).then(() => {
    console.log("Categories refreshed for switch change.");
  });
}

function categ1Change() {
  // Reset Categ 2 and 3 when Categ 1 changes to maintain data integrity
  console.log("Categ 1 changed. Resetting Categ 2 and 3.");
  document.getElementById("categ2").selectedIndex = -1;
  document.getElementById("categ3").selectedIndex = -1;
}

function categ2Change() {
  // Reset Categ 3 when Categ 2 changes
  console.log("Categ 2 changed. Resetting Categ 3.");
  document.getElementById("categ3").selectedIndex = -1;
}

function loadCateg(whichCateg) {
  return new Promise((resolve, reject) => {
    const icomeOutcomeCheckbox = document.getElementById("incomeSwitch");
    let esexTarget = icomeOutcomeCheckbox.checked ? 1 : 0;

    const selectElement = document.getElementById("categ" + whichCateg);
    selectElement.innerHTML = "";
    // console.log(`Loading categories for level ${whichCateg} (Filtering for esex=${esexTarget})`);

    $.ajax({
      url: serverURL + "/categ" + whichCateg + "/all",
      dataType: "json",
      success: function (data) {
        // console.log(`Successfully loaded all categories for level ${whichCateg}:`, data);
        $.each(data, function (index, item) {
          if (item.esex == esexTarget) {
            const option = document.createElement("option");
            option.value = item.id;
            option.textContent = item.descr;
            selectElement.appendChild(option);
          }
        });
        resolve();
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.error(`Error loading category ${whichCateg}:`, textStatus, errorThrown, jqXHR);
        // alert("Error loadCateg: " + textStatus + " - " + errorThrown);
        reject(errorThrown);
      },
    });
  });
}

function getAllTransDataIntoTable() {
  const dt_from = $("#dt_from").val();
  const dt_to = $("#dt_to").val();

  if (!dt_from || !dt_to) {
    console.warn("getAllTransDataIntoTable: Skipping fetch as dates are not yet initialized.");
    return;
  }

  console.log("Fetching transactions from:", dt_from, "to:", dt_to);
  console.log("Using serverURL:", serverURL);

  function performFetch(url, isFallback = false) {
    $.ajax({
      url: url,
      dataType: "json",
      success: function (data) {
        console.log(`Received transactions data (${isFallback ? 'Fallback' : 'Main'}):`, data);
        renderTable(data);
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.error(`Error fetching transactions (${url}):`, textStatus, errorThrown);
        if (!isFallback) {
          console.log("Attempting fallback to /trans/all");
          performFetch(serverURL + "/trans/all", true);
        } else {
          alert("Error getAllTransDataIntoTable: " + textStatus + " - " + errorThrown);
          renderTable([]);
        }
      },
    });
  }

  function renderTable(data) {
    const tableData = [];
    let totalIncome = 0;
    let totalExpenses = 0;
    $.each(data, function (index, item) {
      if (!item) return;
      const amount = parseFloat(item.amount) || 0;
      if (item.esex == 1) {
        totalIncome += amount;
      } else {
        totalExpenses += amount;
      }
      const row = [
        item.id || "",
        item.dt ? moment(item.dt).format("DD/MM/YYYY") : "",
        '<a href="#" onclick="showTrans(' +
          (item.id || 0) +
          ')">' +
          (item.descr || "No Description") +
          "</a>",
        (item.categ1_descr || "N/A") +
          " / " +
          (item.categ2_descr || "N/A") +
          " / " +
          (item.categ3_descr || "N/A"),
        fixAmount(amount),
        item.username || "Unknown",
        item.esex == 1 ? "Income" : "Expense",
      ];
      tableData.push(row);
    });
    const balance = totalIncome - totalExpenses;
    document.getElementById("total_insome").innerHTML =
      "<strong>Total Income:</strong> " + fixAmount(totalIncome);
    document.getElementById("total_expenses").innerHTML =
      "<strong>Total Expenses:</strong> " + fixAmount(totalExpenses);
    document.getElementById("total_balance").innerHTML =
      "<strong>Balance:</strong> " + fixAmount(balance);
    $("#transactionsTable").DataTable({
      responsive: true,
      stateSave: true,
      dom: "Bfrtip",
      buttons: ["copy", "excel", "pdf", "print"],
      columns: [
        { title: "Id", visible: false },
        { title: "Date" },
        { title: "Description" },
        { title: "Categories" },
        { title: "Amount" },
        { title: "User" },
        { title: "Type" }
      ],
      data: tableData,
      destroy: true,
      order: [[1, "desc"]],
    });
  }

  // Try the endpoint seen in deprecated files first
  performFetch(serverURL + "/trans/allBetweenDates?from=" + dt_from + "&to=" + dt_to);
}

function showTrans(transId) {
  $.ajax({
    url: serverURL + "/trans/" + transId,
    dataType: "json",
    success: function (data) {
      document.getElementById("trans_id").value = data.id;
      document.getElementById("dt").value = data.dt;
      document.getElementById("incomeSwitch").checked = data.esex == 1;
      
      Promise.all([loadCateg("1"), loadCateg("2"), loadCateg("3")]).then(() => {
        document.getElementById("categ1").value = data.categ1_id;
        document.getElementById("categ2").value = data.categ2_id;
        document.getElementById("categ3").value = data.categ3_id;
      });

      document.getElementById("trans_descr").value = data.descr;
      document.getElementById("trans_amount").value = data.amount;
    },
    error: function (jqXHR, textStatus, errorThrown) {
      alert("Error trans: showTrans " + textStatus + " - " + errorThrown);
    },
  });
}

function saveUpdateTrans() {
  const transIdVal = document.getElementById("trans_id").value;
  if (transIdVal === "" || transIdVal === "New") {
    saveNewTrans();
  } else {
    updateTrans();
  }
}

function saveNewTrans() {
  if (!validate_amount()) return;

  const esexVar = document.getElementById("incomeSwitch").checked ? "1" : "0";

  const insert_new_trans = {
    id: 1,
    dt: $("#dt").val().trim().replaceAll(" ", ""),
    esex: esexVar,
    categ1_id: $("#categ1").val(),
    categ2_id: $("#categ2").val(),
    categ3_id: $("#categ3").val(),
    descr: $("#trans_descr").val().trimEnd(),
    amount: $("#trans_amount").val().trim().replaceAll(",", "."),
  };

  $.ajax({
    url: serverURL + "/trans/add/",
    dataType: "json",
    type: "POST",
    contentType: "application/json",
    data: JSON.stringify(insert_new_trans),
    success: function () {
      load_defaults();
      alert("New Transaction added successfully.");
    },
    failure: function (errMsg) {
      alert("Failure: Ο server δεν ανταποκρίθηκε");
    },
  });
}

function updateTrans() {
  if (!validate_amount()) return;

  const esexVar = document.getElementById("incomeSwitch").checked ? "1" : "0";
  const transId = $("#trans_id").val().trim().replaceAll(" ", "");

  const update_trans = {
    id: transId,
    dt: $("#dt").val().trim().replaceAll(" ", ""),
    esex: esexVar,
    categ1_id: $("#categ1").val(),
    categ2_id: $("#categ2").val(),
    categ3_id: $("#categ3").val(),
    descr: $("#trans_descr").val().trimEnd(),
    amount: $("#trans_amount").val().trim().replaceAll(",", "."),
  };

  $.ajax({
    url: serverURL + "/trans/updateTrans/" + transId,
    dataType: "json",
    type: "POST",
    contentType: "application/json",
    data: JSON.stringify(update_trans),
    success: function () {
      load_defaults();
      alert("Transaction updated successfully.");
    },
    failure: function (errMsg) {
      alert("Failure: Ο server δεν ανταποκρίθηκε");
    },
  });
}

function initializeDeleteTransDialog() {
  const transId = document.getElementById("trans_id").value;
  if (transId === "" || transId === "New") {
    alert("Error: No transaction selected for deletion.");
    return;
  }
  document.getElementById("trans_id").value = transId;
  document.getElementById("current_trans_id").innerHTML = transId;
  document.getElementById("current_trans_details").innerHTML =
    document.getElementById("trans_descr").value +
    " - " +
    document.getElementById("trans_amount").value +
    " EUR";
  document.getElementById("current_trans_id").hidden = false;
  document.getElementById("current_trans_details").hidden = false;
  $("#trans_delete_modal").modal("show");
}

function hide_trans_delete_modal() {
  document.getElementById("current_trans_id").hidden = true;
  document.getElementById("current_trans_details").hidden = true;
  $("#trans_delete_modal").modal("hide");
}

function delete_trans() {
  const transIdToDelete = document.getElementById("trans_id").value;
  const details =
    document.getElementById("trans_descr").value +
    " - " +
    document.getElementById("trans_amount").value +
    " EUR";
  $.ajax({
    url: serverURL + "/trans/delTrans/" + transIdToDelete,
    type: "GET",
    success: function () {
      load_defaults();
      hide_trans_delete_modal();
      alert("Transaction : " + details + " has been deleted successfully.");
    },
    error: function (jqXHR, textStatus, errorThrown) {
      alert("Error trans: delete_trans " + textStatus + " - " + errorThrown);
    },
  });
}

function validate_amount() {
  const val = document.getElementById("trans_amount").value;
  const floatVal = parseFloat(val.replace(",", "."));
  if (isNaN(floatVal) || floatVal <= 0) {
    alert("Amount must be a positive number.");
    return false;
  }
  return true;
}
