window.rxdefine = (function () {
  function RxDefine() {}

  RxDefine.prototype.generateRxId = function (uuid) {
    /**
     * 1. pass ph_id, condition_uuid
     * 2. return rx_uuid
     * 3. Mahana side call getRxId function from rxdefinejs and pass this id as GET param (?rx_id=[sampleid]) to our intake form
     * 4. on the intake form we fetch posthog id by rxdefine id and set it for this user
     */

    //get ph_id and condition_id
    var ph_id = posthogProps.distinct_id;
    var condition_id = rx.getConditionId();

    //pass ph_id, condition_uuid to server side
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "https://rxdefinejs.herokuapp.com/rx", true);

    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

    xhr.onreadystatechange = function (res) {
      if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
        console.dir(JSON.parse(xhr.response));
        //retrieve rx_id
        localStorage.setItem("rx_id", JSON.parse(xhr.response).rx_id);
      }
    };

    xhr.send(
      JSON.stringify({
        ph_id: ph_id,
        condition_id: condition_id,
      })
    );
  };

  RxDefine.prototype.ph_rewriteUrls = function (includeUtms) {
    const links = [...document.getElementsByTagName("A")].filter((el) =>
      el.href.includes("rxengage")
    );

    let params = "";
    const posthogProps = window.posthog.persistence.props;

    if (posthogProps.distinct_id !== undefined) {
      params += "&ph_id=" + posthogProps.distinct_id;
    }

    if (includeUtms) {
      if (posthogProps.utm_campaign !== undefined) {
        params += "&utm_campaign=" + posthogProps.utm_campaign;
      }
      if (posthogProps.utm_medium !== undefined) {
        params += "&utm_medium=" + posthogProps.utm_medium;
      }
      if (posthogProps.utm_source !== undefined) {
        params += "&utm_source=" + posthogProps.utm_source;
      }
      if (posthogProps.utm_content !== undefined) {
        params += "&utm_content=" + posthogProps.utm_content;
      }
    }

    links.forEach((link) => {
      if (link.href.includes("?")) {
        link.setAttribute("href", link.href + params);
      } else {
        link.setAttribute("href", `${link.href}?${params.slice(1)}`);
      }
    });
  };

  var rx = {
    getConditionId: function () {
      var script_tag = document.getElementById("rxscript");
      var query = script_tag.src.replace(/^[^\?]+\??/, "");

      // Parse the querystring into arguments and parameters
      var vars = query.split("&");
      var args = {};

      for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        args[pair[0]] = decodeURI(pair[1]).replace(/\+/g, " ");
      }

      return args["id"];
    },
    getRxId: function () {
      return localStorage.getItem("rx_id");
    },
  };
  return rx;
})();

(function waitForPosthog() {
  if (window.posthog && window.posthog.__loaded) {
    window.rxdefine.ph_rewriteUrls();
    window.rxdefine.generateRxId();
  } else {
    setTimeout(waitForPosthog, 10);
  }
})();
