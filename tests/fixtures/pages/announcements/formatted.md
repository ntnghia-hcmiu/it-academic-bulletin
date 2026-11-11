---
title: 'Fixture renamed title <b>plain text</b>'
summary: 'Fixture summary <img src=x onerror=alert(1)>'
category: alpha
published: true
important: false
published_date: 2026-01-03
deadline: 2000-01-01
attachments:
  - label: 'Fixture public <b>attachment</b>'
    url: https://example.org/fixture-public?first=1&second=2
    note: Công khai
  - label: Fixture IU attachment
    url: https://example.org/fixture-iu
    note: Yêu cầu tài khoản IU
  - label: Fixture attachment without access note
    url: https://example.org/fixture-no-note
---
Fixture **Markdown bold** with a [fixture link](https://example.org/fixture-body).

## Fixture subheading

- Fixture list item

<script>alert('fixture-raw-html')</script>

<b>Fixture raw HTML</b>

{{ fixture_expression_must_remain_literal }}
