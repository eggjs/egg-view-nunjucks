{{ name | repeatSync }}
--
{% for item in list %}
  {% include "./include-sub.tpl" %}
{% endfor %}