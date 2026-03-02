function getAllCateg1IntoTable() {
  $.ajax({
    url: serverURL + "/categ1/all",
    dataType: "json",
    success: function (data) {
      const tableData = [];
      $.each(data, function (i, item) {
        const typeText = item.esex === 1 ? "Income" : "Expense";
        tableData.push([
          item.id,
          '<a href="#" onclick="showCateg1(' +
            item.id +
            '); return false;">' +
            item.descr +
            "</a>",
          typeText,
        ]);
      });

      $("#categ1Table").DataTable({
        responsive: true,
        stateSave: true,
        destroy: true, // Use destroy instead of manual clear/destroy for cleaner logic
        columnDefs: [{ visible: false, targets: 0 }],
        data: tableData,
        order: [[1, "asc"]],
        language: {
          searchPlaceholder: "Search...",
          sSearch: "",
          lengthMenu: "_MENU_ items/page",
        },
        initComplete: function() {
           // Force adjustment after initialization to ensure correct alignment
           this.api().columns.adjust().responsive.recalc();
        }
      });
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.error("Error loading categ1:", textStatus, errorThrown);
      alert("Error loading categ1: " + textStatus + " - " + errorThrown);
    },
  });
}

function showCateg1(id) {
  $.ajax({
    url: serverURL + "/categ1/" + id,
    dataType: "json",
    success: function (data) {
      $("#id").val(data.id);
      $("#descr").val(data.descr);
      $("#incomeSwitch").prop("checked", data.esex === 1);
    },
    error: function (jqXHR, textStatus, errorThrown) {
      alert("Error showing categ1: " + textStatus + " - " + errorThrown);
    },
  });
}

function saveUpdateCateg1() {
  const descr = $("#descr").val().trim();
  const esex = $("#incomeSwitch").is(":checked") ? 1 : 0;
  const id = $("#id").val();
  const isNew = !id || id === "New";

  if (!descr) {
    alert("Description is required.");
    return;
  }

  const categData = {
    id: isNew ? 0 : parseInt(id),
    descr: descr,
    esex: esex,
  };
  const url = isNew
    ? serverURL + "/categ1/add"
    : serverURL + `/categ1/updateCateg1/${categData.id}`;

  $.ajax({
    url: url,
    type: "POST",
    contentType: "application/json",
    data: JSON.stringify(categData),
    success: function () {
      alert(
        isNew ? "Category saved (added as new)." : "Category updated successfully."
      );
      getAllCateg1IntoTable();
      clearCateg1Form();
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.error("Save error:", textStatus, errorThrown);
      alert("Error saving: " + textStatus + " - " + errorThrown);
    },
  });
}

function deleteCateg1(id) {
  if (!confirm("Delete this category?")) return;
  $.ajax({
    url: serverURL + "/categ1/canDelCateg1/" + id,
    type: "GET",
    success: function (response) {
      if (response === "YES") {
        $.ajax({
          url: serverURL + "/categ1/delCateg1/" + id,
          type: "GET",
          success: function () {
            alert("Category 1 deleted.");
            getAllCateg1IntoTable();
          },
          error: function (jqXHR, textStatus, errorThrown) {
            alert("Error deleting: " + textStatus + " - " + errorThrown);
          },
        });
      } else {
        alert("This category cannot be deleted (in use).");
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      alert("Error checking delete: " + textStatus + " - " + errorThrown);
    },
  });
}

function clearCateg1Form() {
  $("#id").val("New");
  $("#descr").val("");
  $("#incomeSwitch").prop("checked", false);
}
