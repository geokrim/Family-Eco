function getFamilyData() {

    // console.log("serverURL:", serverURL);

   $.ajax({
    url: serverURL + "/family/1",
    dataType: "json",
    success: function (data) {
      // EMPTY ELEMENTS FIRST IN CASE ID DOES NOT EXIST
        document.getElementById("id").value = data.id
        document.getElementById("descr").value = data.descr;
        document.getElementById("familyId").value = data.port;
    },
    error: function (jqXHR, textStatus, errorThrown) {
      write_to_log(
        "Error family: getFamilyData" + " " + textStatus + " - " + errorThrown
      );
      alert("Error family: getFamilyData " + textStatus + " - " + errorThrown);
    },
    failure: function (errMsg) {
      // write_to_log("Failure family: getFamilyData" + " " + errMsg);
      alert("Failure: Ο server δεν ανταποκρίθηκε");
    },
  });
}



function updateFamily() {
    console.log("updateFamily called");
    // PREPARE JSON OBJECT
    var upd_family = {
        id: 1,
        descr: $("#descr").val().trimEnd(),
        port: "doesnotmatter on update",        // port is not updated here althought i can get it from storage obect feco 
    };

    $.ajax({
    url: serverURL + "/family/updateFamily/1",
    dataType: "json",
    type: "POST",
    contentType: "application/json",
    // The key needs to match your method's input parameter (case-sensitive).
    data: JSON.stringify(upd_family),
    contentType: "application/json; charset=utf-8",
    success: function (data) {
      // DO NOTHING
    },
    complete: function (data) {
      console.log("Update Family complete completed");
        alert("Family updated successfully.");
    },
    error: function (jqXHR, textStatus, errorThrown) {
      write_to_log(
        "Error family: updateFamily" + " " + textStatus + " - " + errorThrown
      );
      alert("Error family: " + textStatus + " - " + errorThrown);
    },
    failure: function (errMsg) {
      // write_to_log("Failure cus: ajaxUpdateCusById" + " " + errMsg);
      alert("Failure: Ο server δεν ανταποκρίθηκε");
    },
  });
}

