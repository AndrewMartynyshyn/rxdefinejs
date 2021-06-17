function write_links() {
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

(function wait_for_posthog() {
  if (window.posthog.__loaded === true) {
    write_links();
  } else {
    setTimeout(wait_for_posthog, 10);
  }
})();
