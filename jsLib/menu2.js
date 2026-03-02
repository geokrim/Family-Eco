function menu_dsk_load() {
  let sidebar_html = "";

  sidebar_html += '<aside class="sidebar">';
  sidebar_html += '<div class="sidebar-header">';
  sidebar_html +=
    '<img src="../images/familyeco_logo.png" alt="FamilyEco Logo" />';
  sidebar_html += "<h2>Family Eco</h2>";
  sidebar_html += "</div>";
  sidebar_html += '<ul class="sidebar-links">';
  sidebar_html += "<li>";
  sidebar_html += '<a href="../dsk/family.html">';
  sidebar_html += '<span class="material-symbols-outlined">home</span>';
  sidebar_html += '<span class="link">Family</span>';
  sidebar_html += "</a>";
  sidebar_html += "</li>";
  sidebar_html += "<li>";
  sidebar_html += '<a href="../dsk/users.html">';
  sidebar_html += '<span class="material-symbols-outlined">group</span>';
  sidebar_html += '<span class="link">Users</span>';
  sidebar_html += "</a>";
  sidebar_html += "</li>";
  sidebar_html += "<li>";
  sidebar_html += '<a href="../dsk/trans.html">';
  sidebar_html += '<span class="material-symbols-outlined">receipt_long</span>';
  sidebar_html += '<span class="link">Transactions</span>';
  sidebar_html += "</a>";
  sidebar_html += "</li>";
  sidebar_html += '<li class="has-submenu">';
  sidebar_html +=
    '<a href="#" class="submenu-toggle" onclick="toggleSubmenu(event)">';
  sidebar_html += '<span class="material-symbols-outlined">category</span>';
  sidebar_html += '<span class="link">Categories</span>';
  sidebar_html +=
    '<span class="arrow material-symbols-outlined">chevron_right</span>';
  sidebar_html += "</a>";
  sidebar_html += '<ul class="submenu">';
  sidebar_html +=
    '<li><a href="../dsk/categ1.html"><span class="material-symbols-outlined">looks_one</span><span class="link">Category 1</span></a></li>';
  sidebar_html +=
    '<li><a href="../dsk/categ2.html"><span class="material-symbols-outlined">looks_two</span><span class="link">Category 2</span></a></li>';
  sidebar_html +=
    '<li><a href="../dsk/categ3.html"><span class="material-symbols-outlined">looks_3</span><span class="link">Category 3</span></a></li>';
  sidebar_html += "</ul>";
  sidebar_html += "</li>";
  sidebar_html += "<li>";
  sidebar_html += '<a href="../dsk/stats.html">';
  sidebar_html += '<span class="material-symbols-outlined">bar_chart</span>';
  sidebar_html += '<span class="link">Stats</span>';
  sidebar_html += "</a>";
  sidebar_html += "</li>";
  sidebar_html += "</ul>";
  sidebar_html += '<div class="sidebar-bottom">';
  sidebar_html += '<button class="logout-btn" onclick="logout()">';
  sidebar_html += '<span class="material-symbols-outlined">logout</span>';
  sidebar_html += '<span class="link">Logout</span>';
  sidebar_html += "</button>";
  sidebar_html += "</div>";
  sidebar_html += "</aside>";
  if (!document.querySelector('link[href*="material-symbols"]')) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200";
    document.head.appendChild(link);
  }

  document.body.insertAdjacentHTML("afterbegin", sidebar_html);

  const existingContent = document.body.innerHTML;
  const mainContentStart = '<div class="main-content">';
  const mainContentEnd = "</div>";

  const sidebarElement = document.querySelector(".sidebar");
  const remainingContent = Array.from(document.body.children).filter(
    (child) => child !== sidebarElement
  );

  const tempWrapper = document.createElement("div");
  tempWrapper.className = "main-content";
  remainingContent.forEach((element) => {
    tempWrapper.appendChild(element);
  });

  document.body.appendChild(tempWrapper);
}

function toggleSubmenu(event) {
  event.preventDefault();
  const submenuItem = event.currentTarget.parentElement;
  submenuItem.classList.toggle("active");
}
