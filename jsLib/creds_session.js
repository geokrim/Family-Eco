function getDeviceType() {
  const ua = navigator.userAgent;
  if (/Mobi/i.test(ua)) {
    return "phone";
  } else if (/Tablet|iPad|Android(?!.*Mobile)/i.test(ua)) {
    return "tablet";
  } else {
    return "desktop";
  }
}

function checkCredentials() {
  const familyId = $("#familyId").val();
  const username = $("#username").val();
  const password = $("#password").val();

  $.ajax({
    url: `https://lecsserver2.gr:${familyId}/user/all`,
    method: "GET",
    dataType: "json",
    success: function (users) {
      const user = users.find(
        (u) =>
          u.username === username && u.pass === password && u.isActive === 1
      );

      if (user) {
        const feco = {
          username: user.username,
          password: user.pass,
          familyId: familyId,
          port: familyId,
          name: user.name,
          surname: user.surname,
          loggedIn: true,
        };

        localStorage.setItem("feco", JSON.stringify(feco));

        const deviceType = getDeviceType();
        switch (deviceType) {
          case "phone":
            window.location.href = "red_transactions.html";
            break;
          case "tablet":
            window.location.href = "blue_transactions.html";
            break;
          case "desktop":
            window.location.href = "/dsk/dsk_trans.html";
            break;
        }
      } else {
        localStorage.removeItem("feco");
        alert("Your credentials are wrong or user is not active.");
      }
    },
    error: function () {
      alert("Error connecting to server..");
    },
  });
}

function checkSession() {
  const feco = JSON.parse(localStorage.getItem("feco"));

  if (!feco || !feco.loggedIn) {
    alert("Please login first.");
    window.location.href = "index.html";
  } else {
    $.ajax({
      url: `https://lecsserver2.gr:${feco.port}/user/all`,
      method: "GET",
      dataType: "json",
      success: function (users) {
        const user = users.find(
          (u) =>
            u.username === feco.username &&
            u.pass === feco.password &&
            u.isActive === 1
        );

        if (!user) {
          alert("Session expired or invalid. Please log in again.");
          localStorage.removeItem("feco");
          window.location.href = "index.html";
        }
      },
      error: function () {
        alert("Server error. Please try again later.");
        window.location.href = "index.html";
      },
    });
  }
}

function logout() {
  localStorage.removeItem("feco");
  window.location.href = "index.html";
}
