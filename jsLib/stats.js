function loadStats() {
  const from = $("#fromDate").val();
  const to = $("#toDate").val();

  if (!from || !to) {
    alert("Please select both dates.");
    return;
  }

  console.log("Fetching stats from:", from, "to:", to);

  $.ajax({
    url: serverURL + "/trans/allBetweenDates?from=" + from + "&to=" + to,
    dataType: "json",
    success: function (data) {
      console.log("Received data for stats:", data);
      renderStatsTable(data);
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.error("Error fetching stats:", textStatus, errorThrown);
      // Fallback to /trans/all if between dates fails
      $.ajax({
        url: serverURL + "/trans/all",
        dataType: "json",
        success: function (data) {
          renderStatsTable(data);
        },
        error: function () {
          alert("Error loading statistics.");
        }
      });
    },
  });
}

function renderStatsTable(data) {
  const summary = {};

  $.each(data, function (index, item) {
    if (!item) return;
    const catName = item.categ1_descr || "Uncategorized";
    const amount = parseFloat(item.amount) || 0;
    const type = item.esex == 1 ? "Income" : "Expense";
    const key = catName + "|" + type;

    if (!summary[key]) {
      summary[key] = {
        name: catName,
        total: 0,
        type: type
      };
    }
    summary[key].total += amount;
  });

  const tableData = [];
  for (let key in summary) {
    tableData.push([
      summary[key].name,
      fixAmount(summary[key].total),
      summary[key].type
    ]);
  }

  $("#statsTable").DataTable({
    responsive: true,
    data: tableData,
    destroy: true,
    order: [[1, "desc"]],
    dom: "Bfrtip",
    buttons: ["copy", "excel", "pdf", "print"],
  });
}
