# Special Dates and Overrides

## Special Dates

Special dates use `MM-DD` and repeat every year:

```json
{ "name": "Bastille Day", "date": "07-14" }
```

## Date Overrides

Overrides use `YYYY-MM-DD` and affect a single date:

```json
{
  "date": "2026-07-17",
  "dayOff": false,
  "workFromHome": true,
  "officeDay": false
}
```

Overrides take priority over weekly rules.
