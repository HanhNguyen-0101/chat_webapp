window.onload = function () {
  var switchElm = document.getElementById("switch");
  var fullpage = document.getElementById("fullpage");
  switchElm.addEventListener("click", function (e) {
    e.preventDefault();
    if (fullpage.classList.contains("night")) {
      fullpage.classList.remove("night");
      switchElm.classList.remove("switched");
      $('input[name="switch"]').val('light');
    } else {
      fullpage.classList.add("night");
      switchElm.classList.add("switched");
      $('input[name="switch"]').val('night');
    }
  });
};
