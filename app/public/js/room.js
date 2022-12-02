window.onload = function () {
  function behavier() {
    document
      .querySelector("#menu-toggle")
      .addEventListener("click", function (e) {
        e.preventDefault();
        document.querySelector(".fixed-nav-inner").classList.toggle("open-nav");
        document.querySelector(".chat-content").classList.toggle("open-nav");
      });
    if ($(window).width() < 500) {
      document.querySelector(".fixed-nav-inner").classList.remove("open-nav");
      document.querySelector(".chat-content").classList.remove("open-nav");
    } else {
      document.querySelector(".fixed-nav-inner").classList.add("open-nav");
      document.querySelector(".chat-content").classList.add("open-nav");
    }
  }
  behavier();
  var socket = io();

  // Welcome
  socket.on("welcome", (msgOne) => {
    $(".direct-chat-messages").append("<div class='welcome'>" + msgOne + "</div>");
  });
  socket.on("welcomeEveryone", (msgMany) => {
    $(".direct-chat-messages").append("<div class='welcome'>" + msgMany + "</div>");
  });

  // Room
  var queryString = location.search;
  var params = Qs.parse(queryString, {
    ignoreQueryPrefix: true,
  });
  socket.emit("sendRoom", params);
  document.querySelector(".box-title").innerHTML =
    "<span class='text-room'>Room " + params.room + " </span>";
  $('#room').addClass(params.switch);

  // UserList
  function showUserList(userList) {
    var ulElm = document.querySelector(".fixed-nav-inner ul");
    if (userList) {
      var htmlStr =
        "<a href='#' id='menu-toggle' class='waves-light menu-toggle text-decoration-none' data-toggle='offcanvas'><li><i class='material-icons menu-toggle-icon'>menu</i></li><li>Members</li></a>";
      for (var i = 0; i < userList.length; i++) {
        htmlStr +=
          '<a href="#" class="waves-light"><li><img class="direct-chat-img" src="' +
          userList[i].avatar +
          '" alt="' +
          userList[i].nickname +
          '"></li><li>' +
          userList[i].nickname +
          "</li></a>";
      }
      htmlStr += "<a href='/' class='waves-light go-back text-decoration-none'><li><i class='material-icons'>logout</i></li><li>Go back</li></a>";
      ulElm.innerHTML = htmlStr;
    }
    behavier();
  }
  socket.on("receivedUserList", (userList) => {
    showUserList(userList);
  });
  socket.on("receivedUserListUpdate", (userList, msgBye) => {
    showUserList(userList);
    $(".direct-chat-messages").append("<div class='welcome'>" + msgBye + "</div>");
  });

  // Location
  socket.on("receivedLocation", (locationObj) => {
    var htmlStr = '<div class="direct-chat-msg right"> <div class="direct-chat-info clearfix"> <span class="direct-chat-name pull-right">'+locationObj.nickname+'</span> </div> <!-- /.direct-chat-info --> <img class="direct-chat-img" src="'+locationObj.avatar+'" alt="'+locationObj.nickname+'" /><!-- /.direct-chat-img --> <div class="direct-chat-text"> <a class="text-white" style="text-decoration: underline" target="_blank" href="'+locationObj.location+'"><i class="material-icons" style="font-size: 16px">location_on</i> My location</a> </div> <!-- /.direct-chat-text --> <div class="direct-chat-timestamp">'+locationObj.date+'</div> </div>';
    $(".direct-chat-messages").append(htmlStr);
  });
  socket.on("receivedLocationEveryOne", (locationObj) => {
    var htmlStr = "<div class='direct-chat-msg'> <div class='direct-chat-info clearfix'> <span class='direct-chat-name pull-right'>"+locationObj.nickname+"</span> </div> <!-- /.direct-chat-info --> <img class='direct-chat-img' src='"+locationObj.avatar+"' alt='"+locationObj.nickname+"' /><!-- /.direct-chat-img --> <div class='direct-chat-text'> <a class='text-white' style='text-decoration: underline' target='_blank' href='"+locationObj.location+"'><i class='material-icons' style='font-size: 16px'>location_on</i> "+ locationObj.nickname +"'s location</a> </div> <!-- /.direct-chat-text --> <div class='direct-chat-timestamp'>"+locationObj.date+"</div> </div>";
    $(".direct-chat-messages").append(htmlStr);
  });
  document
    .querySelector("#get-position")
    .addEventListener("click", function (e) {
      e.preventDefault();
      if (!navigator.geolocation) {
        return alert("The browser doesn't support!");
      }
      navigator.geolocation.getCurrentPosition(function (position) {
        const location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        socket.emit("sendLocation", location);
      });
    });

  // Message
  socket.on("receivedMSG", (sentMsg) => {
    var htmlStr = '<div class="direct-chat-msg right"> <div class="direct-chat-info clearfix"> <span class="direct-chat-name pull-right">'+sentMsg.nickname+'</span> </div> <!-- /.direct-chat-info --> <img class="direct-chat-img" src="'+sentMsg.avatar+'" alt="'+sentMsg.nickname+'" /><!-- /.direct-chat-img --> <div class="direct-chat-text"> '+sentMsg.msg+' </div> <!-- /.direct-chat-text --> <div class="direct-chat-timestamp">'+sentMsg.date+'</div> </div>';
    $(".direct-chat-messages").append(htmlStr);
  });
  socket.on("receivedMSGEveryone", (sentMsg) => {
    var htmlStr = '<div class="direct-chat-msg"> <div class="direct-chat-info clearfix"> <span class="direct-chat-name pull-right">'+sentMsg.nickname+'</span> </div> <!-- /.direct-chat-info --> <img class="direct-chat-img" src="'+sentMsg.avatar+'" alt="'+sentMsg.nickname+'" /><!-- /.direct-chat-img --> <div class="direct-chat-text"> '+sentMsg.msg+' </div> <!-- /.direct-chat-text --> <div class="direct-chat-timestamp">'+sentMsg.date+'</div> </div>';
    $(".direct-chat-messages").append(htmlStr);
  });
  $(document).ready(function() {
    var form = document.getElementById("chat-form");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var msg = document.getElementById("msg");
      var callbackError = function (errors) {
        if (errors) {
          alert(errors);
        }
      };
      socket.emit("sendMSG", msg.value, callbackError);
      msg.value = "";
      var elem = $(".direct-chat-messages");
      elem.scrollTop = elem.scrollHeight;
    });
  });
};
