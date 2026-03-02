function getAllUsersDataIntoTable() {
  $("#usersTable tbody").empty();

  $.ajax({
    url: serverURL + "/user/all",
    dataType: "json",
    cache: true,
    success: function (data) {
      const tableData = [];

      $.each(data, function (index, item) {
        const row = [
          item.id,
          '<a href="#" onclick="showUser(' +
            item.id +
            ')">' +
            item.username +
            "</a>",
          item.name,
          item.surname,
        ];
        tableData.push(row);
      });
      $("#usersTable").DataTable({
        responsive: true,
        stateSave: true,
        dom: "Bfrtip",
        buttons: ["copy", "excel", "pdf", "print"],
        columnDefs: [{ visible: false, targets: 0 }],
        data: tableData,
        destroy: true,
        order: [[1, "asc"]],
      });
    },
    error: function (jqXHR, textStatus, errorThrown) {
      alert(
        "Error getAllUsersDataIntoTable: " + textStatus + " - " + errorThrown
      );
      $("#usersTable").DataTable({
        responsive: true,
        stateSave: true,
        dom: "Bfrtip",
        buttons: ["copy", "excel", "pdf", "print"],
        columnDefs: [{ visible: false, targets: 0 }],
        data: [],
        destroy: true,
      });
    },
  });
}

function showUser(userId) {
  $.ajax({
    url: serverURL + "/user/" + userId,
    dataType: "json",
    success: function (data) {
      document.getElementById("userId").value = data.id;
      document.getElementById("username").value = data.username;
      document.getElementById("username").disabled = true;
      document.getElementById("pass").value = data.pass;
      document.getElementById("name").value = data.name;
      document.getElementById("surname").value = data.surname;
      document.getElementById("isActiveSwitch").checked = data.isActive == 1;
      document.getElementById("isAdminSwitch").checked = data.isAdmin == 1;
      document.getElementById("seeStatsSwitch").checked = data.seeStats == 1;
    },
    error: function (jqXHR, textStatus, errorThrown) {
      alert("Error users: showUser " + textStatus + " - " + errorThrown);
    },
  });
}

function saveUpdateUser() {
  const userIdVal = document.getElementById("userId").value;
  if (userIdVal === "" || userIdVal === "New") {
    saveNewUser();
  } else {
    updateUser();
  }
}

function saveNewUser() {
  const isActiveVar = document.getElementById("isActiveSwitch").checked
    ? "1"
    : "0";
  const isAdminVar = document.getElementById("isAdminSwitch").checked
    ? "1"
    : "0";
  const seeStatsVar = document.getElementById("seeStatsSwitch").checked
    ? "1"
    : "0";

  const insert_new_user = {
    id: 1,
    username: $("#username").val().trim().replaceAll(" ", ""),
    pass: $("#pass").val().trim().replaceAll(" ", ""),
    name: $("#name").val().trim().replaceAll(" ", ""),
    surname: $("#surname").val().trim().replaceAll(" ", ""),
    isActive: isActiveVar,
    isAdmin: isAdminVar,
    seeStats: seeStatsVar,
  };

  $.ajax({
    url: serverURL + "/user/add/",
    dataType: "json",
    type: "POST",
    contentType: "application/json",
    data: JSON.stringify(insert_new_user),
    success: function () {
      getAllUsersDataIntoTable();
      clearUser();
      alert("New User added successfully.");
    },
    failure: function (errMsg) {
      alert("Failure: Ο server δεν ανταποκρίθηκε");
    },
  });
}

function updateUser() {
  const isActiveVar = document.getElementById("isActiveSwitch").checked
    ? "1"
    : "0";
  const isAdminVar = document.getElementById("isAdminSwitch").checked
    ? "1"
    : "0";
  const seeStatsVar = document.getElementById("seeStatsSwitch").checked
    ? "1"
    : "0";

  const insert_new_user = {
    id: $("#userId").val().trim().replaceAll(" ", ""),
    username: $("#username").val().trim().replaceAll(" ", ""),
    pass: $("#pass").val().trim().replaceAll(" ", ""),
    name: $("#name").val().trim().replaceAll(" ", ""),
    surname: $("#surname").val().trim().replaceAll(" ", ""),
    isActive: isActiveVar,
    isAdmin: isAdminVar,
    seeStats: seeStatsVar,
  };

  $.ajax({
    url: serverURL + "/user/updateUser/" + insert_new_user.id,
    dataType: "json",
    type: "POST",
    contentType: "application/json",
    data: JSON.stringify(insert_new_user),
    success: function () {
      getAllUsersDataIntoTable();
      clearUser();
      alert("User updated successfully.");
    },
    failure: function (errMsg) {
      alert("Failure: Ο server δεν ανταποκρίθηκε");
    },
  });
}

function initializeDeleteUserDialog() {
  const userId = document.getElementById("userId").value;
  if (userId === "" || userId === "New") {
    alert("Error: No user selected for deletion.");
    return;
  }
  const details =
    document.getElementById("username").value +
    " - " +
    document.getElementById("name").value +
    " " +
    document.getElementById("surname").value;
  $("#user_delete_modal").modal("show");
  user_check_before_delete(userId, details);
}

function user_check_before_delete(current_id, current_user_details) {
  $.ajax({
    url: serverURL + "/user/canDelUser/" + current_id,
    type: "GET",
    success: function (data) {
      document.getElementById("user_id").innerHTML = current_id;
      document.getElementById("user_details").innerHTML = current_user_details;
      document.getElementById("user_delete_error_message").innerHTML =
        data === "YES" ? "ΕΠΙΒΕΒΑΙΩΣΗ ΔΙΑΓΡΑΦΗΣ" : "ΑΠΑΓΟΡΕΥΣΗ ΔΙΑΓΡΑΦΗΣ";
      document.getElementById("btn_user_delete").style.visibility =
        data === "YES" ? "visible" : "hidden";
    },
    error: function (jqXHR, textStatus, errorThrown) {
      alert(
        "Error user: user_check_before_delete" +
          textStatus +
          " - " +
          errorThrown
      );
    },
  });
}

function deleteUser() {
  const userIdToDelete = document.getElementById("user_id").innerHTML;
  const details =
    document.getElementById("username").value +
    " - " +
    document.getElementById("name").value +
    " " +
    document.getElementById("surname").value;
  $.ajax({
    url: serverURL + "/user/delUser/" + userIdToDelete,
    type: "GET",
    success: function () {
      getAllUsersDataIntoTable();
      clearUser();
      hide_user_delete_modal();
      alert("User : " + details + " has been deleted successfully.");
    },
    error: function (jqXHR, textStatus, errorThrown) {
      alert("Error user: deleteUser " + textStatus + " - " + errorThrown);
    },
  });
}

function hide_user_delete_modal() {
  $("#user_delete_modal").modal("hide");
}

function clearUser() {
  document.getElementById("userId").value = "New";
  document.getElementById("username").value = "";
  document.getElementById("username").disabled = false;
  document.getElementById("pass").value = "";
  document.getElementById("name").value = "";
  document.getElementById("surname").value = "";
  document.getElementById("isActiveSwitch").checked = false;
  document.getElementById("isAdminSwitch").checked = false;
  document.getElementById("seeStatsSwitch").checked = false;
}
