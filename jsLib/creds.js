var url = "https://lecsserver2.gr:";
var fecoObj = JSON.parse(localStorage.getItem("feco"));
var familyId = fecoObj ? fecoObj.familyId : null;
var serverURL = familyId ? url + familyId : "";

if (!serverURL && window.location.pathname.indexOf("index.html") === -1) {
  console.warn("serverURL could not be initialized. No familyId found in localStorage.");
}





