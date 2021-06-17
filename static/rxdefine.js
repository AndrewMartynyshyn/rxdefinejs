function grabFormData() {
  const form = document.querySelector("form");

  var result = Object.values(form).reduce((obj, field) => {
    obj[field.name] = field.value;
    return obj;
  }, {});

  console.log(result);

  var xhr = new XMLHttpRequest();
  xhr.open("POST", "https://rxdefinejs.herokuapp.com/data", true);

  xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

  xhr.onreadystatechange = function (res) {
    if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
      console.log(xhr);
    }
  };

  xhr.send(JSON.stringify(result));
}

function rewriteLinks() {
  const links = [...document.getElementsByTagName("A")].filter((el) =>
    el.href.includes("rxengage")
  );

  let params = "";
  const posthogProps = window.posthog.persistence.props;
  if (posthogProps.distinct_id !== undefined) {
    params += "&utm_id=" + posthogProps.distinct_id;
  }
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

  links.forEach((link) => {
    if (link.href.includes("?")) {
      link.setAttribute("href", link.href + params);
    } else {
      link.setAttribute("href", `${link.href}?${params.slice(1)}`);
    }
  });
}

(function waitForPosthog() {
  if (window.posthog && window.posthog.__loaded) {
    rewriteLinks();
  } else {
    setTimeout(waitForPosthog, 10);
  }
})();
