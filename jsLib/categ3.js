function getAllCateg3IntoTable() {
  $.ajax({
    url: serverURL + "/categ3/all",
    dataType: "json",
    success: function (data) {
      const tableData = [];
      $.each(data, function (i, item) {
        const typeText = item.esex === 1 ? "Income" : "Expense";
        tableData.push([
          item.id,
          '<a href="#" onclick="showCateg3(' +
            item.id +
            '); return false;">' +
            item.descr +
            "</a>",
          typeText,
        ]);
      });

      $("#categ3Table").DataTable({
        responsive: true,
        stateSave: true,
        destroy: true,
        columnDefs: [{ visible: false, targets: 0 }],
        data: tableData,
        order: [[1, "asc"]],
        language: {
          searchPlaceholder: "Search...",
          sSearch: "",
          lengthMenu: "_MENU_ items/page",
        },
        initComplete: function() {
           this.api().columns.adjust().responsive.recalc();
        }
      });
    },
    error: function (jqXHR, textStatus, errorThrown) {
      alert("Error loading categ3: " + textStatus + " - " + errorThrown);
    },
  });
}

function showCateg3(id) {
  $.ajax({
    url: serverURL + "/categ3/" + id,
    dataType: "json",
    success: function (data) {
      $("#id").val(data.id);
      $("#descr").val(data.descr);
      $("#incomeSwitch").prop("checked", data.esex === 1);
    },
    error: function (jqXHR, textStatus, errorThrown) {
      alert("Error showing categ3: " + textStatus + " - " + errorThrown);
    },
  });
}

function saveUpdateCateg3() {
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
    ? serverURL + "/categ3/add"
    : serverURL + "/categ3/updateCateg3/" + categData.id;

  $.ajax({
    url: url,
    type: "POST",
    contentType: "application/json",
    data: JSON.stringify(categData),
    success: function () {
      alert(
        isNew ? "Category saved (added as new)." : "Category updated successfully."
      );
      getAllCateg3IntoTable();
      clearCateg3Form();
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.error("Save error:", textStatus, errorThrown);
      alert("Error saving: " + textStatus + " - " + errorThrown);
    },
  });
}

function deleteCateg3(id) {
  if (!confirm("Delete this category?")) return;
  $.ajax({
    url: serverURL + "/categ3/canDelCateg3/" + id,
    type: "GET",
    success: function (response) {
      if (response === "YES") {
        $.ajax({
          url: serverURL + "/categ3/delCateg3/" + id,
          type: "GET",
          success: function () {
            alert("Category 3 deleted.");
            getAllCateg3IntoTable();
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

function clearCateg3Form() {
  $("#id").val("New");
  $("#descr").val("");
  $("#incomeSwitch").prop("checked", false);
}
